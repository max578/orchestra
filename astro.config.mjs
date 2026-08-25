// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// V12 domain-portability: the launch origin lives in exactly ONE place.
// The real domain is deferred (subject repo is private). Override without a
// rebuild via SITE_ORIGIN.
const SITE_ORIGIN = process.env.SITE_ORIGIN ?? "https://example.invalid";
// Sub-path hosting (GitHub Pages project site): SITE_BASE="/orchestra". Empty = root.
const SITE_BASE = (process.env.SITE_BASE ?? "").replace(/\/$/, "");

export default defineConfig({
  site: SITE_ORIGIN,
  base: SITE_BASE || undefined,
  trailingSlash: "ignore",
  // never inline CSS/JS as <style>/<script> — keep everything external so the
  // CSP can stay strict (style-src 'self', script-src 'self', no unsafe-inline)
  build: { format: "directory", inlineStylesheets: "never" },
  integrations: [sitemap()],
  // Never inline scripts: the strict CSP (script-src 'self', no unsafe-inline)
  // blocks inline <script type="module">, which Astro emits for small hoisted
  // scripts by default. 0 forces every script (and asset) to a same-origin file.
  vite: { build: { assetsInlineLimit: 0 } },
});
