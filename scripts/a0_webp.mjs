// Modern-format siblings for the A0 figures (G7): one .webp beside each .png
// under public/figures/a0/, same pixel size, quality 82. Run: node scripts/a0_webp.mjs
import sharp from "sharp";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
const dir = new URL("../public/figures/a0/", import.meta.url);
for (const f of readdirSync(dir).filter((x) => x.endsWith(".png"))) {
  const out = fileURLToPath(new URL(f.replace(/\.png$/, ".webp"), dir));
  const info = await sharp(fileURLToPath(new URL(f, dir))).webp({ quality: 82 }).toFile(out);
  console.log(`${f} -> ${f.replace(/\.png$/, ".webp")} ${Math.round(info.size / 1024)} KB`);
}
