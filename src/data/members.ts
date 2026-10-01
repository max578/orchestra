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
  { id: "flexyBayes", tier: "member", role: "Bayesian models for field trials",
    method: "Fits Bayesian mixed models for multi-environment trials, written in ASReml or brms syntax.",
    guard: "Stops and names the model family when it is asked for one it does not support, rather than fitting something else.",
    visibility: "gated", install: NOT_YET },
  { id: "quorum", tier: "member", role: "Combining estimates",
    method: "Combines independent estimates of one quantity into a verdict, or reports that they disagree.",
    guard: "Gives no verdict when too few independent estimates agree, or when an estimate falls outside its stated scope.",
    visibility: "private", install: NOT_YET },
  { id: "decideR", tier: "member", role: "Decisions under uncertainty",
    method: "Chooses the best action under uncertainty, weighing what a wrong call costs, and prices what more information is worth.",
    guard: "Gives no recommendation when an input has not been checked against an independent source.",
    visibility: "public", repo: "max578/decideR", install: PUBLIC },
  { id: "grainPlan", tier: "member", role: "Plans for growers",
    method: "Turns an analysis into a grower's plan: nitrogen rate, variety and grade target.",
    guard: "Gives no plan when the analysis before it gave no result, or answered a different question.",
    visibility: "public", repo: "max578/grainPlan", install: PUBLIC },
  { id: "apsimR", tier: "member", role: "Crop simulation",
    method: "Runs the APSIM Next Generation crop simulator from R.",
    guard: "Says so and stops when APSIM is not installed.",
    visibility: "private", install: NOT_YET },
  { id: "PESTO", tier: "member", role: "Fitting a simulator to the field",
    method: "Fits a crop simulator to field observations with the ensemble methods of PEST++, and keeps what remains uncertain.",
    guard: "Checks that the observations can support the number of settings being fitted before it runs.",
    visibility: "public", repo: "max578/PESTO", install: PUBLIC },
  { id: "kernR", tier: "member", role: "Testing whole distributions",
    method: "Tests whether a treatment changes the whole distribution of an outcome, not only its mean.",
    guard: "Gives no verdict when the sample is too small to test reliably.",
    visibility: "public", repo: "max578/kernR", install: PUBLIC },
  { id: "terroir", tier: "member", role: "Climate, soil and farm data",
    method: "Fetches climate, weather, soil, elevation and farm-economics data for any location, and records where every value came from.",
    guard: "Returns a recorded refusal, not a guess, when a value cannot be traced to its source.",
    visibility: "private", install: NOT_YET },
  { id: "masque", tier: "member", role: "Synthetic copies of private data",
    method: "Makes a synthetic copy of a confidential table that keeps its experimental design, so an analysis can be built before anyone sees the real data.",
    guard: "Refuses to hand over a copy when it finds that real values could be recovered from it, or that a location was left unmasked.",
    visibility: "public", repo: "max578/masque", install: PUBLIC },

  // Supporting 6
  { id: "koine", tier: "member", role: "A fourth opinion",
    method: "Cross-checks a fit with several other inference methods, and gives no result when they add nothing.",
    guard: "Works only with normally distributed errors in multi-environment trials; for other kinds of data it gives no answer.",
    visibility: "private", install: NOT_YET },
  { id: "cdzoo", tier: "member", role: "Causal discovery",
    method: "Puts sixteen causal-discovery algorithms behind one interface and suggests one for the data.",
    guard: "Gives no suggestion when the evidence does not favour one algorithm.",
    visibility: "private", install: NOT_YET },
  { id: "proxymix", tier: "member", role: "Simplifying distributions",
    method: "Replaces a complicated distribution with a small mixture of bell curves and states the information lost.",
    guard: "Refuses to predict for treatment levels outside those it was fitted on.",
    visibility: "public", repo: "max578/proxymix", install: PUBLIC },
  { id: "optimix", tier: "member", role: "Choosing an optimiser",
    method: "Gives one problem to many optimisers and picks the best for it.",
    guard: "Says so when its mapping method cannot handle a problem with that many dimensions.",
    visibility: "private", install: NOT_YET },
  { id: "gpfield", tier: "member", role: "Mapping a field",
    method: "Maps a field variable from point samples to paddock or regional averages.",
    guard: "Gives no prediction when the samples are too sparse or too far away to support it.",
    visibility: "public", repo: "max578/gpfield", install: PUBLIC },
  { id: "kalmix", tier: "member", role: "Series over time",
    method: "Does Kalman filtering, regime switching and change-point detection on series over time, and checks its causal information rate against the method authors' acir package.",
    guard: "Gives no causal reading when the time-series model does not fit the series.",
    visibility: "private", install: NOT_YET },

  // Shared format, entry point, engine
  { id: "orchestraManifest", tier: "member", role: "Shared result format",
    method: "The result format every package writes: it records who produced a result, from what, and which question it answers.",
    guard: "A result whose version or contents do not check out is stopped, never quietly converted.",
    visibility: "unspecified", install: NOT_YET },
  { id: "cropOrchestra", tier: "member", role: "Install and check",
    method: "Installs the set and checks it works together.",
    visibility: "unspecified", install: NOT_YET },
  { id: "conductoR", tier: "member", role: "Running an analysis plan",
    method: "Runs an analysis plan step by step, checking that each result handed from one package to the next is the right kind.",
    visibility: "unspecified", install: NOT_YET },

  // Members joined 2026-09-25
  { id: "bacipair", tier: "member", role: "Before and after comparisons",
    method: "Compares treated sites with matched control sites, before and after a change.",
    guard: "Gives no estimate when there are too few control sites.",
    visibility: "unspecified", install: NOT_YET },
  { id: "survkit", tier: "member", role: "Time to an event",
    method: "Analyses time-to-event data through one interface.",
    guard: "Gives no estimate when too few events were observed.",
    visibility: "private", install: NOT_YET },

  // Outside packages the orchestra uses, as drawn on the poster map
  { id: "nasapower", tier: "external", role: "Weather",
    method: "R package that downloads daily weather for any location from NASA POWER; terroir uses it.",
    visibility: "external" },
  { id: "ocular", tier: "external", role: "Satellite images",
    method: "R package for Sentinel-2 and Landsat satellite series; terroir uses it.",
    visibility: "external" },
  { id: "nert", tier: "external", role: "Ecosystem data",
    method: "R package for data from TERN, Australia's ecosystem observatory; terroir uses it.",
    visibility: "external" },
  { id: "read.abares", tier: "external", role: "Agricultural statistics",
    method: "R package for agricultural statistics from ABARES, including grain prices; terroir uses it.",
    visibility: "external" },
  { id: "apsimx", tier: "external", role: "Running APSIM",
    method: "R package that runs the APSIM crop simulator and retrieves soil profiles from ISRIC SoilGrids; PESTO and terroir use it.",
    visibility: "external" },
  { id: "INLA", tier: "external", role: "Model fitting",
    method: "R package for fast approximate Bayesian model fitting; flexyBayes can fit with it.",
    visibility: "external" },
  { id: "brms", tier: "external", role: "Model fitting",
    method: "R package for Bayesian regression models fitted with Stan; flexyBayes can fit with it.",
    visibility: "external" },
  { id: "acir", tier: "external", role: "Causal information rate",
    method: "The method authors' R package for the causal information rate; kalmix checks its results against it.",
    visibility: "external" },
  { id: "agridat", tier: "external", role: "Published trials",
    method: "R package of published agricultural field-trial datasets; conductoR's guide uses one.",
    visibility: "external" },
  { id: "targets", tier: "external", role: "Pipelines",
    method: "R package for pipelines that re-run only the steps whose inputs changed; a conductoR plan can run as one.",
    visibility: "external" },
];

// The data layer. DataHub is not an R package. Counts read from DataHub's
// catalogue by ORCHESTRA_dev/poster/aagi/datahub_numbers.R (held datasets only).
export const dataHub = {
  id: "DataHub",
  role: "The data layer",
  method: "Holds open datasets, each recorded with its source and licence and indexed by what it can answer, so a question can find its data.",
  nDatasets: 81,
  nAustralia: 15,
};

export const tiers = {
  member: members.filter((m) => m.tier === "member"),
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
