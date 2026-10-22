# What it would cost to build the Crop Analytics Orchestra from scratch

All amounts are Australian dollars at 2025-26 labour rates, excluding GST. The figures price building the measured suite from scratch with a team: 19 R packages, the shared contract package, the DataHub data catalogue, the study series, the website, the papers and the poster. The headline is the realistic minimum team. The lean team and the commercial firm are the lower and upper bounds. The itemised rows are in `cost_model_2026-10-22.csv`, the totals and bands in `cost_summary_2026-10-22.json`, and the calculation in `cost_model_2026-10-22.R`. This revision replaces the estimate of 2026-10-15. What changed and why is listed at the end.

## Method

Development effort for every piece of code comes from the COCOMO II.2000 post-architecture model (Boehm et al., 2000). The effort equation is person-months = 2.94 × (thousands of logical source statements)^1.0997 × the product of the effort multipliers. It uses 152 hours per person-month, with all five scale factors nominal.

**Size.** COCOMO II measures size in logical source statements, not in physical lines, and its calibration rests on that unit. Package code is counted at each package's latest release, in the `R/` and `src/` folders only. Generated code and deprecated functions kept only for backward compatibility are removed. No dead files were found. In R, a statement is each top-level expression and each expression placed directly inside a `{ }` block, so a call wrapped over several lines counts once. In C++, statements are counted from semicolons, control keywords and preprocessor lines. The 91,568 counted physical lines of package code hold 40,429 logical statements. Study and DataHub scripts use the logical share measured on their own R files (0.725 and 0.651). Website and poster code stay as physical lines.

**What is not counted as size.** Tests, vignettes and help pages are not added, because COCOMO's development effort already covers testing and documentation. Data-preparation and developer scripts (`data-raw/`, `tools/`, `inst/scripts/`) are not counted either.

**Estimation units.** Each package, study folder and other code item is estimated on its own, so the diseconomy of scale applies inside an item and not across the whole suite. Method design, which COCOMO leaves out of its development estimate, adds 7% of each package's effort. Release engineering, data enrolment, study plans and reports, papers, poster versions and decision records are priced from their counts.

**Scenarios.** All three teams are rated alike, as skilled and experienced, so the hours of work are the same in every scenario. The scenarios differ only in what is added and how it is paid. The realistic team adds senior review and coordination at loaded salaries. The commercial firm adds charge-out rates, project management, testing, technical writing, discovery, contingency and warranty.

Person-years are hours divided by 1,725 productive hours a year throughout.

## Totals

| Scenario | Total (AUD) | All-low to all-high settings (AUD) | Hours | Person-years |
|-|-:|-:|-:|-:|
| **Realistic minimum team (headline)** | **4,496,515** | 2,670,000 to 7,230,000 | 30,091 | 17.4 |
| Lean (lower bound) | 1,374,426 | 840,000 to 2,210,000 | 24,301 | 14.1 |
| Commercial firm (upper bound) | 11,894,567 | 7,820,000 to 18,410,000 | 35,039 | 20.3 |

Each total is the sum of its itemised rows. The range beside it is not a confidence interval. Its low end sets every setting at its favourable end at once: the COCOMO constant 30% lower, every complexity rating one step lower and every rate at the low end of its source range. Its high end sets every setting at its unfavourable end. Both ends are rounded to the nearest $10,000.

What the hours imply in calendar time, as model arithmetic (hours / (full-time equivalents × 1,725)):

- Realistic minimum team: at the team below (3.7 full-time equivalents), about 4.7 years.
- Lean: at two full-time people, about 7 years.
- Commercial firm: at the team below (6.0 full-time equivalents), about 3.4 years.

## Cost drivers

All values are the published COCOMO II.2000 post-architecture multipliers.

| Driver | Rating | Multiplier | Applies to |
|-|-|-:|-|
| Required software reliability (RELY) | Nominal | 1.00 | All code. The scale rates the cost of a failure; for research analysis software that is "moderate, easily recoverable losses" |
| Documentation match to life-cycle needs (DOCU) | Nominal | 1.00 | All code. Help pages and vignettes are what an R package needs, which is "right-sized to life-cycle needs" |
| Product complexity (CPLX) | Nominal to very high | 1.00 to 1.34 | Per package, table below; nominal for studies, DataHub, website and poster |
| Analyst capability (ACAP) | Very high | 0.71 | All code, all scenarios |
| Programmer capability (PCAP) | High | 0.88 | All code, all scenarios |
| Application experience (AEXP) | High | 0.88 | All code, all scenarios |
| Platform experience (PLEX) | High | 0.91 | All code, all scenarios |
| Language and tool experience (LTEX) | High | 0.91 | All code, all scenarios |
| Personnel continuity (PCON) | Nominal | 1.00 | All code, all scenarios |
| TOOL, SITE, SCED, DATA, RUSE, TIME, STOR, PVOL | Nominal | 1.00 | All code |

The six personnel multipliers together give 0.455. Very high analyst capability is a 90th-percentile team, high programmer capability a 75th-percentile team, and high experience three years. The measured test volume (0.95 test lines per source line, 5,040 tests) and the 68 vignettes are effort that COCOMO already counts inside development, so they do not raise the reliability or documentation ratings.

| Package | CPLX | Multiplier | Reason |
|-|-|-:|-|
| flexyBayes | Very high | 1.34 | Difficult but structured numerical analysis: one model language translated into three inference engines, with structured covariance and results kept in agreement with a licensed commercial engine; the sampling runs inside the engines |
| PESTO | Very high | 1.34 | C++17 kernels for ensemble smoothing, external PEST++ binaries driven through files, an APSIM callback |
| kernR | Very high | 1.34 | C++ kernels with permutation nulls, small-sample calibration, a simulator-as-null test |
| proxymix | Very high | 1.34 | Mixture calculus with Kullback-Leibler fitting, missing data and posterior compression |
| apsimR | High | 1.17 | External crop simulator with platform-specific binaries on the .NET 8 runtime |
| quorum | High | 1.17 | Reconciles several heavy inference engines on common scales |
| koine | High | 1.17 | Reproduces another engine's models through compiled nimble code |
| terroir | High | 1.17 | Many external web data services with their own failure modes |
| kalmix | High | 1.17 | Numerically stable filtering and smoothing, hidden Markov models |
| masque | High | 1.17 | Confidentiality guarantees backed by leak tests |
| gpfield | High | 1.17 | Change-of-support integration with typed abstention |
| optimix | High | 1.17 | Many optimiser back ends behind one contract and a selector |
| cdzoo | High | 1.17 | Mixed R and Python stack and fair benchmarking |
| conductoR | High | 1.17 | Runs a schema-validated plan across every member's contract |
| decideR | Nominal | 1.00 | Decision theory in pure R with a small surface |
| grainPlan | Nominal | 1.00 | Thin front end on decideR |
| survkit | Nominal | 1.00 | One interface over established survival back ends |
| bacipair | Nominal | 1.00 | Established estimators in a small package |
| janusplot | Nominal | 1.00 | Pairwise smoothed-association matrices from established GAM fits, drawn with ggplot2 |
| orchestraManifest | Nominal | 1.00 | Small set of S7 classes that define the shared result format |

## Teams

The FTE column is each role's share of a full-time load, with the main developers working the whole project.

**Realistic minimum team: three full-time developers and three part-time specialists (3.7 FTE).** Three principal data scientists or senior research software engineers write the code, studies, data tooling, website and poster. A professor-level methodologist does the method design and reviews code and results at one tenth of development hours. The same person writes the papers and decision records. A crop scientist enrols the datasets and supplies one tenth of study hours. A part-time research software engineering lead does release engineering. Coordination adds 15% to all hours for meetings, planning and handover, priced at the principal rate. Rates are loaded with 30% on-costs. The principal rate uses a salary of 200,000 a year, the senior band on the recruiter page for senior data scientists.

| Role | FTE | Hours | Rate (AUD/h) | Rate source |
|-|-:|-:|-:|-|
| Principal data scientist / senior research software engineer (including coordination) | 3.00 | 24,341 | 150.72 | rates.csv row 30 |
| Professor-level methodologist, academic Level E | 0.37 | 3,040 | 166.58 | rates.csv row 26 |
| Research software engineering lead, HEO10, part time | 0.21 | 1,680 | 111.93 | rates.csv row 34 |
| Senior crop scientist, CSIRO CSOF7 | 0.13 | 1,029 | 129.54 | rates.csv row 32 |

**Lean: two full-time people.** Two people with academic training do everything, including method design. The engagement is casual or freelance, paid at the Level A salary per productive hour, with no on-costs and no casual loading. That is 56.56 AUD an hour, below the published Australian contract rate for an R developer (117 to 143 AUD an hour). There is no coordination, review, project manager or tester.

| Role | FTE | Hours | Rate (AUD/h) | Rate source |
|-|-:|-:|-:|-|
| Postdoctoral fellow, academic Level A, casual or freelance | 2.00 | 24,301 | 56.56 | rates.csv row 11, salary 97,565 / 1,725 h, no on-costs |

**Commercial firm: four full-time data scientists and five supporting roles (6.0 FTE).** Senior data scientists or statisticians do development, release engineering, studies and data work. A principal consultant does method design, sign-off of decisions and the shared format, papers and discovery, and a web developer builds the site. On top of delivery come:

- a project manager at 15% of delivery hours
- discovery at 5% of delivery hours
- warranty and handover at 5% of delivery hours
- a tester at 20% of development hours
- a technical writer at 5% of development hours
- a 15% contingency on all priced work.

The firm's margin is inside the charge-out rates, so none is added on top. The charge-out rates apply a billing multiple of 3.21 taken from US engineering firms. The Australian figures found are lower, so this scenario is an upper bound.

| Role | FTE | Hours | Rate (AUD/h, charge-out) | Rate source |
|-|-:|-:|-:|-|
| Senior data scientist / statistician | 4.00 | 23,514 | 304.25 | rates.csv row 38 |
| QA / test engineer | 0.63 | 3,730 | 230.75 | rates.csv row 50 |
| Project manager | 0.62 | 3,645 | 260.52 | rates.csv row 46 |
| Principal consultant | 0.41 | 2,390 | 428.00 | rates.csv row 42 |
| Technical writer | 0.16 | 933 | 176.78 | rates.csv row 54 |
| UX / web developer | 0.14 | 826 | 230.75 | rates.csv row 58 |

## Itemised cost

Each package row adds development, release engineering and method design. Per-item detail and justification are in `cost_model_2026-10-22.csv`. Hours are the same in every scenario where an item appears. Senior review, testing and technical writing are shares of 18,651 development hours. These cover the packages (11,923), DataHub tooling, study scripts, the website and the poster scripts.

| Item | Hours | Realistic (AUD) | Lean (AUD) | Commercial (AUD) |
|-|-:|-:|-:|-:|
| flexyBayes | 5,592 | 838,997 | 316,253 | 1,744,546 |
| proxymix | 1,465 | 215,008 | 82,864 | 456,121 |
| masque | 1,149 | 167,369 | 64,989 | 357,480 |
| kernR | 1,025 | 150,797 | 57,982 | 319,233 |
| PESTO | 917 | 132,520 | 51,884 | 285,163 |
| koine | 669 | 98,978 | 37,839 | 208,443 |
| quorum | 618 | 91,868 | 34,951 | 192,628 |
| kalmix | 418 | 60,561 | 23,639 | 129,965 |
| janusplot | 345 | 50,096 | 19,502 | 107,246 |
| cdzoo | 340 | 49,325 | 19,214 | 105,656 |
| apsimR | 334 | 48,164 | 18,901 | 103,859 |
| conductoR | 278 | 40,590 | 15,722 | 86,498 |
| terroir | 261 | 36,993 | 14,737 | 80,866 |
| optimix | 240 | 34,763 | 13,549 | 74,504 |
| gpfield | 222 | 31,153 | 12,561 | 68,845 |
| decideR | 170 | 23,525 | 9,599 | 52,556 |
| grainPlan | 122 | 16,323 | 6,914 | 37,733 |
| survkit | 120 | 17,010 | 6,814 | 37,374 |
| bacipair | 88 | 11,702 | 4,955 | 27,041 |
| orchestraManifest (contract package, with 40 h design of the shared format) | 106 | 15,092 | 5,996 | 37,423 |
| DataHub (tooling, 132 enrolments, 81 formatted) | 2,046 | 299,945 | 115,706 | 622,411 |
| Study series (13 study folders, shared helpers, 16 design files) | 6,327 | 940,230 | 357,862 | 1,925,044 |
| Website (11 pages, build and design) | 826 | 124,550 | 46,739 | 190,685 |
| Papers (857 lines, literature and revision) | 166 | 27,602 | 9,372 | 70,920 |
| Poster (14 content versions, latest build and figure scripts) | 163 | 24,504 | 9,196 | 49,465 |
| Technical writing (5% of development) | 933 |  |  | 164,858 |
| Senior review (10% of development) | 1,865 | 310,693 |  |  |
| Quality assurance and testing (20% of development) | 3,730 |  |  | 860,755 |
| Decision records (90) | 135 | 22,488 | 7,636 | 57,780 |
| Cross-package audits (4) | 160 | 24,115 | 9,050 | 48,680 |
| Project coordination (15%) | 3,925 | 591,554 |  |  |
| Project management (15%) | 3,645 |  |  | 949,618 |
| Discovery and scoping (5%) | 1,215 |  |  | 520,033 |
| Warranty and handover (5%) | 1,215 |  |  | 369,673 |
| Contingency (15% of priced work) | cost allowance |  |  | 1,551,465 |
| **Total** | | **4,496,515** | **1,374,426** | **11,894,567** |

| Group | Realistic (AUD) | Lean (AUD) | Commercial (AUD) |
|-|-:|-:|-:|
| 19 packages | 2,115,742 | 812,869 | 4,475,757 |
| Contract package | 15,092 | 5,996 | 37,423 |
| DataHub | 299,945 | 115,706 | 622,411 |
| Studies | 940,230 | 357,862 | 1,925,044 |
| Website, papers, poster, writing | 176,656 | 65,307 | 475,928 |
| Review, quality and decision records | 357,296 | 16,686 | 967,215 |
| Coordination, management, discovery, warranty, contingency | 591,554 | 0 | 3,390,789 |
| **Total** | **4,496,515** | **1,374,426** | **11,894,567** |

## Sanity checks

**Effort.** 17.4 person-years for the realistic team, 14.1 for the lean team and 20.3 for the commercial firm. The underlying work is the same 24,301 hours in each. The realistic team adds review and coordination, and the firm adds management, testing, writing, discovery and warranty.

**Cross-check at nominal drivers.** COCOMO II with every driver at nominal gives 20,726 development hours for the 19 packages and the contract package. The model here gives 11,923. The complexity ratings raise effort, and the skilled personnel ratings (0.455) bring it back below nominal.

**Cost per statement.** The size counted is 69,998: logical statements of package R and C++, DataHub tooling and study scripts, plus physical lines of website code and the latest poster scripts. The cost per unit is 64.24 AUD (realistic), 19.64 (lean) and 169.93 (commercial).

**Concentration.** flexyBayes is 19% of the realistic total, 23% of the lean total and 15% of the commercial total. It is by far the largest package, with 14,091 logical statements (39,765 physical lines). At extra-high complexity instead, the totals rise to 4,803,303 (realistic), 1,464,778 (lean) and 12,701,834 (commercial).

**Sensitivity (AUD).**

| Case | Realistic | Lean | Commercial |
|-|-:|-:|-:|
| Mid estimate | 4,496,515 | 1,374,426 | 11,894,567 |
| COCOMO constant 30% lower | 3,376,232 | 1,043,790 | 8,970,835 |
| COCOMO constant 30% higher | 5,616,799 | 1,705,058 | 14,818,292 |
| Complexity one step lower | 4,171,706 | 1,278,765 | 11,039,868 |
| Complexity one step higher | 5,099,346 | 1,551,964 | 13,480,818 |
| Rates at the low end | 3,795,327 | 1,179,091 | 11,116,524 |
| Rates at the high end | 5,069,267 | 1,569,762 | 12,969,235 |
| flexyBayes at extra high complexity | 4,803,303 | 1,464,778 | 12,701,834 |
| Reliability and documentation rated high | 5,037,999 | 1,533,901 | 13,319,397 |
| Physical lines as size | 8,752,220 | 2,628,762 | 23,087,454 |
| Method of 2026-10-15 on the new counts | 11,290,376 | 3,376,271 | 29,766,231 |
| All settings favourable | 2,667,441 | 837,999 | 7,824,890 |
| All settings unfavourable | 7,225,574 | 2,210,990 | 18,405,550 |

The unit of size moves the totals most. Counting physical lines instead of logical statements nearly doubles every total, because formatted R code spreads one call over many lines. Among the remaining settings, the COCOMO constant moves the totals most.

## Assumptions

1. Effort follows COCOMO II.2000 at its default calibration (constant 2.94, exponent 1.0997 from nominal scale factors summing to 18.97), 152 hours per person-month.
2. Size is logical source statements. Package code is counted at each package's latest release, with generated code and deprecated back-compatibility functions removed. quorum has no release tag and is counted at the head of its main branch. conductoR is counted at the last commit of its 0.2.0 release, which has no tag.
3. Study and DataHub scripts are converted to logical statements at the share measured on their R files on 2026-10-22: 0.725 for studies and 0.651 for DataHub. Website and poster code stay as physical lines.
4. Each code item is estimated separately: 19 packages and the contract package, 13 study folders and the shared study helpers, DataHub tooling, the website and the latest poster scripts.
5. The cost-driver ratings are judgement against the published COCOMO II rating scales; the values attached to each rating are the published table.
6. Studies, DataHub, website and poster scripts are rated nominal for complexity, reliability and documentation, with the same personnel ratings as the packages.
7. Method design is 7% of each package's development effort, the share COCOMO II adds for plans and requirements outside its development estimate.
8. Release engineering is 24 hours of set-up plus 8 hours per release recorded in NEWS, as maintenance outside one development cycle.
9. Per-item rates:
   - 16 hours per study plan or addendum, and 12 per report
   - 3 hours per dataset enrolled, and 2 per held dataset formatted
   - 6 hours per poster content version
   - 1.5 hours per decision record
   - six minutes per manuscript line, plus 80 hours of literature and revision
   - 40 hours of website design, and 40 hours to design the shared result format
   - four cross-package audits of 40 hours each.
10. Study, DataHub, website, paper, poster and decision-record counts are those measured on 2026-10-15. A trial run of study S2 is left out. Only the latest poster build script and its figure script are priced as code. The 16 study design documents kept in the coordination plan folder are priced like in-folder plans.
11. Lean pays the Level A salary per productive hour with no on-costs and no casual loading, as a casual or freelance engagement.
12. All three scenarios share the same personnel ratings, so they share the same hours of work before review and overheads.
13. Not priced: hardware, software licences (including the licensed mixed-model engine used for parity checks), cloud services, travel and recruitment.

**Items with no published source**, and the assumption used in their place:

| Item | Assumption used |
|-|-|
| Australian freelance R developer rate | The lean team is paid the university Level A salary without on-costs, below the published contract rate for an R developer |
| Australian consulting firm rate card | Charge-out = mid salary / 1,725 h × 3.21, the average billing multiple in a US engineering-firm benchmark; the Australian figures found are lower, so the commercial total is an upper bound |
| Peer-reviewed effort to build an R package | COCOMO II.2000 on measured logical statements, package by package |
| Cost of CRAN-grade quality assurance | Release checks and four cross-package audits, plus 10% review (realistic) or 20% QA (commercial) |
| Hours per plan, report, dataset, poster version, decision record and manuscript line | The planning rates in assumption 9 |
| Logical statements in R | COCOMO's counting checklist is written for languages with statement terminators; the R rule in the method section is our reading of it |
| Cost-driver ratings | Judgement against the published rating scales; the multiplier values are the published table |

## Sources

Realistic rates are annual salary × 1.30 on-cost / 1,725 hours, and the lean rate drops the on-cost. Commercial rates are mid salary / 1,725 hours × 3.21. Full low, mid and high values are in `rates.csv`. Every web source below was read again on 2026-10-22, and the figure used was found on the page. The record is in `source_validation_2026-10-22.csv`.

| Source | Used for |
|-|-|
| Boehm, B. W., et al. (2000). Software Cost Estimation with COCOMO II. Prentice Hall. | The COCOMO II.2000 model |
| USC Center for Software Engineering. COCOMO II Model Definition Manual, version 2.1 (1995-2000). https://www.rose-hulman.edu/class/csse/csse372/201310/Homework/CII_modelman2000.pdf | Logical source statements as the size unit; constants 2.94 and 0.91; scale factors; rating scales and multipliers for RELY, DOCU, CPLX and the personnel drivers; 152 hours per person-month |
| Menzies, T., et al. Negative results for software effort estimation, arXiv:1609.05563 (2016), Fig. 5, default COCOMO II.2000 tunings. https://arxiv.org/abs/1609.05563 | The multiplier table, checked value by value against the manual |
| My first COCOMO, tutorial reading for software engineering course CSSE 372, Rose-Hulman Institute of Technology. https://rose-hulman.edu/class/cs/csse372/201410/Readings/MyFirstCOCOMO_Tutorial.pdf | Plans and requirements at 7% of effort, outside the development total |
| Softstar Systems COCOMO FAQ. https://www.softstarsystems.com/faq.htm | 152 hours per person-month |
| UQ research academic pay scales, effective 7 Feb 2026. https://about.uq.edu.au/careers/why-work-uq/pay-scales/research-academic | Level A and Level E salaries |
| ANU 2025 and 2026 salary on-costs. https://services.anu.edu.au/human-resources/salaries-benefits/salary-on-costs | On-cost items, which sum to about 30.7% |
| Western Sydney University, developing a budget for your research application. https://www.westernsydney.edu.au/research/preparing-a-grant-application/developing-a-budget-for-your-research-application | ARC 30% on-cost |
| ANU Enterprise Agreement 2023-2026, clause 52 Workloads. https://services.anu.edu.au/human-resources/enterprise-agreement/52-workloads | 1,725 productive hours a year |
| Clicks IT Recruitment, senior data scientist salary and rates. https://clicks.com.au/job-salary/senior-data-scientist/ | Senior data scientist salary (145,500 / 163,500 / 200,000) and contractor day rates; the 200,000 senior band sets the realistic principal rate |
| Clicks IT Recruitment, R developer salary and rates. https://clicks.com.au/job-salary/r-developer/ | Contract day rate for an R developer (935 / 1,040 / 1,140), a check on the lean rate |
| Clicks IT Recruitment, project manager and technical writer pages. https://clicks.com.au/job-salary/ | Project manager and technical writer salaries |
| Morgan McKinley 2026 technology permanent and contract salaries. https://www.morganmckinley.com/au/salary-guide/technology/permanent-salaries | Head of data science, test analyst and UX salaries; contractor day rates |
| CSIRO Enterprise Agreement 2023-2026, Schedule 6. https://www.csiro.au/-/media/About/Files/EA-2023/CSIRO_Enterprise_Agreement_2023-2026_Final_APSC_approved_8-Feb_24-Accessible.txt | CSOF7 crop scientist |
| Flinders University professional staff salary details, effective 2 Jul 2025. https://www.flinders.edu.au/content/dam/documents/jobs/position-descriptions/Salary%20Details_Professional%20Staff.pdf | HEO10 research software engineering lead |
| BQE, billing multiples and realization rates (2025, updated 13 Jul 2026). https://www.bqe.com/blog/beyond-utilization-what-billing-multiples-and-realization-rates-can-reveal-about-your-ae-firms-financial-health | Billing multiple 3.21 (US architecture and engineering firms) |
| Department of Finance, APS Audit of Employment 2023-24 (December 2025). https://www.finance.gov.au/sites/default/files/2025-12/2023-24-Audit-of-Employment.pdf | A check on the commercial rates: Commonwealth consultant spending of 536 million dollars for 1,430 full-time equivalents, about 375,000 a year each, below the senior charge-out used here |
| Package, study, data and publication sizes | Packages measured on 2026-10-22 at their release tags (`fleet_metrics_2026-10-22.csv`); studies, data and publications measured on 2026-10-15 (`surround_metrics.csv`, `fleet_notes.md`) |

## Changes since 2026-10-15

1. Totals: realistic 11,064,344 to 4,496,515 AUD; lean 3,308,619 to 1,374,426; commercial 29,166,155 to 11,894,567.
2. Code is counted at each package's latest release instead of the working copies of 2026-10-15. On its own, this and the new member raise the totals slightly. With the old method on the new counts, the totals would have been 11,290,376 (realistic), 3,376,271 (lean) and 29,766,231 (commercial).
3. janusplot joins as the nineteenth member package, at release 0.2.0.
4. Two kinds of code are no longer counted as size: generated code (111 R lines) and deprecated back-compatibility functions (210 R lines). No dead files were found.
5. Size is measured in logical statements, the unit COCOMO II is calibrated on, instead of physical lines. This is the largest change.
6. Required reliability and documentation move from high to nominal. COCOMO rates them by the cost of a failure and by fit to life-cycle needs, not by test volume or vignette count.
7. flexyBayes complexity moves from extra high to very high, on the COCOMO description of difficult but structured numerical analysis.
8. The realistic principal rate's 200,000 salary is now tied to a published figure, the senior band on the recruiter page for senior data scientists.
9. The commercial firm is presented as the upper bound. Its billing multiple comes from US engineering firms, and the Australian figures found are lower.
