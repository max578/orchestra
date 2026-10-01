#!/usr/bin/env node
// U4.2 — build-time OG/social-card generator (G8's og:image supplier).
// Composes a typographic 1200x630 SVG per route (field colour, kicker,
// title, site mark from the instance's design tokens) and rasterises to
// PNG via the instance's sharp (libvips+librsvg — build-time only, fully
// self-hosted, CSP-irrelevant). Runs AFTER `astro build`:
//
//   node scripts/og_images.mjs dist [--tokens src/styles/tokens.css]
//
// Contract with the layout: pages emit og:image = /og/<slug>.png where
// slug = "home" for "/" else the path with slashes -> "-". This script
// walks dist/*.html, derives slug + <title> + description, and writes
// dist/og/<slug>.png. A page whose PNG fails to generate FAILS the run
// (fail-closed; G8/G4 would catch a dangling og:image anyway).
// Exit 0 = all generated; 1 = generation failure; 2 = usage/tool missing.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";

async function loadSharp() {
  try { return (await import("sharp")).default; } catch {}
  const { createRequire } = await import("node:module");
  const { pathToFileURL } = await import("node:url");
  const req = createRequire(pathToFileURL(resolve(process.cwd(), "package.json")));
  try { return (await import(pathToFileURL(req.resolve("sharp")))).default; }
  catch { console.error("og_images: sharp not installed in this instance"); process.exit(2); }
}

const args = process.argv.slice(2);
const dist = args.find((a) => !a.startsWith("--"));
if (!dist || !existsSync(dist)) { console.error("usage: og_images.mjs <dist> [--tokens tokens.css]"); process.exit(2); }
const tokensPath = args.includes("--tokens") ? args[args.indexOf("--tokens") + 1] : "src/styles/tokens.css";

// tokens -> colours (fallbacks are the racing_green preset)
let field = "#0B3D2E", fieldInk = "#F1EFE4", accent = "#A8D5BA";
if (existsSync(tokensPath)) {
  const css = readFileSync(tokensPath, "utf8");
  const grab = (name, cur) => (css.match(new RegExp(`${name}:\\s*(#[0-9A-Fa-f]{6})`)) || [, cur])[1];
  field = grab("--field", field); fieldInk = grab("--field-ink", fieldInk); accent = grab("--accent", accent);
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function wrap(text, max) {
  const words = text.split(/\s+/); const lines = [""];
  for (const w of words) {
    if ((lines.at(-1) + " " + w).trim().length > max) lines.push(w);
    else lines[lines.length - 1] = (lines.at(-1) + " " + w).trim();
  }
  return lines.slice(0, 4);
}

function svgCard(title, kicker, mark) {
  const lines = wrap(title, 30);
  const size = lines.length > 2 ? 56 : 68;
  const tspans = lines.map((l, i) =>
    `<tspan x="80" dy="${i === 0 ? 0 : size * 1.18}">${esc(l)}</tspan>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${field}"/>
  <rect x="80" y="86" width="120" height="6" fill="${accent}"/>
  <text x="80" y="150" font-family="monospace" font-size="26" letter-spacing="4"
        fill="${accent}">${esc(kicker.toUpperCase())}</text>
  <text x="80" y="260" font-family="Georgia, 'Times New Roman', serif" font-size="${size}"
        fill="${fieldInk}">${tspans}</text>
  <text x="80" y="560" font-family="monospace" font-size="24" fill="${fieldInk}"
        opacity="0.85">${esc(mark)}</text>
</svg>`;
}

function pages(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (name !== "og") pages(p, acc); }
    else if (name === "index.html" || /^[^/]+\.html$/.test(relative(dist, p))) acc.push(p);
  }
  return acc;
}

const sharp = await loadSharp();
mkdirSync(join(dist, "og"), { recursive: true });
let failures = 0, made = 0;
for (const p of pages(dist)) {
  const rel = relative(dist, p);
  const route = rel === "index.html" ? "/" : "/" + rel.replace(/\/index\.html$/, "").replace(/\.html$/, "");
  const slug = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
  const html = readFileSync(p, "utf8");
  if (/http-equiv="refresh"/i.test(html)) continue; // forwarding pages need no card
  const title = (html.match(/<title>([^<]+)<\/title>/i) || [, slug])[1]
    .split("—")[0].trim();
  const mark = (html.match(/<meta[^>]+name="author"[^>]+content="([^"]+)"/i) || [, ""])[1];
  const kicker = slug === "home" ? "profile" : slug.replace(/-/g, " ");
  try {
    const png = await sharp(Buffer.from(svgCard(title, kicker, mark || slug))).png().toBuffer();
    writeFileSync(join(dist, "og", `${slug}.png`), png);
    made++;
    console.log(`pass /og/${slug}.png (${(png.length / 1024).toFixed(0)}KB) <- ${route}`);
  } catch (e) {
    failures++;
    console.error(`FAIL /og/${slug}.png: ${e.message}`);
  }
}
console.log(`og_images: ${failures === 0 ? "PASS" : "FAIL"} (${made} generated, ${failures} failed)`);
process.exit(failures === 0 ? 0 : 1);
