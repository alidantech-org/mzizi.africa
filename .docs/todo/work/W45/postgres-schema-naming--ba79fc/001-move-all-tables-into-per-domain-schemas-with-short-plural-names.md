---
{id: TSK-BEF6D2097C05,name: Move all tables into per-domain schemas with short plural names,type: task,status: completed,priority: medium,created_at: 2026-11-02T06:15:28.512Z,updated_at: 2026-11-02T06:20:46.203Z,due_at: 2026-11-02,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T06:15:28.687Z},{from: in-progress,to: completed,at: 2026-11-02T06:20:46.203Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-BEF6D2097C05/1793600128689-start,started_at: 2026-11-02T06:15:28.930Z,end_ref: refs/tracking/TSK-BEF6D2097C05/1793600446205-end,ended_at: 2026-11-02T06:20:46.204Z,summary: {files: 105,insertions: 650,deletions: 459}}]}}}
---

# Move all tables into per-domain schemas with short plural names

## Goal

Replace the single public schema with one schema per domain and rename every table to a short, non-redundant, plural name, for example geo.units instead of public.geo_units. Recreate the development database on the new layout and keep every test green.

## Context

The rule: schemas are singular, one word where possible, named for the domain; tables are plural, one word where possible, never repeat the schema name (no geo.geo_units), and use an underscore only when two words are really needed. The full map is in .docs/rules/database-naming.md. Dryv supports a storage namespace on a group (group facets storage namespace) and the entity pack emits it as the TypeORM schema option. Places that mention table names by hand: the geography and governance raw SQL use cases, the audit target-kind validation and the access-rules export (target kinds become schema-qualified), the integration tests and their role grants (GRANT on ALL TABLES IN SCHEMA public no longer applies), the dev schema script (TypeORM dropSchema only drops public), and the docs. The old mzizi_dev database is dropped and recreated; the shared postgis container also holds other projects' databases, which must not be touched.

## Acceptance checklist

- [x] Publish the naming rule and the old-to-new table map in .docs/rules/database-naming.md and link it from the architecture notes.
- [x] Set a storage namespace on every group and shorten every table name per the map; no entity remains in public.
- [x] Extend the contract audit to enforce the rule (namespace present, singular schema, no schema prefix in table names, at most one underscore, unique schema and table).
- [x] Regenerate the API and make target kinds schema-qualified while keeping them safe to use as identifiers.
- [x] Update hand-written SQL, scripts, tests and role grants; run typecheck and the full suite against PostGIS.
- [x] Drop and recreate the development database, load the fixtures, boot the API and check real endpoints.
- [x] Update the docs, the contract catalog and the data engine handoff; run task validate.

## Progress

Published the rule and the full old-to-new map in .docs/rules/database-naming.md. All 14 groups now set a storage namespace and every table was renamed: 69 tables in 14 singular schemas (reference, geo, legal, governance, electoral, political, calendar, org, finance, debt, procurement, statistic, civic, audit) with short plural names, for example geo.units, legal.instruments, audit.comments, governance.aliases; nothing is in public. The contract audit now enforces namespace present and never public, one-word singular schema, table not prefixed with its schema, at most one underscore and uniqueness per schema, and was verified to fail on geo_units and a three-word name. Regenerating changed only the 69 entity decorators. Hand-written SQL in 9 use cases, the audit target-kind validation (target kinds are now schema-qualified and quoted per part), the per-schema read-only and writer grants, and the dev script were updated. Found and fixed: TypeORM creates enum types before the table's schema, so a shared synchronizeDomainSchemas helper creates schemas first (dev script and all five integration suites), and dropSchema only affects public, so dev resets drop each domain schema. The old mzizi_dev database was dropped and recreated on the new layout with the 56 fixture rows; the API booted and answered reference, geography (hierarchy, history, map context, governance), finance, legal, governance and audit reads. Full suite on PostGIS: 506 files, 14277 tests; bun run check, generated:check and the boundary check pass. The schema integration test now also asserts no table is in public.
