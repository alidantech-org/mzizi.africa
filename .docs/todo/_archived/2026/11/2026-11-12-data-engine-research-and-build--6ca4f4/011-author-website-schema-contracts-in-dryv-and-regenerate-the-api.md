---
{id: TSK-55F47BC49B60,name: Author website schema contracts in Dryv and regenerate the API,type: task,status: completed,priority: medium,created_at: 2026-11-02T07:26:37.051Z,updated_at: 2026-11-02T08:05:52.951Z,due_at: 2026-11-09,order: 11264,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T08:00:14.951Z},{from: in-progress,to: completed,at: 2026-11-02T08:05:52.951Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-55F47BC49B60/1793606414953-start,started_at: 2026-11-02T08:00:15.237Z,end_ref: refs/tracking/TSK-55F47BC49B60/1793606752953-end,ended_at: 2026-11-02T08:05:52.951Z,summary: {files: 287,insertions: 13191,deletions: 11}}]}},archived_at: 2026-11-12T05:47:56.094Z}
---

# Author website schema contracts in Dryv and regenerate the API

## Goal
Model sites, domains, site-publisher links, structures, structure versions, structure files and checks as Dryv contracts so the generated entities, DTOs and read endpoints exist like every other schema, with soft links to source and filesystem.

## Context
Read .docs/docs/WEBSITE_DESIGN.md, .docs/docs/SITE_STRUCTURE_SPEC.md and .docs/decisions/website-schema-and-structure.md first. A site is not its domain: domains are dated and many per site. Work only on develop, record progress here and tick items with task check. Follow .docs/rules/database-naming.md (full-word schema, no cross-schema foreign keys). Generator limits are listed in dryv/README.md. Writes to this schema come from the engine, so the public API is read-only except for sites marked public.

## Acceptance checklist
- [x] Contracts for the seven tables with validity and precision on domains, soft ids for publisher, folder, file version and method.
- [x] Add soft site_id, domain_id and structure_version_id to source captures, and site_id to documents.
- [x] Read endpoints for sites, domains and structure versions with a file listing; tests following the existing API pattern.
- [x] Run bun run check and generated:check, update DATABASE_DESIGN.md catalogue and run task validate.

## Progress
Seven website tables authored (sites, domains, site_publishers, structures, structure_versions, structure_files, checks) plus soft links on source captures and documents. Generated with the Dryv API; contract check, generated:check, API typecheck and 13104 unit tests pass; db:reset now yields 19 schemas and 96 tables. A relation from a file to its version collided with the record version column, so that reference is a plain id. There is no hand-written integration test for the website endpoints yet; the generated specs cover them.
