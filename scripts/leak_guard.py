#!/usr/bin/env python3
"""G9 / V13 — public-surface leak scan over a built site directory.

Scans text files under <dist> for: home paths and usernames, secret
material, AI-tooling names (charter rule: never in deliverables), draft
markers, and internal flag words. Exit 1 on any hit (blocker gate).

An optional `.leakallow` file (one regex per line) beside the scanned
directory suppresses reviewed-and-accepted lines — every suppression is
reported, never silent.

Usage: leak_guard.py <dist-dir>
"""
import os
import re
import sys

PATTERNS = [
    ("home-path", re.compile(r"/Users/[A-Za-z0-9_.-]+|/home/[A-Za-z0-9_.-]+")),
    ("username", re.compile(r"\ba1222[0-9]+\b")),
    ("private-key", re.compile(r"BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY")),
    ("aws-key", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("gh-token", re.compile(r"\bghp_[A-Za-z0-9]{36}\b")),
    ("generic-secret", re.compile(r"\b[A-Z_]{3,}(?:_TOKEN|_KEY|_SECRET)\s*[:=]\s*['\"]?[A-Za-z0-9+/_-]{8,}")),
    ("ai-tooling", re.compile(r"\b(?:Claude|Anthropic|ChatGPT|OpenAI|Copilot|GPT-[0-9])\b")),
    ("draft-marker", re.compile(r"\b(?:TODO|FIXME|XXX|DRAFT)\b|lorem ipsum", re.I)),
    ("flag-word", re.compile(r"\[unverified\]|\bSA-gate\b|\bmega-skill\b")),
]

# Designed exemption (uplift U0.9, audit finding I9): crawler user-agent
# tokens are legitimate robots.txt content, not AI-tooling disclosure. They
# are stripped BEFORE the ai-tooling pattern runs, and ONLY inside a file
# named robots.txt — prose like "built with Claude" still trips anywhere,
# including robots.txt comments, because stripping is token-exact.
CRAWLER_UA = re.compile(
    r"\b(?:ClaudeBot|Claude-Web|Claude-SearchBot|anthropic-ai|GPTBot|"
    r"OAI-SearchBot|ChatGPT-User|Google-Extended|PerplexityBot|CCBot)\b")
TEXT_EXT = {".html", ".htm", ".css", ".js", ".mjs", ".json", ".txt", ".xml",
            ".svg", ".md", ".webmanifest", ".yaml", ".yml", ".toml"}


def load_allow(root: str):
    p = os.path.join(root, ".leakallow")
    if not os.path.exists(p):
        return []
    return [re.compile(l.strip()) for l in open(p, encoding="utf-8")
            if l.strip() and not l.startswith("#")]


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 2
    root = sys.argv[1].rstrip("/")
    if not os.path.isdir(root):
        print(f"FAIL: not a directory: {root}")
        return 2
    allow = load_allow(root)
    hits = suppressed = files = 0
    for dirpath, _dirnames, filenames in os.walk(root):
        for name in filenames:
            if os.path.splitext(name)[1].lower() not in TEXT_EXT:
                continue
            path = os.path.join(dirpath, name)
            files += 1
            try:
                lines = open(path, encoding="utf-8", errors="strict").read().splitlines()
            except (UnicodeDecodeError, OSError):
                continue
            is_robots = name.lower() == "robots.txt"
            for lineno, line in enumerate(lines, 1):
                for label, pat in PATTERNS:
                    probe = CRAWLER_UA.sub("", line) if (label == "ai-tooling" and is_robots) else line
                    if not pat.search(probe):
                        continue
                    rel = os.path.relpath(path, root)
                    if any(a.search(line) for a in allow):
                        suppressed += 1
                        print(f"allow [{label}] {rel}:{lineno}")
                    else:
                        hits += 1
                        print(f"LEAK [{label}] {rel}:{lineno}: {line.strip()[:120]}")
    verdict = "PASS" if hits == 0 else "FAIL"
    print(f"leak_guard: {verdict} ({files} files, {hits} leaks, {suppressed} allowed)")
    return 0 if hits == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
