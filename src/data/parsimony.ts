// The parsimony evidence — grounded in the benchmark reports
// (extract/parsimony.json). Message: multi-tool BY DESIGN, but the system
// abstains rather than over-reach; and it states its own limit.

// leadership-≥3: every lead drives ≥3 members, so no study is single-tool by design
export const leadership = [
  { lead: "flexyBayes", members: 8 }, { lead: "kernR", members: 6 },
  { lead: "masque", members: 5 }, { lead: "proxymix", members: 5 },
  { lead: "PESTO", members: 4 },
  { lead: "kalmix", members: 4 }, { lead: "koine", members: 4 },
  { lead: "terroir", members: 4 },
];

// small-N: fraction "confident but wrong". Lower is better; abstaining beats bravado.
export const smallN = {
  cols: ["N ≈ 2–3", "N = 5", "N ≈ 8–13", "N ≈ 21–30", "abstains?"],
  rows: [
    { design: "naive t-test", cells: ["0.48–0.54", "0.36", "0.22–0.30", "0.18"], abstains: "never" },
    { design: "TACI (mechanism)", cells: ["0.48", "0.32", "0.30–0.40", "0.26"], abstains: "never" },
    { design: "synthetic control", cells: ["—", "0.50", "0.08–0.16", "0.06"], abstains: "yes" },
  ],
};

export const limit =
  "A stated limit, shown not hidden: TACI never abstained in the small-N " +
  "stress test — its gates guard identification quality, not data scarcity, " +
  "so at tiny N it is as confident-wrong as the naive test. The calibrated " +
  "design (synthetic control) abstains when its donors fail. A power-aware " +
  "scarcity gate for TACI is the next backlog item.";

export const ladder =
  "How few observations, by design: from N_treated = 1 (synthetic control — " +
  "proxymix donors + a kernR pre-fit gate, four ingredients) up to N ≈ 15–30 " +
  "for a kernel instrumental-variable design (weak-instrument fragile). The " +
  "right number of tools for the evidence — never more than needed.";
