#!/usr/bin/env node
// G15 / V2+U3 — reduced-motion parity gate. Emulates
// `prefers-reduced-motion: reduce` via CDP and FAILS if any animation or
// transition longer than 50 ms is still live on the page (or any
// scroll-driven/auto-duration animation survives). Run over key routes
// whenever the declared motion tier is above T0.
//
// Usage: motion_check.mjs <url> [--routes /,/work] [--json out.json]
// Exit 0 = parity holds; 1 = motion survives reduce; 2 = usage/launch error.
import { connect, goto, evalJson } from "./_cdp.mjs";
import { writeFileSync } from "node:fs";

const argv = process.argv.slice(2);
const url = argv.find((a) => /^https?:\/\//.test(a));
if (!url) { console.error("usage: motion_check.mjs <url> [--routes /a,/b] [--json out.json]"); process.exit(2); }
const jsonOut = argv.includes("--json") ? argv[argv.indexOf("--json") + 1] : null;
const routesArg = argv.includes("--routes") ? argv[argv.indexOf("--routes") + 1] : null;
const origin = new URL(url).origin;
const routes = routesArg ? routesArg.split(",").map((r) => new URL(r, origin).href) : [url];

const SNIFF = `JSON.stringify(document.getAnimations({ subtree: true }).map(a => {
  const t = a.effect ? a.effect.getTiming() : {};
  return { kind: a.constructor.name,
           name: a.animationName || a.transitionProperty || "",
           duration: t.duration ?? 0, iterations: t.iterations ?? 1,
           state: a.playState,
           scrollDriven: !!(a.timeline && a.timeline.constructor &&
                            /Scroll|View/.test(a.timeline.constructor.name)) };
}))`;

const { send, close } = await connect("motion_check");
await send("Emulation.setEmulatedMedia", {
  features: [{ name: "prefers-reduced-motion", value: "reduce" }],
});

const report = [];
let totalBad = 0;
for (const route of routes) {
  await goto(send, route);
  const anims = await evalJson(send, close, "motion_check", SNIFF);
  const bad = anims.filter((a) =>
    a.scrollDriven || a.duration === "auto" ||
    (typeof a.duration === "number" && a.duration > 50));
  totalBad += bad.length;
  report.push({ route, offenders: bad, total: anims.length });
  console.log(`${bad.length ? "FAIL" : "pass"} ${route}: ${bad.length} animations survive reduce` +
    (bad.length ? ` [${bad.map((a) => `${a.kind}:${a.name || "?"}(${a.duration}ms×${a.iterations})`).join(", ")}]` : ""));
}
console.log(`motion_check: ${totalBad === 0 ? "PASS" : "FAIL"} (${routes.length} routes, ${totalBad} offenders under prefers-reduced-motion: reduce)`);
if (jsonOut) writeFileSync(jsonOut, JSON.stringify({ origin, routes: report, generated: new Date().toISOString() }, null, 2));
await close();
process.exit(totalBad === 0 ? 0 : 1);
