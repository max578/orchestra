#!/usr/bin/env node
// G11b / V2 — horizontal-overflow gate. Emulates narrow mobile and wide
// viewports via CDP and fails if any element extends past the layout
// viewport (the "body must never scroll horizontally" rule). Catches what
// a clipped screenshot only hints at — and removes the eyeball from the
// loop.
//
// Usage: node overflow_check.mjs <url> [--widths 360,768,1440]
// Needs a Chromium-family browser; set CHROME_PATH to override auto-detect.
// Exit 0 = no overflow at any width; 1 = overflow; 2 = usage/launch error.
import { connect, goto, evalJson } from "./_cdp.mjs";

const url = process.argv.find((a) => /^https?:\/\//.test(a));
if (!url) { console.error("usage: overflow_check.mjs <url> [--widths 360,768,1440]"); process.exit(2); }
const wi = process.argv.indexOf("--widths");
const widths = wi > -1 ? process.argv[wi + 1].split(",").map(Number) : [360, 768, 1440];

const { send, close } = await connect("overflow_check");
const EXPR = `(() => {
  const vw = window.innerWidth, over = [];
  // an element wider than the viewport is only a defect if it forces the PAGE
  // to scroll — content inside an overflow-x:auto/scroll container (e.g. a wide
  // data table, per patterns P6) is meant to scroll within its own box.
  const inScrollBox = (el) => {
    for (let n = el.parentElement; n && n !== document.documentElement; n = n.parentElement) {
      const ox = getComputedStyle(n).overflowX;
      if (ox === 'auto' || ox === 'scroll') return true;
    }
    return false;
  };
  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 && !inScrollBox(el)) over.push(el.tagName.toLowerCase() + '.' + (el.className||'').toString().trim().split(/\\s+/)[0]);
  }
  return JSON.stringify({ vw, sw: document.documentElement.scrollWidth, over: [...new Set(over)].slice(0,5) });
})()`;

let failures = 0;
for (const w of widths) {
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: 800, deviceScaleFactor: 1, mobile: w < 768 });
  await goto(send, url);
  const r = await evalJson(send, close, "overflow_check", EXPR);
  const bad = r.sw > r.vw + 1 || r.over.length;
  if (bad) failures++;
  console.log(`${bad ? "FAIL" : "pass"} @${w}px: scrollWidth=${r.sw} innerWidth=${r.vw}` +
    (r.over.length ? ` offenders: ${r.over.join(", ")}` : ""));
}
console.log(`overflow_check: ${failures === 0 ? "PASS" : "FAIL"} (${widths.length} widths, ${failures} with overflow)`);
await close();
process.exit(failures === 0 ? 0 : 1);
