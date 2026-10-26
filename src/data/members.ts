// Grounded roster. Membership, roles and grouping follow the poster (v10_B_25, 2026-10-26), with janusplot
// added beside koine as on its map (enrolled 2026-10-19, MIT).
// Visibility re-read 2026-10-26: anonymous `git ls-remote` answered for all 19 max578 repos; the
// max578.r-universe.dev package list holds 17 of them, not flexyBayes or quorum, which are shown in development.
// Earlier record follows. Membership follows the roster decision of 2026-09-25:
// the ratified Core 9 and Supporting 6, the orchestration engine (conductoR),
// and two members joined that day (bacipair, survkit). Visibility and repo
// links are from a read-only `gh repo list max578` on 2026-09-25 (kalmix,
// conductoR, bacipair public 2026-10-02); `install` is the only source of a
// member page's install block, so a change in availability is one field here,
// never a page edit. Guard lines from the fleet refusal gate. No version
// numbers (drift). `repo` present ONLY where `gh` reported PUBLIC.
// work / alternatives / advantages: from the package repositories (read
// 2026-10-03). An advantage is "tested" only where a result file or log for it
// exists on disk; every other advantage is "claimed".
// visibility: public | gated | private | disabled | unspecified | candidate | external
export type Visibility =
  | "public" | "gated" | "private" | "disabled" | "unspecified" | "candidate" | "external";

export interface Install {
  github: boolean;     // installable with remotes::install_github("max578/<id>")
  runiverse: boolean;  // on max578.r-universe.dev
  cran?: boolean;      // on CRAN
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
  work?: string;         // work still to do, public gist
  alternatives?: string[]; // nearest outside packages, at most four
  advantages?: Advantage[];
}

export interface Advantage {
  text: string;
  status: "tested" | "claimed";
}

const PUBLIC: Install = { github: true, runiverse: true };
const NOT_YET: Install = { github: false, runiverse: false };

export const members: Member[] = [
  // Core 9
  { id: "flexyBayes", tier: "member", role: "Bayesian models for field trials",
    method: "Fits Bayesian mixed models for multi-environment trials, written in ASReml or brms syntax.",
    guard: "Stops and names the model family when it is asked for one it does not support, rather than fitting something else.",
    visibility: "gated", install: NOT_YET,
    work: "Adding fully Bayesian selection of covariates. A public release is to follow.",
    alternatives: ["asreml", "brms", "sommer", "MCMCglmm"],
    advantages: [
      { text: "On a four-site field trial, its site means matched those from ASReml to within 0.07 per cent.", status: "tested" },
      { text: "Needs no paid licence: it fits with the free engines brms and INLA.", status: "claimed" },
      { text: "Refuses by name a model it cannot fit faithfully, rather than fitting a different one.", status: "claimed" },
    ] },
  { id: "quorum", tier: "member", role: "Combines estimates",
    method: "Combines independent estimates of one quantity into a verdict, or reports that they disagree.",
    guard: "Gives no verdict when too few independent estimates agree, or when an estimate falls outside its stated scope.",
    visibility: "gated", install: NOT_YET,
    work: "Adding more packages as sources of independent estimates, among them proxymix, gpfield and optimix.",
    alternatives: ["loo", "performance", "multiverse", "BAS"],
    advantages: [
      { text: "Reproduces the site-by-site choices of the nitrogen study from its recorded table, cell by cell.", status: "tested" },
      { text: "Records which estimates are independent of each other before it combines them.", status: "claimed" },
      { text: "Gives no answer, with the reason, when too few estimates agree.", status: "claimed" },
    ] },
  { id: "decideR", tier: "member", role: "Decisions under uncertainty",
    method: "Chooses the best action under uncertainty, weighing what a wrong call costs, and prices what more information is worth.",
    guard: "Gives no recommendation when an input has not been checked against an independent source.",
    visibility: "public", repo: "max578/decideR", install: PUBLIC,
    work: "Adding a faster way to value one more sample when choosing where to place trials, with plots and a guide to the value of information.",
    alternatives: ["voi", "BCEA", "dampack", "rdecision"],
    advantages: [
      { text: "In a recorded run it refused to price an estimate the field data had rejected, and no rate was produced.", status: "tested" },
      { text: "Reads results in the shared format directly, with no conversion code.", status: "claimed" },
    ] },
  { id: "grainPlan", tier: "member", role: "Plans for growers",
    method: "Turns an analysis into a grower's plan: nitrogen rate, variety and grade target.",
    guard: "Gives no plan when the analysis before it gave no result, or answered a different question.",
    visibility: "public", repo: "max578/grainPlan", install: PUBLIC,
    work: "Adding checks of how a plan changes with grain price and input costs. A plant-density planner is not yet included.",
    alternatives: ["nlraa", "eonr (Python)"],
    advantages: [
      { text: "Shows the grower no number when the evidence behind it was rejected earlier in the analysis.", status: "claimed" },
      { text: "Records where each figure in the plan came from.", status: "claimed" },
    ] },
  { id: "apsimR", tier: "member", role: "Runs APSIM from R",
    method: "Runs the APSIM Next Generation crop simulator from R.",
    guard: "Says so and stops when APSIM is not installed.",
    visibility: "public", repo: "max578/apsimR", install: PUBLIC,
    work: "Connecting it to conductoR, so that a plan can run APSIM as one of its steps.",
    alternatives: ["apsimx", "CroptimizR", "apsimNGpy (Python)"],
    advantages: [
      { text: "Includes a test bench of simulated experiments with a known treatment effect, for checking causal methods before they meet field data.", status: "claimed" },
    ] },
  { id: "PESTO", tier: "member", role: "Fits a crop simulator to field data",
    method: "Fits a crop simulator to field observations with the ensemble methods of PEST++, and keeps what remains uncertain.",
    guard: "Checks that the observations can support the number of settings being fitted before it runs.",
    visibility: "public", repo: "max578/PESTO", install: PUBLIC,
    work: "Running many simulator runs in parallel, as PEST++ can. Four of the eight PEST++ tools have no PESTO counterpart yet.",
    alternatives: ["PEST++", "pyEMU (Python)", "FME", "BayesianTools"],
    advantages: [
      { text: "Can drive the PEST++ ensemble program itself and gets the same result, to the last digit.", status: "tested" },
      { text: "Runs the calibration inside R, without exchanging files with the simulator.", status: "claimed" },
      { text: "Declines a calibration with more settings than the observations can support.", status: "claimed" },
    ] },
  { id: "kernR", tier: "member", role: "Tests whole distributions",
    method: "Tests whether a treatment changes the whole distribution of an outcome, not only its mean.",
    guard: "Gives no verdict when the sample is too small to test reliably.",
    visibility: "public", repo: "max578/kernR", install: PUBLIC,
    work: "Making results on samples larger than 2,500 repeatable from a set seed. Newer kernel tests are planned.",
    alternatives: ["kernlab", "dHSIC", "energy", "sensitivity"],
    advantages: [
      { text: "Keeps its false-alarm rate at the stated level, as dHSIC and energy do.", status: "tested" },
      { text: "Detects a change in spread with fewer samples than the energy test.", status: "tested" },
      { text: "Its fast version was the only test compared whose run time grew close to linearly with sample size.", status: "tested" },
      { text: "Tests field data against a crop model's own predictions with its mechanism-consistency test, a method in development, unpublished.", status: "claimed" },
    ] },
  { id: "terroir", tier: "member", role: "Climate, soil and farm data with their sources",
    method: "Fetches climate, weather, soil, elevation and farm-economics data for any location, and records where every value came from.",
    guard: "Returns a recorded refusal, not a guess, when a value cannot be traced to its source.",
    visibility: "public", repo: "max578/terroir", install: PUBLIC,
    work: "Adding a grain-price source. Lower and upper soil estimates from SoilGrids are not available from that service.",
    alternatives: ["nasapower", "soilDB", "elevatr", "weatherOz"],
    advantages: [
      { text: "Every figure carries its source and date, and can be fetched again with the same result.", status: "claimed" },
      { text: "A figure that cannot be traced to its source is refused, with the reason.", status: "claimed" },
    ] },
  { id: "masque", tier: "member", role: "Synthetic copies of private data",
    method: "Makes a masked copy of a data table that keeps its experimental design, so an analysis plan can be written and tested before anyone uses the real data.",
    guard: "Refuses to hand over a copy when it finds that real values could be recovered from it, or that a location was left unmasked.",
    visibility: "public", repo: "max578/masque", install: PUBLIC,
    work: "Copies do not yet keep differences between varieties across environments. Copies made with older versions should be rebuilt.",
    alternatives: ["synthpop", "sdcMicro", "simPop"],
    advantages: [
      { text: "A planted treatment effect of +5 came through the copy as +5.14. Copying each column separately gave +0.25.", status: "tested" },
      { text: "Keeps a recipe, so the same analysis can be run again on the real data by its owner.", status: "claimed" },
    ] },

  // Supporting 6
  { id: "koine", tier: "member", role: "An independent second analysis",
    method: "Cross-checks a fit with several other inference methods, and gives no result when they add nothing.",
    guard: "Works only with normally distributed errors in multi-environment trials; for other kinds of data it gives no answer.",
    visibility: "public", repo: "max578/koine", install: PUBLIC,
    work: "Correcting a known bias in one model-comparison score for random-effects models. Very large multi-environment trials are still too slow to fit.",
    alternatives: ["lme4", "glmmTMB", "brms", "loo"],
    advantages: [
      { text: "Its variety effects matched a production REML fit at r = 1.00.", status: "tested" },
      { text: "In a simulation, its fixed effects agreed with independent fits from brms and INLA.", status: "tested" },
      { text: "Reports how far its answer differs from the main Bayesian fit.", status: "claimed" },
    ] },
  { id: "janusplot", tier: "member", role: "Shapes of pairwise relations",
    method: "Shows how each pair of continuous variables is related, as a matrix of smoothed curves fitted in both directions, and names the shape of each curve.",
    guard: "Its shape label is a screen, not a verdict: a curve that looks like a rise and fall still needs a formal test.",
    visibility: "public", repo: "max578/janusplot", install: PUBLIC,
    alternatives: ["corrplot", "GGally"],
    advantages: [
      { text: "Fits each pair in both directions with mgcv, so leverage, uneven spread and curvature in one direction show up.", status: "claimed" },
    ] },
  { id: "cdzoo", tier: "member", role: "Causal discovery",
    method: "Puts sixteen causal-discovery algorithms behind one interface and suggests one for the data.",
    guard: "Gives no suggestion when the evidence does not favour one algorithm.",
    visibility: "public", repo: "max578/cdzoo", install: PUBLIC,
    work: "Methods that mix kinds of data are held back until a study shows they work.",
    alternatives: ["pcalg", "bnlearn", "causal-learn (Python)", "gCastle (Python)"],
    advantages: [
      { text: "Runs sixteen published algorithms in one format and compares them on the same data.", status: "claimed" },
      { text: "Recommends a structure with its reasons and the alternatives, rather than choosing silently.", status: "claimed" },
    ] },
  { id: "proxymix", tier: "member", role: "Simplifies distributions",
    method: "Replaces a complicated distribution with a small mixture of bell curves and states the information lost.",
    guard: "Refuses to predict for treatment levels outside those it was fitted on.",
    visibility: "public", repo: "max578/proxymix", install: PUBLIC,
    work: "Preparing a CRAN release. Adding ways to fit a mixture from a distribution's characteristic function.",
    alternatives: ["mclust", "mixtools", "flexmix"],
    advantages: [
      { text: "When it compresses a smoothed density, a handful of components match the accuracy of mclust.", status: "tested" },
      { text: "Fits a mixture to a distribution that can be evaluated but not sampled.", status: "claimed" },
      { text: "Later calculations run on the mixture itself: shift, update, condition and filter through time.", status: "claimed" },
    ] },
  { id: "optimix", tier: "member", role: "Chooses an optimiser",
    method: "Gives one problem to many optimisers and picks the best for it.",
    guard: "Says so when its mapping method cannot handle a problem with that many dimensions.",
    visibility: "public", repo: "max578/optimix", install: PUBLIC,
    work: "Adding problems with whole-number and mixed settings.",
    alternatives: ["optimx", "nloptr", "DEoptim", "GenSA"],
    advantages: [
      { text: "With a tight evaluation budget, its automatic choice solved more test problems than the best single solver, 63 against 56 per cent. With a generous budget the best single solver did better.", status: "tested" },
      { text: "Every solver gets the same number of evaluations, so the comparison is fair.", status: "claimed" },
    ] },
  { id: "gpfield", tier: "member", role: "Maps a field",
    method: "Maps a field variable from point samples to paddock or regional averages.",
    guard: "Gives no prediction when the samples are too sparse or too far away to support it.",
    visibility: "public", repo: "max578/gpfield", install: PUBLIC,
    work: "Adding a faster approximate solver and blocks that are not rectangles. Its results do not yet follow the shared result layout exactly.",
    alternatives: ["gstat", "spaMM", "DiceKriging", "INLA"],
    advantages: [
      { text: "On a simulated field that varies more in one direction than another, its block averages were about 15 times more accurate than standard block kriging with gstat.", status: "tested" },
      { text: "With sparse samples it was more accurate than gstat, and its uncertainty ranges were closer to right.", status: "tested" },
      { text: "Gives no prediction, with the reason, where the samples cannot support one.", status: "claimed" },
    ] },
  { id: "kalmix", tier: "member", role: "Series over time",
    method: "Does Kalman filtering, regime switching and change-point detection on series over time, and checks its causal information rate against the method authors' acir package.",
    guard: "Gives no causal reading when the time-series model does not fit the series.",
    visibility: "public", repo: "max578/kalmix", install: PUBLIC,
    work: "A change to how the causal information rate is scaled is due in the next release.",
    alternatives: ["KFAS", "dlm", "bsts", "changepoint"],
    advantages: [
      { text: "Its causal information rate matches the method authors' acir package.", status: "tested" },
      { text: "Gives no causal reading when the model fits the series poorly.", status: "claimed" },
    ] },

  // Orchestration engine
  { id: "conductoR", tier: "member", role: "Runs an analysis plan",
    method: "Runs an analysis plan step by step, checking that each result handed from one package to the next is the right kind.",
    visibility: "public", repo: "max578/conductoR", install: PUBLIC,
    work: "Its name clashes with an existing CRAN package, so it needs a new name before a CRAN release. The example plans it ships show the format but do not yet run end to end.",
    alternatives: ["targets", "drake"],
    advantages: [
      { text: "Refuses a handed-on result of the wrong kind, or one that was altered, before the next step runs.", status: "tested" },
      { text: "A plan run as a targets pipeline reaches the same verdict as a direct run.", status: "tested" },
    ] },

  // Members joined 2026-09-25
  { id: "bacipair", tier: "member", role: "Before and after comparisons",
    method: "Compares treated sites with matched control sites, before and after a change.",
    guard: "Its synthetic-control estimate is withheld when there are too few control sites or too few years before the change.",
    visibility: "public", repo: "max578/bacipair", install: PUBLIC,
    work: "It does not yet write the shared result format. It was built for carbon-offset audits, and its uses in grain are still to be shown.",
    alternatives: ["did", "fixest", "Synth", "tidysynth"],
    advantages: [
      { text: "Recovers a known effect in simulated data, and withholds its synthetic-control estimate when there are too few control sites or years.", status: "tested" },
      { text: "Every estimator works on one register of site pairs, so the whole analysis can be checked in one place.", status: "claimed" },
    ] },
  { id: "survkit", tier: "member", role: "Time to an event",
    method: "Analyses time-to-event data through one interface.",
    guard: "Warns when too few events were observed, and gives no estimate when asked to withhold one.",
    visibility: "public", repo: "max578/survkit", install: PUBLIC,
    work: "It writes its own result format, not yet the shared one.",
    alternatives: ["survival", "flexsurv", "censored", "rms"],
    advantages: [
      { text: "Checks whether enough events were observed to trust the model, and can return a refusal instead of a fit.", status: "tested" },
      { text: "Compares several time-to-event methods on the same data through one function.", status: "claimed" },
    ] },
  // Invited members: packages by other authors that the orchestra uses
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
  { id: "asreml", tier: "external", role: "Benchmark mixed models",
    method: "Commercial R package from VSN International that fits linear mixed models by REML; the study uses it as the benchmark for flexyBayes.",
    visibility: "external" },
];

// DataHub, the orchestra's data catalogue: on the map in the data section; not an R package. Counts read from DataHub's
// catalogue for the poster (v10_B_22 recount, 2026-10-24; held datasets only).
export const dataHub = {
  id: "DataHub",
  role: "In the orchestra · data catalogue",
  method: "Holds open datasets for testing analyses, each with its source and licence, and finds the datasets that can answer a given question.",
  nDatasets: 101,
  nAustralia: 27,
  nAwaiting: 55,
  nQuestionKinds: 8,
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
  if (m.install.cran) lines.push(`install.packages("${m.id}")`);
  if (m.install.github) lines.push(`remotes::install_github("max578/${m.id}")`);
  if (m.install.runiverse)
    lines.push(`install.packages("${m.id}", repos = c("https://max578.r-universe.dev", "https://cloud.r-project.org"))`);
  if (lines.length === 0) return { lines, note: "public release in preparation" };
  return { lines };
};

// The poster's grouping of the roster, in its order; colours are the hexagon borders.
export const posterGroups = [
  { label: "Data and privacy", color: "#56B4E9", ids: ["terroir", "masque", "DataHub"] },
  { label: "Crop simulation", color: "#E69F00", ids: ["apsimR", "PESTO"] },
  { label: "Causal, spatial and time series", color: "#009E73", ids: ["kernR", "cdzoo", "bacipair", "gpfield", "kalmix"] },
  { label: "Statistics and consensus", color: "#0072B2", ids: ["flexyBayes", "koine", "janusplot", "quorum", "survkit"] },
  { label: "Approximation and optimisation", color: "#CC79A7", ids: ["proxymix", "optimix"] },
  { label: "Decisions", color: "#D55E00", ids: ["decideR", "grainPlan"] },
  { label: "At the centre", color: "#F0E442", ids: ["conductoR"] },
];
