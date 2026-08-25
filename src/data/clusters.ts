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
  { task: "Synthetic / privacy", lead: "masque", members: ["masque"],
    blurb: "A faithful synthetic clone to develop on. One tool is enough — masque alone." },
  { task: "Estimation & UQ", lead: "flexyBayes", members: ["flexyBayes"],
    blurb: "Hierarchical Bayesian MET/GxE with full posterior uncertainty. The inferential backbone — flexyBayes alone." },
  { task: "Downscaling", lead: "kernR", members: ["terroir", "kernR"],
    blurb: "Conditional-mean-embedding change-of-support from coarse to fine. Covariates in, two tools." },
  { task: "Causal direction (ACI)", lead: "kalmix", members: ["kalmix", "kernR"],
    blurb: "Which way does the arrow point? Assimilative causal inference on time series — state-space + kernel." },
  { task: "Calibration / inverse", lead: "PESTO", members: ["PESTO", "proxymix", "kernR"],
    blurb: "Invert a forward simulator to its parameters, compress, and check fidelity — three tools." },
  { task: "Validation / concordance", lead: "kernR", members: ["flexyBayes", "koine", "kernR"],
    blurb: "Do two independent fits agree? A split is a signal, not something to average away." },
  { task: "Causal consistency (TACI)", lead: "kernR", members: ["PESTO", "kernR", "proxymix"],
    blurb: "The flagship: kernel tests that a fitted effect is consistent with the mechanism, not just the outcome." },
  { task: "Decision / loss-optimal", lead: "grainPlan", members: ["kernR", "decideR", "grainPlan"],
    blurb: "Close the loop to a risk-aware action — nitrogen rate, variety, grade — or abstain when the input is unverified." },
];

// response-family × model-structure coverage (grounded counts, illustrative rows)
export const coverage = {
  families: ["gaussian", "poisson", "binomial", "genomic", "time-to-event*", "extreme-value*"],
  structures: ["fixed", "(1|g)", "genomic", "state-space", "spatial", "differential-eq", "MET/GxE", "spatio-temporal*"],
  note: "* frontier families/structures — led by a candidate or an open member (see Vacant places). The live registry factorises every scenario as response-family × model-structure; the lead package per cell is what the matrix encodes.",
};
