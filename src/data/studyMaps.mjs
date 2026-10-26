// The two studies the introduction's map can show, one at a time. Each arrow is a hand-over that the study's own
// records show, with its source (file:line) beside it; nothing here is inferred from a package's purpose.
//   BT1 Q3, nitrogen topdressing: ORCHESTRA_dev/studies/BT1/Q3_npay/sealed/{plan.R, tools.R} (sealed 2026-10-26).
//   C2, sowing time: ORCHESTRA_dev/studies/C2/ (plan scripts r_code_14 and r_code_19, tools_C2_v1.2.R, stage scripts,
//   report_C2_v5.md).
// conductoR sits at the centre and has no arrows. Outside packages (asreml, apsimx, dagitty) are named in the step text
// and not drawn. kind "handover": a result or data table read by the next package; kind "inside": ran inside a step.
// via: waypoints [radius from the centre, degrees clockwise from east], drawn as one smooth curve that leaves and meets
// each circle facing its nearest waypoint. Neighbours are joined in the lane between the section labels (radius 208)
// and the circles (inner edge 270); longer hops cross the empty interior and pass radius 208 between labels where they
// can. out/into (degrees, screen) fix where an arrow leaves or meets a circle, so arrows sharing one fan out.

/** Ring order for both study maps: as the poster, except that the statistics band reads janusplot, flexyBayes,
 * koine, quorum, survkit, so that no arrow has to cross another to reach quorum (poster order: koine, janusplot,
 * flexyBayes, quorum, survkit). */
export const studyOrder = ["masque", "terroir", "apsimR", "PESTO", "cdzoo", "bacipair", "kalmix", "kernR", "gpfield",
  "janusplot", "flexyBayes", "koine", "quorum", "survkit", "decideR", "grainPlan", "optimix", "proxymix"];

export const studies = [
  {
    id: "sowing",
    label: "Does wheat sown earlier yield more?",
    note: "Open data",
    page: "/examples/sowing-time",
    steps: [
      // r_code_01_pairs_v1_10Oct2026.R:2,9-11 (pair table from DataHub's holding of the open trial records);
      // sowing-time page: 205 pairs at 46 sites
      { ids: ["DataHub"], text: "DataHub supplies the open trial records compiled by Newman and Furbank (2021). From them, an Early and a Main trial sown on the same paddock in the same season form a pair: 205 pairs, fixed before any yield was read." },
      // r_code_20_kernR_v1.6a_13Oct2026.R:2-3,13 (kernR balance test, Early against Main, incl. N applied by sowing)
      { ids: ["kernR"], text: "{kernR} checks that Early and Main trials were alike before sowing, including the nitrogen applied by sowing day." },
      // r_code_22_cdzoo_v1.6b_13Oct2026.R:2,7-8; report_C2_v5.md:46-50,152-181
      { ids: ["cdzoo"], text: "{cdzoo} looks for what sets the sowing date from the data alone, as a check on the causal diagram." },
      // r_code_13_pesto_A1_v1.2_11Oct2026.R:2,8-10 (PESTO calibrates APSIM per pair to the trials' site-mean yields);
      // r_code_06_sim_apsimx_v1_10Oct2026.R:2,35 (apsimx runs APSIM at both sowing dates)
      { ids: ["PESTO"], text: "{PESTO} calibrates the APSIM crop model, run through {apsimx}, to each pair's site; APSIM then predicts the gain at both sowing dates." },
      // tools_C2_v1.2.R:122-139,295-298 (lens L2, flexyBayes INLA); r_code_19_conduct_v1.6a_13Oct2026.R:177-178 (L1 asreml, L2)
      { ids: ["flexyBayes"], text: "{flexyBayes} fits the main analysis and gives the posterior the decision uses. {asreml} fits the same model as a check." },
      // tools_C2_v1.2.R:200,304-307 (lens L3, proxymix); r_code_23_proxymix_v1.6b_13Oct2026.R:2 (within-pair lens);
      // report_C2_v5.md:29-31 (0.21 against 0.23: agrees)
      { ids: ["proxymix"], text: "{proxymix} estimates the gain again without assuming a bell-shaped spread, and agrees." },
      // r_code_19_conduct_v1.6a_13Oct2026.R:180-181 (quorum consumes L1, L2, L3); tools_C2_v1.2.R:347-373
      { ids: ["quorum"], text: "{quorum} compares the {flexyBayes}, {proxymix} and {asreml} estimates." },
      // r_code_19_conduct_v1.6a_13Oct2026.R:132-134,187 (money consumes L2; ABARES file); tools_C2_v1.2.R:404-429
      { ids: ["decideR"], text: "{decideR} turns the {flexyBayes} gain and the ABARES wheat price into dollars per hectare." },
      // r_code_19_conduct_v1.6a_13Oct2026.R:168-187 (the plan); output_19_v1.6a/run_card.md (14 nodes, provenance);
      // steps 2 to 4 ran as their own scripts, and the plan read PESTO's result (r_code_14_conduct_v1.2_11Oct2026.R:92-97)
      { ids: ["conductoR"], text: "{conductoR} runs the core of the study as one plan: each analysis first on a copy with a known answer, then on the real pairs, then the comparison with the crop model and the value. It logs each dispatch and collect. Steps 2 to 4 ran as their own scripts." },
    ],
    arrows: [
      // r_code_20_kernR_v1.6a_13Oct2026.R:10-11 reads the pair table and output_02_covariates, built from DataHub
      // (r_code_02_covariates_v1_10Oct2026.R:8-9)
      { from: "DataHub", to: "kernR", kind: "handover", via: [[200, 218], [140, 250], [135, 300], [172, 336]] },
      // r_code_22_cdzoo_v1.6b_13Oct2026.R:7-8 reads the trial table of stage 21, built from DataHub
      // (r_code_21_dag_tests_v1.6b_13Oct2026.R:9,46)
      { from: "DataHub", to: "cdzoo", kind: "handover", via: [[240, 232], [180, 252], [172, 275], [200, 298]] },
      // r_code_13_pesto_A1_v1.2_11Oct2026.R:8-10: target yields from DataHub (site means)
      { from: "DataHub", to: "PESTO", kind: "handover", via: [[254, 232], [256, 262]] },
      // r_code_19_conduct_v1.6a_13Oct2026.R:71-72 reads the pair table (from DataHub, r_code_01_pairs:9,42);
      // tools_C2_v1.2.R:295-296 tool_L2 fits data$tab
      { from: "DataHub", to: "flexyBayes", kind: "handover", via: [[190, 200], [132, 170], [125, 120], [150, 80], [212, 60]] },
      // tools_C2_v1.2.R:304-305 tool_L3 fits data$tab, the same pair table
      { from: "DataHub", to: "proxymix", kind: "handover", via: [[262, 196]] },
      // r_code_19_conduct_v1.6a_13Oct2026.R:180-181 quorum consumes L2; tools_C2_v1.2.R:360
      { from: "flexyBayes", to: "quorum", kind: "handover", via: [[236, 60], [236, 74]] },
      // r_code_19_conduct_v1.6a_13Oct2026.R:180-181 quorum consumes L3; tools_C2_v1.2.R:365
      { from: "proxymix", to: "quorum", kind: "handover", via: [[175, 178], [160, 150], [175, 118], [232, 96]] },
      // r_code_19_conduct_v1.6a_13Oct2026.R:187 money consumes L2; tools_C2_v1.2.R:404-429 (emitter decideR)
      { from: "flexyBayes", to: "decideR", kind: "handover", via: [[186, 64], [166, 92], [202, 114]] },
    ],
    caption: "{conductoR}, at the centre, ran the core of the study as one plan, dispatching each of its steps and collecting each result, so its own arrows are not drawn. {asreml} and {apsimx}, by other authors, are named in the steps and not drawn.",
  },
  {
    id: "nitrogen",
    label: "How much nitrogen to topdress in June?",
    note: "Synthetic copy of confidential GRDC trials",
    page: "/examples/nitrogen-topdressing",
    steps: [
      // tools.R:10,92 (the analysis is written and rehearsed on the clone); plan.R:23,27 (fidelity check, then stage 1)
      { ids: ["masque"], text: "{masque} makes a synthetic copy of the private trials; the plan is written and rehearsed on it." },
      // tools.R:56-59 (ABARES barley price, read from DataHub's ABARES table)
      { ids: ["DataHub"], text: "DataHub supplies the barley price (ABARES)." },
      // plan.R:27,32-33 (stage1, L1); tools.R:16-19,432,631
      { ids: ["flexyBayes"], text: "{flexyBayes} analyses each trial, then fits the Bayesian response curve the decision uses." },
      // plan.R:40 (L4 koine consumes stage1); tools.R:861-887
      { ids: ["koine"], text: "{koine} gives an independent second analysis." },
      // plan.R:46-47 (quorum consumes L1, L2, L3, L4); tools.R:1193-1218
      { ids: ["quorum"], text: "{quorum} checks that the analyses agree." },
      // plan.R:49-50 (hsic, screen consume stage1); tools.R:1299-1313
      { ids: ["kernR"], text: "{kernR} tests whether soil water and rain change the response." },
      // plan.R:48 (janus consumes L1); tools.R:1255-1260
      { ids: ["janusplot"], text: "{janusplot} checks what the curve leaves unexplained." },
      // plan.R:43-44 (decision consumes L1, L1q, cost); tools.R:938-942 (decideR), 1103 (grainPlan plan_nitrogen_rate)
      { ids: ["decideR", "grainPlan"], text: "{decideR} turns the posterior into a rate for each soil moisture reading; {grainPlan} checks it in a grower's terms." },
      // plan.R:45 (proxymix consumes L1); tools.R:1159-1175 (one or two mixture components)
      { ids: ["proxymix"], text: "{proxymix} checks that the decision has one best region, not two." },
      // plan.R:19-70 (the sealed oap_plan)
      { ids: ["conductoR"], text: "{conductoR} runs the sealed plan, and logs each dispatch and collect." },
    ],
    arrows: [
      // plan.R:27 stage1 consumes fidelity, which reads the synthetic copy (tools.R:10,92,213-214)
      { from: "masque", to: "flexyBayes", kind: "handover", via: [[238, 238], [176, 256], [150, 292], [150, 340], [165, 12], [200, 34]], into: -114 },
      // plan.R:40 L4 consumes stage1
      { from: "flexyBayes", to: "koine", kind: "handover", via: [[262, 60]] },
      // plan.R:48 janus consumes L1
      { from: "flexyBayes", to: "janusplot", kind: "handover", via: [[262, 42]] },
      // plan.R:49-50 hsic and screen consume stage1
      { from: "flexyBayes", to: "kernR", kind: "handover", via: [[236, 38], [242, 14]], out: -100 },
      // plan.R:46-47 quorum consumes L1
      { from: "flexyBayes", to: "quorum", kind: "handover", via: [[236, 66], [234, 74]], out: -152, into: -100 },
      // plan.R:46-47 quorum consumes L4
      { from: "koine", to: "quorum", kind: "handover", via: [[250, 74.3]], into: -55 },
      // plan.R:43-44 decision consumes L1
      { from: "flexyBayes", to: "decideR", kind: "handover", via: [[200, 66], [172, 94], [205, 114]], out: -140 },
      // plan.R:45 proxymix consumes L1
      { from: "flexyBayes", to: "proxymix", kind: "handover", via: [[170, 64], [138, 110], [148, 150], [195, 172]], out: -127 },
      // tools.R:56-59 price read from DataHub's ABARES table inside the decision tool (tools.R:1018,1043)
      { from: "DataHub", to: "decideR", kind: "inside", via: [[240, 190], [236, 160], [250, 135]] },
      // tools.R:1103 grainPlan's plan_nitrogen_rate, called inside tool_decision
      { from: "decideR", to: "grainPlan", kind: "inside", via: [[262, 131.8]] },
    ],
    caption: "{conductoR}, at the centre, dispatched every step and collected every result, so its own arrows are not drawn. The {asreml} and crop-model checks declined to run in the rehearsal and are not drawn; {dagitty}, which computes the adjustment set, is not drawn either.",
  },
];
