#!/usr/bin/env python3
"""G11 / V11 — recompute WCAG contrast for every declared token pair.

Reads a tokens.css whose pairs are declared as comments:
    /* pair: --fg-var on --bg-var */
Resolves each var in the base :root scope and again under any
`prefers-color-scheme: dark` override block, and fails (exit 1) if any
resolved pair falls below the AA body-text floor (4.5:1).

Usage: tokens_contrast.py <tokens.css> [--min 4.5]
"""
import re
import sys


def luminance(hexcolor: str) -> float:
    h = hexcolor.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    channels = []
    for i in (0, 2, 4):
        v = int(h[i:i + 2], 16) / 255.0
        channels.append(v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4)
    r, g, b = channels
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(fg: str, bg: str) -> float:
    hi, lo = sorted((luminance(fg), luminance(bg)), reverse=True)
    return (hi + 0.05) / (lo + 0.05)


def parse_scopes(css: str):
    """Return (base_vars, dark_vars) as dicts of --name -> #hex."""
    var_re = re.compile(r"(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\b")
    dark_m = re.search(
        r"@media[^{]*prefers-color-scheme\s*:\s*dark[^{]*\{(.*)\}", css, re.S)
    dark_block = dark_m.group(1) if dark_m else ""
    base_block = css[:dark_m.start()] + css[dark_m.end():] if dark_m else css
    base = dict(var_re.findall(base_block))
    dark = dict(base, **dict(var_re.findall(dark_block)))
    return base, dark


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    path = sys.argv[1]
    floor = float(sys.argv[sys.argv.index("--min") + 1]) if "--min" in sys.argv else 4.5
    css = open(path, encoding="utf-8").read()
    pairs = re.findall(r"pair:\s*(--[\w-]+)\s+on\s+(--[\w-]+)", css)
    if not pairs:
        print(f"FAIL: no `pair: --fg on --bg` declarations found in {path}")
        return 1
    base, dark = parse_scopes(css)
    failures = 0
    for scope_name, scope in (("light", base), ("dark", dark)):
        for fg, bg in pairs:
            if fg not in scope or bg not in scope:
                print(f"FAIL [{scope_name}] {fg} on {bg}: variable not resolvable")
                failures += 1
                continue
            r = ratio(scope[fg], scope[bg])
            verdict = "pass" if r >= floor else "FAIL"
            if r < floor:
                failures += 1
            print(f"{verdict} [{scope_name}] {fg} on {bg}: "
                  f"{scope[fg]} / {scope[bg]} = {r:.2f}:1 (floor {floor})")
    print(f"tokens_contrast: {'PASS' if failures == 0 else 'FAIL'} "
          f"({len(pairs)} pairs x 2 schemes, {failures} failures)")
    return 0 if failures == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
