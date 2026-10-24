// Base-path helper: internal links are authored root-relative ("/members")
// and prefixed at render with the configured base (import.meta.env.BASE_URL),
// so the same source serves a root origin and a GitHub Pages sub-path.
import { tiers } from "./members";

const BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
export const href = (p: string): string => (p === "/" ? `${BASE}/` : `${BASE}${p}`);
export const base = BASE;

// Site-level metadata. Grounded framing from ORCHESTRA.md; no version numbers
// (they drift — GROUNDING_NOTES rule 2), agriculture-only (trading excluded).
export const site = {
  name: "Crop Analytics Orchestra",
  tagline: "R packages for crop analytics",
  intro:
    "A coordinated, flexible constellation of R packages for crop analytics: " +
    "18 R packages and an open-data catalogue, DataHub, built to work together " +
    "to take a grain-production question from open data to a decision a grower can act on.",
  domain: "Australian grain agriculture (wheat · barley · corn): multi-environment trials, breeding and genomics, crop simulation",
  counts: { members: tiers.member.length, external: tiers.external.length, contracts: 7 },
  acknowledgement:
    "This work was done under AAGI project AAGI-AU-RD-CSL, Causal learning for optimising " +
    "industry relevant traits in Australian grain production systems. The support of the " +
    "Grains Research and Development Corporation (GRDC) provided through the Analytics for " +
    "the Australian Grains Industry (AAGI) project is acknowledged.",
  nav: [
    { href: "/", label: "Introduction" },
    { href: "/examples", label: "Study" },
    { href: "/members", label: "Members" },
    { href: "/about", label: "About" },
  ],
};
