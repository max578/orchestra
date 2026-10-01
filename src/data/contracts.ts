// Grounded C1–C7 registry + the two epistemic operators — from
// extract/contracts.json (0 hallucinations vs ORCHESTRA.md + oap_spec).
export interface Contract {
  id: string; name: string; kind: "interface" | "data";
  owner: string; consumers: string; note?: string;
}
export const contracts: Contract[] = [
  { id: "C1", name: "backend_contract", kind: "interface", owner: "flexyBayes",
    consumers: "INLA · brms · koine" },
  { id: "C2", name: "pesto_ensemble_manifest", kind: "data", owner: "PESTO",
    consumers: "kernR (live) · flexyBayes (planned)", note: "the core manifest format" },
  { id: "C3", name: "koine_pass / koine_result", kind: "data", owner: "koine",
    consumers: "flexyBayes" },
  { id: "C4", name: "fb_log_posterior / posterior_proxy", kind: "interface", owner: "flexyBayes",
    consumers: "proxymix · kernR", note: "in development" },
  { id: "C5", name: "ensemble_source / fb_ensemble", kind: "data", owner: "flexyBayes",
    consumers: "flexyBayes (self-ingest) — producers: PESTO · apsimx · file" },
  { id: "C6", name: "geo_point_series", kind: "data", owner: "terroir",
    consumers: "flexyBayes · kernR · PESTO" },
  { id: "C7", name: "surrogate / fb_surrogate", kind: "interface", owner: "flexyBayes",
    consumers: "flexyBayes — conformers PESTO (gp) · kernR (cme)" },
];

export const operators = [
  { name: "abstain_gate",
    what: "Reads the summary in one earlier step's manifest, then passes the result on or withholds it, and records why in a manifest of its own.",
    when: "it withholds when the previous step has already flagged a problem; or no effect was found and the effective sample size is below 25; or no effect was found and the approximate z-statistic is below 2 (too little data to detect an effect); or any declared minimum for identifying the effect is not met.",
    modesLabel: "options",
    modes: "flag the result, stop the analysis, or switch to a different method" },
  { name: "triangulate",
    what: "Combines the verdicts of several packages into one shared decision: when they agree, each supports the other; when they split, the split is flagged, never averaged.",
    when: "several packages have given verdicts. The possible outcomes are an effect confirmed by more than one method; no effect, confirmed by more than one method; an effect seen by one method only; no effect, seen by one method only; methods disagree (flagged); or no result.",
    modesLabel: "use",
    modes: "when two or more methods address the same question" },
];

export const typedEdge =
  "Before a package runs, the result it receives is checked three ways: it must " +
  "be a manifest; its version and a fresh checksum of its contents must match " +
  "what was recorded; and the question it answers must be the one this " +
  "connection was declared to carry. If any check fails, the run stops with an " +
  "error rather than quietly converting the result.";
