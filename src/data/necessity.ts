// The necessity register, site view — generated from the ratified
// release/necessity_register.md in the ORCHESTRA leader workspace
// (Max, 2026-09-02). One entry per RELEASED member (Core 9 + Supporting 6);
// parked members and candidates do not get member pages. Evidence lines cite
// artefacts that exist in the leader workspace or public repos; no number
// appears here that does not resolve to one.

export type ReleaseTier = "core" | "supporting";

export interface Necessity {
  id: string;
  tier: ReleaseTier;
  question: string;   // the crop question that needs it
  outside: string;    // the nearest tool outside the orchestra
  why: string;        // why that does not suffice (capability / contract / oracle / translation)
  evidence: string;   // where it was load-bearing
  method: string;     // pick / adopt-adapt / translate statement, plainly worded
}

export const necessity: Necessity[] = [
  {
    id: "flexyBayes", tier: "core",
    question: "Fit the hierarchical multi-environment posterior every study routes through — and know when two engines disagree.",
    outside: "brms, INLA or asreml called directly.",
    why: "No single engine offers cross-engine triangulation as a gate, refusal by model family, or a typed manifest result; the interface is one surface over three engines with disagreement as a first-class signal.",
    evidence: "Study A0's statistical lens; variety BLUPs corroborated against an independent REML fit at r = 1.00; fleet refusal gate line, 2026-09-02.",
    method: "Adapts three external engines; adds the triangulation gate; translates via the manifest into the decision layer.",
  },
  {
    id: "PESTO", tier: "core",
    question: "Invert the crop simulator against field observations, with a stated ensemble of the uncertainty.",
    outside: "PEST++ / pyEMU (Python, file-protocol).",
    why: "R-native iterative ensemble smoother emitting the typed manifest spine; drives real pestpp-ies bit-identically; abstains, typed, on over-determination.",
    evidence: "Authoritative C2 emitter (conformance 26/26, 2026-09-02); Study A0 mechanism lens.",
    method: "Adopts the IES method family; adapts PEST++ behind an R contract; translates ensembles into manifests every consumer reads.",
  },
  {
    id: "kernR", tier: "core",
    question: "Does the field agree with the mechanism? The cascade's refusal decision at every site.",
    outside: "kernlab, dHSIC, energy — kernel tests.",
    why: "TACI (theory-anchored causal inference) as a verb, with an effective-sample-size floor that abstains rather than under-powers; no outside package asks the assimilative question.",
    evidence: "On A0's hidden subsoil constraint: refusal sensitivity 0.58, specificity 0.93 — the refusals that route the cascade.",
    method: "Adopts kernel two-sample machinery; the TACI composition is the orchestra's own.",
  },
  {
    id: "apsimR", tier: "core",
    question: "Bring the industry's crop model (APSIM Next Gen) into the pipeline as a typed member.",
    outside: "apsimx (CRAN).",
    why: "apsimx is a driver; apsimR adds the forward-model closure contract, the known-truth OSSE causal test-bench, manifest emission, and a typed abstention when the binary is absent.",
    evidence: "A0 stage-01 factorial truth; the OSSE bench that grounds TACI's scoring; fleet gate line.",
    method: "Adopts APSIM itself; adapts it into the contract; the test-bench is the orchestra's own.",
  },
  {
    id: "quorum", tier: "core",
    question: "Do the lenses agree, and which answer is grounded enough to carry?",
    outside: "Hand-built cascade code per analysis, and the hub's pairwise triangulate().",
    why: "N-lens consensus with declared independence and a typed no-quorum abstention. No outside tool asks which lens's answer is grounded enough to act on.",
    evidence: "Study A0's cascade, 2,960 against 5,818 AUD per hectare, reproduced from the package; the surrogate seam that made A0 affordable; fleet gate line.",
    method: "Adapters over members' fitters; the consensus operator and the independence ledger are the orchestra's own.",
  },
  {
    id: "terroir", tier: "core",
    question: "Every covariate the studies use — climate, soil, satellite series — grounded to its source, or refused.",
    outside: "nasapower, soilDB, elevatr called directly (terroir wraps these very packages).",
    why: "The contract is the contribution, stated plainly: provenance-stamped replayable series, a per-fact grounding registry, and typed refusals — the decision layer's firewall requires covariates that can refuse.",
    evidence: "Fleet gate line; the recorded-real grounding pattern; the ocular remote-sensing adapter (2026-09).",
    method: "Adapts free public sources behind one provenance contract; adds nothing to their science and says so.",
  },
  {
    id: "masque", tier: "core",
    question: "Analyse data that cannot leave its owner: develop on a faithful synthetic clone, replay on the real thing.",
    outside: "synthpop, sdcMicro.",
    why: "Recipe-bound round-trip and a conditional mode that preserves the treatment-to-outcome map — causal analysis on a clone is meaningless without it; neither outside tool has it.",
    evidence: "A planted +5 treatment effect preserved at +5.14 through the clone (marginal-only cloning gave +0.25).",
    method: "Adopts copula-based synthesis; the causal-map preservation and round-trip recipe are the orchestra's own.",
  },
  {
    id: "decideR", tier: "core",
    question: "Close the loop: the loss-optimal action, the value of one more test — or a refusal to price a rejected posterior.",
    outside: "No R package offers grounding-gated expected-utility decisions; the alternative is hand-built loss code.",
    why: "The firewall (an unverified fact yields no rate) and the manifest-native tail are the orchestra's decision semantics, exercised live in the demo.",
    evidence: "A0 cascade vs naive arm: 2,960 vs 5,818 AUD/ha summed loss on the synthetic belt; the demo's live refusal-to-price (2026-09-02 log).",
    method: "Adopts decision theory; the grounding gate is the orchestra's own; translates manifests into actions.",
  },
  {
    id: "grainPlan", tier: "core",
    question: "Hand the grower a plan — nitrogen rate, variety, grade target — that inherits every upstream refusal.",
    outside: "Proprietary agronomic calculators.",
    why: "Translation with provenance: no outside calculator abstains, carries lineage, or greys out when the evidence refused.",
    evidence: "The demo: on the refused mechanism posterior, grainPlan abstains — no number reaches the grower (2026-09-02 log).",
    method: "Pure translation layer over decideR; consolidates the grain value schedules the studies kept hand-building.",
  },
  {
    id: "gpfield", tier: "supporting",
    question: "Predict at the support the decision needs: a point sample re-woven into a block mean, with the variance a block truly carries.",
    outside: "gstat, INLA-SPDE, spaMM, DiceKriging.",
    why: "Change-of-support with the full quadratic-form predictive variance plus a typed abstention when range or support will not bear the prediction; routing vs the kernel engine settled by an arbitration study.",
    evidence: "Change-of-support arbitration (oracle: the true block average of a known field, gstat as neutral third party); fleet gate line.",
    method: "Adopts Gaussian-process regression; the typed abstention and manifest are the orchestra's own.",
  },
  {
    id: "kalmix", tier: "supporting",
    question: "Track a latent state through a noisy season and say — with evidence — when the regime changed.",
    outside: "KFAS, dlm, bsts, changepoint.",
    why: "A model-adequacy abstention no outside filter carries, plus the causal-information metric graded against its authors' own MATLAB reference.",
    evidence: "State-space arbitration (oracle: textbook Kalman filter + the true simulated latent + a 4000-particle filter); fleet gate line.",
    method: "Adopts state-space machinery; the adequacy gate and the ACI grading are the orchestra's own.",
  },
  {
    id: "koine", tier: "supporting",
    question: "Say it again in a second language: corroborate the Bayesian fit with an independent REML lens, and treat divergence as a signal.",
    outside: "lme4 / glmmTMB called directly.",
    why: "The point is not another fitter — it is the typed divergence signal the triangulation gate consumes, with an exact Gaussian scope and abstention outside it.",
    evidence: "Variety BLUPs vs a production REML fit at r = 1.00; exact marginal matching to 1.4e-14; fleet gate line.",
    method: "Adapts REML fitting; the corroboration contract is the orchestra's own.",
  },
  {
    id: "proxymix", tier: "supporting",
    question: "Carry a posterior across the federation as a few declared shapes — and compute with it after compression.",
    outside: "mclust, mixtools.",
    why: "Mixture fitters exist outside; the operator calculus (affine, observe, conditionalise, filter) and KL-optimal compression with the cost stated do not.",
    evidence: "Three standing arbitration studies define its lanes (state-space tails, global-optimisation maps, density-ratio backend); conformance derived-manifest line.",
    method: "Adopts Gaussian mixtures; the calculus is the orchestra's own. Co-developed with J. van der Hoek.",
  },
  {
    id: "optimix", tier: "supporting",
    question: "Route an optimisation problem to the right engine under a fair budget — for the value-of-information site ranking and design search.",
    outside: "optimx, nloptr, DEoptim, GenSA called directly.",
    why: "Stated plainly: contract-plus-routing, not new mathematics — one problem contract, an engine registry, a fair-eval race, and a manifest that flags point-versus-posterior.",
    evidence: "The from-objective arbitration (analytic optima + a brute-force counter as oracle); conformance emitter line; fleet gate line.",
    method: "Adapts the efficient optimisers; adds the contract and the point-versus-posterior flag.",
  },
  {
    id: "cdzoo", tier: "supporting",
    question: "Recover the causal structure that fixes an adjustment set — with the dissent on the record.",
    outside: "pcalg, bnlearn, causal-learn called directly.",
    why: "Sixteen algorithms behind one convention with an evidence-routed recommender that explains and never decrees — causal discovery has no run-time ground truth, and cdzoo says so in its output.",
    evidence: "Conformance cross-emitter line (the structure manifest); fleet gate line.",
    method: "Adapts both R and Python discovery stacks; the recommender-not-selector stance is the orchestra's own.",
  },
];

export const necessityById = new Map(necessity.map((n) => [n.id, n]));
