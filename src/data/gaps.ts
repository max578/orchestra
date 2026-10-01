// Vacant places — grounded in extract/gaps_external.json (deep-research,
// adversarially verified). 4 filled (with the licence caveat that matters
// for wrapping), 3 OPEN, stated plainly. Never present an open gap as filled.
export interface FilledGap {
  gap: string; use: string; tool: string; licence: string; caveat: string;
}
export const filled: FilledGap[] = [
  { gap: "Compositional data (parts of a whole)", use: "soil texture, nutrient and species composition",
    tool: "DirichletReg (regression) · robCompositions (actively maintained core)", licence: "GPL-2 | GPL-3",
    caveat: "No package for compositional data claims well-calibrated uncertainty ranges; the orchestra's own checks would supply the intervals." },
  { gap: "Extreme values", use: "frost, heat and rainfall extremes; climate tail risk",
    tool: "extRemes", licence: "GPL",
    caveat: "A clean fit: variables that change over time can enter every parameter of the extreme-value distributions (GEV and GPD), and it gives a full set of uncertainty ranges for return levels, such as the size of a 1-in-100-year event." },
  { gap: "Counts more variable than usual (over-dispersed)", use: "insect and disease-lesion counts (Conway-Maxwell-Poisson)",
    tool: "glmmTMB (mixed-effects) · mpcmp (GLM only)", licence: "glmmTMB: AGPL-3, needs a licence check",
    caveat: "AGPL-3 is stricter than the orchestra's default licence, so compatibility must be checked before the orchestra calls it. mpcmp is the lighter alternative." },
  { gap: "Quantiles and whole distributions", use: "yield quantiles, the full distribution of a response",
    tool: "qgam", licence: "GPL",
    caveat: "Fast, calibrated additive quantile regression built on the mgcv package; smooth effects of agricultural variables fit naturally." },
];

export interface OpenGap { gap: string; use: string; note: string }
export const open: OpenGap[] = [
  { gap: "Responses that are curves (functional data)", use: "hyperspectral readings, NDVI and growth curves",
    note: "No tool has passed checking yet; a dedicated search is planned. Shown as open rather than guessed." },
  { gap: "Causal study designs", use: "difference-in-differences, regression discontinuity, instrumental variables, mediation",
    note: "No outside tool checked yet. The orchestra already has bacipair (under review) and cdzoo in this area." },
  { gap: "Survival with interval-censored times or a cured fraction", use: "survival cases beyond the standard Cox model",
    note: "No tool has passed checking yet; this is the area the survkit package (under review) is moving into." },
];
