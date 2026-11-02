---
{id: TSK-998EC5BE2CBA,name: Backfill candidate domain records for every site and record zones,type: task,status: planned,priority: medium,created_at: 2026-11-02T20:02:41.170Z,updated_at: 2026-11-02T20:02:41.170Z,order: 2048}
---

# Backfill candidate domain records for every site and record zones

## Goal

Create the missing domain rows: one for each candidate hostname of each of the 481 sites, with source and reason, and link them to zones and parent domains.

## Context

Candidate hostnames exist in two places: the expected-site reachability checks written by `expand-patterns` (for example `nakuru.go.ke` and `nakuru.go.ke` variants without hyphens for each county, `{county}assembly.go.ke`, and `{constituency}.ngcdf.go.ke` such as `westlands.ngcdf.go.ke`), and the `hosts` lists in `fixtures/seed/ke-expected-sites.json`. Expansion must be changed to write domain rows directly with status candidate, source pattern and the pattern id, one row per spelling variant, and the seeder must do the same for the seed hosts. Rows already existing for confirmed domains keep their facts. Subdomains such as `westlands.ngcdf.go.ke` take `ngcdf.go.ke` as parent domain, and every domain links to its zone (for example `.go.ke`). The backfill is offline and idempotent; no request is made. The result must be a count of domains by status, zone and source in the status document.

## Acceptance checklist

- [ ] Change `expand-patterns` to create domain rows for every spelling variant, with source and pattern reference.
- [ ] Change the expected-sites seeder to create domain rows for the seed hosts.
- [ ] Backfill rows for existing expected sites from their reachability checks.
- [ ] Link domains to zones and subdomains to parent domains.
- [ ] Report counts by status, zone and source.
- [ ] Add tests that a second run creates nothing and that a confirmed domain is not downgraded.
