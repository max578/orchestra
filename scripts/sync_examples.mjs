// Copy each worked example's released numbers into the site.
//
//   node scripts/sync_examples.mjs [--from <W1 folder>]
//   node scripts/sync_examples.mjs --fixtures <folder>   (layout work only)
//
// Reads <folder>/E{1,2,3,4}/release/site_numbers.json and writes
// src/data/examples/E{n}.json, plus the error alphabet. Figures that `files`
// names inside release/ (png, svg, webp, jpg) are copied to
// public/figures/examples/E{n}/ and listed in the copy as `_figures`. Stops with exit 1,
// writing nothing, if any file is missing or lacks a field the SPEC requires.
// Files copied with --fixtures are marked "_fixture": true; the build refuses
// them unless ORCHESTRA_FIXTURES=1 is set, and every page then says so.
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { EXAMPLE_IDS, validateExample } from "../src/data/examples_spec.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const site = resolve(here, "..");
const out = join(site, "src", "data", "examples");
const figOut = join(site, "public", "figures", "examples");
const W1_DEFAULT = resolve(site, "../../../ORCHESTRA_dev/studies/W1_site_examples");

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1] ?? ""; };
const fixtures = flag("--fixtures");
if (fixtures === "") { console.error("sync_examples: --fixtures needs a folder"); process.exit(1); }
const from = resolve(fixtures ?? flag("--from") ?? W1_DEFAULT);

const problems = [];
const ready = [];
for (const id of EXAMPLE_IDS) {
  const p = join(from, id, "release", "site_numbers.json");
  if (!existsSync(p)) { problems.push(`${id}: ${p} does not exist`); continue; }
  let ex;
  try { ex = JSON.parse(readFileSync(p, "utf8")); }
  catch (e) { problems.push(`${id}: ${p} is not valid JSON (${e.message})`); continue; }
  const errs = validateExample(ex, id);
  if (errs.length) { problems.push(...errs); continue; }
  if (fixtures) ex._fixture = true; else delete ex._fixture;
  const release = join(from, id, "release");
  const figs = [];
  for (const f of ex.files) {
    if (!/\.(png|svg|webp|jpe?g)$/i.test(f)) continue;
    const src = [resolve(from, id, f), resolve(release, f)].find((c) => existsSync(c) && !relative(release, c).startsWith(".."));
    if (!src) { problems.push(`${id}: figure ${f} is not inside ${release}`); continue; }
    figs.push(src);
  }
  if (!figs.some((f) => /janus/i.test(basename(f)))) console.warn(`sync_examples: WARNING ${id} names no janusplot figure in files; the page shows none.`);
  ready.push([id, ex, figs]);
}
const alphabet = join(fixtures ? W1_DEFAULT : from, "alphabet.tsv");
if (!existsSync(alphabet)) problems.push(`alphabet: ${alphabet} does not exist`);

if (problems.length) {
  console.error(`sync_examples: FAILED, nothing written (${problems.length} problem${problems.length > 1 ? "s" : ""})`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
mkdirSync(out, { recursive: true });
for (const [id, ex, figs] of ready) {
  const dir = join(figOut, id);
  rmSync(dir, { recursive: true, force: true });
  ex._figures = [];
  if (figs.length) mkdirSync(dir, { recursive: true });
  for (const f of figs) {
    copyFileSync(f, join(dir, basename(f)));
    ex._figures.push({ src: `/figures/examples/${id}/${basename(f)}`,
      alt: /janus/i.test(basename(f)) ? `janusplot matrix of smoothed associations, example ${id}` : `Figure from the released results of example ${id}: ${basename(f)}` });
  }
  writeFileSync(join(out, `${id}.json`), JSON.stringify(ex, null, 2) + "\n");
}
writeFileSync(join(out, "alphabet.tsv"), readFileSync(alphabet, "utf8"));
console.log(`sync_examples: wrote ${ready.map(([id]) => id).join(", ")} and alphabet.tsv to src/data/examples/${fixtures ? " (FIXTURES: layout only, never commit)" : ""}`);
