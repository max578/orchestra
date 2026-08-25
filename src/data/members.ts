// Grounded roster — sourced ONLY from extract/members.json (verified against
// the live ORCHESTRA_dev repo, 0 hallucinations). No version numbers (drift).
// repo present ONLY where a source line explicitly says PUBLIC.
// visibility: public | gated | private | disabled | unspecified | candidate | external
export type Visibility =
  | "public" | "gated" | "private" | "disabled" | "unspecified" | "candidate" | "external";

export interface Member {
  id: string;
  tier: "member" | "candidate" | "external";
  role: string;          // short scientific role
  method: string;        // one-line capability
  emits?: string;        // only where a source literally assigns it
  guard?: string;        // abstention/refusal rule
  visibility: Visibility;
  repo?: string;         // only for verifiably-public repos
}

export const members: Member[] = [
  { id: "flexyBayes", tier: "member", role: "Inference hub",
    method: "Multi-backend hierarchical Bayesian MET/GxE (greta · brms · INLA); GBLUP + GWAS + factor-analytic breeder outputs. Owns C1/C4/C5/C7.",
    emits: "breeding_values · marker_associations",
    guard: "brms/INLA honestly abstain as C4 posterior producers (no fabricated log-density, IOP); only greta is a real producer",
    visibility: "gated" },
  { id: "PESTO", tier: "member", role: "Calibration",
    method: "Simulator inversion (iterative ensemble smoother) + ensemble UQ over forward models; the authoritative source of the C2 manifest spine.",
    guard: "IES over-determination guard",
    visibility: "public", repo: "max578/PESTO" },
  { id: "kernR", tier: "member", role: "Validation & causal",
    method: "Kernel two-sample / independence / goodness-of-fit tests + CME downscaling; the TACI flagship's causal-consistency engine.",
    guard: "ESS floor (abstains below the effective-sample threshold)",
    visibility: "public", repo: "max578/kernR" },
  { id: "proxymix", tier: "member", role: "Proxy / compression",
    method: "KL-optimal Gaussian-mixture posterior compression + the density-ratio backend kernR routes to.",
    guard: "none",
    visibility: "public", repo: "max578/proxymix" },
  { id: "gretaR", tier: "member", role: "Engine",
    method: "Torch-native Bayesian MCMC with no Python dependency; a C1 backend flexyBayes can dispatch to.",
    guard: "none",
    visibility: "unspecified" },
  { id: "koine", tier: "member", role: "Synthesis",
    method: "Orthogonal fourth-opinion lens battery that triangulate() consumes; owns C3; full MET random-effects lift.",
    guard: "Non-Gaussian MET abstains (Gaussian-exact only); PSIS + corroboration diagnostic gates",
    visibility: "private" },
  { id: "terroir", tier: "member", role: "Data collector",
    method: "Geo-point climate / NDVI / soil / elevation / ag-economics from free sources; owns C6, feeding flexyBayes · kernR · PESTO.",
    guard: "structured typed refusals (terroir_refusal) on ungrounded facts",
    visibility: "unspecified" },
  { id: "kalmix", tier: "member", role: "State-space & ACI",
    method: "State-space / HMM / Kalman / change-point + N-of-1 interrupted-time-series causal inference (the ACI engine).",
    guard: "none",
    // source declares public (MIT), but the live max578/kalmix URL 404s at
    // build (IOP: G4 caught it) — badge stays public, no dead link shipped
    visibility: "public" },
  { id: "masque", tier: "member", role: "Data sovereignty",
    method: "Faithful synthetic clones (develop-on-clone, round-trip); conditional mode preserves the treatment→outcome map for causal MET inference.",
    guard: "none",
    visibility: "public", repo: "max578/masque" },
  { id: "apsimR", tier: "member", role: "External-engine member",
    method: "Wraps APSIM Next Gen; forward model, calibrate/sensitivity/emulate, plus the OSSE known-ATE causal test-bench.",
    guard: "Abstains (typed) when the APSIM binary is absent",
    visibility: "private" },
  { id: "flexyBayesOrchestra", tier: "member", role: "Composition layer",
    method: "Surrogate emulators, ensemble sources/priors; activates the koine fourth-opinion backend + genomic oracle. Keeps flexyBayes core lean.",
    guard: "none",
    visibility: "unspecified" },
  { id: "decideR", tier: "member", role: "Decision layer",
    method: "Loss-optimal, risk-aware closer of the inference→decision loop; manifest-native, duck-typed tail.",
    guard: "IOP firewall — refuses to act on an ungrounded input",
    visibility: "private" },
  { id: "gpfield", tier: "member", role: "Spatial",
    method: "Spatial / spatio-temporal Gaussian-process regression for field & MET data; change-of-support (point↔block).",
    guard: "Typed honest abstention when range/support won't bear the prediction",
    visibility: "private" },
  { id: "grainPlan", tier: "member", role: "Decision orchestration",
    method: "Grain-specific last-mile: turns a manifest into nitrogen-rate / variety / grade-target decisions + a season plan.",
    guard: "Inherits decideR's IOP firewall; worst-case combined at the plan level",
    visibility: "private" },
  { id: "optimix", tier: "member", role: "Optimisation meta-layer",
    method: "Unified problem contract + engine registry + auto/race selector over gradient / global / Bayesian-opt / combinatorial optimisers.",
    emits: "parameters",
    guard: "none",
    visibility: "unspecified" },
  { id: "cdzoo", tier: "member", role: "Causal discovery",
    method: "16 algorithms (pcalg/bnlearn + LiNGAM/DAGMA via reticulate) behind one CPDAG convention + the evidence-routed recommender cd_auto().",
    emits: "structure",
    guard: "none",
    visibility: "disabled" },

  // NB: the `bourse` trading-arm candidate is deliberately OMITTED — the
  // public showcase is agriculture-only (ratified in CLAUDE.md; the trading
  // domain is unratified and excluded). The diversity checker caught it here.
  { id: "survkit", tier: "candidate", role: "Survival",
    method: "Time-to-event inference (AFT / Cox / competing-risks / recurrent / frailty); manifest-native by design but immature (needs tests + a remote).",
    guard: "abstains on too-few events", visibility: "candidate" },
  { id: "bsquare", tier: "candidate", role: "Exact small-sample intervals",
    method: "Exact interval estimation (binomial / poisson / risk-difference / odds-ratio); mature engine, lacks a manifest emitter.",
    guard: "IOP-gated oracle comparison", visibility: "candidate" },
  { id: "janusplot", tier: "candidate", role: "Diagnostic visualisation",
    method: "Exploratory visualisation hub (asymmetric association matrix, shape metrics); most mature candidate but a terminal consumer, not a producer.",
    guard: "none", visibility: "candidate" },
  { id: "bacipair", tier: "candidate", role: "Quasi-experimental causal",
    method: "Paired DiD / synthetic control / event study / Goodman-Bacon decomposition; off-namespace, overlaps proxymix/kalmix on synthetic control.",
    guard: "none", visibility: "candidate" },

  { id: "nert", tier: "external", role: "TERN data upstream",
    method: "Environmental data source consumed by reference. Barred from membership by the GRDC firewall + the max578-namespace invariant.",
    visibility: "external" },
  { id: "apsimx", tier: "external", role: "APSIM execution layer",
    method: "The single APSIM-execution R layer; reached only via the apsimR member, never routed to directly.",
    visibility: "external" },
  { id: "DataHub", tier: "external", role: "Validation-data catalogue",
    method: "A validation-data catalogue (DuckDB + Frictionless); a data backend, not a manifest-emitting package the pipeline routes through.",
    visibility: "external" },
];

export const tiers = {
  member: members.filter((m) => m.tier === "member"),
  candidate: members.filter((m) => m.tier === "candidate"),
  external: members.filter((m) => m.tier === "external"),
};
