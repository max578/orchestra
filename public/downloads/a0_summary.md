# Study A0 -- N that pays, where it pays, and where to look next

**One page, v0.2, generated 2026-08-26 12:59 ACST by `studies/A0/08_poster_figure.R`.** Every number is read from a chain artefact; the binding table is `output/poster_numbers.csv`; the full bound report is `REPORT.md`.

## The question

For each site-season of a barley belt, which nitrogen rate maximises expected profit net of nitrogen and its nitrous-oxide cost, how confident can we be, where should the crop model be refused, and what is one soil test or one strip trial worth at each site?

## The set-up

- **Synthetic Barley Belt**: 40 sites on real eastern- and western-Australian grain-belt coordinates with real climate (NASA POWER) and soil (SoilGrids), 5 seasons, 6 N rates x 3 varieties x 3 replicates, yields from APSIM Next Gen. At 12 sites a **hidden subsoil constraint** caps yield and flattens the response above 60 kg N/ha; the simulator used for inversion is never told.
- **The orchestra chain**: apsimR (truth) -> flexyBayesOrchestra surrogate + PESTO inversion (mechanism lens) -> kernR TACI (does the field agree with the mechanism?) -> a plateau-capable field-record lens (brms) where TACI refuses -> decideR (loss, EVPI, EVSI) -> optimix (which sites to test) -> grainPlan (the grower-facing plan). Each hand-off is a typed result record; each refusal is typed and read downstream.
- **Independent oracles in every stage** (7 of them; 5 pass, and the 2 that fail are reported as failures in `REPORT.md` section 7).

## Three numbers

1. **2,960 vs 5,818 AUD/ha.** Summed realised loss against the planted truth, orchestra cascade vs the naive mechanism-only arm, over 198 decision cells: **49 per cent less loss**. At the 60 constrained cells the cascade loses 27.0 AUD/ha per site-season against the naive arm's 75.2; at the unconstrained cells 9.7 vs 9.5. The result reproduces on a re-seeded belt (2,549 vs 5,002).
2. **1,440 kg N not applied and 6.2 t CO2-e/ha avoided** (summed over the belt) relative to the naive arm, because the field record locates the plateau the mechanism cannot see: the posterior interval of the plateau onset contains the planted 60 kg N/ha at 12 of 12 constrained sites (median onset 67 vs 97 kg N/ha at unconstrained sites). TACI's refusal of the mechanism has sensitivity 0.58 and specificity 0.93.
3. **EVSI map.** 40 of 40 sites priced for the value of one soil nitrate test or one N-rate strip trial; the top site (S33) is worth 164 AUD/ha. Directional, not calibrated: the importance-weighted EVSI is ESS-limited at this posterior size, and the information prices are `[unverified]`.

## What it is not

A controlled recovery exercise on a synthetic belt, not a real one; the shape conclusions have real-data cover (the belt's N-response slopes partially bracket a real barley MET, `REPORT.md` section 8), the magnitudes do not. The plateau-onset separation between constrained and unconstrained sites fails its own stated gate (AUC 0.86 against 0.9) because unconstrained sites plateau too; the decision value, not the onset, is what carries.

## Where to look next

A0 v0.2 closes the digital-twin flagship's first question. Next in the series: B0 (climate-forward genomic selection) and C1 (impact attribution); on A0 itself, a conjugate fast path for EVSI in decideR and a plateau formula inside flexyBayes (uplift FB-07) so the lens is a package verb, not a study script.

