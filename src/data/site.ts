// Base-path helper: internal links are authored root-relative ("/members")
// and prefixed at render with the configured base (import.meta.env.BASE_URL),
// so the same source serves a root origin and a GitHub Pages sub-path.
const BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
export const href = (p: string): string => (p === "/" ? `${BASE}/` : `${BASE}${p}`);
export const base = BASE;

// Site-level metadata. Grounded framing from ORCHESTRA.md; no version numbers
// (they drift — GROUNDING_NOTES rule 2), agriculture-only (trading excluded).
export const site = {
  name: "The ORCHESTRA",
  tagline: "Composition, not consolidation",
  intro:
    "A constellation of single-responsibility R packages for grain-crop " +
    "analytics — multi-environment trials, breeding, crop simulation — " +
    "unified by one result contract and performed by a contract-typed " +
    "engine that refuses a mistyped connection and abstains when the " +
    "evidence is under-powered.",
  domain: "Australian grain agriculture (wheat · barley · corn) — MET, breeding/genomics, crop simulation",
  counts: { members: 16, candidates: 4, external: 3, contracts: 7 },
  nav: [
    { href: "/", label: "Home" },
    { href: "/members", label: "Members" },
    { href: "/studies", label: "Studies" },
    { href: "/about", label: "About" },
  ],
};
