# =============================================================================
# Sowing window study: does wheat sown in the Early window yield more than wheat sown in the Main window?
#
# Author      : Max Moldovan
# Version date: 24 Oct 2026
# Usage       : Rscript r_code_c2_sowing_window_v1_24Oct2026.R > run.log 2>&1
#               (run from a directory holding data/nvt/ and data/abares/ as described under Data)
#
# Data        : NVT records compiled by Newman and Furbank (2021), figshare collection
#               doi:10.6084/m9.figshare.c.5296369.v4, CC BY 4.0, as parquet tables under data/nvt/:
#               tables/nvt_trial, tables/nvt_observation, enrich/nvt_season_key, coverage/nvt_trial_coordinate
#               (the DataHub projection of the deposit: one row per trial, per trial x variety, and the paddock key);
#               ABARES (2026), Agricultural commodities: September quarter 2026, statistical tables, Table 6
#               (wheat gross unit value, $/t), under data/abares/
# Requirements: arrow, data.table, flexyBayes (INLA backend), readxl
#
# Outcomes    : grain yield, t/ha; the analysed value is the Early minus Main difference of one variety in one pair
# Design      : an Early and a Main trial of the same season, no more than 5 km apart and on the same paddock, form a pair;
#               NSW and Queensland; pairs sown 7 days or more apart are the study set, pairs sown 0 to 6 days apart the
#               negative control; north and south split at 31.5 degrees S
# Models      : Bayesian mixed model of the differences (flexyBayes, INLA): intercept only (the average effect), with
#               random site, season, variety and pair effects, weighted by the trial LSDs; the same model with a
#               north/south term; the same model on the negative-control pairs
# Outputs     : output/{tab_pairs.csv, tab_estimates.csv, tab_price_seasons.csv, tab_headline.csv, sessionInfo.txt}
#
# Structure   : 1. Read the data
#               2. Pairs of Early and Main trials
#               3. Variety differences and weights
#               4. The Bayesian model
#               5. The value of the gain
#               6. Write the artefacts
# =============================================================================


require(arrow)
require(data.table)
require(flexyBayes)
require(readxl)

rm(list = ls())

ptm1 <- proc.time()	# total execution time
setDTthreads(1L)


# Configuration: switches and paths
########################################################

dir_data <- "data/"
dir_nvt <- paste0(dir_data, "nvt/")
file_t6 <- paste0(dir_data, "abares/abares_agcom_sep2026_statistical.xlsx")
dir_out <- "output/"
dir.create(dir_out, showWarnings = FALSE, recursive = TRUE)

max_km <- 5			# largest distance between the two trials of a pair, km
min_shared <- 3L		# fewest shared varieties for a usable pair
min_gap <- 7L			# study pairs: Early sown at least this many days sooner
lat_split <- -31.5		# north of this latitude is north
seed_run <- 20261011L
n_draws <- 4000L		# posterior draws

options(flexyBayes.silence_default_prior_note = TRUE)
options(flexyBayes.inla_best_of_workers = 1L)	# one core per INLA fit
########################################################


# =============================================================================
# 1. Read the data
# =============================================================================
print("==== 1. Read the data ====")
ptm_local <- proc.time()

cols_trial <- names(open_dataset(paste0(dir_nvt, "tables/nvt_trial.parquet"))$schema)
cols_series <- grep("^MANDom_Series_name", cols_trial, value = TRUE)
cols_read <- c("crop", "trial_id", "latitude", "longitude", "PHENDom_LSD", cols_series)

tab_trial <- as.data.table(read_parquet(paste0(dir_nvt, "tables/nvt_trial.parquet"), col_select = all_of(cols_read)))
tab_trial <- tab_trial[crop == "Wheat", ]

tab_key <- as.data.table(read_parquet(paste0(dir_nvt, "enrich/nvt_season_key.parquet"),
	col_select = c("trial_id", "trial_year", "sowing_date_numeric", "state")))
tab_coord <- as.data.table(read_parquet(paste0(dir_nvt, "coverage/nvt_trial_coordinate.parquet"),
	col_select = c("trial_id", "town_label", "nearest_place", "paddock_key")))
tab_obs <- as.data.table(read_parquet(paste0(dir_nvt, "tables/nvt_observation.parquet"),
	col_select = c("trial_id", "variety", "row_class", "crop", "PHENDom_yield_t_ha")))
tab_obs <- tab_obs[crop == "Wheat", ]
stopifnot(!anyDuplicated(tab_coord[, trial_id]), !anyDuplicated(tab_key[, trial_id]))

print(paste0("wheat trials: ", nrow(tab_trial), " | wheat observation rows: ", nrow(tab_obs)))

time_section <- proc.time() - ptm_local
print("Section: 1. Read the data")
print(time_section)


# =============================================================================
# 2. Pairs of Early and Main trials
# =============================================================================
print("==== 2. Pairs of Early and Main trials ====")
ptm_local <- proc.time()

	# a trial carries one series indicator; Early names contain Early or AdvEa
	##########
	mat_series <- as.matrix(tab_trial[, ..cols_series]) == 1
	tab_trial[, series := apply(mat_series, 1, function(r) paste(cols_series[which(r)], collapse = ";"))]
	tab_trial[, arm := fifelse(grepl("Early|AdvEa", series), "Early", fifelse(grepl("Main", series), "Main", "other"))]
	tab_trial[, (cols_series) := NULL]
	##########

	tab_trial <- merge(tab_trial, tab_key, by = "trial_id", all.x = TRUE, sort = FALSE)
	tab_trial <- merge(tab_trial, tab_coord, by = "trial_id", all.x = TRUE, sort = FALSE)
	tab_trial[, site := fifelse(is.na(town_label), nearest_place, town_label)]

	# every Early trial against every Main trial of the same season, kept when within max_km
	##########
	tab_e <- tab_trial[arm == "Early" & !is.na(latitude) & !is.na(sowing_date_numeric), ]
	tab_m <- tab_trial[arm == "Main" & !is.na(latitude) & !is.na(sowing_date_numeric), ]
	tab_pairs <- merge(tab_e, tab_m, by = "trial_year", suffixes = c("_E", "_M"), allow.cartesian = TRUE)

	# great-circle distance, km
	fun_km <- function(lat1, lon1, lat2, lon2) {
		rad <- pi / 180
		h <- sin((lat2 - lat1) * rad / 2)^2 + cos(lat1 * rad) * cos(lat2 * rad) * sin((lon2 - lon1) * rad / 2)^2
		2 * 6371 * asin(sqrt(h))
	} # ends fun_km

	tab_pairs[, km := fun_km(latitude_E, longitude_E, latitude_M, longitude_M)]
	tab_pairs <- tab_pairs[km <= max_km, ]
	tab_pairs[, gap := as.numeric(sowing_date_numeric_M - sowing_date_numeric_E)]	# days
	##########

	# shared varieties, read from the variety lists only (no yield yet)
	##########
	tab_var_list <- unique(tab_obs[trial_id %in% c(tab_pairs[, trial_id_E], tab_pairs[, trial_id_M]), .(trial_id, variety)])
	list_var <- split(tab_var_list[, variety], tab_var_list[, trial_id])
	tab_pairs[, n_shared := mapply(function(a, b) length(intersect(list_var[[a]], list_var[[b]])), trial_id_E, trial_id_M)]
	##########

	tab_pairs[, set := fifelse(gap >= min_gap, "usable", fifelse(gap >= 0, "placebo", "negative_gap"))]
	tab_pairs[n_shared < min_shared, set := "too_few_shared"]
	tab_pairs[, region := fifelse(latitude_M > lat_split, "north", "south")]
	tab_pairs[, site := site_M]
	tab_pairs[, pair_id := sprintf("P%03d", seq_len(.N))]

	# the study keeps NSW and Queensland pairs whose two trials share a paddock
	tab_pairs <- tab_pairs[set %in% c("usable", "placebo") & state_M %in% c("NSW", "QLD") &
		!is.na(paddock_key_E) & paddock_key_E == paddock_key_M, ]
	print(tab_pairs[, .(pairs = .N, sites = uniqueN(site), median_gap = median(gap), min_gap = min(gap), max_gap = max(gap)), keyby = set])

time_section <- proc.time() - ptm_local
print("Section: 2. Pairs of Early and Main trials")
print(time_section)


# =============================================================================
# 3. Variety differences and weights
# =============================================================================
print("==== 3. Variety differences and weights ====")
ptm_local <- proc.time()

	# one yield per trial and variety: duplicate rows are averaged
	##########
	tab_y <- tab_obs[row_class == "observed" & !is.na(PHENDom_yield_t_ha)]
	tab_y <- tab_y[, .(yield = mean(as.numeric(PHENDom_yield_t_ha))), by = .(trial_id, variety)]	# t/ha
	##########

	# one row per variety grown in both trials of a pair
	##########
	tab_an <- tab_pairs[, .(variety = intersect(list_var[[trial_id_E]], list_var[[trial_id_M]])),
		by = .(pair_id, trial_id_E, trial_id_M, set, region, site, trial_year, gap, PHENDom_LSD_E, PHENDom_LSD_M)]
	tab_an[, y_E := tab_y[match(paste(tab_an[, trial_id_E], tab_an[, variety]), paste(trial_id, variety)), yield]]
	tab_an[, y_M := tab_y[match(paste(tab_an[, trial_id_M], tab_an[, variety]), paste(trial_id, variety)), yield]]
	print(paste0("variety pairs without a yield in one or both trials, dropped: ", tab_an[is.na(y_E) | is.na(y_M), .N]))
	tab_an <- tab_an[!is.na(y_E) & !is.na(y_M)]
	stopifnot(!anyNA(tab_an[, .(PHENDom_LSD_E, PHENDom_LSD_M)]))
	##########

	# the difference and its weight: each trial LSD gives the variance of one variety mean
	##########
	tab_an[, d := y_E - y_M]	# t/ha, Early minus Main
	tab_an[, var_d := (PHENDom_LSD_E / qnorm(0.975))^2 / 2 + (PHENDom_LSD_M / qnorm(0.975))^2 / 2]
	tab_an[, w := 1 / var_d]
	##########

	tab_counts <- tab_an[, .(pairs = uniqueN(pair_id), variety_pairs = .N, sites = uniqueN(site),
		median_gap = as.numeric(median(unique(.SD)[, gap])), min_gap = min(gap), max_gap = max(gap),
		mean_y_M = round(mean(y_M), 2L)), keyby = set, .SDcols = c("pair_id", "gap")]
	print(tab_counts)

	cols_fac <- c("site", "trial_year", "variety", "pair_id", "region")
	tab_an[, (cols_fac) := lapply(.SD, function(v) factor(as.character(v))), .SDcols = cols_fac]

time_section <- proc.time() - ptm_local
print("Section: 3. Variety differences and weights")
print(time_section)


# =============================================================================
# 4. The Bayesian model
# =============================================================================
print("==== 4. The Bayesian model ====")
ptm_local <- proc.time()

	# model M, its north/south form M-R, and M on the negative-control pairs M-P
	##########
	fun_fit <- function(fixed_local, df_local) {
		flexybayes(fixed = fixed_local, random = ~ site + trial_year + variety + pair_id, data = df_local,
			family = "gaussian", backend = "inla", weights = df_local$w, verbose = FALSE)
	} # ends fun_fit

	fun_q <- function(v) data.table(estimate = mean(v), sd = sd(v), ci90_lo = quantile(v, 0.05, names = FALSE),
		ci90_hi = quantile(v, 0.95, names = FALSE), p_gain = mean(v > 0))

	df_u <- as.data.frame(droplevels(tab_an[set == "usable"]))
	df_p <- as.data.frame(droplevels(tab_an[set == "placebo"]))

	fit_m <- fun_fit(d ~ 1, df_u)
	fit_r <- fun_fit(d ~ region, df_u)
	fit_p <- fun_fit(d ~ 1, df_p)
	stopifnot(isTRUE(fb_convergence(fit_m)$ok), isTRUE(fb_convergence(fit_r)$ok), isTRUE(fb_convergence(fit_p)$ok))
	stopifnot(levels(df_u$region)[1] == "north")
	##########

	# posterior draws; fixed effects carry a ":1" suffix in the draw names
	##########
	set.seed(seed_run)
	dr_m <- fb_as_draws_simple(fit_m, n_samples = n_draws)
	set.seed(seed_run)
	dr_r <- fb_as_draws_simple(fit_r, n_samples = n_draws)
	set.seed(seed_run)
	dr_p <- fb_as_draws_simple(fit_p, n_samples = n_draws)

	list_draws <- list(ate = dr_m[["(Intercept):1"]], north = dr_r[["(Intercept):1"]],
		south = dr_r[["(Intercept):1"]] + dr_r[["regionsouth:1"]], same_week = dr_p[["(Intercept):1"]])

	# a new paddock and season: the average plus new site, season and pair effects
	sd_site <- 1 / sqrt(dr_m[["Precision for site"]])
	sd_year <- 1 / sqrt(dr_m[["Precision for trial_year"]])
	sd_pair <- 1 / sqrt(dr_m[["Precision for pair_id"]])
	set.seed(seed_run + 1L)
	list_draws$new_paddock <- list_draws$ate + rnorm(n_draws, 0, sd_site) + rnorm(n_draws, 0, sd_year) + rnorm(n_draws, 0, sd_pair)
	##########

	tab_est <- rbindlist(lapply(names(list_draws), function(nm) cbind(estimand = nm, fun_q(list_draws[[nm]]))))
	print(tab_est)

time_section <- proc.time() - ptm_local
print("Section: 4. The Bayesian model")
print(time_section)


# =============================================================================
# 5. The value of the gain
# =============================================================================
print("==== 5. The value of the gain ====")
ptm_local <- proc.time()

	# wheat gross unit value of each study season, ABARES Table 6, weighted by the season's variety pairs
	##########
	tab_season <- tab_an[set == "usable", .(n_varpairs = .N), by = trial_year]
	tab_season[, trial_year := as.integer(as.character(trial_year))]
	tab_season[, fy := paste0(trial_year, "–", sprintf("%02d", (trial_year + 1L) %% 100L))]	# Table 6 headers use an en dash
	setorder(tab_season, trial_year)

	mat_t6 <- as.matrix(read_excel(file_t6, sheet = "Table 6", col_names = FALSE, .name_repair = "minimal"))
	row_w <- which(trimws(mat_t6[, 1L]) == "Wheat")
	stopifnot(length(row_w) == 1L, trimws(mat_t6[row_w, 2L]) == "$/t")
	col_vec <- match(tab_season[, fy], mat_t6[3L, ])
	stopifnot(!anyNA(col_vec))
	tab_season[, guv := as.numeric(mat_t6[row_w, col_vec])]	# $/t
	print(tab_season)

	price_c <- tab_season[, sum(guv * n_varpairs) / sum(n_varpairs)]	# $/t
	print(paste0("study-season wheat price: ", round(price_c, 2L), " $/t"))
	##########

	val_ate <- list_draws$ate * price_c	# $/ha
	tab_value <- data.table(price_aud_t = price_c, mean_aud_ha = mean(val_ate), q05 = quantile(val_ate, 0.05, names = FALSE),
		q95 = quantile(val_ate, 0.95, names = FALSE))
	print(tab_value)

time_section <- proc.time() - ptm_local
print("Section: 5. The value of the gain")
print(time_section)


# =============================================================================
# 6. Write the artefacts
# =============================================================================
print("==== 6. Write the artefacts ====")
ptm_local <- proc.time()

	# the headline, rounded as it is reported
	##########
	fun_r2 <- function(x) sprintf("%.2f", x)
	tab_head <- data.table(
		quantity = c("pairs, sites (study set)", "days apart: min, median, max", "Main-window mean, t/ha",
			"average gain, t/ha (90% interval)", "share of the Main-window mean", "north gain, t/ha (90% interval)",
			"south gain, t/ha (90% interval)", "chance of a gain on average", "chance of a gain in the north",
			"chance of a gain, new paddock and season", "negative-control pairs, gain t/ha (90% interval)",
			"price, $/t", "value, $/ha (90% interval)"),
		value = c(
			tab_counts[set == "usable", paste0(pairs, ", ", sites)],
			tab_counts[set == "usable", paste0(min_gap, ", ", median_gap, ", ", max_gap)],
			sprintf("%.1f", tab_counts[set == "usable", mean_y_M]),
			tab_est[estimand == "ate", paste0(fun_r2(estimate), " (", fun_r2(ci90_lo), " to ", fun_r2(ci90_hi), ")")],
			paste0(round(100 * tab_est[estimand == "ate", estimate] / tab_counts[set == "usable", mean_y_M]), "%"),
			tab_est[estimand == "north", paste0(fun_r2(estimate), " (", fun_r2(ci90_lo), " to ", fun_r2(ci90_hi), ")")],
			tab_est[estimand == "south", paste0(fun_r2(estimate), " (", fun_r2(ci90_lo), " to ", fun_r2(ci90_hi), ")")],
			paste0(round(100 * tab_est[estimand == "ate", p_gain]), "%"),
			paste0(round(100 * tab_est[estimand == "north", p_gain]), "%"),
			paste0(round(100 * tab_est[estimand == "new_paddock", p_gain]), "%"),
			paste0(tab_counts[set == "placebo", pairs], " pairs: ", tab_est[estimand == "same_week",
				paste0(fun_r2(estimate), " (", fun_r2(ci90_lo), " to ", fun_r2(ci90_hi), ")")]),
			as.character(round(price_c)),
			paste0(round(tab_value[, mean_aud_ha]), " (", round(tab_value[, q05]), " to ", round(tab_value[, q95]), ")")))
	print(tab_head)
	##########

	fwrite(tab_pairs[, .(pair_id, set, region, site, trial_year, trial_id_E, trial_id_M, gap, km, n_shared)],
		file = paste0(dir_out, "tab_pairs.csv"))
	fwrite(tab_est, file = paste0(dir_out, "tab_estimates.csv"))
	fwrite(tab_season, file = paste0(dir_out, "tab_price_seasons.csv"))
	fwrite(tab_head, file = paste0(dir_out, "tab_headline.csv"))

time_section <- proc.time() - ptm_local
print("Section: 6. Write the artefacts")
print(time_section)


# =============================================================================
# Completion
# =============================================================================
writeLines(capture.output(sessionInfo()), paste0(dir_out, "sessionInfo.txt"))

exec_time1 <- proc.time() - ptm1
print(exec_time1)
