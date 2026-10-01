// The orchestra map: one source for the interactive map on /members and the
// poster figure (ORCHESTRA_dev/poster/build_map.mjs). Roster of 2026-09-25.
// No version numbers here; the member pages carry install and status.

/** Sections in clockwise order, following the flow from data to decision. */
export const sections = [
  { id: "data", label: "Data and confidentiality", color: "#56B4E9" },
  { id: "mech", label: "Crop simulation", color: "#E69F00" },
  { id: "causal", label: "Causal, spatial and time-series analysis", color: "#009E73" },
  { id: "hub", label: "Statistics and consensus", color: "#0072B2" },
  { id: "decision", label: "Decisions", color: "#D55E00" },
  { id: "proxy", label: "Approximation and optimisation", color: "#CC79A7" },
];

/**
 * kind: "member" sits on the ring; "centre" is the connector; "format" is the
 * shared-format ring; "entry" is the starting point; "source" is outside the
 * orchestra and drawn on the outer ring.
 */
export const nodes = [
  // Data and confidentiality
  { id: "masque", kind: "member", section: "data", motif: "mask",
    purpose: "Lets analysts develop on a synthetic copy of confidential field data, then run the finished analysis on the real data.",
    character: "The copy keeps the relationships an analysis depends on, including how treatment relates to outcome within each block. It is rebuilt from a stored recipe, and every assumption made while cleaning a table is reported.",
    similar: ["synthpop", "sdcMicro"] },
  { id: "terroir", kind: "member", section: "data", motif: "seal",
    purpose: "Supplies climate, soil and satellite series for any field location.",
    character: "Each value records where it came from and can be fetched again with the same result. A value whose source cannot be confirmed is flagged, not passed on silently. It wraps established data packages rather than replacing them.",
    similar: ["nasapower", "soilDB", "elevatr"] },

  // Crop simulation
  { id: "apsimR", kind: "member", section: "mech", motif: "vessel",
    purpose: "Runs the APSIM Next Generation crop simulator from R and returns its results in the shared format.",
    character: "It includes a test bench where the true answer is known, so a fitting method can be checked before it meets field data. It stops with a clear message when the simulator is not installed.",
    similar: ["apsimx"] },
  { id: "PESTO", kind: "member", section: "mech", motif: "braids",
    purpose: "Fits a crop simulator to field observations and reports the remaining uncertainty as a set of plausible simulator runs.",
    character: "An R implementation of the iterative ensemble smoother behind PEST++, able to drive PEST++ itself and match its results.",
    similar: ["PEST++", "pyEMU"] },

  // Causal, spatial and time-series analysis
  { id: "kernR", kind: "member", section: "causal", motif: "discs",
    purpose: "Tests whether field observations agree with what the crop model predicts for each treatment.",
    character: "It tests the crop model's own predictions rather than a generic statistical pattern. Where the field and the model disagree, the site is passed to the statistical models instead.",
    similar: ["kernlab", "dHSIC", "energy"] },
  { id: "cdzoo", kind: "member", section: "causal", motif: "arrows",
    purpose: "Recovers the likely causal structure among field variables, which decides what an analysis must adjust for.",
    character: "A zoo of sixteen causal-discovery algorithms behind one interface. A recommender suggests which algorithm suits the data and keeps a record of where the algorithms disagree.",
    similar: ["pcalg", "bnlearn", "causal-learn"],
    similarNote: "cdzoo gathers these under one interface rather than replacing them." },
  { id: "bacipair", kind: "member", section: "causal", motif: "pair",
    purpose: "Estimates the effect of a change at treated sites by comparing each with a matched control site, before and after.",
    character: "Every estimator, the bootstrap and a simulator with known answers work on one register of site pairs, so the whole analysis, from raw pairs to final effect, can be checked in one place.",
    similar: ["did", "fixest", "Synth"] },
  { id: "gpfield", kind: "member", section: "causal", motif: "weave",
    purpose: "Predicts a field variable over whole paddocks or regions from measurements taken at points.",
    character: "It carries the extra uncertainty that comes with moving from points to areas, and declines to predict where the data cannot support it.",
    similar: ["gstat", "INLA-SPDE", "spaMM"] },
  { id: "kalmix", kind: "member", section: "causal", motif: "tide",
    purpose: "Tracks a system over time, finds the points where its behaviour changes, and estimates causal effects from a single long series.",
    character: "It checks that the model fits before it reports. Its causal-information rate is checked against the method authors' own code.",
    similar: ["KFAS", "dlm", "bsts", "changepoint"] },

  // Approximation and optimisation
  { id: "proxymix", kind: "member", section: "proxy", motif: "blend",
    purpose: "Replaces a complicated probability distribution with a small mixture of bell-shaped curves that is fast to compute with.",
    character: "It states how much information the simplification loses, and later calculations can run on the mixture directly.",
    similar: ["mclust", "mixtools"] },
  { id: "optimix", kind: "member", section: "proxy", motif: "paths",
    purpose: "Solves optimisation problems through one description of the problem and a choice of established solvers.",
    character: "Solvers compete on an equal budget of evaluations. The result says whether it is a single best point or a map of every good solution.",
    similar: ["optimx", "nloptr", "DEoptim", "GenSA"] },

  // Statistics and consensus
  { id: "survkit", kind: "member", section: "hub", motif: "curve",
    purpose: "Analyses time-to-event data through one interface.",
    character: "It compares several methods on the same data, and declines to report when there are too few events to support the model.",
    similar: ["survival", "flexsurv", "cmprsk"] },
  { id: "koine", kind: "member", section: "hub", motif: "tongues",
    purpose: "Builds one independent fourth opinion for a Bayesian model from a battery of inference methods, beside the opinions of the main engines.",
    character: "It combines methods and model structures into one prediction, and abstains when combining them would add nothing the other opinions lack.",
    similar: ["loo"], similarNote: "loo supplies stacking weights; koine assembles the opinion itself." },
  { id: "quorum", kind: "member", section: "hub", motif: "mirror",
    purpose: "Combines several independent estimates of the same quantity into one verdict, or reports that they do not agree enough to act on.",
    character: "Each estimate declares how independent it is and which question it answers. When no quorum forms, no answer is carried forward.",
    similar: [], similarNote: "This step is usually written by hand for each analysis." },
  { id: "flexyBayes", kind: "member", section: "hub", motif: "echoes",
    purpose: "Fits Bayesian mixed models for multi-environment trials through several engines behind one interface.",
    character: "When two engines disagree on the same model, the disagreement is reported as a warning. A model family it cannot fit is refused by name.",
    similar: ["brms", "INLA", "asreml"],
    status: "Under development and not yet public." },

  // Decisions
  { id: "decideR", kind: "member", section: "decision", motif: "table",
    purpose: "Finds the best action under uncertainty and what more information would be worth.",
    character: "It will not put a price on an input that has not been verified. It reads the shared result format directly.",
    similar: [], similarNote: "Decision code of this kind is usually written by hand for each analysis." },
  { id: "grainPlan", kind: "member", section: "decision", motif: "hearth",
    purpose: "Turns an analysis into a grower's plan: nitrogen rate, variety choice and grade target.",
    character: "Every refusal made earlier in the chain is carried into the plan, so the plan gives no recommendation where the evidence was refused.",
    similar: [], similarNote: "The nearest tools are proprietary agronomic calculators." },

  // The centre
  { id: "conductoR", kind: "centre", section: null, glyph: "c",
    purpose: "Runs an analysis plan: a list of steps, each done by one package of the orchestra, in order.",
    character: "It checks that each result handed from one package to the next is the right kind, and stops the plan before a wrong one is used. Two built-in steps decline to report a null result the study had too little power to detect, and reconcile several independent estimates.",
    similar: ["targets"], similarNote: "A conductoR plan can be run as a targets pipeline." },
  { id: "orchestraManifest", kind: "format", section: null,
    purpose: "The shared result format: the one structure every member writes and reads.",
    character: "Because every result has the same form, any member's output can be checked and passed on without extra code to connect them. A member that cannot answer soundly returns a refusal in the same format, stating why it declined.",
    similar: [], similarNote: "It is the orchestra's own agreement between members." },
  { id: "cropOrchestra", kind: "entry", section: null, glyph: "✓",
    purpose: "The place to start: lists the members, installs them and checks that they work together.",
    character: "It runs no analysis of its own.",
    similar: ["tidyverse"], similarNote: "It plays the role the tidyverse package plays for its family: one install for the whole set." },

  // Outside sources
  { id: "nasapower", kind: "source", purpose: "R package that downloads daily weather for any location from NASA POWER." },
  { id: "ocular", kind: "source", purpose: "R package for Sentinel-2 and Landsat satellite series." },
  { id: "nert", kind: "source", purpose: "R package for data from TERN, Australia's ecosystem observatory." },
  { id: "read.abares", kind: "source", purpose: "R package for agricultural statistics from ABARES, including grain prices." },
  { id: "apsimx", kind: "source", purpose: "R package that runs the APSIM crop simulator and retrieves soil profiles from ISRIC SoilGrids." },
  { id: "INLA", kind: "source", purpose: "R package for fast approximate Bayesian model fitting." },
  { id: "brms", kind: "source", purpose: "R package for Bayesian regression models fitted with Stan." },
  { id: "greta", kind: "source", purpose: "R package for Bayesian models fitted with TensorFlow." },
  { id: "acir", kind: "source", purpose: "The method authors' R package for the causal information rate." },
  { id: "agridat", kind: "source", purpose: "R package of published agricultural field-trial datasets." },
  { id: "targets", kind: "source", purpose: "R package for pipelines that re-run only the steps whose inputs changed." },
];

/**
 * Relations. kind: "flow" passes a result on; "build" is one member built on
 * or optionally using another; "source" is an outside source or engine;
 * "format" writes or reads the shared format. Each text names both ends so it
 * reads correctly in either member's panel.
 */
export const edges = [
  { from: "koine", to: "quorum", kind: "flow", text: "koine's independent fit enters quorum as a second opinion." },
  { from: "quorum", to: "flexyBayes", kind: "build", text: "quorum is built on flexyBayes and compares its fits with other estimates." },
  { from: "PESTO", to: "quorum", kind: "flow", text: "PESTO's ensembles of simulator runs, and its fast stand-in for the simulator, enter quorum as estimates." },
  { from: "apsimR", to: "quorum", kind: "flow", text: "APSIM runs from apsimR enter quorum as estimates." },
  { from: "kernR", to: "quorum", kind: "flow", text: "kernR's fast stand-in model can enter quorum as an estimate." },
  { from: "terroir", to: "flexyBayes", kind: "flow", text: "terroir supplies the climate and soil covariates for flexyBayes models." },
  { from: "terroir", to: "kernR", kind: "flow", text: "terroir supplies the covariates that kernR's test conditions on." },
  { from: "terroir", to: "PESTO", kind: "flow", text: "terroir supplies the weather and soil series that drive PESTO's simulator runs." },
  { from: "terroir", to: "apsimR", kind: "flow", text: "terroir's climate and soil records drive apsimR's simulations." },
  { from: "apsimR", to: "PESTO", kind: "flow", text: "PESTO fits apsimR's simulator to the field observations." },
  { from: "PESTO", to: "kernR", kind: "flow", text: "kernR's test reads PESTO's ensemble of simulator runs." },
  { from: "kernR", to: "brms", kind: "flow", text: "In the worked example, sites where the field and the crop model disagree go from kernR to a brms model of the field response." },
  { from: "brms", to: "decideR", kind: "flow", text: "In the worked example, decideR prices the brms field-response result." },
  { from: "PESTO", to: "decideR", kind: "flow", text: "decideR prices PESTO's simulator-based result, or declines to." },
  { from: "flexyBayes", to: "decideR", kind: "flow", text: "decideR prices the statistical result from flexyBayes." },
  { from: "decideR", to: "grainPlan", kind: "flow", text: "decideR's priced action becomes grainPlan's plan for the grower." },
  { from: "masque", to: "PESTO", kind: "build", text: "PESTO can be developed on masque's synthetic copy of confidential field data." },
  { from: "PESTO", to: "proxymix", kind: "flow", text: "proxymix compresses PESTO's ensemble into a few shapes." },
  { from: "proxymix", to: "kernR", kind: "build", text: "kernR can use proxymix to compute density ratios." },
  { from: "cdzoo", to: "kernR", kind: "flow", text: "cdzoo's causal structure tells kernR what to adjust for." },
  { from: "gpfield", to: "flexyBayes", kind: "flow", text: "gpfield's area-level predictions become covariates in flexyBayes models." },
  { from: "optimix", to: "decideR", kind: "flow", text: "optimix tells decideR where extra sampling is worth most." },
  { from: "kernR", to: "kalmix", kind: "build", text: "kalmix's causal-information rate is built on kernR's entropy metric." },
  { from: "optimix", to: "proxymix", kind: "build", text: "optimix can use proxymix to map every good solution with its uncertainty." },
  { from: "cdzoo", to: "proxymix", kind: "build", text: "cdzoo can use proxymix's mixture model to test which variables are independent." },
  { from: "conductoR", to: "PESTO", kind: "flow", text: "conductoR can run PESTO as a step in a plan." },
  { from: "bacipair", to: "conductoR", kind: "flow", text: "bacipair's estimate enters a conductoR plan as one of several independent estimates." },
  { from: "survkit", to: "conductoR", kind: "flow", text: "survkit's fit enters a conductoR plan as one of several independent estimates." },
  { from: "conductoR", to: "orchestraManifest", kind: "format", text: "conductoR checks every handoff against orchestraManifest." },

  { from: "ocular", to: "terroir", kind: "source", text: "Sentinel-2 and Landsat series reach terroir through ocular." },
  { from: "nert", to: "terroir", kind: "source", text: "TERN ecosystem data reach terroir through nert." },
  { from: "nasapower", to: "terroir", kind: "source", text: "Daily weather from NASA POWER reaches terroir through nasapower." },
  { from: "apsimx", to: "terroir", kind: "source", text: "Soil profiles from ISRIC SoilGrids reach terroir through apsimx." },
  { from: "read.abares", to: "terroir", kind: "source", text: "Grain prices and production statistics reach terroir from ABARES." },
  { from: "apsimx", to: "PESTO", kind: "source", text: "PESTO edits and runs APSIM simulations through apsimx." },
  { from: "acir", to: "kalmix", kind: "source", text: "kalmix checks its causal-information rate against the method authors' acir package." },
  { from: "INLA", to: "flexyBayes", kind: "source", text: "flexyBayes can fit a model with INLA." },
  { from: "brms", to: "flexyBayes", kind: "source", text: "flexyBayes can fit a model with brms and Stan." },
  { from: "greta", to: "flexyBayes", kind: "source", text: "flexyBayes can fit a model with greta." },
  { from: "targets", to: "conductoR", kind: "source", text: "A conductoR plan can be run as a targets pipeline." },
  { from: "agridat", to: "conductoR", kind: "source", text: "conductoR's guide runs a plan on a published nitrogen trial from agridat." },
];

/** Members that write or read the shared format (roster of 2026-09-25). */
export const formatWriters = ["PESTO", "proxymix", "cdzoo", "optimix", "gpfield", "apsimR", "masque", "survkit"];
export const formatReaders = ["kernR", "flexyBayes", "decideR", "grainPlan", "conductoR"];

/** The worked example (Study A0), in order. */
export const workedExample = [
  { id: "terroir", text: "Climate and soil records are fetched for each site, with their sources recorded." },
  { id: "apsimx", text: "apsimx writes each site's weather file and runs APSIM, which simulates what each season should produce." },
  { id: "PESTO", text: "The simulator is fitted to the field observations, and the remaining uncertainty is kept as an ensemble." },
  { id: "kernR", text: "The test asks whether the field agrees with the crop model. Sites where it does not are passed on." },
  { id: "brms", text: "For those sites, a brms model fits the nitrogen response the field shows, including a plateau the crop model cannot see." },
  { id: "decideR", text: "The best action is priced, or pricing is refused where an input is unverified." },
  { id: "grainPlan", text: "The grower receives a nitrogen plan that keeps every refusal made along the way." },
];

/** Small drawings inside member nodes, in a 44 34 72 78 box; C stands for the section colour. */
export const motifs = {
  "echoes": "<path d='M80 40 q-18 8 -18 26 q0 18 18 26 q18 -8 18 -26 q0 -18 -18 -26Z' fill='none' stroke='C' stroke-width='2.4'/><path d='M80 48 q-11 5 -11 18 q0 13 11 18 q11 -5 11 -18 q0 -13 -11 -18Z' fill='none' stroke='currentColor' stroke-width='2'/><circle cx='80' cy='66' r='4.5' fill='C'/><path d='M56 96 q24 12 48 0' fill='none' stroke='C' stroke-width='2.4'/>",
  "braids": "<path d='M52 104 q8 -20 12 -34 M64 108 q4 -24 8 -40 M80 110 q0 -26 0 -46 M96 108 q-4 -24 -8 -40 M108 104 q-8 -20 -12 -34' fill='none' stroke='currentColor' stroke-width='2'/><path d='M64 68 q16 -10 32 0 M58 84 q22 -12 44 0' fill='none' stroke='C' stroke-width='2.2'/><circle cx='80' cy='46' r='5' fill='C'/>",
  "discs": "<circle cx='68' cy='70' r='22' fill='none' stroke='currentColor' stroke-width='2.2'/><circle cx='92' cy='70' r='22' fill='none' stroke='C' stroke-width='2.2'/><path d='M80 51 a22 22 0 0 1 0 38 a22 22 0 0 1 0 -38Z' fill='C' opacity='0.3'/><circle cx='80' cy='100' r='3' fill='currentColor'/>",
  "vessel": "<path d='M64 42 v14 q-14 16 -14 34 a30 26 0 0 0 60 0 q0 -18 -14 -34 v-14Z' fill='none' stroke='currentColor' stroke-width='2.2'/><path d='M80 104 v-28 M80 84 q-10 -4 -12 -14 M80 92 q10 -4 12 -14 M80 76 q-6 -2 -8 -9 M80 76 q6 -2 8 -9' fill='none' stroke='C' stroke-width='2.4'/><path d='M60 42 h40' stroke='currentColor' stroke-width='2.2'/>",
  "mirror": "<path d='M52 86 q10 -34 28 -34 q18 0 28 34' fill='none' stroke='currentColor' stroke-width='2.4'/><path d='M52 92 q10 -34 28 -34 q18 0 28 34' fill='none' stroke='C' stroke-width='2.2' stroke-dasharray='5 4'/><path d='M60 104 h40' stroke='C' stroke-width='2' stroke-dasharray='2 4'/>",
  "seal": "<path d='M54 60 h52 M54 76 h52 M54 92 h52 M62 48 v56 M80 44 v64 M98 48 v56' stroke='currentColor' stroke-width='1.3' opacity='0.7'/><circle cx='80' cy='74' r='14' fill='S' stroke='C' stroke-width='2.8'/><path d='M74 74 l4 5 l8 -10' fill='none' stroke='C' stroke-width='2.8' stroke-linecap='round'/>",
  "mask": "<path d='M53 62 q27 -14 54 0 q0 26 -14 38 q-8 7 -13 7 q-5 0 -13 -7 q-14 -12 -14 -38Z' fill='C' opacity='0.2'/><path d='M53 62 q27 -14 54 0 q0 26 -14 38 q-8 7 -13 7 q-5 0 -13 -7 q-14 -12 -14 -38Z' fill='none' stroke='C' stroke-width='2.4'/><path d='M64 72 q8 -5 12 0 M84 72 q8 -5 12 0' fill='none' stroke='currentColor' stroke-width='2.2'/><path d='M80 62 v40' stroke='currentColor' stroke-width='1.6' stroke-dasharray='3 3'/>",
  "table": "<path d='M56 52 h48 v48 h-48 Z M56 68 h48 M56 84 h48 M72 52 v48 M88 52 v48' fill='none' stroke='currentColor' stroke-width='2'/><rect x='73.5' y='69.5' width='13' height='13' fill='C' opacity='0.35'/><rect x='89.5' y='85.5' width='13' height='13' fill='none' stroke='C' stroke-width='2.2' stroke-dasharray='3 3'/>",
  "hearth": "<path d='M54 78 h52 M60 78 v22 M100 78 v22' stroke='currentColor' stroke-width='2.4'/><path d='M70 66 q0 -10 10 -10 q10 0 10 10' fill='none' stroke='C' stroke-width='2.4'/><circle cx='80' cy='70' r='3.5' fill='C'/><path d='M64 92 h32' stroke='C' stroke-width='2' stroke-dasharray='2 4'/>",
  "weave": "<path d='M52 58 q28 10 56 0 M52 72 q28 10 56 0 M52 86 q28 10 56 0' fill='none' stroke='currentColor' stroke-width='1.8'/><path d='M62 50 q10 28 0 52 M80 48 q10 28 0 56 M98 50 q10 28 0 52' fill='none' stroke='currentColor' stroke-width='1.8' opacity='0.7'/><rect x='70' y='64' width='20' height='16' fill='C' opacity='0.32'/><rect x='70' y='64' width='20' height='16' fill='none' stroke='C' stroke-width='2.4'/>",
  "tide": "<path d='M52 62 q7 -6 14 0 t14 0 t14 0 t14 0' fill='none' stroke='currentColor' stroke-width='2'/><path d='M52 80 q14 -10 28 0 t28 0' fill='none' stroke='C' stroke-width='2.8'/><path d='M88 96 v10 M84 102 l4 6 l4 -6' fill='none' stroke='C' stroke-width='2.4'/>",
  "tongues": "<path d='M58 56 h20 M58 66 h16 M58 76 h20' stroke='currentColor' stroke-width='2.2'/><path d='M84 60 q6 -6 10 0 q4 6 10 0 M84 72 q6 -6 10 0 q4 6 10 0' fill='none' stroke='C' stroke-width='2.4'/><path d='M66 92 q14 12 28 0' fill='none' stroke='C' stroke-width='2.2'/><circle cx='80' cy='98' r='2.5' fill='currentColor'/>",
  "blend": "<circle cx='68' cy='64' r='13' fill='C' opacity='0.25'/><circle cx='93' cy='70' r='10' fill='C' opacity='0.35'/><circle cx='76' cy='88' r='8' fill='C' opacity='0.5'/><circle cx='68' cy='64' r='13' fill='none' stroke='currentColor' stroke-width='1.8'/><circle cx='93' cy='70' r='10' fill='none' stroke='currentColor' stroke-width='1.8'/><circle cx='76' cy='88' r='8' fill='none' stroke='currentColor' stroke-width='1.8'/><path d='M60 104 h40' stroke='C' stroke-width='1.8' stroke-dasharray='1 3'/>",
  "paths": "<path d='M56 102 q10 -18 6 -34 q-2 -10 6 -16 M56 102 q18 -8 22 -28 q2 -12 10 -18 M56 102 q26 2 34 -16 q4 -10 12 -12' fill='none' stroke='currentColor' stroke-width='1.8'/><circle cx='98' cy='52' r='4' fill='C'/><path d='M98 52 v-10 l8 3 l-8 3' fill='C' stroke='C' stroke-width='1.4'/>",
  "arrows": "<circle cx='64' cy='56' r='4' fill='currentColor'/><circle cx='98' cy='62' r='4' fill='currentColor'/><circle cx='72' cy='92' r='4' fill='currentColor'/><circle cx='98' cy='94' r='4' fill='currentColor'/><path d='M68 58 l24 3 M74 88 l20 4' stroke='C' stroke-width='2.4'/><path d='M90 58 l4 3.5 l-4.6 2.6Z M92 90 l4 3.5 l-4.6 2.6Z' fill='C'/><path d='M66 61 l5 25' stroke='currentColor' stroke-width='1.8' stroke-dasharray='3 3'/>",
  "pair": "<path d='M54 100 h52' stroke='currentColor' stroke-width='2'/><rect x='58' y='72' width='10' height='28' fill='none' stroke='currentColor' stroke-width='2'/><rect x='72' y='60' width='10' height='40' fill='C' opacity='0.35' stroke='C' stroke-width='2'/><rect x='90' y='70' width='10' height='30' fill='none' stroke='currentColor' stroke-width='2'/><rect x='104' y='66' width='10' height='34' fill='none' stroke='currentColor' stroke-width='2'/><path d='M80 44 v12' stroke='C' stroke-width='2.4' stroke-dasharray='3 3'/><path d='M63 50 h18 M97 50 h18' stroke='currentColor' stroke-width='1.6' opacity='0.7'/>",
  "curve": "<path d='M54 100 h52 M54 100 v-52' stroke='currentColor' stroke-width='1.8'/><path d='M54 50 h10 v10 h8 v8 h8 v12 h10 v10 h8 v8 h8' fill='none' stroke='C' stroke-width='2.8'/><path d='M54 50 h10 v10 h8 v8 h8 v12 h10 v10 h8 v8 h8 V100 H54 Z' fill='C' opacity='0.18'/><path d='M96 62 l4 4 l6 -8' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'/>"
};
