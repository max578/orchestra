// Number and message formatting shared by the example pages.
import alphabetTsv from "./examples/alphabet.tsv?raw";

const ok = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);

/** A number at a precision suited to its size; "not estimated" when absent. */
export function num(x: unknown): string {
  if (!ok(x)) return "not estimated";
  const a = Math.abs(x);
  if (a >= 1000) return Math.round(x).toLocaleString("en-AU");
  if (a >= 100) return x.toFixed(0);
  if (a >= 10) return x.toFixed(1);
  if (a >= 0.1 || a === 0) return x.toFixed(2);
  return String(Number(x.toPrecision(2)));
}
export const range = (lo: unknown, hi: unknown) => (ok(lo) && ok(hi) ? `${num(lo)} to ${num(hi)}` : "no interval");
export const withRange = (est: unknown, lo: unknown, hi: unknown) =>
  ok(est) ? `${num(est)} (${range(lo, hi)})` : "not estimated";
export const yesNo = (b: unknown) => (b === true ? "yes" : b === false ? "no" : "not recorded");
export const passFail = (b: unknown) => (b === true ? "passed" : b === false ? "failed" : "not recorded");
export const count = (x: unknown) => (ok(x) ? Math.round(x).toLocaleString("en-AU") : "not recorded");
export const pct = (x: unknown) => (ok(x) ? `${Math.round(x * 100)} per cent` : "not estimated");

/** Error types and their meanings (W1 alphabet.tsv). */
export const errorMeaning: Record<string, string> = Object.fromEntries(
  alphabetTsv.trim().split("\n").slice(1).map((l) => l.split("\t")).map(([k, v]) => [k.trim(), (v ?? "").trim()]),
);

/** One returned message, split into its lines: "stop", or "<step or trigger> <error or signal type>" per line. */
export function readMessage(message: string | string[]): { step: string; type: string; meaning: string }[] {
  return (Array.isArray(message) ? message : String(message).split(/\n|;/)).map((l) => l.trim()).filter(Boolean).map((l) => {
    if (l === "stop") return { step: "", type: "stop", meaning: "every step completed" };
    const [step, type = ""] = l.split(/\s+/);
    return { step, type, meaning: errorMeaning[type] ?? errorMeaning[`signal:${type}`] ?? "type not in the list" };
  });
}

/** The way a run ended, in plain words. */
export const returnWords: Record<string, string> = {
  results: "Every step completed and the agreement check passed, so the result was released.",
  revise: "The last round ended with steps still to revise, so no result was released.",
  discoveries: "Every step completed and the result was released, with patterns worth testing on other data.",
};

/** A second-loop verdict, in plain words. */
export const verdictWords: Record<string, string> = {
  supported: "supported",
  not_supported: "not supported",
  "not supported": "not supported",
  not_testable: "not testable on open data",
  "not testable on open data": "not testable on open data",
};

/** What a declared trigger does when it fires. */
export const actionWords: Record<string, string> = {
  branch: "runs an extra analysis written into the sealed plan",
  return: "sends the plan back for revision",
  release: "passes the finding to the next loop",
};
export const classWords: Record<string, string> = {
  anomaly: "something out of its expected range",
  candidate: "a possible discovery",
};
export const roundWords: Record<string, string> = {
  first: "First run of the sealed plan",
  issue: "Rerun after a failed step",
  signal: "Rerun after a declared pattern was seen",
};

/** A formal shape verdict, in plain words. */
export const shapeWords: Record<string, string> = {
  reverse_u: "rises then falls",
  u: "falls then rises",
  rise_plateau: "rises then levels off",
  monotone: "keeps rising or falling, with no turn",
  flat: "flat",
  not_testable: "cannot be told from these data",
};
/** The test behind a verdict, named simply. */
export function testWords(test: string): string {
  const t = String(test).toLowerCase();
  if (t.includes("two")) return "two-lines test: the slopes either side of a breakpoint have opposite signs";
  if (t.includes("end") || t.includes("lind")) return "end-slope test: the slopes at the two ends of the range have opposite signs";
  return String(test).replace(/_/g, " ");
}
