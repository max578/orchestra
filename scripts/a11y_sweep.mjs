#!/usr/bin/env node
// G3 / V2 — axe-core accessibility sweep over every route of a running
// origin. This is the real implementation of the gate (uplift U0.1): axe is
// injected via CDP and executed in-page; the gate FAILS on any critical or
// serious violation. Findings mapped to WCAG 4.1.1 Parsing are suppressed
// (V2: 4.1.1 was removed as obsolete in WCAG 2.2 — never report it).
//
// axe-core resolves from the INSTANCE (devDependency), never vendored here:
//   1. $AXE_CORE_PATH (explicit file path to axe.min.js)
//   2. ./node_modules/axe-core/axe.min.js relative to CWD
// Absent axe-core is a TOOL-MISSING condition (exit 2 with a recognisable
// message) so the orchestrator reports "skipped", which --strict escalates.
//
// Usage: a11y_sweep.mjs <url> [--routes /,/work] [--json out.json]
// Routes default to sitemap discovery at the origin (sitemap-index.xml or
// sitemap.xml), falling back to the given URL alone. Max 50 routes.
// Exit 0 = zero critical/serious on all routes; 1 = violations; 2 = error.
import { connect, goto, evalJson } from "./_cdp.mjs";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const argv = process.argv.slice(2);
const url = argv.find((a) => /^https?:\/\//.test(a));
if (!url) { console.error("usage: a11y_sweep.mjs <url> [--routes /a,/b] [--json out.json]"); process.exit(2); }
const jsonOut = argv.includes("--json") ? argv[argv.indexOf("--json") + 1] : null;
const routesArg = argv.includes("--routes") ? argv[argv.indexOf("--routes") + 1] : null;

const axePath = process.env.AXE_CORE_PATH || resolve(process.cwd(), "node_modules/axe-core/axe.min.js");
if (!existsSync(axePath)) {
  console.error(`a11y_sweep: axe-core not installed (looked at ${axePath}; set AXE_CORE_PATH to override)`);
  process.exit(2);
}
const axeSource = readFileSync(axePath, "utf8");

const origin = new URL(url).origin;
async function discoverRoutes() {
  if (routesArg) return routesArg.split(",").map((r) => new URL(r, origin).href);
  const locs = async (u) => {
    try {
      const res = await fetch(u);
      if (!res.ok) return null;
      const xml = await res.text();
      const found = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
      return { index: /<sitemapindex/i.test(xml), found };
    } catch { return null; }
  };
  // sitemap locs may carry the PRODUCTION origin (domain-portable builds);
  // remap every loc to the origin actually being audited before fetching
  const remap = (u) => { try { return new URL(new URL(u).pathname, origin).href; } catch { return null; } };
  for (const name of ["/sitemap-index.xml", "/sitemap.xml"]) {
    const top = await locs(origin + name);
    if (!top || !top.found.length) continue;
    if (!top.index) return top.found.map(remap).filter(Boolean).slice(0, 50);
    const pages = [];
    for (const child of top.found.map(remap).filter(Boolean).slice(0, 10)) {
      const c = await locs(child);
      if (c) pages.push(...c.found);
    }
    if (pages.length) return pages.map(remap).filter(Boolean).slice(0, 50);
  }
  return [url];
}

const { send, close } = await connect("a11y_sweep");
const routes = (await discoverRoutes()).map((r) => r.replace(new URL(r).origin, origin));
const report = [];
let totalBad = 0;
for (const route of routes) {
  await goto(send, route);
  await send("Runtime.evaluate", { expression: axeSource });
  const all = await evalJson(send, close, "a11y_sweep",
    `axe.run(document, { resultTypes: ['violations'] }).then(r => JSON.stringify(
      r.violations.map(v => ({ id: v.id, impact: v.impact, tags: v.tags, nodes: v.nodes.length,
                               help: v.help }))))`,
    { awaitPromise: true });
  const bad = all.filter((v) => ["critical", "serious"].includes(v.impact) && !v.tags.includes("wcag411"));
  totalBad += bad.length;
  report.push({ route, violations: bad, other: all.length - bad.length });
  console.log(`${bad.length ? "FAIL" : "pass"} ${route}: ${bad.length} critical/serious` +
    (bad.length ? ` [${bad.map((v) => `${v.id}(${v.impact}×${v.nodes})`).join(", ")}]` : "") +
    (all.length - bad.length ? ` (+${all.length - bad.length} lower-impact, not gating)` : ""));
}
console.log(`a11y_sweep: ${totalBad === 0 ? "PASS" : "FAIL"} (${routes.length} routes, ${totalBad} critical/serious violations)`);
if (jsonOut) writeFileSync(jsonOut, JSON.stringify({ origin, routes: report, generated: new Date().toISOString() }, null, 2));
await close();
process.exit(totalBad === 0 ? 0 : 1);
