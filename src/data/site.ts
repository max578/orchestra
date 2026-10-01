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
    "Small R packages for grain-crop analytics (multi-environment trials, " +
    "breeding, crop simulation), each doing one job. The packages share one " +
    "result format. A package stops if it is handed a result in the wrong " +
    "format. It gives no result, with the reason, when the data are too thin.",
  domain: "Australian grain agriculture (wheat · barley · corn): multi-environment trials, breeding and genomics, crop simulation",
  counts: { members: 20, external: 10, contracts: 7 },
  nav: [
    { href: "/", label: "Home" },
    { href: "/members", label: "Members" },
    { href: "/studies", label: "Studies" },
    { href: "/a0", label: "A0 results" },
    { href: "/governance", label: "Governance" },
    { href: "/delegates", label: "Delegates" },
    { href: "/trial", label: "Trial" },
    { href: "/about", label: "About" },
  ],
};
