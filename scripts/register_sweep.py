#!/usr/bin/env python3
"""G13 — mechanical claim-register sweep (uplift U0.6).

Reads an instance claim register (TSV: claim_id, referent, statement,
authority, oracle, status, escape, signoff) and fails when:

1. any row whose status contains "[unverified]" carries an escape that binds
   in the requested scope — "blocks ship" always binds at ship scope;
   "blocks <X> ... only" binds when <X> is passed via --scope; and
2. (with --dist) any ungrounded row whose claim_id has a mapped shipped
   surface in a `surfaces.json` beside the register actually matches the
   built output — the shipped-but-ungrounded case that motivated this gate
   (audit finding I8: robots.txt shipped an AI-crawler policy while its
   register row was still [unverified]/blocks-ship).

surfaces.json format: { "<claim_id>": {"path": "robots.txt",
                                        "pattern": "GPTBot|ClaudeBot"} }

Usage: register_sweep.py <register.tsv> [--dist <dir>] [--scope ship]
       (repeat --scope for extra scopes, e.g. --scope ship --scope W6)
Exit 0 = no binding ungrounded rows; 1 = blockers; 2 = usage error.
"""
import csv
import json
import os
import re
import sys


def parse_args(argv):
    if not argv or argv[0].startswith("--"):
        print(__doc__)
        return None
    reg, dist, scopes = argv[0], None, []
    i = 1
    while i < len(argv):
        if argv[i] == "--dist" and i + 1 < len(argv):
            dist = argv[i + 1]; i += 2
        elif argv[i] == "--scope" and i + 1 < len(argv):
            scopes.append(argv[i + 1].lower()); i += 2
        else:
            print(f"unknown arg: {argv[i]}"); return None
    return reg, dist, scopes or ["ship"]


def binds(escape: str, scopes) -> bool:
    e = escape.lower().strip()
    if "blocks ship" in e:
        return "ship" in scopes
    m = re.match(r"blocks\s+(.+?)\s+(?:ship\s+|implementation\s+|completion\s+)?only", e)
    if m:
        token = m.group(1).lower()
        return any(s in token or token in s for s in scopes)
    return False  # silent / advisory / dormant / re-verify notes never bind


def main() -> int:
    parsed = parse_args(sys.argv[1:])
    if not parsed:
        return 2
    reg_path, dist, scopes = parsed
    if not os.path.isfile(reg_path):
        print(f"FAIL: no such register: {reg_path}")
        return 2

    with open(reg_path, encoding="utf-8") as fh:
        rows = list(csv.DictReader(fh, delimiter="\t"))
    surfaces = {}
    sj = os.path.join(os.path.dirname(os.path.abspath(reg_path)), "surfaces.json")
    if os.path.exists(sj):
        surfaces = json.load(open(sj, encoding="utf-8"))

    blockers = advisories = 0
    for row in rows:
        status = (row.get("status") or "").strip()
        escape = (row.get("escape") or "").strip()
        cid = (row.get("claim_id") or "?").strip()
        if "[unverified]" not in status:
            continue
        bound = binds(escape, scopes)
        shipped = ""
        if dist and cid in surfaces:
            spath = os.path.join(dist, surfaces[cid].get("path", ""))
            if os.path.exists(spath):
                text = open(spath, encoding="utf-8", errors="replace").read()
                if re.search(surfaces[cid].get("pattern", "$^"), text):
                    shipped = f" — SHIPPED SURFACE MATCHES ({surfaces[cid]['path']})"
                    bound = True  # shipping an ungrounded decision always binds
        if bound:
            blockers += 1
            print(f"BLOCK [{cid}] [unverified] escape='{escape}'{shipped}")
        else:
            advisories += 1
            print(f"open  [{cid}] [unverified] escape='{escape}' (not binding in scope {scopes})")

    verdict = "PASS" if blockers == 0 else "FAIL"
    print(f"register_sweep: {verdict} ({len(rows)} rows, {blockers} blocking, {advisories} open non-blocking; scopes={scopes})")
    return 0 if blockers == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
