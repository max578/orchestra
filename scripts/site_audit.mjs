#!/usr/bin/env node
// G1-G8 + G11b orchestrator — runs the node-ecosystem audit tools that are
// installed in the INSTANCE (project devDependencies, resolved at scaffold
// time; this script only orchestrates) plus its own dependency-free checks.
// Emits a JSON scorecard with tool versions.
//
// Skip-vs-fail contract (uplift U0.2): a tool that is genuinely absent —
// npx itself missing (ENOENT) OR `npx --no-install` refusing because the
// package is not installed — is reported "skipped", never "fail" and never
// silently passed. `--strict` turns any skip into failure (ship/CI posture).
// Real tool executions that find defects are "fail".
//
// Modes:
//   dist dir : G6 html-validate · G4 links · G8 metadata (built-in)
//              · G7 asset budget (built-in)
//   url      : G2 lighthouse · G3 a11y_sweep (axe via CDP, sibling script)
//              · G4 links · G11b overflow (sibling script)
//
// Usage: node site_audit.mjs <dist-dir | url> [--json <out.json>] [--strict]
import { execFileSync } from "node:child_process";
import { writeFileSync, existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const target = args.find(a => !a.startsWith("--"));
const jsonOut = args.includes("--json") ? args[args.indexOf("--json") + 1] : null;
const strict = args.includes("--strict");
if (!target) {
  console.error("usage: site_audit.mjs <dist-dir|url> [--json out.json] [--strict]");
  process.exit(2);
}
const isUrl = /^https?:\/\//.test(target);

const MISSING_PKG = /npx canceled due to missing packages|could not determine executable to run|command not found|not found/i;

function exec(cmd, cmdArgs) {
  return execFileSync(cmd, cmdArgs, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 * 1024 * 1024 });
}

function run(gate, cmd, cmdArgs, parse) {
  try {
    const out = exec(cmd, cmdArgs);
    return { gate, status: "pass", detail: parse ? parse(out) : out.split("\n").slice(-3).join(" ").trim() };
  } catch (e) {
    if (e.code === "ENOENT") return { gate, status: "skipped", detail: `${cmd} not installed in this instance` };
    const msg = (e.stdout || "") + (e.stderr || "") + (e.message || "");
    if (MISSING_PKG.test(msg)) {
      const m = msg.match(/missing packages[^[]*\[([^\]]*)\]/);
      return { gate, status: "skipped", detail: `tool not installed in this instance${m ? `: ${m[1]}` : ""}` };
    }
    return { gate, status: "fail", detail: msg.split("\n").filter(Boolean).slice(0, 20).join("\n") };
  }
}

// Sibling gate scripts speak the same protocol: exit 0 pass, 1 fail,
// 2 usage/tool-missing/launch error (message says which).
function runSibling(gate, script, scriptArgs) {
  try {
    const out = exec(process.execPath, [join(HERE, script), ...scriptArgs]);
    return { gate, status: "pass", detail: out.trim().split("\n").slice(-1)[0] };
  } catch (e) {
    const msg = (e.stdout || "") + (e.stderr || "");
    if (e.status === 2 && /not installed|could not launch/i.test(msg))
      return { gate, status: "skipped", detail: msg.trim().split("\n").slice(-1)[0] };
    if (e.status === 2) return { gate, status: "fail", detail: `usage/launch error: ${msg.trim().slice(0, 200)}` };
    return { gate, status: "fail", detail: msg.split("\n").filter(Boolean).slice(-6).join("\n") };
  }
}

function ver(cmd, cmdArgs) {
  try { return exec(cmd, cmdArgs).trim().split("\n")[0]; } catch { return null; }
}

// ---------------------------------------------------------------- G8 (built-in)
// V6 literal text: title, description, canonical, OG + social-card IMAGE,
// sitemap, robots, favicon. Pure-node so it runs everywhere (uplift U0.5).
function walkHtml(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkHtml(p, acc);
    else if (extname(name) === ".html") acc.push(p);
  }
  return acc;
}
function checkMeta(dist) {
  const problems = [];
  const pages = walkHtml(dist);
  if (!pages.length) return { gate: "G8:metadata", status: "fail", detail: "no HTML pages found" };
  for (const p of pages) {
    const rel = relative(dist, p);
    const is404 = /(^|\/)404\.html$/.test(rel);
    const html = readFileSync(p, "utf8");
    const has = (re) => re.test(html);
    if (!has(/<title>[^<]+<\/title>/i)) problems.push(`${rel}: missing <title>`);
    if (!has(/<meta[^>]+name=["']description["'][^>]+content=["'][^"']+/i) &&
        !has(/<meta[^>]+content=["'][^"']+["'][^>]+name=["']description["']/i)) problems.push(`${rel}: missing meta description`);
    if (!is404) {
      if (!has(/<link[^>]+rel=["']canonical["']/i)) problems.push(`${rel}: missing canonical`);
      if (!has(/property=["']og:title["']/i)) problems.push(`${rel}: missing og:title`);
      if (!has(/property=["']og:description["']/i)) problems.push(`${rel}: missing og:description`);
      if (!has(/property=["']og:image["']/i)) problems.push(`${rel}: missing og:image (V6 social card)`);
      if (!has(/name=["']twitter:card["']/i)) problems.push(`${rel}: missing twitter:card`);
    }
  }
  for (const [what, ok] of [
    ["sitemap", existsSync(join(dist, "sitemap.xml")) || existsSync(join(dist, "sitemap-index.xml"))],
    ["robots.txt", existsSync(join(dist, "robots.txt"))],
    ["favicon", existsSync(join(dist, "favicon.svg")) || existsSync(join(dist, "favicon.ico"))],
  ]) if (!ok) problems.push(`dist root: missing ${what}`);
  return problems.length
    ? { gate: "G8:metadata", status: "fail", detail: problems.slice(0, 15).join("; ") + (problems.length > 15 ? ` (+${problems.length - 15} more)` : "") }
    : { gate: "G8:metadata", status: "pass", detail: `${pages.length} pages: title/description/canonical/og:image/twitter:card + sitemap/robots/favicon all present` };
}

// ---------------------------------------------------------------- G7 (built-in)
// Mechanical floor for the asset budget (card budgets refine per instance):
// raster > 500 KB fails; legacy-format raster > 200 KB fails unless a modern
// sibling (.avif/.webp) ships beside it; non-woff2 font files fail;
// HTML page > 150 KB fails. Reports the five heaviest assets either way.
function checkAssets(dist) {
  const problems = []; const sizes = [];
  const RASTER = new Set([".jpg", ".jpeg", ".png", ".gif"]);
  const FONT = new Set([".ttf", ".otf", ".woff", ".eot"]);
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      const st = statSync(p);
      if (st.isDirectory()) { walk(p); continue; }
      const rel = relative(dist, p); const ext = extname(name).toLowerCase(); const kb = st.size / 1024;
      sizes.push([rel, kb]);
      if (RASTER.has(ext)) {
        if (kb > 500) problems.push(`${rel}: raster ${kb.toFixed(0)}KB > 500KB`);
        else if (kb > 200 && !existsSync(p.replace(/\.[^.]+$/, ".avif")) && !existsSync(p.replace(/\.[^.]+$/, ".webp")))
          problems.push(`${rel}: legacy-format ${kb.toFixed(0)}KB with no modern sibling`);
      }
      if (FONT.has(ext)) problems.push(`${rel}: font not woff2`);
      if (ext === ".html" && kb > 150) problems.push(`${rel}: page ${kb.toFixed(0)}KB > 150KB`);
    }
  })(dist);
  const top = sizes.sort((a, b) => b[1] - a[1]).slice(0, 5).map(([r, k]) => `${r} ${k.toFixed(0)}KB`).join(", ");
  return problems.length
    ? { gate: "G7:assets", status: "fail", detail: problems.slice(0, 10).join("; ") }
    : { gate: "G7:assets", status: "pass", detail: `no budget violations; heaviest: ${top || "(empty dist)"}` };
}

// ---------------------------------------------------------------- main
const results = [];
if (!isUrl) {
  if (!existsSync(target)) { console.error(`no such dist dir: ${target}`); process.exit(2); }
  results.push(run("G6:html-validate", "npx", ["--no-install", "html-validate", `${target}/**/*.html`]));
  results.push(run("G4:links", "npx", ["--no-install", "linkinator", target, "--recurse", "--silent"]));
  results.push(checkMeta(target));
  results.push(checkAssets(target));
  // mode-deferred, not tool-missing: --strict must not escalate these two —
  // CI runs URL mode as well and gate_report merges both scorecards
  results.push({ gate: "G2:lighthouse", status: "deferred", detail: "needs a running origin (URL mode); CI runs both modes" });
  results.push({ gate: "G3:axe", status: "deferred", detail: "needs a running origin (URL mode); CI runs both modes" });
} else {
  results.push(run("G2:lighthouse", "npx", ["--no-install", "lighthouse", target,
    "--quiet", "--chrome-flags=--headless", "--only-categories=performance,accessibility,best-practices,seo",
    "--output=json", "--output-path=stdout"],
    out => {
      const r = JSON.parse(out);
      const s = Object.fromEntries(Object.entries(r.categories).map(([k, v]) => [k, Math.round(v.score * 100)]));
      if (s.performance < 95) throw Object.assign(new Error("perf<95"), { stdout: JSON.stringify(s) });
      return s;
    }));
  results.push(runSibling("G3:axe", "a11y_sweep.mjs", [target]));
  results.push(run("G4:links", "npx", ["--no-install", "linkinator", target, "--recurse", "--silent"]));
  results.push(runSibling("G11b:overflow", "overflow_check.mjs", [target]));
}

const versions = {
  node: process.version,
  lighthouse: ver("npx", ["--no-install", "lighthouse", "--version"]),
  "html-validate": ver("npx", ["--no-install", "html-validate", "--version"]),
  linkinator: ver("npx", ["--no-install", "linkinator", "--version"]),
  "axe-core": (() => {
    try { return JSON.parse(readFileSync(join(process.cwd(), "node_modules/axe-core/package.json"), "utf8")).version; }
    catch { return null; }
  })(),
};

const failed = results.filter(r => r.status === "fail");
const skipped = results.filter(r => r.status === "skipped");
const verdict = failed.length ? "FAIL" : (strict && skipped.length ? "FAIL(strict:skips)" : "PASS");
const scorecard = { target, mode: isUrl ? "url" : "dist", verdict, results, versions, generated: new Date().toISOString() };
for (const r of results) console.log(`${r.status.toUpperCase().padEnd(9)} ${r.gate}  ${typeof r.detail === "string" ? r.detail.split("\n")[0] : JSON.stringify(r.detail)}`);
console.log(`site_audit: ${verdict}`);
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(scorecard, null, 2));
process.exit(verdict === "PASS" ? 0 : 1);
