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
    question: "Fit the multi-level model of yield across many trial environments that every study relies on, written in the model notation breeders already use.",
    outside: "brms, INLA or asreml called directly.",
    why: "None of these, used on its own, reads a model written in ASReml notation and fits it with free engines, refuses a model type an engine cannot fit faithfully, or writes its result in the shared result record that the other packages read. flexyBayes gives one way in to brms and INLA from that notation.",
    evidence: "Its estimated variety effects (best linear unbiased predictions, BLUPs) matched an independent fit by restricted maximum likelihood (REML) at r = 1.00. Declined correctly in the refusal check of 2026-09-02, in which every package was given one real case it should not answer.",
    method: "Uses existing engines (brms, INLA); adds the translation from ASReml notation and the refusal of models it cannot fit faithfully; passes results to the decision step in the shared result record.",
  },
  {
    id: "PESTO", tier: "core",
    question: "Work back from field observations to the crop-simulator settings that reproduce them, keeping a set of plausible settings that shows how uncertain they are.",
    outside: "PEST++ / pyEMU (Python tools that exchange data with the simulator through files).",
    why: "PESTO runs the same calibration method, an iterative ensemble smoother, directly in R, and writes the shared result record that the other packages read. It can drive the real PEST++ ensemble program (pestpp-ies) with bit-identical results. When the calibration problem is over-determined, it declines to answer and records why.",
    evidence: "Defines the shared result record (contract C2) that the other packages write; the check of 2026-09-02 that each package writes it correctly passed 26 of 26. Calibrated the crop-model stand-in in Study A0.",
    method: "Uses the iterative ensemble smoother family of methods; wraps PEST++ so it can be run from R; writes each set of plausible settings into the shared result record that every other package reads.",
  },
  {
    id: "kernR", tier: "core",
    question: "Do the field data agree with the crop model? At every site, this test decides whether the crop model's answer is used or rejected.",
    outside: "kernlab, dHSIC, energy: packages for kernel tests, which compare two sets of data without assuming a shape for either.",
    why: "kernR runs TACI (theory-anchored causal inference), a method in development and not yet published, which tests a process model's predictions against field data. We know of no other package that tests field data against a process model in this way.",
    evidence: "In Study A0 it rejected the crop model at the sites with the hidden subsoil constraint with sensitivity 0.58 and specificity 0.93. These rejections decide where the field-data fit replaces the crop model.",
    method: "Uses established kernel two-sample tests; TACI, which builds on them, is the orchestra's own.",
  },
  {
    id: "apsimR", tier: "core",
    question: "Bring the industry's crop model, APSIM Next Gen, into the analysis as a package that follows the same rules as the others.",
    outside: "apsimx (CRAN).",
    why: "apsimx runs APSIM. apsimR adds an agreed way for other packages to run the crop model and receive its output; a test bench of simulated experiments whose true effects are set in advance (an observing-system simulation experiment, OSSE), used to test cause-and-effect methods; results in the shared result record; and a recorded refusal when APSIM is not installed.",
    evidence: "In Study A0 it checks that APSIM is installed before the runs, which go through apsimx. It also provides a test bench of simulated experiments with a known treatment effect, used to score TACI, a method in development. Declined correctly in the refusal check of 2026-09-02, in which every package was given one real case it should not answer.",
    method: "Uses APSIM itself; fits it into the agreed way of working; the test bench is the orchestra's own.",
  },
  {
    id: "quorum", tier: "core",
    question: "Do the different analyses agree, and which answer is well enough supported to act on?",
    outside: "Code written by hand for each analysis to decide which method's answer to use, and flexyBayes's comparison of two analyses at a time.",
    why: "quorum compares any number of analyses, records which of them are independent of each other, and, when too few agree, declines to answer and says why. No outside tool asks which analysis's answer is well enough supported to act on.",
    evidence: "Reproduced, from the package, Study A0's result for the full sequence of packages: 2,960 against 5,818 AUD per hectare of summed loss. Its fast stand-in for the crop simulator made Study A0 affordable to run. Declined correctly in the refusal check of 2026-09-02, in which every package was given one real case it should not answer.",
    method: "Connects to the other packages' model-fitting functions; the way it reaches agreement and its record of which analyses are independent are the orchestra's own.",
  },
  {
    id: "terroir", tier: "core",
    question: "Every climate, soil and satellite figure the studies use, traced to its source, or refused.",
    outside: "nasapower, soilDB, elevatr called directly (terroir wraps these very packages).",
    why: "What terroir adds is record keeping, not new science. Every series carries its source and date and can be fetched again identically; each fact is logged with how it was checked; and a figure that cannot be traced is refused, with the reason recorded. The decision step will not price anything built on an unchecked fact, so it needs inputs that can refuse in this way.",
    evidence: "Declined correctly in the refusal check of 2026-09-02, in which every package was given one real case it should not answer. Values are checked against recorded real responses from each source. Connects to the ocular satellite-imagery package (September 2026).",
    method: "Brings free public data sources under one record of where each figure came from; adds nothing to their science and says so.",
  },
  {
    id: "masque", tier: "core",
    question: "Analyse data that cannot leave its owner: build the analysis on a synthetic copy that behaves like the real data, then run it on the real data where they are held.",
    outside: "synthpop, sdcMicro.",
    why: "masque records exactly how each copy was made, so the same analysis can be run again on the real data, and it has a mode that keeps the link between treatment and outcome intact. Without that link, a treatment effect estimated on the copy means nothing. Neither outside tool keeps it.",
    evidence: "A treatment effect of +5, set in advance, came through the copy as +5.14; copying each column separately gave +0.25.",
    method: "Uses copula-based synthesis, an established way to generate data that keeps the relationships between columns; keeping the treatment-outcome link and the record for rerunning on the real data are the orchestra's own.",
  },
  {
    id: "decideR", tier: "core",
    question: "Turn an estimate into a recommended action: the action with the lowest expected cost of being wrong, the value of one more test, or a refusal to price an estimate the field data have rejected.",
    outside: "No R package makes expected-value decisions that refuse to act on unchecked facts; the alternative is writing the cost calculations by hand.",
    why: "If any input fact has not been checked, decideR returns no rate. It reads the shared result record directly. Both rules were shown working in the live demonstration.",
    evidence: "In Study A0 the full sequence of packages lost 2,960 AUD/ha in total on the simulated region, against 5,818 for the crop model alone. In the live demonstration it refused to price a rejected estimate (log of 2026-09-02).",
    method: "Uses standard decision theory; the rule that an unchecked fact gets no price is the orchestra's own; turns shared result records into actions.",
  },
  {
    id: "grainPlan", tier: "core",
    question: "Give the grower a plan (nitrogen rate, variety, grade target) that respects every refusal made earlier in the analysis.",
    outside: "Proprietary agronomic calculators.",
    why: "grainPlan turns results into a plan and keeps track of where each figure came from. No outside calculator declines to answer, records the source of its inputs, or greys out a recommendation when the evidence behind it was refused.",
    evidence: "In the demonstration, when the crop model's estimate had been rejected, grainPlan declined to answer and no number reached the grower (log of 2026-09-02).",
    method: "Builds on decideR and only turns its results into a plan; it gathers in one place the grain value tables that the studies had been building by hand each time.",
  },
  {
    id: "gpfield", tier: "supporting",
    question: "Predict at the scale the decision needs: turn point samples into an average for a whole block, with the uncertainty that block average really carries.",
    outside: "gstat, INLA-SPDE, spaMM, DiceKriging.",
    why: "gpfield moves from points to blocks (a change of support) with the full calculation of prediction uncertainty, and declines to answer, with the reason, when the spatial correlation range or the block size will not support the prediction. A comparison study settled when to use gpfield and when to use kernR instead.",
    evidence: "A comparison study on a simulated field whose true block averages are known, with gstat as an independent third method. Declined correctly in the refusal check of 2026-09-02, in which every package was given one real case it should not answer.",
    method: "Uses Gaussian-process regression, an established method for spatial prediction; the recorded refusal and the shared result record are the orchestra's own.",
  },
  {
    id: "kalmix", tier: "supporting",
    question: "Follow a hidden quantity through a season of noisy measurements, and say, with evidence, when its behaviour changed.",
    outside: "KFAS, dlm, bsts, changepoint.",
    why: "kalmix declines to answer, and says why, when its model does not fit the data well enough; no outside filter does this. It also computes a measure of causal information, checked against the method authors' own MATLAB code.",
    evidence: "A comparison study checked against three references: a textbook Kalman filter, the true hidden values of a simulation, and a particle filter with 4,000 particles. Declined correctly in the refusal check of 2026-09-02, in which every package was given one real case it should not answer.",
    method: "Uses established state-space methods; the model-fit check and the checked causal-information measure are the orchestra's own.",
  },
  {
    id: "koine", tier: "supporting",
    question: "Check the Bayesian fit with an independent second method, restricted maximum likelihood (REML), and treat any disagreement as information.",
    outside: "lme4 / glmmTMB called directly.",
    why: "koine is not just another model-fitting package. It reports how far its answer differs from the Bayesian fit. Its results are exact for models with normally distributed errors; outside those models it declines to answer and says why.",
    evidence: "Estimated variety effects (BLUPs) matched a production REML fit at r = 1.00, and exact marginal values agreed to within 1.4e-14. Declined correctly in the refusal check of 2026-09-02, in which every package was given one real case it should not answer.",
    method: "Uses REML fitting; the agreed format for reporting agreement and disagreement is the orchestra's own.",
  },
  {
    id: "proxymix", tier: "supporting",
    question: "Summarise the full uncertainty of an estimate as a blend of a few bell curves (a Gaussian mixture), so it can be passed between analyses held in different places, and keep calculating with it after it has been shrunk.",
    outside: "mclust, mixtools.",
    why: "Packages that fit mixtures exist. What they lack is a set of operations on the summary itself (shift and rescale, update with a new observation, condition on a known value, filter through time), and shrinking to the closest possible summary, measured by Kullback-Leibler divergence, with the information lost stated.",
    evidence: "Three comparison studies set where proxymix is used rather than another package: tracking a quantity through time when extreme values are common, maps of good solutions from global optimisation, and the density-ratio estimates kernR uses. Its derived result records passed the shared-format check of 2026-09-02.",
    method: "Uses Gaussian mixtures; the set of operations on them is the orchestra's own. Co-developed with J. van der Hoek.",
  },
  {
    id: "optimix", tier: "supporting",
    question: "Send an optimisation problem to the best-suited solver, with every solver given the same budget; used to rank sites by the value of the next test and to search for trial designs.",
    outside: "optimx, nloptr, DEoptim, GenSA called directly.",
    why: "optimix adds no new mathematics. It gives one way to state a problem, a list of solvers to choose from, a race in which every solver gets the same number of evaluations, and a result record that says whether the answer is a single best point or a spread of good ones.",
    evidence: "A comparison study on problems whose best answers are known exactly, with an exhaustive search as an independent check; its results passed the check of 2026-09-02 that each package writes the shared result record correctly. Declined correctly in the refusal check of 2026-09-02, in which every package was given one real case it should not answer.",
    method: "Wraps existing efficient solvers; adds the common problem format and the flag for a single point versus a spread.",
  },
  {
    id: "cdzoo", tier: "supporting",
    question: "Work out which variables affect which, so an analysis knows what it must adjust for, and record where the methods disagree.",
    outside: "pcalg, bnlearn, causal-learn called directly.",
    why: "cdzoo runs sixteen published algorithms in one common format and recommends a structure with its reasons, rather than imposing one. When the true structure is unknown, nothing available at run time can confirm which algorithm is right, and cdzoo says so in its output.",
    evidence: "Its result record for causal structures passed the shared-format check of 2026-09-02. Declined correctly in the refusal check of 2026-09-02, in which every package was given one real case it should not answer.",
    method: "Uses causal-discovery tools from both R and Python; recommending rather than choosing for the user is the orchestra's own approach.",
  },
];

export const necessityById = new Map(necessity.map((n) => [n.id, n]));
