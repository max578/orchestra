#!/usr/bin/env python3
"""GATE_REPORT generator — the scorecard writes the report, never the model
(uplift U0.4; HAR A-family: no artefact, no "passes" claim).

Merges one or more site_audit scorecard JSONs plus individual gate-result
JSONs into a GATE_REPORT.md in which EVERY canonical gate appears exactly
once as PASS / FAIL / SKIPPED / DEFERRED(reason) / NOT-RUN. NOT-RUN rows
make silent skips impossible (audit finding I7) and fail the generator.

Inputs:
  --scorecard <site-audit.json>     (repeatable; gates keyed "G2:lighthouse")
  --result "G9=pass|<evidence>|<detail>"   (repeatable; for gates run by
                                     standalone tools: leak_guard, contrast,
                                     probes, register_sweep, human G14)
  --deferred "G5=needs real origin" (repeatable)
  --out GATE_REPORT.md  --title "<instance name>"

Exit 0 = report written and no FAIL/NOT-RUN; 1 = report written but the
scorecard blocks ship (honest red); 2 = usage error.
"""
import json
import os
import sys
from datetime import date

CANONICAL = ["G1", "G2", "G3", "G3-kb", "G3b", "G4", "G5", "G6", "G7", "G8",
             "G9", "G10", "G11", "G11b", "G12", "G13", "G14", "G14b", "G15"]
OPTIONAL = {"G3b", "G14b", "G15"}  # advisory/new gates: NOT-RUN allowed until adopted by the instance blueprint


def parse(argv):
    opts = {"scorecards": [], "results": [], "deferred": {}, "out": None, "title": "instance"}
    i = 0
    while i < len(argv):
        a = argv[i]
        if a == "--scorecard":
            opts["scorecards"].append(argv[i + 1]); i += 2
        elif a == "--result":
            opts["results"].append(argv[i + 1]); i += 2
        elif a == "--deferred":
            k, _, v = argv[i + 1].partition("=")
            opts["deferred"][k.strip()] = v.strip() or "deferred"; i += 2
        elif a == "--out":
            opts["out"] = argv[i + 1]; i += 2
        elif a == "--title":
            opts["title"] = argv[i + 1]; i += 2
        else:
            print(f"unknown arg: {a}"); return None
    if not opts["out"]:
        print(__doc__); return None
    return opts


def main() -> int:
    opts = parse(sys.argv[1:])
    if opts is None:
        return 2

    gates = {}  # gate -> (status, detail, evidence)

    def put(gate, status, detail, evidence):
        # fail trumps everything; a real pass beats a mode-deferral/skip;
        # among equal ranks the later artefact wins
        cur = gates.get(gate)
        rank = {"fail": 3, "pass": 2, "skipped": 1, "deferred": 1}
        if cur is None or rank.get(status, 0) >= rank.get(cur[0], 0):
            gates[gate] = (status, detail, evidence)

    for sc_path in opts["scorecards"]:
        if not os.path.isfile(sc_path):
            print(f"FAIL: no such scorecard {sc_path}"); return 2
        sc = json.load(open(sc_path, encoding="utf-8"))
        for r in sc.get("results", []):
            gate = r["gate"].split(":")[0]
            detail = r["detail"] if isinstance(r["detail"], str) else json.dumps(r["detail"])
            put(gate, r["status"], detail.split("\n")[0][:160], os.path.basename(sc_path))

    for spec in opts["results"]:
        head, _, rest = spec.partition("=")
        status, _, tail = rest.partition("|")
        evidence, _, detail = tail.partition("|")
        put(head.strip(), status.strip().lower(), (detail or "").strip()[:160], (evidence or "manual").strip())

    for g, reason in opts["deferred"].items():
        put(g, "deferred", reason, "blueprint/ship plan")

    rows, n_fail, n_notrun = [], 0, 0
    for g in CANONICAL:
        if g in gates:
            status, detail, evidence = gates[g]
        elif g in OPTIONAL:
            status, detail, evidence = "not-adopted", "advisory gate not adopted by this instance", "-"
        else:
            status, detail, evidence = "NOT-RUN", "no artefact — this row blocks the report going green", "-"
            n_notrun += 1
        if status == "fail":
            n_fail += 1
        rows.append((g, status, detail, evidence))

    verdict = "SHIP-BLOCKED" if (n_fail or n_notrun) else (
        "READY (deferred gates pending live origin)" if any(s == "deferred" for _, s, _, _ in rows) else "READY")

    md = [f"# GATE_REPORT — {opts['title']}", "",
          f"Generated {date.today().isoformat()} by gate_report.py from scorecard artefacts —",
          "not hand-written. Every canonical gate appears; NOT-RUN rows block.",
          "", f"**Verdict: {verdict}**", "",
          "| Gate | Status | Evidence | Detail |", "|---|---|---|---|"]
    for g, status, detail, evidence in rows:
        md.append(f"| {g} | {status.upper()} | {evidence} | {detail} |")
    md.append("")
    open(opts["out"], "w", encoding="utf-8").write("\n".join(md))
    print(f"gate_report: {verdict} -> {opts['out']} ({n_fail} fail, {n_notrun} not-run)")
    return 0 if verdict.startswith("READY") else 1


if __name__ == "__main__":
    sys.exit(main())
