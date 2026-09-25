// Grounded C1–C7 registry + the two epistemic operators — from
// extract/contracts.json (0 hallucinations vs ORCHESTRA.md + oap_spec).
export interface Contract {
  id: string; name: string; kind: "interface" | "data";
  owner: string; consumers: string; note?: string;
}
export const contracts: Contract[] = [
  { id: "C1", name: "backend_contract", kind: "interface", owner: "flexyBayes",
    consumers: "greta · INLA · brms · koine" },
  { id: "C2", name: "pesto_ensemble_manifest", kind: "data", owner: "PESTO",
    consumers: "kernR (live) · flexyBayes (planned)", note: "the manifest spine" },
  { id: "C3", name: "koine_pass / koine_result", kind: "data", owner: "koine",
    consumers: "flexyBayes" },
  { id: "C4", name: "fb_log_posterior / posterior_proxy", kind: "interface", owner: "flexyBayes",
    consumers: "proxymix · kernR", note: "seam CLOSED end-to-end; greta is the real producer, brms/INLA abstain" },
  { id: "C5", name: "ensemble_source / fb_ensemble", kind: "data", owner: "flexyBayes",
    consumers: "flexyBayes (self-ingest) — producers: PESTO · apsimx · file" },
  { id: "C6", name: "geo_point_series", kind: "data", owner: "terroir",
    consumers: "flexyBayes · kernR · PESTO" },
  { id: "C7", name: "surrogate / fb_surrogate", kind: "interface", owner: "flexyBayes",
    consumers: "flexyBayes — conformers PESTO (gp) · kernR (cme)" },
];

export const operators = [
  { name: "abstain_gate",
    what: "Reads one upstream manifest's typed summary and decides pass vs abstain, emitting a decisions manifest.",
    when: "self-flagged abstain · OR (no effect AND n < 25 ESS floor) · OR (no effect AND power proxy z < 2) · OR any declared identification floor violated.",
    modes: "flag · halt-branch · reroute" },
  { name: "triangulate",
    what: "Reconciles N member verdicts into one consensus decisions manifest — agreement corroborates, a split is flagged (never averaged).",
    when: "verdicts: causal_effect_corroborated · no_effect_corroborated · single_lens_effect · single_lens_no_effect · disagreement_flagged · abstain.",
    modes: "same-question (≥2 lenses) or cross-lens" },
];

export const typedEdge =
  "Before any node runs, the upstream object must be an orchestra_manifest, " +
  "pass consume_manifest() (version + payload-integrity re-hash), and its " +
  "inferential_target must equal the edge's declared contract — else a hard " +
  "TYPED-EDGE VIOLATION, never a silent coercion.";
