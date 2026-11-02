---
{id: TSK-C9C28F18E04D,name: "Regenerate, adapt, rebuild the database and document",type: task,status: planned,priority: medium,created_at: 2026-11-02T06:41:22.755Z,updated_at: 2026-11-02T06:41:22.755Z,due_at: 2026-11-02,order: 5120}
---

# Regenerate, adapt, rebuild the database and document

## Goal

After the contracts are rewritten, regenerate the API once, repair project-owned code and tests, recreate the development database on the new schemas, run every suite on PostGIS and update the documentation and handoffs.

## Context

The rewrite changes table names, removes provenance columns, adds four schemas and removes people from governance. Project-owned files that must change: service implementations (new operations), hand-written SQL in geography use cases and governance, the fixture loader and fixtures, dev-db script, integration tests and their grants, and the data engine handoff. The shared PostGIS container holds other projects' databases; only mzizi_dev is dropped and recreated. Use the schema creation helper before synchronizing.

## Acceptance checklist

- [ ] Run the contract checks, regenerate, and fix the post-generation typecheck.
- [ ] Update hand-written SQL, service implementations, fixtures, loaders and tests.
- [ ] Drop and recreate mzizi_dev, load fixtures, boot the API and exercise the new endpoints.
- [ ] Run the full suite against PostGIS.
- [ ] Update the naming rule, domain catalog, architecture notes and data engine handoff; run task validate.
