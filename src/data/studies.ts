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
    name: "A digital twin of a grain farm business (a computer model of the farm)",
    fixed: "variety (genotype), site",
    optimised: "management, environment and timing, and how they interact, within one season",
    style: "chooses actions by weighing costs and returns; anchored on a crop simulator, whose predictions are the baseline the field data are tested against; follows the season through time",
    causal: "do field results agree with what the crop simulator predicts for this treatment?",
  },
  B: {
    name: "Genomics and breeding",
    fixed: "management, and the range of environments",
    optimised: "genotype over breeding generations, across seasons",
    style: "prediction from statistical genetics: genomic best linear unbiased prediction (GBLUP), factor-analytic models of multi-environment trials, and reaction norms (how a line's performance changes along an environmental gradient)",
    causal: "which traits cause yield, and which gene variants (alleles) will matter as the climate shifts?",
  },
  C: {
    name: "Institutional: research investment",
    fixed: "the research and development portfolio",
    optimised: "where the next trial, the next programme, the next dollar goes",
    style: "what extra information is worth; working out cause and effect from observational data where no experiment was run; benefit–cost",
    causal: "did the investment cause the change, and where would the next one pay?",
  },
};

export const studies: Study[] = [
  {
    id: "A0", arm: "A", flagship: true, build: 1,
    title: "Nitrogen that pays, where it pays, and where to look next",
    question: "For each site and season, which nitrogen rate gives the highest expected profit after the cost of the nitrogen and its environmental cost, how confident can we be, and, where the model cannot be trusted, what is a soil test or a trial worth?",
    data: "Simulated: forty sites sampled across a real range of environments, five real seasons, six nitrogen rates and three varieties; yields come from the crop model, with soil nitrogen known and a hidden subsoil constraint at a third of the sites. Real counterpart: an approved barley multi-environment trial series (summary figures only) and a public maize trial.",
    chain: ["terroir", "apsimR", "PESTO", "kernR", "||", "flexyBayes", "triangulate", "decideR", "grainPlan"],
    insight: "The money is at the sites where the crop model is wrong: a simple recommendation loses money there, while the orchestra, which sets the crop model aside and decides from the field results using a method that can detect a yield plateau, loses about half as much across the simulated sites. The expected value of sample information (what a soil test or trial is worth before it is done) ranks where the next soil test or trial pays. Results: /a0.",
    value: ["$/ha", "kg nitrogen not applied", "t CO₂-e", "worth of a trial's information, $ per trial", "benefit–cost ratio"],
  },
  {
    id: "A1", arm: "A",
    title: "The malting window",
    question: "Which nitrogen and variety choices keep grain protein between the lower and upper limits of the grade band while keeping yield up, given that yield and protein trade off along an inverted-U curve?",
    data: "Simulated: a grain-quality table for 48 environments (protein, screenings, retention) with a known relationship built in. Real counterpart: an approved grain-quality trial theme (summary figures only).",
    chain: ["flexyBayes", "gpfield", "decideR", "grainPlan"],
    insight: "The premium is won or lost at the edge of the band, where a single best estimate says least and an estimate with its full range of uncertainty says most.",
    value: ["premium $/t captured", "tonnes downgraded"],
  },
  {
    id: "A2", arm: "A",
    title: "Sowing window in El Niño and La Niña years",
    question: "How far should the sowing window move in a forecast El Niño or La Niña season, and what does the move buy in frost and heat risk?",
    data: "Simulated: thirty years of daily weather set against the Oceanic Niño Index, with simulated runs over a range of sowing dates. Real counterpart: public climate indices and weather-station records.",
    chain: ["kalmix", "apsimR", "PESTO", "decideR", "grainPlan"],
    insight: "A measure of how much the current El Niño or La Niña state tells us about water stress later in the season, tracked through time, sets how many days to move the sowing window.",
    value: ["risk-adjusted yield", "window shift (days)"],
  },
  {
    id: "A3", arm: "A",
    title: "Carbon and nitrous oxide (N₂O) savings alongside profit",
    question: "How much cut in greenhouse emissions comes free with the nitrogen decision that maximises profit, and what difference does a carbon price make?",
    data: "A0's data, plus the simulator's outputs for emissions from soil nitrogen.",
    chain: ["apsimR", "PESTO", "decideR"],
    insight: "Putting a price on environmental cost moves the best nitrogen rate less than the crop model's errors do, where it moves it at all.",
    value: ["t CO₂-e avoided", "credit value $"],
  },
  {
    id: "A4", arm: "A",
    title: "Multi-environment trials analysed across owners who keep their own data",
    question: "How much is lost from the analysis when three data owners each analyse a synthetic copy of their data, instead of pooling the real rows?",
    data: "A0's data split across three owners, each releasing only a synthetic copy that keeps the structure of the real data.",
    chain: ["masque", "PESTO", "||", "flexyBayes", "round-trip"],
    insight: "The cost of each owner keeping their own data can be measured, and is often small, which is what makes the rest of the series usable in practice.",
    value: ["information lost compared with pooling", "rows never shared"],
  },
  {
    id: "A5", arm: "A",
    title: "In-season rolling update",
    question: "As observations arrive through the season, how should the plan update, and what is a mid-season decision worth?",
    data: "Measurements arriving through the season (rainfall, NDVI, a satellite measure of crop greenness, and tissue nitrogen) set against a season simulated forward from A0.",
    chain: ["terroir (ocular)", "kalmix", "PESTO", "kernR", "decideR", "grainPlan"],
    insight: "Two checks running together: a tracking filter follows the crop's state as measurements arrive, and a test that uses the crop simulator's predictions as the baseline decides whether the simulator still holds.",
    value: ["worth of keeping the option to top-dress", "worth of keeping the option to spray"],
  },
  {
    id: "B0", arm: "B", build: 2,
    title: "Which line, where — and under a 2040 climate",
    question: "Which breeding lines to advance for which environments, and which gene variants (alleles) gain value as the range of climates shifts?",
    data: "Simulated: three hundred lines in thirty environments, with five thousand genetic markers, known QTL (stretches of DNA linked to a trait), and differences between lines across environments driven by measured environmental conditions. Real counterpart: public national variety trials and classic multi-environment trial sets.",
    chain: ["terroir", "flexyBayes", "||", "koine", "triangulate", "gpfield", "decideR", "grainPlan"],
    insight: "Modelling how each line responds to real environmental measurements turns genomic prediction into selection for a future climate: the environments that separate good lines from poor ones today are not the ones that will do so in future.",
    value: ["genetic gain $/yr", "environments that separate lines", "adoption"],
  },
  {
    id: "B1", arm: "B",
    title: "Trait causal network to selection index",
    question: "Which traits cause yield, and which merely travel with it?",
    data: "Simulated: measurements of several traits (development timing, height, protein, yield, screenings) with a known cause-and-effect diagram, and genetic markers used to separate cause from mere correlation.",
    chain: ["cdzoo", "||", "kernR", "flexyBayes", "decideR"],
    insight: "A selection index built on the cause-and-effect diagram does not chase traits that move with yield without causing it, and the gap between the gain achieved and the gain predicted closes.",
    value: ["gain achieved vs gain predicted"],
  },
  {
    id: "B2", arm: "B",
    title: "Best layout for the next multi-environment trials",
    question: "Where, and how, should the next trial series be laid out to learn the most per plot?",
    data: "A range of possible designs across the environments covered by B0, each scored by what its information would be worth; candidate layouts come from an outside spatial-design tool.",
    chain: ["gpfield", "optimix", "decideR"],
    insight: "The same calculation of what information is worth, which ranks soil tests in A0, ranks trial sites here.",
    value: ["information per plot", "trials avoided"],
  },
  {
    id: "B3", arm: "B",
    title: "Crop-model-assisted genomic prediction",
    question: "Can the crop model's variety settings (cultivar parameters) be predicted from genomic data, and can the crop model then predict how lines perform in environments where they have not been tested?",
    data: "For each line, the simulator's variety settings worked back from observed results, then predicted for untested lines and run forward in new environments.",
    chain: ["apsimR", "PESTO", "flexyBayes", "apsimR", "kernR", "decideR"],
    insight: "Where the two arms meet: from genes to field performance, through the crop model.",
    value: ["prediction accuracy in untested environments"],
  },
  {
    id: "C0", arm: "C",
    title: "Trial placement",
    question: "Where should the next trial be funded?",
    data: "A0's map of what a soil test or trial is worth at each site, used on its own.",
    chain: ["PESTO", "decideR", "optimix"],
    insight: "Uncertainty becomes a map of where research pays.",
    value: ["worth of a trial's information, $ per trial"],
  },
  {
    id: "C1", arm: "C", build: 3,
    title: "Impact attribution of an extension programme",
    question: "Did the programme cause the change in practice and yield, and what did each dollar return?",
    data: "Simulated: records for five hundred farms over ten years, adopting at different times, with a known average effect of the programme on the farms that adopted it.",
    chain: ["bacipair", "||", "kalmix", "||", "cdzoo", "kernR", "decideR"],
    insight: "Three methods for working out cause and effect from observational data must agree before a benefit–cost ratio is reported.",
    value: ["benefit–cost ratio", "attributed yield change"],
  },
  {
    id: "C2", arm: "C",
    title: "R&D portfolio",
    question: "Which investments, in which order?",
    data: "The outputs of C0 and C1 as a portfolio.",
    chain: ["decideR", "optimix"],
    insight: "A ranked portfolio, with the cost of a wrong choice stated, and no answer given where the evidence is too thin to detect an effect.",
    value: ["portfolio return", "ranked investments"],
  },
];
