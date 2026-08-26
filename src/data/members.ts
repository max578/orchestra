// Grounded roster — first sourced from extract/members.json (verified against
// the live ORCHESTRA_dev repo, 0 hallucinations). Re-grounded 2026-08-26:
// visibility and repo links from a read-only `gh repo view` of every
// max578 repository that day; guard lines from the fleet refusal gate
// (ORCHESTRA_dev/audit/orchestra_fitness_2026-08-25/wave4/refusal_fleet_table.md,
// 20/20 members on 2026-08-26); candidates from ORCHESTRA.md. No version
// numbers (drift). repo present ONLY where `gh` reported PUBLIC.
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
    guard: "orchestra_refusal-classed errors on an out-of-scale treatment or an unobserved treatment level",
    visibility: "public", repo: "max578/proxymix" },
  { id: "gretaR", tier: "member", role: "Engine",
    method: "Torch-native Bayesian MCMC with no Python dependency; a C1 backend flexyBayes can dispatch to.",
    guard: "gretaR_refusal (a classed condition on invalid input); the C1 edge itself is parked",
    visibility: "public", repo: "max578/gretaR" },
  { id: "koine", tier: "member", role: "Synthesis",
    method: "Orthogonal fourth-opinion lens battery that triangulate() consumes; owns C3; full MET random-effects lift.",
    guard: "Non-Gaussian MET abstains (Gaussian-exact only); PSIS + corroboration diagnostic gates",
    visibility: "private" },
  { id: "terroir", tier: "member", role: "Data collector",
    method: "Geo-point climate / NDVI / soil / elevation / ag-economics from free sources; owns C6, feeding flexyBayes · kernR · PESTO.",
    guard: "structured typed refusals (terroir_refusal) on ungrounded facts",
    visibility: "private" },
  { id: "kalmix", tier: "member", role: "State-space & ACI",
    method: "State-space / HMM / Kalman / change-point + N-of-1 interrupted-time-series causal inference (the ACI engine).",
    guard: "kalmix_abstention when the state-space model is inadequate for the series (ACI adequacy grounding)",
    // MIT-licensed, but the max578/kalmix repository is private (gh, 2026-08-26)
    visibility: "private" },
  { id: "masque", tier: "member", role: "Data sovereignty",
    method: "Faithful synthetic clones (develop-on-clone, round-trip); conditional mode preserves the treatment→outcome map for causal MET inference.",
    guard: "Typed masque_*_refusal on bad input; fails closed on a standing leakage finding or an unmasked coordinate",
    visibility: "public", repo: "max578/masque" },
  { id: "apsimR", tier: "member", role: "External-engine member",
    method: "Wraps APSIM Next Gen; forward model, calibrate/sensitivity/emulate, plus the OSSE known-ATE causal test-bench.",
    guard: "Abstains (typed) when the APSIM binary is absent",
    visibility: "private" },
  { id: "flexyBayesOrchestra", tier: "member", role: "Composition layer",
    method: "Surrogate emulators, ensemble sources/priors; activates the koine fourth-opinion backend + genomic oracle. Keeps flexyBayes core lean.",
    guard: "flexyBayesOrchestra_abstention on an unsupported random-effects structure; a CME gate on the surrogate",
    visibility: "private" },
  { id: "decideR", tier: "member", role: "Decision layer",
    method: "Loss-optimal, risk-aware closer of the inference→decision loop; manifest-native, duck-typed tail.",
    guard: "IOP firewall — decideR_abstention on an ungrounded input",
    visibility: "public", repo: "max578/decideR" },
  { id: "gpfield", tier: "member", role: "Spatial",
    method: "Spatial / spatio-temporal Gaussian-process regression for field & MET data; change-of-support (point↔block).",
    guard: "gpfield_abstention when range/support won't bear the prediction",
    visibility: "public", repo: "max578/gpfield" },
  { id: "grainPlan", tier: "member", role: "Decision orchestration",
    method: "Grain-specific last-mile: turns a manifest into nitrogen-rate / variety / grade-target decisions + a season plan.",
    guard: "Inherits decideR's IOP firewall; grainPlan_abstention on a producer's decline or a wrong inferential target",
    visibility: "public", repo: "max578/grainPlan" },
  { id: "optimix", tier: "member", role: "Optimisation meta-layer",
    method: "Unified problem contract + engine registry + auto/race selector over gradient / global / Bayesian-opt / combinatorial optimisers.",
    emits: "parameters",
    guard: "optimix_map_abstention when the map engine cannot cover the problem's dimension",
    visibility: "private" },
  { id: "cdzoo", tier: "member", role: "Causal discovery",
    method: "16 algorithms (pcalg/bnlearn + LiNGAM/DAGMA via reticulate) behind one CPDAG convention + the evidence-routed recommender cd_auto().",
    emits: "structure",
    guard: "cdzoo_abstention when the evidence-routed recommender declines",
    visibility: "private" },

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
    guard: "janusplot_refusal on degenerate input", visibility: "candidate", repo: "max578/janusplot" },
  { id: "bacipair", tier: "candidate", role: "Quasi-experimental causal",
    method: "Paired DiD / synthetic control / event study / Goodman-Bacon decomposition; off-namespace, overlaps proxymix/kalmix on synthetic control.",
    guard: "bacipair_abstention below the donor floor", visibility: "candidate" },
  { id: "effectsurf", tier: "candidate", role: "Post-estimation surfaces",
    method: "Effect-surface visualisation over covariates for fitted models (public AAGI-AUS package); adopted as the presentation layer for study results, held out of studies until its documented defaults are re-verified.",
    guard: "none typed yet", visibility: "candidate" },
  { id: "speed2", tier: "candidate", role: "Spatial experimental design",
    method: "Spatial design generation for field trials; a candidate for the design studies (B2, C0), held out of studies until its documented defaults are re-verified.",
    guard: "none typed yet", visibility: "candidate" },

  { id: "ocular", tier: "external", role: "Remote-sensing upstream",
    method: "Sentinel-2 and Landsat retrieval through the Planetary Computer STAC with cloud filtering and pixel masks, batched area series, and sample-free field-boundary delineation (public AAGI-AUS package). Adopted tentatively as a terroir source; an AAGI-AUS namespace stays upstream-only.",
    visibility: "external" },
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
