---
{id: TSK-39C88A553155,name: "API: Inventory legacy FastAPI contracts and migration boundaries",type: task,status: planned,priority: high,created_at: 2026-11-01T00:35:56.137Z,updated_at: 2026-11-01T05:36:47.962Z,tags: [api,architecture],extra: {description: "Map current routes, models, migrations, seed data, and callers. Identify what belongs in the target NestJS API versus data-engine, files, db-engine, and intelligence. Preserve current behavior and produce a migration inventory before implementing replacements."},due_at: 2026-11-08}
---

# API: Inventory legacy FastAPI contracts and migration boundaries

## Summary

Map current routes, models, migrations, seed data, and callers. Assign each responsibility to its intended owner before replacement work begins.

## Acceptance criteria

- [ ] Inventory includes routes, data models, Alembic revisions, seeds, file handling, extraction utilities, and consumers.
- [ ] Each item has current behavior, target owner, dependencies, and known gaps.
- [ ] No existing behavior is removed or reclassified without evidence.
