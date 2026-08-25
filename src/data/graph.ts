// Constellation geometry — the 16 members + the contract edges. Rendered as
// a static SVG at build (SSR fallback) and enhanced by the island JS.
// Positions are hand-laid in a 0–100 viewBox. Edges + score path are grounded
// (contract registry + the ORCHESTRA.md application pipeline).
export interface GNode { id: string; x: number; y: number; hub?: boolean }
export const nodes: GNode[] = [
  { id: "flexyBayes", x: 50, y: 50, hub: true },
  { id: "kernR", x: 71, y: 39 }, { id: "proxymix", x: 69, y: 62 },
  { id: "PESTO", x: 31, y: 60 }, { id: "koine", x: 33, y: 39 },
  { id: "gretaR", x: 50, y: 24 }, { id: "masque", x: 15, y: 70 },
  { id: "terroir", x: 15, y: 45 }, { id: "apsimR", x: 31, y: 80 },
  { id: "kalmix", x: 58, y: 80 }, { id: "gpfield", x: 83, y: 52 },
  { id: "decideR", x: 83, y: 72 }, { id: "grainPlan", x: 72, y: 88 },
  { id: "optimix", x: 86, y: 34 }, { id: "cdzoo", x: 69, y: 20 },
  { id: "flexyBayesOrchestra", x: 41, y: 70 },
];
export interface GEdge { from: string; to: string; tag: string }
export const edges: GEdge[] = [
  { from: "gretaR", to: "flexyBayes", tag: "C1" },
  { from: "koine", to: "flexyBayes", tag: "C3" },
  { from: "PESTO", to: "kernR", tag: "C2" },
  { from: "flexyBayes", to: "proxymix", tag: "C4" },
  { from: "flexyBayes", to: "kernR", tag: "C4" },
  { from: "PESTO", to: "flexyBayes", tag: "C5" },
  { from: "apsimR", to: "flexyBayes", tag: "C5" },
  { from: "terroir", to: "flexyBayes", tag: "C6" },
  { from: "terroir", to: "kernR", tag: "C6" },
  { from: "terroir", to: "PESTO", tag: "C6" },
  { from: "flexyBayes", to: "PESTO", tag: "C7" },
  { from: "masque", to: "PESTO", tag: "pipeline" },
  { from: "PESTO", to: "proxymix", tag: "pipeline" },
  { from: "proxymix", to: "kernR", tag: "pipeline" },
  { from: "kernR", to: "decideR", tag: "pipeline" },
  { from: "decideR", to: "grainPlan", tag: "pipeline" },
  { from: "kalmix", to: "kernR", tag: "ACI" },
  { from: "gpfield", to: "flexyBayes", tag: "spatial" },
  { from: "optimix", to: "decideR", tag: "opt" },
  { from: "cdzoo", to: "kernR", tag: "structure" },
  { from: "flexyBayesOrchestra", to: "flexyBayes", tag: "composition" },
];
// the animated "score" — the ORCHESTRA.md application pipeline
export const scorePath = ["masque", "PESTO", "proxymix", "kernR", "decideR", "grainPlan"];
