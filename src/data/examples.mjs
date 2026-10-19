// The four worked examples, read from src/data/examples/E{n}.json (written by
// scripts/sync_examples.mjs from each example's release folder). A missing
// file stops the build at these imports; a missing field stops it below.
import e1 from "./examples/E1.json" with { type: "json" };
import e2 from "./examples/E2.json" with { type: "json" };
import e3 from "./examples/E3.json" with { type: "json" };
import e4 from "./examples/E4.json" with { type: "json" };
import { validateExample } from "./examples_spec.mjs";

export const examples = [e1, e2, e3, e4];

const problems = examples.flatMap((ex, i) => validateExample(ex, `E${i + 1}`));
if (problems.length) throw new Error(`Example numbers incomplete:\n  ${problems.join("\n  ")}`);

/** True when the copied files are layout fixtures, not released results. */
export const usingFixtures = examples.some((ex) => ex._fixture === true);
if (usingFixtures && globalThis.process?.env?.ORCHESTRA_FIXTURES !== "1") {
  throw new Error("src/data/examples/ holds layout fixtures. Run scripts/sync_examples.mjs on the released files, " +
    "or set ORCHESTRA_FIXTURES=1 for a local layout build.");
}

export const exampleById = Object.fromEntries(examples.map((ex) => [ex.id, ex]));
