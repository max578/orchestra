#!/usr/bin/env bash
# G10 / V4 — DNS + canonicalisation posture for a deployed site.
# Usage: dns_check.sh <apex-domain>                (live probe)
#        dns_check.sh --fixture <dir> <apex-domain> (offline fixture mode:
#          reads a.txt aaaa.txt caa.txt www_code.txt tls.txt from <dir> so
#          the self-check exercises the grading logic — uplift U0.8)
# Exit 0 = pass, 1 = failures, 2 = usage error.
set -u
FIXTURE=""
if [ "${1:-}" = "--fixture" ]; then
  FIXTURE="${2:-}"; DOMAIN="${3:-}"
  [ -d "$FIXTURE" ] || { echo "usage: dns_check.sh --fixture <dir> <apex-domain>"; exit 2; }
else
  DOMAIN="${1:-}"
fi
[ -z "$DOMAIN" ] && { echo "usage: dns_check.sh <apex-domain>"; exit 2; }
fails=0

fx() { # fx <name> — fixture file contents (empty if absent)
  [ -n "$FIXTURE" ] && [ -f "$FIXTURE/$1" ] && cat "$FIXTURE/$1" || true
}

if [ -n "$FIXTURE" ]; then a=$(fx a.txt); aaaa=$(fx aaaa.txt); else
  a=$(dig +short A "$DOMAIN" | head -3); aaaa=$(dig +short AAAA "$DOMAIN" | head -3)
fi
if [ -z "$a$aaaa" ]; then
  echo "FAIL apex resolves: no A/AAAA for $DOMAIN"; fails=$((fails+1))
else
  echo "pass apex resolves: $(echo $a $aaaa | tr '\n' ' ')"
fi

if [ -n "$FIXTURE" ]; then caa=$(fx caa.txt); else caa=$(dig +short CAA "$DOMAIN"); fi
if [ -z "$caa" ]; then
  echo "FAIL CAA record absent (V4)"; fails=$((fails+1))
else
  echo "pass CAA: $caa"
fi

# www -> apex 301 canonicalisation (either direction accepted; must be 301/308)
if [ -n "$FIXTURE" ]; then code=$(fx www_code.txt); else
  code=$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' --max-time 15 "https://www.$DOMAIN" 2>/dev/null)
fi
case "$code" in
  30[18]\ *"//$DOMAIN"*) echo "pass www redirects to apex: $code" ;;
  200\ *) echo "FAIL www serves 200 (no canonicalisation)"; fails=$((fails+1)) ;;
  000\ *|"") echo "note: www not reachable (acceptable only if www record intentionally absent)" ;;
  *) echo "FAIL www canonicalisation: got $code"; fails=$((fails+1)) ;;
esac

# TLS floor
if [ -n "$FIXTURE" ]; then
  if [ "$(fx tls.txt)" = "ok" ]; then echo "pass TLS >= 1.2 negotiable"
  else echo "FAIL TLS 1.2 handshake failed"; fails=$((fails+1)); fi
elif command -v openssl >/dev/null; then
  if echo | openssl s_client -connect "$DOMAIN:443" -tls1_2 -servername "$DOMAIN" >/dev/null 2>&1; then
    echo "pass TLS >= 1.2 negotiable"
  else
    echo "FAIL TLS 1.2 handshake failed"; fails=$((fails+1))
  fi
fi

echo "dns_check: $([ $fails -eq 0 ] && echo PASS || echo "FAIL ($fails)")"
[ $fails -eq 0 ]
