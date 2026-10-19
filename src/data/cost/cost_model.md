# What it would cost to build the Crop Analytics Orchestra from scratch

All amounts are Australian dollars at 2025-26 labour rates, excluding GST. The figures price building the measured suite from scratch with a team: 18 R packages, the shared contract package, the DataHub data catalogue, the study series, the website, the papers and the poster. The itemised rows are in `cost_model.csv`, the totals and bands in `cost_summary.json`, and the calculation in `cost_model.R`.

## Method

Development effort for every piece of code comes from the COCOMO II.2000 post-architecture model (Boehm et al., 2000): person-months = 2.94 x (thousands of source lines)^1.0997 x the product of the effort multipliers, at 152 hours per person-month, with all five scale factors nominal. Size is source lines only: R lines that are not comments plus C++ lines. Tests, vignettes and help pages are not added, because COCOMO's development effort already covers testing and documentation. Instead, the measured test volume (0.91 test lines per source line, 4,877 tests) and the 66 vignettes set two cost drivers to high: required reliability (1.10) and documentation (1.11). Complexity (CPLX) is rated per package from the COCOMO II table; each row below gives the reason. Each package, study folder and other code item is estimated on its own, so the diseconomy of scale applies inside an item and not across the whole suite. Method design, which COCOMO leaves out of its development estimate, adds 7% of each package's effort. Release engineering, data enrolment, study plans and reports, papers, poster versions and decision records are priced from their counts.

All three teams are rated alike, as skilled and experienced, so the hours of work are the same in every scenario. The scenarios differ only in what is added and how it is paid: the realistic team adds senior review and coordination at loaded salaries, and the commercial firm adds charge-out rates, project management, testing, technical writing, discovery, contingency and warranty.

Person-years are hours divided by 1,725 productive hours a year throughout.

## Totals

| Scenario | Total (AUD) | All-low to all-high settings (AUD) | Hours | Person-years |
|-|-:|-:|-:|-:|
| Lean | 3,308,619 | 1,770,000 to 5,150,000 | 58,498 | 33.9 |
| Realistic minimum team | 11,064,344 | 5,750,000 to 17,110,000 | 73,121 | 42.4 |
| Commercial firm | 29,166,155 | 16,880,000 to 43,440,000 | 85,836 | 49.8 |

Each total is the sum of its itemised rows. The range beside it is not a confidence interval: it is the total with every setting at its favourable end at once (COCOMO constant 30% lower, every complexity rating one step lower, every rate at the low end of its source range), and then with every setting at its unfavourable end, rounded to the nearest $10,000.

What the hours imply in calendar time, as model arithmetic (hours / (full-time equivalents x 1,725)):

- Lean: at two full-time people, about 17 years.
- Realistic minimum team: at the team below (3.5 full-time equivalents), about 12 years.
- Commercial firm: at the team below (6.0 full-time equivalents), about 8.3 years.

## Cost drivers

All values are the published COCOMO II.2000 post-architecture multipliers.

| Driver | Rating | Multiplier | Applies to |
|-|-|-:|-|
| Required software reliability (RELY) | High | 1.10 | Every package, on the evidence of 0.91 test lines per source line and 4,877 tests |
| Documentation match to life-cycle needs (DOCU) | High | 1.11 | Every package, on the evidence of 66 vignettes and the help pages |
| Product complexity (CPLX) | Nominal to extra high | 1.00 to 1.74 | Per package, table below; nominal for studies, DataHub, website and poster |
| Analyst capability (ACAP) | Very high | 0.71 | All code, all scenarios |
| Programmer capability (PCAP) | High | 0.88 | All code, all scenarios |
| Application experience (AEXP) | High | 0.88 | All code, all scenarios |
| Platform experience (PLEX) | High | 0.91 | All code, all scenarios |
| Language and tool experience (LTEX) | High | 0.91 | All code, all scenarios |
| Personnel continuity (PCON) | Nominal | 1.00 | All code, all scenarios |
| TOOL, SITE, SCED, DATA, RUSE, TIME, STOR, PVOL | Nominal | 1.00 | All code |

The six personnel multipliers together give 0.455.

| Package | CPLX | Multiplier | Reason |
|-|-|-:|-|
| flexyBayes | Extra high | 1.74 | One model language fitted through separate inference engines, with results kept in agreement with a licensed commercial engine |
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
| orchestraManifest | Nominal | 1.00 | Small set of S7 classes that define the shared result format |

## Teams

The FTE column is each role's share of a full-time load, with the main developers working the whole project.

**Lean: two full-time people.** Two people with academic training do everything, including method design, as a casual or freelance engagement paid at the Level A salary per productive hour, with no on-costs and no casual loading. There is no coordination, review, project manager or tester.

| Role | FTE | Hours | Rate (AUD/h) | Rate source |
|-|-:|-:|-:|-|
| Postdoctoral fellow, academic Level A, casual or freelance | 2.00 | 58,498 | 56.56 | rates.csv row 11, salary 97,565 / 1,725 h, no on-costs |

**Realistic minimum team: three full-time developers and three part-time specialists (3.5 FTE).** Three principal data scientists or senior research software engineers write the code, studies, data tooling, website and poster. A professor-level methodologist does method design, reviews code and results at one tenth of development hours, and writes the papers and decision records. A crop scientist enrols the datasets and supplies one tenth of study hours. A part-time research software engineering lead does release engineering. Coordination adds 15% to all hours for meetings, planning and handover, priced at the principal rate. Rates are loaded with 30% on-costs.

| Role | FTE | Hours | Rate (AUD/h) | Rate source |
|-|-:|-:|-:|-|
| Principal data scientist / senior research software engineer (including coordination) | 3.00 | 61,969 | 150.72 | rates.csv row 30 |
| Professor-level methodologist, academic Level E | 0.40 | 8,322 | 166.58 | rates.csv row 26 |
| Research software engineering lead, HEO10, part time | 0.08 | 1,616 | 111.93 | rates.csv row 34 |
| Senior crop scientist, CSIRO CSOF7 | 0.06 | 1,214 | 129.54 | rates.csv row 32 |

**Commercial firm: four full-time data scientists and five supporting roles (6.0 FTE).** Senior data scientists or statisticians do development, release engineering, studies and data work; a principal consultant does method design, sign-off of decisions and the shared format, papers and discovery; a web developer builds the site. On top come a project manager at 15%, discovery at 5% and warranty and handover at 5% of delivery hours, a tester at 20% of development hours, a technical writer at 5% of development hours and a 15% contingency on all priced work. The firm's margin is inside the charge-out rates, so none is added on top.

| Role | FTE | Hours | Rate (AUD/h, charge-out) | Rate source |
|-|-:|-:|-:|-|
| Senior data scientist / statistician | 4.00 | 57,360 | 304.25 | rates.csv row 38 |
| QA / test engineer | 0.71 | 10,170 | 230.75 | rates.csv row 50 |
| Project manager | 0.61 | 8,775 | 260.52 | rates.csv row 46 |
| Principal consultant | 0.43 | 6,162 | 428.00 | rates.csv row 42 |
| Technical writer | 0.18 | 2,543 | 176.78 | rates.csv row 54 |
| UX / web developer | 0.06 | 826 | 230.75 | rates.csv row 58 |

## Itemised cost

Each package row adds development, release engineering and method design; per-item detail and justification are in `cost_model.csv`. Hours are the same in every scenario where an item appears. Senior review, testing and technical writing are shares of 50,850 development hours: the packages (41,370) plus DataHub tooling, study scripts, the website and the poster scripts. The poster is priced as 14 content versions at 6 hours each plus its latest build script and figure script (421 lines); the earlier build scripts are versions of the same job and are not priced again.

| Item | Hours | Lean (AUD) | Realistic (AUD) | Commercial (AUD) |
|-|-:|-:|-:|-:|
| flexyBayes | 25,968 | 1,468,754 | 3,931,652 | 8,109,222 |
| proxymix | 3,631 | 205,352 | 543,344 | 1,132,488 |
| masque | 2,811 | 158,985 | 419,572 | 876,560 |
| kernR | 2,380 | 134,608 | 356,396 | 742,396 |
| PESTO | 2,180 | 123,277 | 324,080 | 679,429 |
| quorum | 1,570 | 88,804 | 236,682 | 490,091 |
| koine | 1,409 | 79,695 | 211,284 | 439,588 |
| kalmix | 894 | 50,563 | 132,802 | 278,650 |
| cdzoo | 754 | 42,652 | 112,214 | 235,094 |
| conductoR | 750 | 42,414 | 112,211 | 233,907 |
| apsimR | 689 | 38,942 | 101,939 | 214,536 |
| terroir | 624 | 35,292 | 92,144 | 194,378 |
| optimix | 597 | 33,750 | 88,965 | 186,062 |
| decideR | 406 | 22,976 | 59,419 | 126,432 |
| gpfield | 406 | 22,979 | 59,107 | 126,381 |
| grainPlan | 242 | 13,692 | 34,507 | 75,158 |
| survkit | 230 | 13,025 | 33,673 | 71,669 |
| bacipair | 225 | 12,706 | 32,500 | 69,849 |
| orchestraManifest (contract package, with 40 h design of the shared format) | 156 | 8,848 | 22,742 | 53,170 |
| DataHub (tooling, 132 enrolments, 81 formatted) | 2,943 | 166,467 | 435,214 | 895,472 |
| Study series (13 study folders, shared helpers, 16 design files) | 8,183 | 462,845 | 1,216,062 | 2,489,784 |
| Technical writing (5% of development) | 2,543 |  |  | 449,477 |
| Website (11 pages, build and design) | 826 | 46,739 | 124,550 | 190,685 |
| Papers (857 lines, literature and revision) | 166 | 9,372 | 27,602 | 70,920 |
| Poster (14 content versions, latest build and figure scripts) | 163 | 9,196 | 24,504 | 49,465 |
| Senior review (10% of development) | 5,085 |  | 847,085 |  |
| Quality assurance and testing (20% of development) | 10,170 |  |  | 2,346,798 |
| Decision records (90) | 135 | 7,636 | 22,488 | 57,780 |
| Cross-package audits (4) | 160 | 9,050 | 24,115 | 48,680 |
| Project coordination (15%) | 9,538 |  | 1,437,491 |  |
| Contingency (15% of priced work) | cost allowance |  |  | 3,804,281 |
| Project management (15%) | 8,775 |  |  | 2,285,990 |
| Discovery and scoping (5%) | 2,925 |  |  | 1,251,860 |
| Warranty and handover (5%) | 2,925 |  |  | 889,903 |
| **Total** | | **3,308,619** | **11,064,344** | **29,166,155** |

| Group | Lean (AUD) | Realistic (AUD) | Commercial (AUD) |
|-|-:|-:|-:|
| 18 packages | 2,588,466 | 6,882,491 | 14,281,890 |
| Contract package | 8,848 | 22,742 | 53,170 |
| DataHub | 166,467 | 435,214 | 895,472 |
| Studies | 462,845 | 1,216,062 | 2,489,784 |
| Website, papers, poster, writing | 65,307 | 176,656 | 760,547 |
| Review, quality and decision records | 16,686 | 893,688 | 2,453,258 |
| Coordination, management, discovery, warranty, contingency | 0 | 1,437,491 | 8,232,034 |
| **Total** | **3,308,619** | **11,064,344** | **29,166,155** |

## Sanity checks

**Effort.** 33.9 person-years for the lean team, 42.4 for the realistic team and 49.8 for the commercial firm. The underlying work is the same 58,498 hours in each; the realistic team adds review and coordination, and the firm adds management, testing, writing, discovery and warranty.

**Cross-check at nominal drivers.** COCOMO II with every driver at nominal gives 50,327 development hours for the 18 packages and the contract package. The model here gives 41,370: the high reliability, documentation and complexity ratings raise effort by about 1.8 times on average, and the skilled personnel ratings (0.455) bring it back below nominal.

**Cost per source line.** Over 128,833 source lines (package R and C++, DataHub tooling, study scripts, website code and the latest poster scripts): 25.68 AUD a line (lean), 85.88 (realistic) and 226.39 (commercial).

**Concentration.** flexyBayes is 44% of the lean total, 36% of the realistic total and 28% of the commercial total: 38,651 source lines at extra-high complexity, where the diseconomy of scale is strongest. Rated very high instead, the totals fall to 2,973,992 (lean), 9,928,119 (realistic) and 26,176,348 (commercial).

**Sensitivity (AUD).**

| Case | Lean | Realistic | Commercial |
|-|-:|-:|-:|
| Mid estimate | 3,308,619 | 11,064,344 | 29,166,155 |
| COCOMO constant 30% lower | 2,396,644 | 7,971,128 | 21,052,557 |
| COCOMO constant 30% higher | 4,220,595 | 14,157,555 | 37,279,747 |
| Complexity one step lower | 2,830,613 | 9,441,284 | 24,895,320 |
| Complexity one step higher | 3,529,095 | 11,812,981 | 31,136,082 |
| Rates at the low end | 2,838,389 | 9,293,214 | 27,258,359 |
| Rates at the high end | 3,778,845 | 12,506,438 | 31,801,295 |
| flexyBayes at very high complexity | 2,973,992 | 9,928,119 | 26,176,348 |
| All settings favourable | 1,768,977 | 5,752,583 | 16,881,455 |
| All settings unfavourable | 5,147,795 | 17,111,198 | 43,440,216 |

The COCOMO constant moves the totals most. A one-step change in complexity moves them less than its multipliers suggest, because most packages are small and flexyBayes is already at the top rating, so it cannot move higher.

## Assumptions

1. Effort follows COCOMO II.2000 at its default calibration (constant 2.94, exponent 1.0997 from nominal scale factors summing to 18.97), 152 hours per person-month.
2. Size is R lines that are not comments plus C++ lines. Tests, vignettes and help pages enter only through the reliability and documentation ratings.
3. Each code item is estimated separately: 18 packages and the contract package, 13 study folders and the shared study helpers, DataHub tooling, the website and the latest poster scripts.
4. Ratings of the cost drivers are judgement from measured evidence. The values attached to each rating are the published table.
5. Studies, DataHub, website and poster scripts are rated nominal for complexity, reliability and documentation, with the same personnel ratings as the packages.
6. Method design is 7% of each package's development effort, the share COCOMO II adds for plans and requirements outside its development estimate.
7. Release engineering is 24 hours of set-up plus 8 hours per release recorded in NEWS, as maintenance outside one development cycle.
8. Per-item rates: 16 hours per study plan or addendum, 12 per report, 3 per dataset enrolled, 2 per held dataset formatted, 6 per poster content version, 1.5 per decision record, six minutes per manuscript line plus 80 hours of literature and revision, 40 hours of website design, 40 hours to design the shared result format, four cross-package audits of 40 hours.
9. A trial run of study S2 is left out. Only the latest poster build script and its figure script are priced as code. The 16 study design documents kept in the coordination plan folder are priced like in-folder plans.
10. Lean pays the Level A salary per productive hour with no on-costs and no casual loading, as a casual or freelance engagement.
11. All three scenarios share the same personnel ratings, so they share the same hours of work before review and overheads.
12. Not priced: hardware, software licences (including the licensed mixed-model engine used for parity checks), cloud services, travel and recruitment.

**Items with no published source**, and the assumption used in their place:

| Item | Assumption used |
|-|-|
| Australian freelance R developer rate | The lean team is paid the university Level A salary without on-costs |
| Australian consulting firm rate card | Charge-out = mid salary / 1,725 h x 3.21, the average billing multiple in a US engineering-firm benchmark |
| Peer-reviewed effort to build an R package | COCOMO II.2000 on measured source lines, package by package |
| Cost of CRAN-grade quality assurance | Release checks and four cross-package audits, plus 10% review (realistic) or 20% QA (commercial) |
| Consulting utilisation | Not needed, since charge-out rates apply to delivered hours only |
| Hours per plan, report, dataset, poster version, decision record and manuscript line | The planning rates in assumption 8 |
| Cost-driver ratings | Judgement from the evidence above; the multiplier values are the published table |

## Sources

Realistic rates are annual salary x 1.30 on-cost / 1,725 hours; the lean rate drops the on-cost; commercial rates are mid salary / 1,725 hours x 3.21. Full low, mid and high values are in `rates.csv`.

| Source | Used for |
|-|-|
| Boehm, B. W., et al. (2000). Software Cost Estimation with COCOMO II. Prentice Hall. | The COCOMO II.2000 model: effort equation, cost drivers and phase distribution |
| Negative results for software effort estimation, arXiv:1609.05563 (2016), Fig. 5, default COCOMO II.2000 tunings. https://arxiv.org/abs/1609.05563 | The multiplier table used here, checked value by value |
| My first COCOMO, tutorial reading for software engineering course CSSE 372, Rose-Hulman Institute of Technology. https://rose-hulman.edu/class/cs/csse372/201410/Readings/MyFirstCOCOMO_Tutorial.pdf | Plans and requirements at 7% of effort, outside the development total, as shown by the USC COCOMO II tool |
| Softstar Systems COCOMO FAQ. https://www.softstarsystems.com/faq.htm | 152 hours per person-month |
| UQ research academic pay scales, effective 7 Feb 2026. https://about.uq.edu.au/careers/why-work-uq/pay-scales/research-academic | Level A and Level E salaries |
| ANU 2025 and 2026 salary on-costs. https://services.anu.edu.au/human-resources/salaries-benefits/salary-on-costs | On-cost rate |
| Western Sydney University, developing a budget for your research application. https://www.westernsydney.edu.au/research/preparing-a-grant-application/developing-a-budget-for-your-research-application | ARC 30% on-cost |
| ANU Enterprise Agreement 2023-2026, clause 52 Workloads. https://services.anu.edu.au/human-resources/enterprise-agreement/52-workloads | 1,725 productive hours a year |
| Morgan McKinley 2026 technology permanent and contract salaries. https://www.morganmckinley.com/au/salary-guide/technology/permanent-salaries | Principal data scientist, contractor day rates |
| Clicks IT Recruitment salary pages. https://clicks.com.au/job-salary/ | Senior data scientist, project manager, technical writer |
| CSIRO Enterprise Agreement 2023-2026, Schedule 6. https://www.csiro.au/-/media/About/Files/EA-2023/CSIRO_Enterprise_Agreement_2023-2026_Final_APSC_approved_8-Feb_24-Accessible.txt | CSOF7 crop scientist |
| Flinders University professional staff salary details, effective 2 Jul 2025. https://www.flinders.edu.au/content/dam/documents/jobs/position-descriptions/Salary%20Details_Professional%20Staff.pdf | HEO10 research software engineering lead |
| BQE, billing multiples and realization rates (2025, updated 13 Jul 2026). https://www.bqe.com/blog/beyond-utilization-what-billing-multiples-and-realization-rates-can-reveal-about-your-ae-firms-financial-health | Billing multiple 3.21 |
| rOpenSci, How much work is onboarding? (3 May 2018). https://ropensci.org/blog/2018/05/03/onboarding-is-work/ | Checked for a package review effort figure; none given |
| Package, study, data and publication sizes | Measured on 2026-10-15 from the source trees (`fleet_metrics.csv`, `surround_metrics.csv`, `fleet_notes.md`) |
