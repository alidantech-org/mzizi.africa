---
{id: TSK-CB080B155C94,name: Implement use cases for the read APIs of all domains,type: task,status: planned,priority: medium,created_at: 2026-11-02T05:14:40.483Z,updated_at: 2026-11-02T05:14:46.913Z,order: 16384,due_at: 2026-11-02}
---

# Implement use cases for the read APIs of all domains

## Goal

Make every generated read endpoint return real data from PostgreSQL through the read-only role, by completing the project-owned use cases that Dryv scaffolds once, and prove it with integration tests.

## Context

Dryv scaffolds a use case per HTTP operation and a service implementation per feature; those files belong to the project. For plain list and detail reads the scaffold already queries the generated entity through the data source. Custom reads such as search, hierarchy and boundaries need hand-written queries, as the geography read slice shows (src/modules/geography/geography-read). Tests run against a scratch PostGIS database through a SELECT-only role, as in geography-read.integration.spec.ts. Depends on the generate-and-validate task.

## Acceptance checklist

- [ ] Review each scaffolded list and detail use case, fixing filters, sorting, pagination and not-found handling.
- [ ] Write the custom geography reads still open: map context, hierarchy, boundaries by level and governance by geography id.
- [ ] Add integration tests per domain that seed records and call the use cases through the read-only role.
- [ ] Confirm no use case writes to a domain table.
- [ ] Run typecheck and the full test suite.
