---
{id: TSK-38F9B96B1772,name: Plan legacy FastAPI responsibility and data migration,type: task,status: planned,priority: high,created_at: 2026-11-01T00:36:41.444Z,updated_at: 2026-11-01T05:36:14.912Z,tags: [api,migration,architecture],depends_on: [TSK-39C88A553155],extra: {description: "Turn the legacy service inventory into an incremental migration plan for approved API endpoints, database lifecycle, extraction, files, and intelligence responsibilities. Preserve behavior and data until replacements are verified.",acceptance_criteria: ["Every retained model, route, migration, seed, and file/extraction behavior has a target owner.","Migration sequence includes data compatibility, rollback, and verification steps.",No legacy code is removed before equivalent ownership and behavior are accounted for.]},due_at: 2026-11-08}
---

# Plan legacy FastAPI responsibility and data migration

## Summary

Plan an incremental migration of FastAPI responsibilities and data into target services without breaking existing callers or losing data lineage.

## Acceptance criteria

- [ ] Map every legacy responsibility to API, db-engine, data-engine, files, or intelligence.
- [ ] Sequence includes data compatibility, verification, rollback, and caller cutover.
- [ ] Removal is gated on equivalent tested behavior and accounted data.
