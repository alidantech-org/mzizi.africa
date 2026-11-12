---
{id: TSK-F7EA5346CF21,name: "Structure runner, transform library and structure store in the data engine",type: task,status: completed,priority: medium,created_at: 2026-11-02T07:26:37.481Z,updated_at: 2026-11-02T09:11:24.556Z,due_at: 2026-11-20,order: 14336,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T09:06:22.774Z},{from: in-progress,to: completed,at: 2026-11-02T09:11:24.556Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-F7EA5346CF21/1793610382775-start,started_at: 2026-11-02T09:06:23.140Z,end_ref: refs/tracking/TSK-F7EA5346CF21/1793610684558-end,ended_at: 2026-11-02T09:11:24.556Z,summary: {files: 17,insertions: 1472,deletions: 17}}]}},archived_at: 2026-11-12T05:47:56.094Z}
---

# Structure runner, transform library and structure store in the data engine

## Goal
Make the data engine load a site's active structure version from the files service, resolve the current domain, run discovery, fetch and extraction deterministically, record captures with site, domain and structure ids, apply mappings to produce candidates, and write drift checks.

## Context
Read .docs/docs/WEBSITE_DESIGN.md, .docs/docs/SITE_STRUCTURE_SPEC.md and .docs/decisions/website-schema-and-structure.md first. A site is not its domain: domains are dated and many per site. Work only on develop, record progress here and tick items with task check. No model runs at extraction time. Politeness policy (robots, rate limits) from the manifest is enforced by the runner. Mismatches against the expect block mark the site degraded and stop jobs instead of guessing. Depends on the data package v1 and staging tasks.

## Acceptance checklist
- [x] Structure loader reading a version bundle and manifest hash through the files interface.
- [x] Runner for http and api modes with pagination, selector alternatives and rate limiting.
- [x] Transform library (date, decimal, fiscal year, lookup, name normalisation) with tests.
- [x] Captures and candidates written with site, domain and structure version lineage.
- [x] Drift detection writing website.checks and pausing affected jobs.

## Compliance (added after LEGALITY_SAFETY_AND_COMPLIANCE.md)
The runner must refuse any request unless the site has a current approved legal/source assessment covering the host, path, method and frequency (fail closed), enforce the manifest policy block with the most conservative limit, identify itself with a monitored user agent, stop on 401 403 429, repeated 5xx and access challenges without retry loops, and quarantine candidates when unexpected personal data appears. Add these items: assessment gate called before every fetch; policy enforcement tests; stop conditions write checks. Details are in the compliance controls task and the collection gate task.

## Progress
Structure store in the registry (publish a bundle as an immutable version in filesystem, validated or draft only; activation is a separate step; load verifies the manifest hash), deterministic runner for listing and api discovery with query and next-link pagination, ordered selector alternatives, transforms, family plus overlay resolution with subject variables, raw pages preserved before reading, captures carrying site, domain, structure, family and assessment ids, mapping to idempotent staging candidates that supersede on change, and drift detection (too few items, empty required fields, fallback selector recorded, redirects) that stops the module, marks the site degraded and writes checks. 82 pytest cases pass against PostGIS. Limits: no path pagination, no browser mode, no resource downloads (PDF links are extracted as records, not fetched), structure runs are single threaded, and the gate is evaluated per request from the database rather than cached.
