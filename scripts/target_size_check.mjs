#!/usr/bin/env node
// WCAG 2.2 SC 2.5.8 target-size prototype (uplift U5.4 — ADVISORY until
// validated against hand-measured fixtures; register row
// a11y.target_size.tooling records that no off-the-shelf tool cleared
// verification for this criterion). Flags visible interactive elements
// whose bounding box is under 24x24 CSS px, honouring the inline
// exception (targets sitting in a sentence/flow of text are exempt).
//
// Usage: target_size_check.mjs <url> [--routes /,/work] [--min 24]
// Exit 0 = no undersized targets; 1 = findings (advisory); 2 = error.
import { connect, goto, evalJson } from "./_cdp.mjs";

const argv = process.argv.slice(2);
const url = argv.find((a) => /^https?:\/\//.test(a));
if (!url) { console.error("usage: target_size_check.mjs <url> [--routes /a,/b] [--min 24]"); process.exit(2); }
const routesArg = argv.includes("--routes") ? argv[argv.indexOf("--routes") + 1] : null;
const MIN = Number(argv.includes("--min") ? argv[argv.indexOf("--min") + 1] : 24);
const origin = new URL(url).origin;
const routes = routesArg ? routesArg.split(",").map((r) => new URL(r, origin).href) : [url];

const SNIFF = `JSON.stringify([...document.querySelectorAll(
  'a[href], button, input:not([type=hidden]), select, textarea, [role=button]')]
  .map(el => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    if (r.width === 0 || r.height === 0 || s.visibility === 'hidden' || s.display === 'none') return null;
    const inline = s.display.startsWith('inline') &&
      el.parentElement && (el.parentElement.textContent || '').trim().length >
      (el.textContent || '').trim().length + 3;
    return { desc: el.tagName + '#' + (el.id || '') + '.' + (el.className || '').toString().split(/\\s+/)[0],
             w: Math.round(r.width), h: Math.round(r.height), inline };
  }).filter(Boolean))`;

const { send, close } = await connect("target_size_check");
let findings = 0;
for (const route of routes) {
  await send("Emulation.setDeviceMetricsOverride",
    { width: 360, height: 800, deviceScaleFactor: 1, mobile: true });
  await goto(send, route);
  const targets = await evalJson(send, close, "target_size_check", SNIFF);
  const bad = targets.filter((t) => !t.inline && (t.w < MIN || t.h < MIN));
  findings += bad.length;
  console.log(`${bad.length ? "FLAG" : "pass"} ${route}: ${targets.length} targets, ${bad.length} under ${MIN}x${MIN}` +
    (bad.length ? ` [${bad.slice(0, 5).map((t) => `${t.desc}(${t.w}x${t.h})`).join(", ")}]` : ""));
}
await close();
console.log(`target_size_check: ${findings === 0 ? "PASS" : "FINDINGS"} (${routes.length} routes @360px, ${findings} undersized targets; advisory)`);
process.exit(findings === 0 ? 0 : 1);
