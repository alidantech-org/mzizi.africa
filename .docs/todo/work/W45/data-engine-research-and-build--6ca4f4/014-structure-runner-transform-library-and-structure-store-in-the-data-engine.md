---
{id: TSK-F7EA5346CF21,name: "Structure runner, transform library and structure store in the data engine",type: task,status: planned,priority: medium,created_at: 2026-11-02T07:26:37.481Z,updated_at: 2026-11-02T07:26:37.481Z,due_at: 2026-11-20,order: 14336}
---

# Structure runner, transform library and structure store in the data engine

## Goal
Make the data engine load a site's active structure version from the files service, resolve the current domain, run discovery, fetch and extraction deterministically, record captures with site, domain and structure ids, apply mappings to produce candidates, and write drift checks.

## Context
Read .docs/docs/WEBSITE_DESIGN.md, .docs/docs/SITE_STRUCTURE_SPEC.md and .docs/decisions/website-schema-and-structure.md first. A site is not its domain: domains are dated and many per site. Work only on develop, record progress here and tick items with task check. No model runs at extraction time. Politeness policy (robots, rate limits) from the manifest is enforced by the runner. Mismatches against the expect block mark the site degraded and stop jobs instead of guessing. Depends on the data package v1 and staging tasks.

## Acceptance checklist
- [ ] Structure loader reading a version bundle and manifest hash through the files interface.
- [ ] Runner for http and api modes with pagination, selector alternatives and rate limiting.
- [ ] Transform library (date, decimal, fiscal year, lookup, name normalisation) with tests.
- [ ] Captures and candidates written with site, domain and structure version lineage.
- [ ] Drift detection writing website.checks and pausing affected jobs.
