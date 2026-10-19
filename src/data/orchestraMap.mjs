// The orchestra map: one source for the interactive map on /members and the
// poster figure (ORCHESTRA_dev/poster/build_map.mjs). Roster of 2026-09-25.
// No version numbers here; the member pages carry install and status.
// Links between packages are only those recorded in the worked examples'
// run files (src/data/examples/) and the dependencies in DESCRIPTION files.
import { examples } from "./examples.mjs";

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
 * shared-format ring; "source" is outside the orchestra and drawn on the outer
 * ring. `label`, where present, is the name shown in place of the id.
 */
export const nodes = [
  // Data and confidentiality
  { id: "masque", kind: "member", section: "data", motif: "mask",
    purpose: "Makes a masked copy of a data table, so an analysis plan can be written and tested before the real data are used.",
    character: "The copy keeps the relationships an analysis depends on, including how treatment relates to outcome within each block. It is rebuilt from a stored recipe, and every assumption made while cleaning a table is reported.",
    similar: ["synthpop", "sdcMicro"] },
  { id: "terroir", kind: "member", section: "data", motif: "seal",
    purpose: "Supplies climate, soil and satellite series for any field location.",
    character: "Each value records where it came from and can be fetched again with the same result. A value whose source cannot be confirmed is flagged, not passed on silently. It wraps established data packages rather than replacing them.",
    similar: ["nasapower", "soilDB", "elevatr"] },
  { id: "DataHub", kind: "member", section: "data", motif: "catalogue",
    purpose: "Holds open datasets for testing analyses, each with its source and licence, and finds the datasets that can answer a given question.",
    character: "Each dataset is measured when it is added, so a question such as \"which datasets record yield at several nitrogen rates\" is answered from what the data hold, not from tags. It is a catalogue, not an R package.",
    similar: ["Frictionless Data", "DuckDB"], similarNote: "It is built on the Frictionless Data descriptor format and a DuckDB index." },

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
  { id: "janusplot", kind: "member", section: "hub", motif: "lattice",
    purpose: "Shows how each pair of continuous variables is related, as a matrix of smoothed curves, and names the shape of each curve.",
    character: "Each pair is fitted in both directions with mgcv, so leverage, uneven spread and curvature in one direction show up. Its shape label is a screen, not a verdict: a curve that looks like a rise and fall still needs a formal test.",
    similar: ["corrplot", "GGally"], similarNote: "Correlation-matrix plots show one number per pair; janusplot shows the fitted curve in each direction." },
  { id: "flexyBayes", kind: "member", section: "hub", motif: "echoes",
    purpose: "Fits Bayesian mixed models for multi-environment trials through several engines behind one interface.",
    character: "A model written in ASReml notation is fitted with free engines. A model family it cannot fit faithfully is refused by name.",
    similar: ["brms", "INLA", "asreml"],
    status: "Under development and not yet public." },

  // Decisions
  { id: "decideR", kind: "member", section: "decision", motif: "table",
    purpose: "Finds the best action under uncertainty and what more information would be worth.",
    character: "It will not put a price on an input that has not been verified. It reads the shared result format directly.",
    similar: ["voi", "BCEA", "dampack", "rdecision"], similarNote: "These value information and compare decisions. decideR adds the refusal to price an unchecked input." },
  { id: "grainPlan", kind: "member", section: "decision", motif: "hearth",
    purpose: "Turns an analysis into a grower's plan: nitrogen rate, variety choice and grade target.",
    character: "Every refusal made earlier in the chain is carried into the plan, so the plan gives no recommendation where the evidence was refused.",
    similar: [], similarNote: "The nearest tools are proprietary agronomic calculators." },

  // The centre
  { id: "conductoR", kind: "centre", section: null, glyph: "c",
    purpose: "Runs an analysis plan: a list of steps, each done by one package of the orchestra, in order.",
    character: "It checks that each result handed from one package to the next is the right kind, and stops the plan before a wrong one is used. Two built-in steps decline to report a null result the study had too little power to detect, and reconcile several independent estimates.",
    similar: ["targets"], similarNote: "A conductoR plan can be run as a targets pipeline." },
  { id: "sharedFormat", label: "Shared result format", kind: "format", section: null,
    purpose: "The shared result format: the one structure every member writes and reads.",
    character: "Because every result has the same form, any member's output can be checked and passed on without extra code to connect them. A member that cannot answer soundly returns a refusal in the same format, stating why it declined.",
    similar: [], similarNote: "It is the orchestra's own agreement between members." },

];

/**
 * Outside packages that an example's plan ran or read its data from. Only the
 * ones an example names are drawn; `near` is the member they sit beside,
 * `side` (1 or -1) which side of it.
 */
const SOURCE_CATALOGUE = {
  agridat: { purpose: "R package of published agricultural field-trial datasets.", near: "masque" },
  sp: { purpose: "R package for spatial data. It includes the meuse river soil samples.", near: "masque" },
  asreml: { purpose: "Commercial R package from VSN International that fits linear mixed models by REML.", near: "koine", side: -1 },
  lme4: { purpose: "R package for linear and generalised linear mixed models.", near: "survkit", side: 1 },
  nlme: { purpose: "R package for linear and nonlinear mixed models, including spatial correlation.", near: "gpfield" },
  gstat: { purpose: "R package for geostatistics: variograms and kriging.", near: "gpfield" },
  mgcv: { purpose: "R package for generalised additive models.", near: "gpfield" },
  INLA: { purpose: "R package for fast approximate Bayesian model fitting.", near: "flexyBayes" },
  brms: { purpose: "R package for Bayesian regression models fitted with Stan.", near: "flexyBayes" },
  apsimx: { purpose: "R package that edits and runs APSIM Next Generation crop simulations.", near: "PESTO" },
};

const MEMBER_IDS = nodes.map((n) => n.id);
/** The map node for a package name as an example file writes it, or null. */
function nodeIdOf(name) {
  const bare = String(name).split("::")[0].trim();
  const all = [...MEMBER_IDS, ...Object.keys(SOURCE_CATALOGUE)];
  return all.find((id) => id === bare) ?? all.find((id) => id.toLowerCase() === bare.toLowerCase()) ?? null;
}
const listOf = (ids) => (ids.length < 2 ? ids.join("") : `${ids.slice(0, -1).join(", ")} and ${ids.at(-1)}`);
const cap = (s) => { const x = String(s).replace(/_/g, " "); return x.charAt(0).toUpperCase() + x.slice(1); };

/** Relations recorded in the examples, merged across examples. */
const recorded = new Map();
function record(from, to, kind, what, exId) {
  if (from === to) return;
  const key = `${from}>${to}>${kind}`;
  const r = recorded.get(key) ?? { from, to, kind, whats: new Map() };
  const exs = r.whats.get(what) ?? [];
  if (!exs.includes(exId)) exs.push(exId);
  r.whats.set(what, exs);
  recorded.set(key, r);
}
const usedSources = new Set();
for (const ex of examples) {
  const memberOf = Object.fromEntries(ex.compose.steps.map((s) => [s.id, s.member]));
  const resolve = (name, where) => {
    const id = nodeIdOf(name);
    if (!id) throw new Error(`${ex.id}: ${where} names "${name}", which is neither a member nor an outside package the map describes (add it to SOURCE_CATALOGUE in orchestraMap.mjs).`);
    if (SOURCE_CATALOGUE[id]) usedSources.add(id);
    return id;
  };
  record("masque", "conductoR", "flow", "the masked copy that the plan was written and tested on", ex.id);
  for (const s of ex.compose.steps) {
    const m = resolve(s.member, `step ${s.id}`);
    if (m !== "conductoR") record("conductoR", m, "run", "run", ex.id);
  }
  for (const e of ex.compose.edges) {
    const a = resolve(memberOf[e.from] ?? e.from, `edge ${e.from} to ${e.to}`);
    const b = resolve(memberOf[e.to] ?? e.to, `edge ${e.from} to ${e.to}`);
    record(a, b, "flow", e.what, ex.id);
  }
  const src = nodeIdOf(ex.data.source);
  if (src && src !== "masque") {
    if (SOURCE_CATALOGUE[src]) usedSources.add(src);
    record(src, "masque", "data", "data", ex.id);
  }
}
for (const id of Object.keys(SOURCE_CATALOGUE).filter((s) => usedSources.has(s))) {
  const { purpose, near, side } = SOURCE_CATALOGUE[id];
  nodes.push({ id, kind: "source", purpose, near, side });
}

const textOf = (r) => {
  const all = [...r.whats.values()].flat();
  const exs = [...new Set(all)].sort();
  if (r.kind === "run") return `conductoR ran ${r.to} in ${listOf(exs)}.`;
  if (r.kind === "data") return `masque masked the data read from ${r.from}, in ${listOf(exs)}.`;
  return [...r.whats].map(([what, ids]) => `${cap(what)}, in ${listOf(ids.sort())}.`).join(" ");
};

/**
 * Package dependencies stated in each member's DESCRIPTION (checked
 * 2026-10-19), drawn from the package used to the package that uses it.
 */
const BUILD = [
  { from: "PESTO", to: "kernR", text: "kernR is built on PESTO (Imports)." },
  { from: "flexyBayes", to: "quorum", text: "quorum is built on flexyBayes (Imports)." },
  { from: "decideR", to: "grainPlan", text: "grainPlan is built on decideR (Imports)." },
  { from: "proxymix", to: "kernR", text: "kernR can use proxymix when it is installed (Suggests)." },
  { from: "proxymix", to: "cdzoo", text: "cdzoo can use proxymix when it is installed (Suggests)." },
  { from: "proxymix", to: "optimix", text: "optimix can use proxymix when it is installed (Suggests)." },
  { from: "kernR", to: "kalmix", text: "kalmix can use kernR when it is installed (Suggests)." },
  { from: "PESTO", to: "apsimR", text: "apsimR can use PESTO when it is installed (Suggests)." },
  { from: "optimix", to: "apsimR", text: "apsimR can use optimix when it is installed (Suggests)." },
  { from: "kernR", to: "quorum", text: "quorum can use kernR when it is installed (Suggests)." },
  { from: "PESTO", to: "quorum", text: "quorum can use PESTO when it is installed (Suggests)." },
  { from: "koine", to: "quorum", text: "quorum can use koine when it is installed (Suggests)." },
  { from: "PESTO", to: "conductoR", text: "conductoR can use PESTO when it is installed (Suggests)." },
  { from: "kernR", to: "janusplot", text: "janusplot can use kernR when it is installed (Suggests)." },
];

/**
 * Relations. kind: "flow" is a result handed from one package to another in
 * an example's run; "run" is conductoR running a package's step; "data" is
 * where an example's data came from; "build" is a dependency in DESCRIPTION.
 */
const drawn = [...recorded.values()].map((r) => ({ from: r.from, to: r.to, kind: r.kind, text: textOf(r) }));
// A hand-off from conductoR to a package it ran shares that line: one path, both texts.
for (const run of drawn.filter((e) => e.kind === "run")) {
  const same = drawn.find((e) => e.kind === "flow" && e.from === run.from && e.to === run.to);
  if (same) { run.text += ` ${same.text}`; drawn.splice(drawn.indexOf(same), 1); }
}
export const edges = [...drawn, ...BUILD.map((b) => ({ ...b, kind: "build" }))];

/** Members that write or read the shared format (roster of 2026-09-25). */
export const formatWriters = ["PESTO", "proxymix", "cdzoo", "optimix", "gpfield", "apsimR", "masque", "survkit"];
export const formatReaders = ["kernR", "flexyBayes", "decideR", "grainPlan", "conductoR"];

/** The worked example (E1), in the order of its plan; consecutive steps by one package are joined. */
export const workedExample = [];
for (const s of examples[0].compose.steps) {
  const id = nodeIdOf(s.member);
  const last = workedExample.at(-1);
  if (last && last.id === id) last.text += ` ${s.does}`;
  else workedExample.push({ id, text: s.does });
}
/** The example the worked example comes from. */
export const workedExampleSource = { id: examples[0].id, slug: examples[0].slug, title: examples[0].title };

/** Small drawings inside member nodes, in a 44 34 72 78 box; C stands for the section colour. */
export const motifs = {
  "catalogue": "<ellipse cx='80' cy='50' rx='24' ry='8' fill='none' stroke='currentColor' stroke-width='2.2'/><path d='M56 50 v40 a24 8 0 0 0 48 0 v-40' fill='none' stroke='currentColor' stroke-width='2.2'/><path d='M56 64 a24 8 0 0 0 48 0 M56 78 a24 8 0 0 0 48 0' fill='none' stroke='C' stroke-width='2.4'/>",
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
  "lattice": "<path d='M54 52 h52 v52 h-52 Z M80 52 v52 M54 78 h52' fill='none' stroke='currentColor' stroke-width='1.8'/><path d='M57 74 q10 -22 20 0' fill='none' stroke='C' stroke-width='2.4'/><path d='M83 100 q4 -16 20 -18' fill='none' stroke='C' stroke-width='2.4'/><path d='M57 100 l20 -16' stroke='currentColor' stroke-width='1.6' opacity='0.6'/><path d='M83 74 l20 -16' stroke='currentColor' stroke-width='1.6' opacity='0.6'/>",
  "curve": "<path d='M54 100 h52 M54 100 v-52' stroke='currentColor' stroke-width='1.8'/><path d='M54 50 h10 v10 h8 v8 h8 v12 h10 v10 h8 v8 h8' fill='none' stroke='C' stroke-width='2.8'/><path d='M54 50 h10 v10 h8 v8 h8 v12 h10 v10 h8 v8 h8 V100 H54 Z' fill='C' opacity='0.18'/><path d='M96 62 l4 4 l6 -8' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'/>"
};
