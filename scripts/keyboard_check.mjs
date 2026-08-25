#!/usr/bin/env node
// V2 keyboard-path oracle (uplift U5.3) — the executable check behind
// "keyboard path complete; visible focus". Drives REAL trusted Tab events
// via CDP and verifies, per route:
//   1. the first Tab lands on a skip link that targets #main-ish content;
//   2. every visible interactive element is reachable by Tab;
//   3. every element focused via keyboard shows a visible indicator
//      (outline or box-shadow) when :focus-visible applies;
//   4. the focused element is not obscured (WCAG 2.2 2.4.11: centre point
//      hit-tests to itself/its subtree/an ancestor).
//
// Usage: keyboard_check.mjs <url> [--routes /,/work] [--max-tabs 120]
// Exit 0 = all checks hold; 1 = failures; 2 = usage/launch error.
import { connect, goto, evalJson } from "./_cdp.mjs";

const argv = process.argv.slice(2);
const url = argv.find((a) => /^https?:\/\//.test(a));
if (!url) { console.error("usage: keyboard_check.mjs <url> [--routes /a,/b] [--max-tabs 120]"); process.exit(2); }
const routesArg = argv.includes("--routes") ? argv[argv.indexOf("--routes") + 1] : null;
const maxTabs = Number(argv.includes("--max-tabs") ? argv[argv.indexOf("--max-tabs") + 1] : 120);
const origin = new URL(url).origin;
const routes = routesArg ? routesArg.split(",").map((r) => new URL(r, origin).href) : [url];

const SELECTOR = `'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'`;

const EXPECTED = `JSON.stringify([...document.querySelectorAll(${SELECTOR})]
  .filter(el => { const r = el.getBoundingClientRect();
                  const s = getComputedStyle(el);
                  return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; })
  .map((el, i) => el.tagName + '#' + (el.id || '') + '.' + (el.className || '').toString().split(/\\s+/)[0] + ':' + i))`;

// identity = index within the interactive-element query (descriptor strings
// collide for bare anchors — a real bug caught by the fixture pair)
const ACTIVE = `(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return JSON.stringify(null);
  // neutralise scroll-behavior:smooth mid-flight (oracle-timing artefact,
  // fixture/flagship-caught): snap the focused element into view before
  // hit-testing — 2.4.11 is about sticky chrome obscuring content at rest,
  // not about scroll animation frames
  el.scrollIntoView({ block: "nearest", behavior: "instant" });
  const s = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const cx = Math.max(0, Math.min(innerWidth - 1, r.left + r.width / 2));
  const cy = Math.max(0, Math.min(innerHeight - 1, r.top + r.height / 2));
  const hit = document.elementFromPoint(cx, cy);
  const obscured = !!(hit && hit !== el && !el.contains(hit) && !hit.contains(el));
  return JSON.stringify({
    idx: [...document.querySelectorAll(${SELECTOR})].indexOf(el),
    desc: el.tagName + '#' + (el.id || '') + '.' + (el.className || '').toString().split(/\\s+/)[0],
    href: el.getAttribute && (el.getAttribute('href') || ''),
    text: (el.textContent || '').trim().slice(0, 40),
    focusVisible: el.matches(':focus-visible'),
    indicator: (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) !== 0) || s.boxShadow !== 'none',
    obscured,
  });
})()`;

const { send, close } = await connect("keyboard_check");
let failures = 0;
for (const route of routes) {
  await goto(send, route);
  const expected = await evalJson(send, close, "keyboard_check", EXPECTED);
  const seen = new Set(); const problems = [];
  let first = null;
  for (let i = 0; i < Math.min(maxTabs, expected.length * 2 + 10); i++) {
    await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
    await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
    await new Promise((r) => setTimeout(r, 80));
    const a = await evalJson(send, close, "keyboard_check", ACTIVE);
    if (!a) continue;
    if (first === null) first = a;
    seen.add(a.idx >= 0 ? a.idx : a.desc);
    if (a.focusVisible && !a.indicator)
      problems.push(`no visible focus indicator on ${a.desc}`);
    if (a.obscured)
      problems.push(`focused element obscured (2.4.11): ${a.desc}`);
  }
  // a skip link is skip-NAMED (class/id) or skip-WORDED at the start of its
  // text — "No skip link here" must not match (fixture-caught false pass)
  const skipOk = first && (first.href || "").startsWith("#") &&
    (/skip/i.test(first.desc) || /^skip\b/i.test(first.text));
  if (!skipOk) problems.push(`first Tab is not a skip link (got ${first ? first.desc : "nothing"})`);
  const reached = seen.size;
  // reachability: every distinct expected element class should be visited;
  // compare counts (descriptors differ in shape, so count-based with slack)
  if (reached < expected.length)
    problems.push(`reachability: ${reached}/${expected.length} interactive elements reached by Tab`);
  const uniq = [...new Set(problems)];
  failures += uniq.length;
  console.log(`${uniq.length ? "FAIL" : "pass"} ${route}: ${expected.length} interactive, ${reached} reached` +
    (uniq.length ? ` — ${uniq.slice(0, 5).join("; ")}` : ""));
}
await close();
console.log(`keyboard_check: ${failures === 0 ? "PASS" : "FAIL"} (${routes.length} routes, ${failures} problems)`);
process.exit(failures === 0 ? 0 : 1);
