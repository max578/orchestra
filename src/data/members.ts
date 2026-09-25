// Grounded roster. Membership follows the roster decision of 2026-09-25:
// the ratified Core 9 and Supporting 6, the shared format and entry point
// (orchestraManifest, cropOrchestra), the orchestration engine (conductoR),
// and two members joined that day (bacipair, survkit). Visibility and repo
// links are from a read-only `gh repo list max578` on 2026-09-25; `install`
// is the only source of a member page's install block, so a change in
// availability is one field here, never a page edit. Guard lines from the
// fleet refusal gate (audit/orchestra_fitness_2026-08-25/wave4). No version
// numbers (drift). `repo` present ONLY where `gh` reported PUBLIC.
// visibility: public | gated | private | disabled | unspecified | candidate | external
export type Visibility =
  | "public" | "gated" | "private" | "disabled" | "unspecified" | "candidate" | "external";

export interface Install {
  github: boolean;     // installable with remotes::install_github("max578/<id>")
  runiverse: boolean;  // on max578.r-universe.dev
}

export interface Member {
  id: string;
  tier: "member" | "candidate" | "external";
  role: string;          // short scientific role
  method: string;        // one-line capability
  emits?: string;        // only where a source literally assigns it
  guard?: string;        // abstention/refusal rule
  visibility: Visibility;
  repo?: string;         // only for verifiably-public repos
  install?: Install;     // members only; drives the per-member install block
}

const PUBLIC: Install = { github: true, runiverse: true };
const NOT_YET: Install = { github: false, runiverse: false };

export const members: Member[] = [
  // Core 9
  { id: "flexyBayes", tier: "member", role: "Inference hub",
    method: "Multi-backend hierarchical Bayesian MET/GxE (greta · brms · INLA); GBLUP + genomic-selection CV + cross-engine triangulation (the GWAS surface was withdrawn from the public API in 0.10.0). Owns C1; C4 dormant; C5/C7 live in the composition layer.",
    emits: "breeding_values",
    guard: "Refuses unsupported model families by name; the C4 posterior-producer path is internal since 0.10.0 -- dormant and declared so",
    visibility: "gated", install: NOT_YET },
  { id: "quorum", tier: "member", role: "Consensus layer",
    method: "Lenses in, a typed verdict out: any member's estimate registers as a lens with declared independence, expressiveness and scope; a quorum of independent lenses must agree before an answer is carried. Keeps the surrogate, ensemble and koine on-ramps; keeps flexyBayes core lean.",
    guard: "quorum_abstention when no quorum forms, a lens is out of scope or an engine is missing; a CME gate on the surrogate",
    visibility: "private", install: NOT_YET },
  { id: "decideR", tier: "member", role: "Decision layer",
    method: "Loss-optimal, risk-aware closer of the inference→decision loop; manifest-native, duck-typed tail.",
    guard: "IOP firewall — decideR_abstention on an ungrounded input",
    visibility: "public", repo: "max578/decideR", install: PUBLIC },
  { id: "grainPlan", tier: "member", role: "Decision orchestration",
    method: "Grain-specific last-mile: turns a manifest into nitrogen-rate / variety / grade-target decisions + a season plan.",
    guard: "Inherits decideR's IOP firewall; grainPlan_abstention on a producer's decline or a wrong inferential target",
    visibility: "public", repo: "max578/grainPlan", install: PUBLIC },
  { id: "apsimR", tier: "member", role: "External-engine member",
    method: "Wraps APSIM Next Gen; forward model, calibrate/sensitivity/emulate, plus the OSSE known-ATE causal test-bench.",
    guard: "Abstains (typed) when the APSIM binary is absent",
    visibility: "private", install: NOT_YET },
  { id: "PESTO", tier: "member", role: "Calibration",
    method: "Simulator inversion (iterative ensemble smoother) + ensemble UQ over forward models; the authoritative source of the C2 manifest spine.",
    guard: "IES over-determination guard",
    visibility: "public", repo: "max578/PESTO", install: PUBLIC },
  { id: "kernR", tier: "member", role: "Validation & causal",
    method: "Kernel two-sample / independence / goodness-of-fit tests + CME downscaling; the TACI flagship's causal-consistency engine.",
    guard: "ESS floor (abstains below the effective-sample threshold)",
    visibility: "public", repo: "max578/kernR", install: PUBLIC },
  { id: "terroir", tier: "member", role: "Data collector",
    method: "Geo-point climate / NDVI / soil / elevation / ag-economics from free sources; owns C6, feeding flexyBayes · kernR · PESTO.",
    guard: "structured typed refusals (terroir_refusal) on ungrounded facts",
    visibility: "private", install: NOT_YET },
  { id: "masque", tier: "member", role: "Data sovereignty",
    method: "Faithful synthetic clones (develop-on-clone, round-trip); conditional mode preserves the treatment→outcome map for causal MET inference.",
    guard: "Typed masque_*_refusal on bad input; fails closed on a standing leakage finding or an unmasked coordinate",
    visibility: "public", repo: "max578/masque", install: PUBLIC },

  // Supporting 6
  { id: "koine", tier: "member", role: "Synthesis",
    method: "Orthogonal fourth-opinion lens battery that triangulate() consumes; owns C3; full MET random-effects lift.",
    guard: "Non-Gaussian MET abstains (Gaussian-exact only); PSIS + corroboration diagnostic gates",
    visibility: "private", install: NOT_YET },
  { id: "cdzoo", tier: "member", role: "Causal discovery",
    method: "16 algorithms (pcalg/bnlearn + LiNGAM/DAGMA via reticulate) behind one CPDAG convention + the evidence-routed recommender cd_auto().",
    emits: "structure",
    guard: "cdzoo_abstention when the evidence-routed recommender declines",
    visibility: "private", install: NOT_YET },
  { id: "proxymix", tier: "member", role: "Proxy / compression",
    method: "KL-optimal Gaussian-mixture posterior compression + the density-ratio backend kernR routes to.",
    guard: "orchestra_refusal-classed errors on an out-of-scale treatment or an unobserved treatment level",
    visibility: "public", repo: "max578/proxymix", install: PUBLIC },
  { id: "optimix", tier: "member", role: "Optimisation meta-layer",
    method: "Unified problem contract + engine registry + auto/race selector over gradient / global / Bayesian-opt / combinatorial optimisers.",
    emits: "parameters",
    guard: "optimix_map_abstention when the map engine cannot cover the problem's dimension",
    visibility: "private", install: NOT_YET },
  { id: "gpfield", tier: "member", role: "Spatial",
    method: "Spatial / spatio-temporal Gaussian-process regression for field & MET data; change-of-support (point↔block).",
    guard: "gpfield_abstention when range/support won't bear the prediction",
    visibility: "public", repo: "max578/gpfield", install: PUBLIC },
  { id: "kalmix", tier: "member", role: "State-space & ACI",
    method: "State-space / HMM / Kalman / change-point + N-of-1 interrupted-time-series causal inference (the ACI engine).",
    guard: "kalmix_abstention when the state-space model is inadequate for the series (ACI adequacy grounding)",
    visibility: "private", install: NOT_YET },

  // Shared format, entry point, engine
  { id: "orchestraManifest", tier: "member", role: "Shared format",
    method: "The orchestra_manifest result contract every member emits and consumes: versioned, payload-hashed, carrying the inferential target that a typed edge checks before any node runs.",
    guard: "consume_manifest() stops on a version or payload-integrity mismatch — a typed-edge violation, never a silent coercion",
    visibility: "unspecified", install: NOT_YET },
  { id: "cropOrchestra", tier: "member", role: "Entry point",
    method: "One package to install the released roster and report its state: cao_install() and cao_status() (matching / drifted / not yet public).",
    visibility: "unspecified", install: NOT_YET },
  { id: "conductoR", tier: "member", role: "Orchestration engine",
    method: "Performs a contract-typed analytical plan across members, checking each edge's manifest before the next node runs; a new package, 0.1.0 in preparation.",
    visibility: "unspecified", install: NOT_YET },

  // Members joined 2026-09-25
  { id: "bacipair", tier: "member", role: "Quasi-experimental causal",
    method: "Before-after-control-impact and paired difference-in-differences estimators for programme attribution (study C1).",
    guard: "bacipair_abstention below the donor floor",
    visibility: "unspecified", install: NOT_YET },
  { id: "survkit", tier: "member", role: "Time-to-event",
    method: "Time-to-event analysis (AFT / Cox / competing risks / recurrent events / frailty), manifest-native by design; a Bayesian survival family under flexyBayes is planned.",
    guard: "Abstains on too few events",
    visibility: "private", install: NOT_YET },

  // Candidate
  { id: "effectsurf", tier: "candidate", role: "Post-estimation surfaces",
    method: "Effect-surface visualisation over covariates for fitted models (public AAGI-AUS package); adopted as the presentation layer for study results, held out of studies until its documented defaults are re-verified.",
    guard: "none typed yet", visibility: "candidate" },

  // External tier — consumed by reference, outside sources
  { id: "ocular", tier: "external", role: "Remote-sensing upstream",
    method: "Sentinel-2 and Landsat retrieval through the Planetary Computer STAC with cloud filtering and pixel masks, batched area series, and sample-free field-boundary delineation (public AAGI-AUS package). Adopted tentatively as a terroir source; an AAGI-AUS namespace stays upstream-only.",
    visibility: "external" },
  { id: "geefetch", tier: "external", role: "Earth Engine upstream",
    method: "Retrieval of Google Earth Engine collections; a remote-sensing source consumed by reference.",
    visibility: "external" },
  { id: "ACI", tier: "external", role: "Causal-information reference",
    method: "Assimilative causal information (biometryhub/acir); the reference implementation the kalmix ACI metric is graded against.",
    visibility: "external" },
  { id: "read.abares", tier: "external", role: "ABARES data upstream",
    method: "Reader for ABARES agricultural statistics and price series; the grain-price source terroir adapts for decideR's loss and grainPlan's value library.",
    visibility: "external" },
  { id: "speed", tier: "external", role: "Spatial experimental design",
    method: "Spatial design of field trials (Julian Taylor and the AAGI team); consumed by reference for the design studies.",
    visibility: "external" },
  { id: "apsimx", tier: "external", role: "APSIM execution layer",
    method: "The single APSIM-execution R layer; reached only via the apsimR member, never routed to directly.",
    visibility: "external" },
  { id: "nert", tier: "external", role: "TERN data upstream",
    method: "Environmental data source consumed by reference. Barred from membership by the GRDC firewall + the max578-namespace invariant.",
    visibility: "external" },
  { id: "agridat", tier: "external", role: "Public trial datasets",
    method: "Published agricultural trial datasets; the public twins and surrogate data the studies use in place of any industry rows.",
    visibility: "external" },
  { id: "SoilGrids", tier: "external", role: "Soil upstream",
    method: "Global soil-property grids; a terroir soil source.",
    visibility: "external" },
  { id: "NASA POWER", tier: "external", role: "Climate upstream",
    method: "Daily point climate series; a terroir climate source.",
    visibility: "external" },
  { id: "INLA", tier: "external", role: "Fitting engine",
    method: "Integrated nested Laplace approximation; one of the three engines flexyBayes dispatches to under C1.",
    visibility: "external" },
  { id: "brms", tier: "external", role: "Fitting engine",
    method: "Stan-based Bayesian regression; one of the three engines flexyBayes dispatches to under C1.",
    visibility: "external" },
  { id: "greta", tier: "external", role: "Fitting engine",
    method: "TensorFlow-based MCMC; one of the three engines flexyBayes dispatches to under C1, and the C4 posterior producer.",
    visibility: "external" },
  { id: "targets", tier: "external", role: "Pipeline toolkit",
    method: "Make-like pipeline management for the study series; consumed by reference.",
    visibility: "external" },
];

export const tiers = {
  member: members.filter((m) => m.tier === "member"),
  candidate: members.filter((m) => m.tier === "candidate"),
  external: members.filter((m) => m.tier === "external"),
};

// Install lines for a member page, generated from `install` and `visibility`.
// Returns the R lines to show, or the plain words when there is nothing to install.
export const installBlock = (m: Member): { lines: string[]; note?: string } => {
  if (m.tier !== "member" || !m.install) return { lines: [] };
  if (m.visibility === "gated") return { lines: [], note: "under development, public release to follow" };
  const lines: string[] = [];
  if (m.install.github) lines.push(`remotes::install_github("max578/${m.id}")`);
  if (m.install.runiverse)
    lines.push(`install.packages("${m.id}", repos = c("https://max578.r-universe.dev", "https://cloud.r-project.org"))`);
  if (lines.length === 0) return { lines, note: "public release in preparation" };
  return { lines };
};
