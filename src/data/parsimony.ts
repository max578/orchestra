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
  cols: ["N ≈ 2–3", "N = 5", "N ≈ 8–13", "N ≈ 21–30", "withholds a result?"],
  rows: [
    { design: "plain t-test", cells: ["0.48–0.54", "0.36", "0.22–0.30", "0.18"], abstains: "never" },
    { design: "TACI (mechanism check, in development)", cells: ["0.48", "0.32", "0.30–0.40", "0.26"], abstains: "never" },
    { design: "synthetic control", cells: ["—", "0.50", "0.08–0.16", "0.06"], abstains: "yes" },
  ],
};

export const limit =
  "TACI never withheld a result in the small-sample test. " +
  "Its checks ask whether the effect can be separated from other causes, not " +
  "whether there is enough data, so with very few observations it is about as " +
  "often confidently wrong as the plain t-test. A check for too " +
  "little data is the next planned addition to TACI.";

export const ladder =
  "How few observations each design can work with: from a single treated unit " +
  "(synthetic control, built from four ingredients including comparison units " +
  "from proxymix and a kernR check of the fit before treatment) up to N ≈ 15–30 " +
  "for a kernel instrumental-variable design, which is fragile when the " +
  "instrument is weak.";
