// Vacant places — grounded in extract/gaps_external.json (deep-research,
// adversarially verified). 4 filled (with the licence caveat that matters
// for wrapping), 3 OPEN, stated plainly. Never present an open gap as filled.
export interface FilledGap {
  gap: string; use: string; tool: string; licence: string; caveat: string;
}
export const filled: FilledGap[] = [
  { gap: "Compositional / simplex", use: "soil texture, nutrient & species composition",
    tool: "DirichletReg (regression) · robCompositions (maintained backbone)", licence: "GPL-2 | GPL-3",
    caveat: "No compositional package advertises calibrated UQ — the orchestra's abstention layer would supply the intervals." },
  { gap: "Extreme-value", use: "frost / heat / rainfall extremes, climate tail risk",
    tool: "extRemes", licence: "GPL",
    caveat: "Clean fit: non-stationary covariates on all GEV/GPD parameters + a full return-level UQ suite." },
  { gap: "Over-dispersed counts", use: "insect & disease-lesion counts (Conway-Maxwell-Poisson)",
    tool: "glmmTMB (mixed-effects) · mpcmp (GLM-only)", licence: "glmmTMB = AGPL-3 — flagged",
    caveat: "AGPL-3 is stricter than the orchestra's default; a licence-compatibility check is required before wrapping. mpcmp is the lighter alternative." },
  { gap: "Quantile / distributional", use: "yield-quantile, full-distribution response",
    tool: "qgam", licence: "GPL",
    caveat: "Fast calibrated additive quantile regression on the mgcv framework — agricultural-covariate smooths are natural." },
];

export interface OpenGap { gap: string; use: string; note: string }
export const open: OpenGap[] = [
  { gap: "Functional-data responses", use: "hyperspectral / NDVI & growth curves",
    note: "No tool survived verification yet — a dedicated pass is queued. Shown open, not guessed." },
  { gap: "Causal panel / design", use: "difference-in-differences, RD, IV, mediation",
    note: "No external tool verified. The orchestra already has bacipair (candidate) + cdzoo in this space." },
  { gap: "Interval-censored / cure survival", use: "survival edge cases beyond Cox",
    note: "No tool survived verification yet — the survkit candidate's frontier." },
];
