// The study series — two arms and an institutional third. Sourced from
// ORCHESTRA_dev/plan/study_series_v0.1.md (2026-08-25). No version numbers,
// no sovereign data values, no per-site results: this page states the
// questions, the configurations and the value axes, not findings.
export type Arm = "A" | "B" | "C";

export interface Study {
  id: string;
  arm: Arm;
  title: string;
  question: string;
  data: string;        // hypothetical generator + real twin, in one line
  chain: string[];     // member chain, in order; "||" marks a parallel lens
  insight: string;
  value: string[];     // value axes
  flagship?: boolean;
  build?: number;      // build order where scheduled
}

export const arms: Record<Arm, { name: string; fixed: string; optimised: string; style: string; causal: string }> = {
  A: {
    name: "Digital twin of a grain enterprise",
    fixed: "genotype, site",
    optimised: "management × environment × time, within a season",
    style: "decision-theoretic, mechanism-anchored (the crop simulator is the null source), temporal",
    causal: "does the field agree with the mechanism under this treatment?",
  },
  B: {
    name: "Genomic horizons",
    fixed: "management, environment envelope",
    optimised: "genotype × generations, across seasons",
    style: "prediction-theoretic, statistical-genetic (GBLUP, factor-analytic MET, reaction norms)",
    causal: "which traits cause yield, and which alleles will matter under a shifted climate?",
  },
  C: {
    name: "Institutional",
    fixed: "the R&D portfolio",
    optimised: "where the next trial, the next programme, the next dollar goes",
    style: "value of information, quasi-experimental attribution, benefit–cost",
    causal: "did the investment cause the change, and where would the next one pay?",
  },
};

export const studies: Study[] = [
  {
    id: "A0", arm: "A", flagship: true, build: 1,
    title: "N that pays, where it pays — and where to look next",
    question: "For each site-season, which nitrogen rate maximises expected profit net of nitrogen and environmental cost, how confident can we be, and where the model cannot be trusted, what is a soil test or a trial worth?",
    data: "Hypothetical: forty sites sampled across a real environment space, five real seasons, six N rates, three varieties; yields simulated by the crop model with known soil nitrogen and a hidden subsoil constraint at a third of sites. Twin: an approved barley multi-environment trial series (aggregates only) and a public maize trial.",
    chain: ["terroir", "apsimR", "PESTO", "kernR", "||", "flexyBayes", "triangulate", "decideR", "grainPlan"],
    insight: "The money is at the sites where the mechanism is wrong: a naive recommendation loses there, the orchestra abstains to the default and loses less. The value of sample information ranks where the next soil test or trial pays.",
    value: ["$/ha", "kg N not applied", "t CO₂-e", "EVSI $ per trial", "benefit–cost ratio"],
  },
  {
    id: "A1", arm: "A",
    title: "The malting window",
    question: "Which nitrogen and variety choices keep protein inside a two-sided grade band while holding yield on the reverse-U yield–protein surface?",
    data: "Hypothetical: a 48-environment grain-quality table (protein, screenings, retention) with a known surface. Twin: an approved grain-quality trial theme (aggregates only).",
    chain: ["flexyBayes", "gpfield", "effectsurf", "decideR", "grainPlan"],
    insight: "The premium is captured or lost at the band edge, where a point estimate is least informative and a posterior is most.",
    value: ["premium $/t captured", "tonnes downgraded"],
  },
  {
    id: "A2", arm: "A",
    title: "Sowing window under ENSO",
    question: "How far should the sowing window move in a forecast El Niño or La Niña season, and what does the move buy in frost and heat risk?",
    data: "Hypothetical: thirty years of daily weather against the Oceanic Niño Index with simulated sowing sweeps. Twin: public climate indices and station records.",
    chain: ["kalmix", "apsimR", "PESTO", "decideR", "grainPlan"],
    insight: "Assimilative causal information from the ENSO state to in-season water stress, resolved in time, sets the window shift in days.",
    value: ["risk-adjusted yield", "window shift (days)"],
  },
  {
    id: "A3", arm: "A",
    title: "Carbon and N₂O co-benefit",
    question: "What abatement rides for free on a profit-optimal nitrogen decision, and what does a carbon price change?",
    data: "A0's data with the simulator's soil-nitrogen emission outputs.",
    chain: ["apsimR", "PESTO", "decideR"],
    insight: "The environmental shadow price moves the optimum less than the mechanism gap does — where it moves it at all.",
    value: ["t CO₂-e abated", "credit value $"],
  },
  {
    id: "A4", arm: "A",
    title: "Sovereign federated MET",
    question: "How much inference is lost when three owners analyse faithful synthetic clones instead of pooling the real rows?",
    data: "A0's data partitioned across three owners, each releasing only a structurally faithful clone.",
    chain: ["masque", "PESTO", "||", "flexyBayes", "round-trip"],
    insight: "The price of sovereignty is measurable, and often small — which is what makes the rest of the series deployable.",
    value: ["information loss vs pooled", "rows never shared"],
  },
  {
    id: "A5", arm: "A",
    title: "In-season rolling update",
    question: "As observations arrive through the season, how should the plan update, and what is a mid-season decision worth?",
    data: "Streaming covariates (rainfall, NDVI, tissue nitrogen) against a season simulated forward from A0.",
    chain: ["terroir", "kalmix", "PESTO", "kernR", "decideR", "grainPlan"],
    insight: "Dual-resolution causal monitoring: the state-space filter tracks, the simulator-as-null test decides whether the mechanism still holds.",
    value: ["option value of top-dressing", "option value of a spray"],
  },
  {
    id: "B0", arm: "B", build: 2,
    title: "Which line, where — and under a 2040 climate",
    question: "Which lines to advance for which environments, and which alleles gain value as the climate envelope shifts?",
    data: "Hypothetical: three hundred lines in thirty environments with five thousand markers, known QTL, and genotype-by-environment driven by environmental covariates. Twin: public national variety trials and classic multi-environment sets.",
    chain: ["terroir", "flexyBayes", "||", "koine", "triangulate", "gpfield", "effectsurf", "decideR", "grainPlan"],
    insight: "Reaction norms on real covariates turn genomic prediction into climate-forward selection: the environments that discriminate today are not the ones that will.",
    value: ["genetic gain $/yr", "environments that discriminate", "adoption"],
  },
  {
    id: "B1", arm: "B",
    title: "Trait causal network to selection index",
    question: "Which traits cause yield, and which merely travel with it?",
    data: "Hypothetical: multi-trait phenotypes (phenology, height, protein, yield, screenings) with a known causal graph and markers as instruments.",
    chain: ["cdzoo", "||", "kernR", "flexyBayes", "effectsurf", "decideR"],
    insight: "An index built on the causal graph does not chase correlated, non-causal traits; the gap between realised and predicted gain closes.",
    value: ["realised vs predicted gain"],
  },
  {
    id: "B2", arm: "B",
    title: "Optimal MET design",
    question: "Where, and how, should the next trial series be laid out to learn the most per plot?",
    data: "A design space over the environment envelope of B0, scored by value of information.",
    chain: ["speed2", "gpfield", "optimix", "decideR"],
    insight: "The same value-of-information layer that ranks soil tests in A0 ranks trial sites here.",
    value: ["information per plot", "trials avoided"],
  },
  {
    id: "B3", arm: "B",
    title: "Crop-model-assisted genomic prediction",
    question: "Can cultivar parameters of the crop model be predicted genomically, and does the mechanism then predict genotype-by-environment in unseen environments?",
    data: "Per-line inversions of the simulator's cultivar parameters, predicted for untested lines and pushed forward into new environments.",
    chain: ["apsimR", "PESTO", "flexyBayes", "apsimR", "kernR", "decideR"],
    insight: "The meeting point of the two arms: genotype to phenotype through mechanism.",
    value: ["prediction accuracy in untested environments"],
  },
  {
    id: "C0", arm: "C",
    title: "Trial placement",
    question: "Where should the next trial be funded?",
    data: "A0's value-of-sample-information map as a stand-alone instrument.",
    chain: ["PESTO", "decideR", "optimix"],
    insight: "Uncertainty becomes a map of where research pays.",
    value: ["EVSI $ per trial"],
  },
  {
    id: "C1", arm: "C", build: 3,
    title: "Impact attribution of an extension programme",
    question: "Did the programme cause the change in practice and yield, and what did each dollar return?",
    data: "Hypothetical: a five-hundred-farm, ten-year panel with staggered adoption and a known average treatment effect on the treated.",
    chain: ["bacipair", "||", "kalmix", "||", "cdzoo", "kernR", "decideR"],
    insight: "Three quasi-experimental lenses that must agree before a benefit–cost ratio is reported.",
    value: ["benefit–cost ratio", "attributed yield change"],
  },
  {
    id: "C2", arm: "C",
    title: "R&D portfolio",
    question: "Which investments, in which order?",
    data: "The outputs of C0 and C1 as a portfolio.",
    chain: ["decideR", "optimix"],
    insight: "A ranked portfolio under explicit loss, with abstention where the evidence is under-powered.",
    value: ["portfolio return", "ranked investments"],
  },
];
