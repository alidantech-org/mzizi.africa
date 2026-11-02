---
{id: TSK-998EC5BE2CBA,name: Backfill candidate domain records for every site and record zones,type: task,status: completed,priority: medium,created_at: 2026-11-02T20:02:41.170Z,updated_at: 2026-11-02T21:52:46.652Z,order: 2048,depends_on: [TSK-2FE5E3594E4C],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T21:52:45.225Z},{from: in-progress,to: completed,at: 2026-11-02T21:52:46.652Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-998EC5BE2CBA/1793656365229-start,started_at: 2026-11-02T21:52:46.512Z,end_ref: refs/tracking/TSK-998EC5BE2CBA/1793656366655-end,ended_at: 2026-11-02T21:52:46.653Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# Backfill candidate domain records for every site and record zones

## Goal

Create the missing domain rows: one for each candidate hostname of each of the 481 sites, with source and reason, and link them to zones and parent domains.

## Context

Candidate hostnames exist in two places: the expected-site reachability checks written by `expand-patterns` (for example `nakuru.go.ke` and `nakuru.go.ke` variants without hyphens for each county, `{county}assembly.go.ke`, and `{constituency}.ngcdf.go.ke` such as `westlands.ngcdf.go.ke`), and the `hosts` lists in `fixtures/seed/ke-expected-sites.json`. Expansion must be changed to write domain rows directly with status candidate, source pattern and the pattern id, one row per spelling variant, and the seeder must do the same for the seed hosts. Rows already existing for confirmed domains keep their facts. Subdomains such as `westlands.ngcdf.go.ke` take `ngcdf.go.ke` as parent domain, and every domain links to its zone (for example `.go.ke`). The backfill is offline and idempotent; no request is made. The result must be a count of domains by status, zone and source in the status document.

## Acceptance checklist

- [x] Change `expand-patterns` to create domain rows for every spelling variant, with source and pattern reference.
- [x] Change the expected-sites seeder to create domain rows for the seed hosts.
- [x] Backfill rows for existing expected sites from their reachability checks.
- [x] Link domains to zones and subdomains to parent domains.
- [x] Report counts by status, zone and source.
- [x] Add tests that a second run creates nothing and that a confirmed domain is not downgraded.

## Result (3 November 2026, real database)

Migrations 1793900000000 and 1793900000001 applied to `mzizi` after a pg_dump snapshot in `.data/backups`; zones seeded (12). Domains: 640 rows (627 candidate, 13 reachable); by origin: pattern 514, seed_research 111, manual 13, none 2; by zone: go.ke 613, org 10, or.ke 7, co.ke 6, ac.ke 2, com 1, none 1; 413 subdomains linked to a parent domain; every one of the 481 sites has at least one domain. Offline command: `python -m mzizi_data.cli backfill-domains` (idempotent, second run creates nothing).
