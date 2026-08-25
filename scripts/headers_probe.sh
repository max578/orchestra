#!/usr/bin/env bash
# G5 / V3+V4 — live security-header probe of a deployed origin.
# Grades against the OWASP canon (grounded r1 F6/F7). Usage:
#   headers_probe.sh https://example.com
#   headers_probe.sh --from-file <saved-headers.txt>   (offline fixture mode:
#     grades a recorded header dump so the self-check can exercise the
#     grading logic without a network — uplift U0.8)
# Exit 0 = all blocker rows pass; 1 = failures; 2 = usage/fetch error.
set -u
URL="${1:-}"
[ -z "$URL" ] && { echo "usage: headers_probe.sh <https-url> | --from-file <headers.txt>"; exit 2; }

if [ "$URL" = "--from-file" ]; then
  FILE="${2:-}"
  [ -f "$FILE" ] || { echo "usage: headers_probe.sh --from-file <headers.txt>"; exit 2; }
  HDRS=$(tr -d '\r' < "$FILE")
  URL="https://fixture.invalid"   # fixture dumps are graded as https
else
  HDRS=$(curl -sSIL --max-time 20 "$URL" 2>/dev/null | tr -d '\r')
fi
[ -z "$HDRS" ] && { echo "FAIL: could not fetch $URL"; exit 2; }
# grade against the FINAL response's headers (after redirects)
FINAL=$(printf '%s\n' "$HDRS" | awk 'BEGIN{RS=""} END{print}')

fails=0
need() { # need <label> <header-regex> [<value-regex>]
  local label="$1" hdr="$2" val="${3:-.}"
  local line
  line=$(printf '%s\n' "$FINAL" | grep -i "^$hdr:" | head -1)
  if [ -z "$line" ]; then
    echo "FAIL $label: header absent"; fails=$((fails+1)); return
  fi
  if ! printf '%s' "$line" | grep -qiE "$val"; then
    echo "FAIL $label: value check failed -> $line"; fails=$((fails+1)); return
  fi
  echo "pass $label: $line"
}
absent() { # deprecated headers must NOT be sent (X-XSS-Protection only as 0)
  local hdr="$1"
  if printf '%s\n' "$FINAL" | grep -qi "^$hdr:"; then
    echo "FAIL deprecated header present: $hdr"; fails=$((fails+1))
  else
    echo "pass no $hdr"
  fi
}

need "HSTS"              "strict-transport-security" "max-age=(6307200[0-9]|[7-9][0-9]{7,}|63072000)"
need "CSP"               "content-security-policy"   "frame-ancestors"
# grep -E lacks lookahead; check script-src unsafe-inline explicitly:
if printf '%s\n' "$FINAL" | grep -i "^content-security-policy:" | grep -qi "script-src[^;]*unsafe-inline"; then
  echo "FAIL CSP: script-src contains unsafe-inline"; fails=$((fails+1))
else
  echo "pass CSP script-src free of unsafe-inline"
fi
need "X-Content-Type-Options" "x-content-type-options" "nosniff"
need "Referrer-Policy"   "referrer-policy"
need "COOP"              "cross-origin-opener-policy" "same-origin"
need "CORP"              "cross-origin-resource-policy" "same-origin"
need "Permissions-Policy" "permissions-policy"
absent "feature-policy"
absent "expect-ct"
absent "public-key-pins"
if printf '%s\n' "$FINAL" | grep -i "^x-xss-protection:" | grep -qvE ":\s*0\s*$"; then
  echo "FAIL X-XSS-Protection present with non-zero value"; fails=$((fails+1))
fi
case "$URL" in
  https://*) echo "pass scheme https" ;;
  *) echo "FAIL scheme not https"; fails=$((fails+1)) ;;
esac

echo "headers_probe: $([ $fails -eq 0 ] && echo PASS || echo "FAIL ($fails)")"
[ $fails -eq 0 ]
