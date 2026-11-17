#!/usr/bin/env bash
# Checks the running dev stack end to end and exits non-zero on the first failure:
# the API answers from the dev database (position lookup, Swahili labels, evidence, sources, search, geometry),
# the engine is healthy and reachable through the portal's server-side proxy, and the three frontends respond.
set -uo pipefail
fail=0
check() { # name, ok-condition result
  if [ "$2" = "ok" ]; then echo "ok    $1"; else echo "FAIL  $1"; fail=1; fi
}
json() { python3 -c "import json,sys
try:
    d=json.load(sys.stdin)
    print($1)
except Exception as e:
    print('error')" 2>/dev/null; }
API=${API:-http://127.0.0.1:8700}
profile=$(curl -s -m10 "$API/v1/locality/at?latitude=-1.2676&longitude=36.8108")
check "API position lookup returns the Karura chain" "$(echo "$profile" | json "'ok' if [u['name'] for u in d['chain']][-3:]==['Nairobi','Westlands','Karura'] else 'no'")"
check "API officials carry evidence" "$(echo "$profile" | json "'ok' if len(d['officials'])==3 and all(o['evidence'] for o in d['officials']) else 'no'")"
check "API procurement is summarised in KES" "$(echo "$profile" | json "'ok' if d['procurement']['count']>0 and d['procurement']['currency']=='KES' else 'no'")"
sw=$(curl -s -m10 "$API/v1/locality/at?latitude=-1.2676&longitude=36.8108&languageCode=sw")
check "API serves Swahili labels" "$(echo "$sw" | json "'ok' if d['languageServed']=='sw' and any(o['officeTitle'].startswith('Mbunge') for o in d['officials']) else 'no'")"
check "API search finds Westlands first" "$(curl -s -m10 "$API/v1/locality/search?query=westlands" | json "'ok' if d['places'][0]['name']=='Westlands' else 'no'")"
check "API lists languages" "$(curl -s -m10 "$API/v1/languages" | json "'ok' if {'en','sw'} <= {l['code'] for l in d['languages']} else 'no'")"
check "API lists sources" "$(curl -s -m10 "$API/v1/sources?limit=2" | json "'ok' if len(d['sources'])==2 else 'no'")"
fid=$(echo "$profile" | json "d['place']['featureId']")
check "API geometry for the place is GeoJSON" "$(curl -s -m10 "$API/v1/geography/features/$fid/geometries" | json "'ok' if d['geometries'][0]['geometry']['type'] in ('Polygon','MultiPolygon') else 'no'")"
cit=$(echo "$profile" | json "d['officials'][0]['evidence'][0]['citationId']")
check "API evidence detail resolves" "$(curl -s -m10 "$API/v1/evidence/$cit" | json "'ok' if d['evidence']['locator'].startswith('Line') else 'no'")"
check "API answers 404 outside any outline" "$([ "$(curl -s -m10 -o /dev/null -w '%{http_code}' "$API/v1/locality/at?latitude=48.85&longitude=2.35")" = 404 ] && echo ok || echo no)"
check "engine is healthy" "$(curl -s -m10 http://127.0.0.1:8800/health | json "'ok' if d['status']=='ok' else 'no'")"
check "portal proxy reaches engine capabilities" "$(curl -s -m20 http://127.0.0.1:3400/api/engine/capabilities | json "'ok' if len(d['capabilities'])>0 else 'no'")"
check "portal refuses paths it does not forward" "$([ "$(curl -s -m10 -o /dev/null -w '%{http_code}' http://127.0.0.1:3400/api/engine/internal/v1/capabilities/execute)" = 403 ] && echo ok || echo no)"
for entry in "site|http://127.0.0.1:3300/place-search" "portal|http://127.0.0.1:3400/capability-list" "flutter|http://127.0.0.1:8090/"; do
  code=$(curl -s -m20 -o /dev/null -w '%{http_code}' "${entry#*|}")
  check "${entry%%|*} responds" "$([ "$code" = 200 ] && echo ok || echo no)"
done
exit $fail
