// Prose that belongs to one example and holds no numbers. Numbers come from
// the example's JSON (src/data/examples/E{n}.json).
export const notes: Record<string, { intro?: string[]; references?: string[] }> = {
  E1: {
    intro: [
      "Some National Variety Trial (NVT) sites sow wheat twice in a season, in two trials side by side: an Early " +
        "series ahead of the usual sowing window and the Main series within it. Because both trials share the " +
        "paddock, the season and the varieties, comparing them shows what an earlier sowing date does to yield " +
        "with most other influences held fixed.",
      "An Early and a Main trial of the same season on the same paddock form a pair. Each variety grown in both " +
        "trials of a pair gives one difference, Early yield minus Main yield.",
    ],
    references: [
      "ABARES (2026). Agricultural commodities: September quarter 2026, statistical tables, Table 6. Australian Bureau of Agricultural and Resource Economics and Sciences.",
      "Hernán, M. A., & Robins, J. M. (2020). Causal inference: What if. Chapman & Hall/CRC.",
      "Newman, S. J., & Furbank, R. T. (2021). A multiple species, continent-wide, million-phenotype agronomic plant dataset. Scientific Data, 8, 116. https://doi.org/10.1038/s41597-021-00898-8 (author correction: Scientific Data, 9, 437, 2022).",
      "Sparks, A. (2026). read.abares: Read data from ABARES and ABS (R package version 3.0.0). https://docs.ropensci.org/read.abares/",
      "The VSNi Team (2026). asreml: Fits linear mixed models using REML (R package version 4.2.0.482). VSN International.",
    ],
  },
};
