// Study C2 (sowing time) numbers, copied from the tables the study stages wrote.
// Yields and differences in t/ha, money in AUD. 90% intervals as [lo, hi].
export const c2 = {
  // design (stage 01 pairs)
  n_pairs: 205,
  n_sites: 46,
  n_variety_pairs: 2425,
  n_varieties: 64,
  gap_min_days: 7,
  gap_max_days: 52,
  gap_median_days: 19,
  n_pairs_north: 85,
  n_pairs_south: 120,
  n_pairs_same_week: 82,
  year_min: 2008,
  year_max: 2017,
  mean_main_yield: 3.7884, // mean Main-window yield over the pairs (poster numbers table)
  // ASReml (stage 14 tab_estimates.csv, lens L1)
  asreml_ate: [0.2278, 0.0878, 0.3679],
  asreml_north: [0.1228, -0.038, 0.2836],
  asreml_south: [0.3094, 0.1583, 0.4605],
  asreml_same_week: [0.0546, -0.0059, 0.1151],
  // flexyBayes (stage 14 tab_estimates.csv, lens L2)
  fb_ate: [0.2238, 0.0587, 0.3933],
  fb_north: [0.1207, -0.0559, 0.3001],
  fb_south: [0.3077, 0.1421, 0.4825],
  fb_same_week: [0.0526, -0.025, 0.1294],
  // proxymix with N applied by sowing day (stage 19 tab_estimates.csv, lens L3)
  pm_ate: [0.2115, 0.141, 0.2747],
  pm_north: [0.1047, 0.018, 0.2119],
  pm_south: [0.2668, 0.1667, 0.3574],
  // APSIM calibrated with PESTO (stage 13 tab_a1_effect_full.csv)
  apsim_ate: [0.1266, 0.1074, 0.1451],
  apsim_north: [0.1119, 0.0908, 0.1333],
  apsim_south: [0.1366, 0.1083, 0.1644],
  // known effect in the simulated copy (stage 14 tab_pc.csv)
  pc_truth: 0.0852,
  // kernR balance check before sowing (stage 20 tab_kernr_tests.csv and tab_smd.csv)
  kernr_p_primary: 1.0, // N applied by sowing day, clay, pH, water-holding capacity
  kernr_p_with_rain: 0.8781,
  kernr_trials_early: 187,
  kernr_trials_main: 190,
  rain_early_mm: 36.69,
  rain_main_mm: 34.75,
  n_sow_early: 24.8,
  n_sow_main: 24.24,
  n_total_early: 56.38,
  n_total_main: 54.96,
  // money at the study-season price (stage 17 tab_money.csv and tab_price_seasons.csv; stage 18 tab_decision.csv)
  price_aud_t: 260.72,
  price_low_aud_t: 218.26,
  price_high_aud_t: 316.1,
  value_ate_aud_ha: [58.36, 15.29, 102.54],
  decider_value_new_paddock_aud_ha: 61.68,
  p_gain: 0.983,
  p_gain_new_paddock: 0.6508,
  // pairs lost to trials with no yields (stage 18 tab_lost_summary.csv)
  lost_early_only: 3,
  lost_main_only: 1,
  lost_both: 20,
  lost_candidates: 229,
};
