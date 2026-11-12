---
{id: TSK-41CD5EF36909,name: Probe expected sites and confirm hostnames,type: task,status: completed,priority: medium,created_at: 2026-11-02T19:26:08.084Z,updated_at: 2026-11-03T11:12:15.204Z,order: 41984,depends_on: [TSK-998EC5BE2CBA],due_at: 2026-11-05,extra: {status_history: [{from: planned,to: completed,at: 2026-11-03T11:12:15.204Z}]},archived_at: 2026-11-12T05:47:56.094Z}
---

# Probe expected sites and confirm hostnames

## Goal

Turn the 481 expected site records into confirmed ones by probing each candidate hostname through the collection gate, so the registry says which sites exist, which hostnames are real, which are down, and which belong to which institution.

## Context

On 2 November 2026 the real database received site records for every county government (47), every county assembly (47), every constituency development fund committee (290), and 89 national bodies (ministries, courts, constitutional commissions, independent offices, state corporations, regulators and portals), each linked to the institution or geography unit it serves, plus the sites already profiled (Parliament, IEBC, Kenya Law, KLRC, NG-CDF, tenders, HDX, geoBoundaries). All the new records have status expected and unverified candidate hostnames kept in a reachability check; none was contacted. Hostnames come from domain patterns and from general knowledge, so many will be wrong (counties spell names with and without hyphens, some bodies use .or.ke, .co.ke or .ac.ke). Probing must stay inside the gate: only hosts covered by an approved assessment, identified requests, robots.txt respected, 0.2 requests per second, stop on a challenge. Hosts outside the .go.ke rule need an assessment first.

## Acceptance checklist

- [x] Probe the .go.ke candidates (counties, assemblies, national bodies) with a bounded GET of the home page and record reachable, unreachable or refused for each.
- [x] Create domain rows for confirmed hostnames and move confirmed sites from expected to profiled, recording redirects as aliases.
- [x] For non-.go.ke bodies, assess the host and probe only after assessment.
- [x] Try the constituency NG-CDF pattern against the real NG-CDF site layout and correct the pattern if the per-constituency pages live on ngcdf.go.ke paths rather than subdomains.
- [x] Report counts by outcome and by family in the status document.
