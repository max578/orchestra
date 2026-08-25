#!/usr/bin/env node
// G14b — visual regression (uplift U5.1). CDP full-page screenshots at
// fixed widths, pixel-compared against committed baselines using the
// instance's sharp. Baselines are PLATFORM/RENDERER-TIED (verified
// constraint, register vrt.playwright.snapshots): they are valid only on
// the OS/Chrome that produced them — regenerate with --update after any
// environment change, and let G14 (human) approve the new baselines.
//
// Usage: visual_diff.mjs <url> [--routes /,/work] [--widths 360,768,1440]
//        [--baselines audits/baselines] [--max-diff-pixels 100] [--update]
// Exit 0 = all within tolerance (or baselines written with --update);
//      1 = regression / missing baseline; 2 = usage/tool/launch error.
import { connect, goto } from "./_cdp.mjs";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

async function loadSharp() {
  try { return (await import("sharp")).default; } catch {}
  const { createRequire } = await import("node:module");
  const { pathToFileURL } = await import("node:url");
  const req = createRequire(pathToFileURL(resolve(process.cwd(), "package.json")));
  try { return (await import(pathToFileURL(req.resolve("sharp")))).default; }
  catch { console.error("visual_diff: sharp not installed in this instance"); process.exit(2); }
}

const argv = process.argv.slice(2);
const url = argv.find((a) => /^https?:\/\//.test(a));
if (!url) { console.error("usage: visual_diff.mjs <url> [--routes ...] [--widths ...] [--baselines dir] [--max-diff-pixels n] [--update]"); process.exit(2); }
const opt = (name, dflt) => argv.includes(name) ? argv[argv.indexOf(name) + 1] : dflt;
const widths = opt("--widths", "360,768,1440").split(",").map(Number);
const baseDir = opt("--baselines", "audits/baselines");
const maxDiff = Number(opt("--max-diff-pixels", "100"));
const update = argv.includes("--update");
const routesArg = opt("--routes", null);
const origin = new URL(url).origin;
const routes = routesArg ? routesArg.split(",").map((r) => new URL(r, origin).href) : [url];

const sharp = await loadSharp();
// --hide-scrollbars: scrollbar presence is capture-time non-deterministic on
// pages whose height sits near the viewport (privacy@1440 flake, 1425 vs
// 1440 px) — hiding it makes full-page captures reproducible
const { send, close } = await connect("visual_diff", ["--hide-scrollbars"]);
mkdirSync(baseDir, { recursive: true });

let failures = 0, updated = 0;
for (const route of routes) {
  const slug = new URL(route).pathname === "/" ? "home"
    : new URL(route).pathname.replace(/^\/|\/$/g, "").replace(/\//g, "-");
  for (const w of widths) {
    await send("Emulation.setDeviceMetricsOverride",
      { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 768 });
    await goto(send, route);
    const shot = await send("Page.captureScreenshot",
      { format: "png", captureBeyondViewport: true });
    const png = Buffer.from(shot.data, "base64");
    const bpath = join(baseDir, `${slug}@${w}.png`);
    if (update || !existsSync(bpath)) {
      if (!update && !existsSync(bpath)) {
        failures++;
        console.log(`FAIL ${slug}@${w}: no baseline (run with --update after G14 approval)`);
        continue;
      }
      writeFileSync(bpath, png); updated++;
      console.log(`baseline ${slug}@${w}: written (${(png.length / 1024).toFixed(0)}KB)`);
      continue;
    }
    const [a, b] = await Promise.all([png, readFileSync(bpath)].map((buf) =>
      sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })));
    if (a.info.width !== b.info.width || a.info.height !== b.info.height) {
      failures++;
      console.log(`FAIL ${slug}@${w}: dimensions ${a.info.width}x${a.info.height} vs baseline ${b.info.width}x${b.info.height}`);
      continue;
    }
    let diff = 0;
    const A = a.data, B = b.data, TOL = 8;
    for (let i = 0; i < A.length; i += 4) {
      if (Math.abs(A[i] - B[i]) > TOL || Math.abs(A[i + 1] - B[i + 1]) > TOL ||
          Math.abs(A[i + 2] - B[i + 2]) > TOL) diff++;
    }
    const ok = diff <= maxDiff;
    if (!ok) failures++;
    console.log(`${ok ? "pass" : "FAIL"} ${slug}@${w}: ${diff} differing pixels (max ${maxDiff})`);
  }
}
await close();
console.log(`visual_diff: ${failures === 0 ? "PASS" : "FAIL"} (${routes.length} routes x ${widths.length} widths${updated ? `, ${updated} baselines updated` : ""})`);
process.exit(failures === 0 ? 0 : 1);
