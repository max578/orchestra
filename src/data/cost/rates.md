# Labour rates for costing the package suite, 2025-26

All figures are in Australian dollars. Sources were read on 2026-10-15; the full set, with low and high values, is in `rates.csv`.

**Common basis.** A loaded hourly cost is annual salary × 1.30 ÷ 1,725 hours:

- **1.30** is the employer on-cost rate. The ARC funds on-costs at 30%, and Griffith (28.65%) and ANU (about 30.7%) publish similar rates. These on-costs cover superannuation (17% at universities, 15.4% at CSIRO, 12% statutory minimum), payroll tax, workers' compensation, leave loading and long service leave.
- **1,725 hours** is the annual workload cap in the ANU, UQ and Adelaide enterprise agreements.

A working day is 7.6 hours, from the 38-hour week in the National Employment Standards. USD figures are converted at 0.6955 USD per AUD (RBA, 15 October 2026).

## 1. Lean: cheap, multi-skilled labour

| Role | Mid salary (pa) | Mid loaded rate | Why this figure |
|---|---|---|---|
| **Postdoctoral fellow, Level A (main developer)** | 97,565 | **73.53/h** | Midpoint of the UQ Level A scale from 7 Feb 2026. ANU's Level A equivalent is 98,000 |
| Graduate data scientist | 70,500 | 53.13/h | Midpoint of the starting ranges in SEEK graduate job ads (65,000-76,000) |
| PhD student, stipend plus top-up | 37,145 + 15,000 | 30.23/h | Monash 2026 stipend, tax-free, plus the ANU digital-agriculture top-up. No on-costs apply. A student cannot develop full time |
| Junior freelance developer (online platform) | n/a | 64.70/h | US$45/h, the middle of Upwork's intermediate band (US$25-60). Australian Freelancer.com IT listings averaged $26.22/h |
| Freelance R developer, Australian rate | not found | not found | No R-specific Australian freelance rate was published |

## 2. Realistic minimum team of senior professionals

| Role | Mid salary (pa) | Mid loaded rate | Why this figure |
|---|---|---|---|
| **Principal data scientist / senior research software engineer (main developer)** | 200,000 | **150.72/h** | Lies between the Clicks senior data scientist average (163,500) and the Morgan McKinley Head of Data Science median in Sydney (230,000) |
| Professor of statistics, Level E | 221,038 | 166.58/h | UQ Level E from 7 Feb 2026. ANU E1 is 215,171. Professorial loadings above the scale are not included |
| Senior crop-modelling scientist, CSIRO CSOF7 | 171,884 | 129.54/h | CSOF7.3 from 20 Nov 2025. The rate includes annual leave loading, so the 1.30 on-cost slightly overstates the loaded cost |
| Research software engineering lead, HEO10, part time | 148,521 | 111.93/h | Flinders HEO10 step 2 from 2 Jul 2025 |

## 3. Commercial firm

Australian consulting firms do not publish their charge-out rates, and no government panel ceiling was public. Two figures are given for each role:

- the **contractor day rate** paid to an individual (Morgan McKinley 2026 or Clicks), which is a floor
- a **firm charge-out rate**: mid salary ÷ 1,725 × 3.21. The multiplier is the average billing multiple in the BQE 2025 benchmarking report (healthy range 3.0-3.5). That report covers US architecture and engineering firms, not Australian consultancies.

| Role | Mid salary (pa) | Contractor day rate (mid) | Firm charge-out, mid |
|---|---|---|---|
| **Senior data scientist / statistician (main developer)** | 163,500 | 1,080 | **304/h, 2,312/day** |
| Principal consultant (head of data science) | 230,000 | 1,200 | 428/h, 3,253/day |
| Project manager | 140,000 | 1,140 | 261/h, 1,980/day |
| QA / test engineer | 124,000 | 800 | 231/h, 1,754/day |
| Technical writer | 95,000 | 780 | 177/h, 1,344/day |
| UX / web developer | 124,000 (UX), 140,000 (front end) | 850 | 231/h, 1,754/day (UX salary basis) |

## Benchmarks

| Item | Value | Source |
|---|---|---|
| Productive hours, academic | 1,725 h/yr | ANU EA 2023-2026 cl. 52.12, UQ workload procedure |
| Productive hours, COCOMO | 152 h per person-month (1,824 h/yr) | Softstar COCOMO FAQ, Menzies et al. 2016 |
| COCOMO II.2000 nominal productivity | about 290, 270 and 230 lines per person-month at 5, 10 and 50 thousand lines | Effort = 2.94 × KSLOC^1.0997 (default calibration 2.94 and 0.91, nominal scale factors summing to 18.97, all effort multipliers 1.0) |
| Peer-reviewed effort to build an R package | not found | |
| Cost of CRAN-grade quality assurance | not found | rOpenSci records reviewer hours but the 2018 post gives no summary figure in its text |
| Consulting margin, Australian | not found | Billing multiple 3.0-3.5, average 3.21 (BQE, US architecture and engineering firms) |
| AUD/USD | 0.6955 | RBA, 15 Oct 2026 |

## Sources

| Source | Published or effective date |
|---|---|
| UQ research academic pay scales. https://about.uq.edu.au/careers/why-work-uq/pay-scales/research-academic | Scales effective 8 Feb 2025, 9 Aug 2025, 7 Feb 2026, 11 Jul 2026 |
| ANU ARC salary schedule with ANU gap. https://services.anu.edu.au/human-resources/salaries-benefits/australian-research-council-arc-salary-schedule-with-anu-gap | 18 Dec 2025 |
| ANU 2025 and 2026 salary on-costs. https://services.anu.edu.au/human-resources/salaries-benefits/salary-on-costs | 2025-2026 |
| ANU Enterprise Agreement 2023-2026, clause 52 Workloads. https://services.anu.edu.au/human-resources/enterprise-agreement/52-workloads | 2023 |
| UQ academic workload procedure. https://policies.uq.edu.au/document/view-current.php?id=373 | Current version, date not read |
| Western Sydney University, developing a budget for your research application. https://www.westernsydney.edu.au/research/preparing-a-grant-application/developing-a-budget-for-your-research-application | Not stated |
| Griffith University salary on-costs. https://www.griffith.edu.au/__data/assets/pdf_file/0033/1775526/20250701-V1-Salary-OnCosts.pdf | 1 Jul 2025 (search excerpt; document not retrievable) |
| CSIRO Enterprise Agreement 2023-2026, Schedule 6 and clause 22. https://www.csiro.au/-/media/About/Files/EA-2023/CSIRO_Enterprise_Agreement_2023-2026_Final_APSC_approved_8-Feb_24-Accessible.txt | Approved 8 Feb 2024; rates to 20 Nov 2025 |
| Flinders University professional staff salary details. https://www.flinders.edu.au/content/dam/documents/jobs/position-descriptions/Salary%20Details_Professional%20Staff.pdf | Rates effective 2 Jul 2025 |
| Torrens University, RTP stipend summary. https://torrens.edu.au/research/faculty-research | 2026 rates (search excerpt) |
| Monash RTP stipend. https://www.monash.edu/study/fees-scholarships/scholarships/find-a-scholarship/research-training-program-scholarship | 2026 |
| QUT RTP stipend. https://www.qut.edu.au/study/fees-and-scholarships/scholarships/research-training-program-stipend | 2026 |
| ANU Digital Agriculture PhD scholarship. https://study.anu.edu.au/scholarships/find-scholarship/digital-agriculture-phd-scholarship | 2025 (search excerpt) |
| SEEK Grad, graduate data scientist salary. https://au.gradconnection.com/career-advice/role/graduate-data-scientist/salary/ | Not stated |
| Upwork hourly rates guide. https://www.upwork.com/resources/upwork-hourly-rates | 2026 (search excerpt; page refused access) |
| IT Brief, freelance pay in Australia (Freelancer.com listings). https://itbrief.com.au/story/business-plan-writing-tops-freelance-pay-in-australia | 20 May 2026 |
| Morgan McKinley 2026 technology contract salaries. https://www.morganmckinley.com/au/salary-guide/technology/contract-salaries | 2026 guide (date not stated) |
| Morgan McKinley 2026 technology permanent salaries. https://www.morganmckinley.com/au/salary-guide/technology/permanent-salaries | 2026 guide (date not stated) |
| Clicks IT Recruitment salary pages (data scientist, senior data scientist, project manager, technical writer). https://clicks.com.au/job-salary/ | Not stated (site dated 2026) |
| BQE, billing multiples and realization rates. https://www.bqe.com/blog/beyond-utilization-what-billing-multiples-and-realization-rates-can-reveal-about-your-ae-firms-financial-health | 7 Oct 2025, updated 13 Jul 2026 |
| ATO, final SG rate increase on 1 July. https://www.ato.gov.au/businesses-and-organisations/small-business-newsroom/the-final-sg-rate-increase-is-coming-on-1-july | 2025 |
| Alvarez & Marsal, payroll tax summary. https://www.alvarezandmarsal.com/node/84266 | 5 Jun 2025 |
| Fair Work Ombudsman, National Employment Standards. https://www.fairwork.gov.au/tools-and-resources/fact-sheets/minimum-workplace-entitlements/introduction-to-the-national-employment-standards | Current |
| Softstar Systems COCOMO FAQ. https://www.softstarsystems.com/faq.htm | Not stated |
| Menzies T., Yang Y., Mathew G., Boehm B., Hihn J. Negative results for software effort estimation. arXiv:1609.05563. https://arxiv.org/abs/1609.05563 | 2016 |
| rOpenSci, How much work is onboarding? https://ropensci.org/blog/2018/05/03/onboarding-is-work/ | 3 May 2018 |
| Reserve Bank of Australia exchange rates. https://www.rba.gov.au/statistics/frequency/exchange-rates.html | 15 Oct 2026 |
