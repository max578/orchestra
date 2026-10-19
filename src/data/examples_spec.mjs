// The fields every example's site_numbers.json must carry (W1 SPEC, 2026-10-19,
// with addendum 1: return, lenses, agreement, discoveries; addendum 2: triggers, rounds; addendum 3 and 3a: shapes).
// Used by scripts/sync_examples.mjs before copying and by src/data/examples.mjs
// at build time, so a page never renders with a number missing.

export const EXAMPLE_IDS = ["E1", "E2", "E3", "E4"];

/** Required paths. "[]" marks an array whose items need the listed keys. */
export const REQUIRED = {
  "": ["id", "slug", "title", "question", "data", "mask", "compose", "rehearsal", "real_run", "result",
    "refusals", "by_solutions", "versions", "files", "return", "lenses", "agreement", "discoveries",
    "triggers", "rounds", "shapes"],
  data: ["name", "source", "citation", "licence", "url", "n_rows", "n_units", "unit_label", "period", "place"],
  mask: ["masque_version", "n_rows_real", "n_rows_clone", "roles", "coordinates_jittered", "audit"],
  "mask.audit[]": ["check", "value", "pass"],
  compose: ["n_clone_runs", "plan_hash", "n_steps", "members", "steps", "edges"],
  "compose.steps[]": ["id", "member", "does"],
  "compose.edges[]": ["from", "to", "what"],
  rehearsal: ["planted_effect", "tolerance", "recovered", "recovered_lo", "recovered_hi", "pass",
    "null_estimate", "null_lo", "null_hi", "null_pass"],
  real_run: ["date", "n_rounds", "messages", "plan_hash", "plan_hash_matches_seal"],
  "real_run.messages[]": ["round", "message"],
  result: ["estimand", "estimate", "lo", "hi", "interval_label", "unit", "refused", "refusal_reason", "extra"],
  "refusals[]": ["step", "reason"],
  "by_solutions[]": ["what", "consequence"],
  "lenses[]": ["lens", "member", "estimate", "lo", "hi", "planted_pass", "null_pass"],
  agreement: ["rule", "verdict"],
  "triggers[]": ["trigger_id", "class", "signal_type", "what", "threshold_label", "action", "rehearsal_fired",
    "rehearsal_silent", "fired_real", "round"],
  "rounds[]": ["round", "reason", "lines"],
  "shapes[]": ["x", "y", "form_selected", "turning_point", "tp_lo", "tp_hi", "test", "verdict", "screen_label"],
  "discoveries[]": ["statement", "found_by", "loop2_dataset", "loop2_verdict", "loop2_estimate", "loop2_lo", "loop2_hi"],
};

/** Formal shape verdicts (addendum 3). */
export const VERDICTS = ["reverse_u", "u", "rise_plateau", "monotone", "flat", "not_testable"];

/** The three ways a run on the real data can end. */
export const RETURNS = ["results", "revise", "discoveries"];

const get = (obj, path) => path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);

/** Every missing field, as "E2: rehearsal.null_lo". An empty list means the file is complete. */
export function validateExample(ex, label) {
  const out = [];
  if (ex == null || typeof ex !== "object") return [`${label}: not a JSON object`];
  for (const [path, keys] of Object.entries(REQUIRED)) {
    const isArr = path.endsWith("[]");
    const base = isArr ? path.slice(0, -2) : path;
    const node = base === "" ? ex : get(ex, base);
    if (node === undefined) continue; // reported by its parent
    const items = isArr ? (Array.isArray(node) ? node : null) : [node];
    if (items === null) { out.push(`${label}: ${base} is not an array`); continue; }
    items.forEach((it, i) => {
      for (const k of keys) {
        if (it == null || !(k in it)) out.push(`${label}: ${base}${isArr ? `[${i}]` : ""}${base ? "." : ""}${k} is missing`);
      }
    });
  }
  if (ex.id !== undefined && ex.id !== label) out.push(`${label}: id is "${ex.id}"`);
  if (ex.return !== undefined && !RETURNS.includes(ex.return)) out.push(`${label}: return is "${ex.return}", not one of ${RETURNS.join(", ")}`);
  (Array.isArray(ex.shapes) ? ex.shapes : []).forEach((s, i) => {
    if (s && s.verdict !== undefined && !VERDICTS.includes(s.verdict)) out.push(`${label}: shapes[${i}].verdict is "${s.verdict}", not one of ${VERDICTS.join(", ")}`);
  });
  if (typeof ex.slug === "string" && !/^[a-z0-9-]+$/.test(ex.slug)) out.push(`${label}: slug "${ex.slug}" is not lower-case letters, digits and hyphens`);
  return out;
}
