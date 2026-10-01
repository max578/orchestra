// Problem-solving clusters — the cross-cutting inferential tasks (the most
// communicative "categories"), each with its lead(s). Grounded in
// SCENARIO_TAXONOMY.md (extract/clusters.json). The response-family ×
// model-structure matrix is the coverage view (see `coverage`).
export interface Cluster { task: string; lead: string; blurb: string; members: string[] }
// `members` = the tools a study in this cluster actually composes — grounded in
// the chain executors (chains.R) + the application pipeline. The spread (1 → 4)
// is the parsimony message made literal: one tool when one is enough, more only
// when the evidence demands it.
export const clusters: Cluster[] = [
  { task: "Private data", lead: "masque", members: ["masque"],
    blurb: "Builds a synthetic stand-in that behaves like the private data, so the analysis can be developed on it. One package is enough: masque alone." },
  { task: "Estimates with uncertainty", lead: "flexyBayes", members: ["flexyBayes"],
    blurb: "Hierarchical Bayesian models for multi-environment trials and genotype-by-environment interaction, reporting the full range of plausible values rather than one number. The main estimation engine: flexyBayes alone." },
  { task: "Coarse to fine scale", lead: "kernR", members: ["terroir", "kernR"],
    blurb: "Downscales estimates from coarse to fine resolution with kernR's kernel methods. terroir supplies the weather and soil inputs; two packages." },
  { task: "Which variable drives which", lead: "kalmix", members: ["kalmix", "kernR"],
    blurb: "Which of two variables drives the other? Assimilative causal inference (ACI) answers this from time series, combining a model of how the system changes over time (kalmix) with kernel tests (kernR)." },
  { task: "Calibrating a simulator", lead: "PESTO", members: ["PESTO", "proxymix", "kernR"],
    blurb: "Works backwards from field measurements to the crop-simulator settings that reproduce them, summarises the range of plausible settings, and checks the fit. Three packages." },
  { task: "Do independent fits agree", lead: "kernR", members: ["flexyBayes", "koine", "kernR"],
    blurb: "Do two independent analyses of the same data agree? A disagreement is reported as a finding, not averaged away." },
  { task: "Does the effect fit the mechanism (TACI)", lead: "kernR", members: ["PESTO", "kernR", "proxymix"],
    blurb: "Kernel tests of whether an estimated effect is consistent with how the crop works, not only with the measured outcome. TACI is a method in development and not yet published." },
  { task: "Decisions", lead: "grainPlan", members: ["kernR", "decideR", "grainPlan"],
    blurb: "Turns an estimate into a recommended action (a nitrogen rate, a variety, a grade target), weighing what a wrong call costs and allowing for risk, or gives no recommendation when an input has not been checked." },
];

// response-family × model-structure coverage (grounded counts, illustrative rows)
export const coverage = {
  families: ["continuous (Gaussian)", "counts (Poisson)", "yes/no and proportions (binomial)", "genomic", "time to an event*", "extremes*"],
  structures: ["fixed effects", "random group effects", "genomic relationships", "change over time (state-space)", "spatial", "differential equations", "multi-environment trials (G×E)", "space and time together*"],
  note: "* Not yet fully covered: led by a package still under review or by one listed as open (see Gaps below). The registry describes every scenario by the kind of response and the model structure, and records the lead package for each combination.",
};
