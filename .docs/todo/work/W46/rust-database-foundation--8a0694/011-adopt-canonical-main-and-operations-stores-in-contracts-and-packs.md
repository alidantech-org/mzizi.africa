---
{id: TSK-4D66638B9176,name: Adopt canonical Main and Operations stores in contracts and packs,type: task,status: completed,priority: medium,created_at: 2026-11-13T11:40:28.799Z,updated_at: 2026-11-13T11:55:00.601Z,order: 11264,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-13T11:41:07.885Z},{from: in-progress,to: completed,at: 2026-11-13T11:52:06.272Z},{from: completed,to: in-progress,at: 2026-11-13T11:54:16.307Z},{from: in-progress,to: completed,at: 2026-11-13T11:55:00.601Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-4D66638B9176/1794570067896-start,started_at: 2026-11-13T11:41:08.694Z,end_ref: refs/tracking/TSK-4D66638B9176/1794570726273-end,ended_at: 2026-11-13T11:52:06.272Z,summary: {files: 54,insertions: 687,deletions: 574}},{base_ref: refs/tracking/TSK-4D66638B9176/1794570856309-start,started_at: 2026-11-13T11:54:16.853Z,end_ref: refs/tracking/TSK-4D66638B9176/1794570900604-end,ended_at: 2026-11-13T11:55:00.602Z,summary: {files: 4,insertions: 5,deletions: 3}}]}}}
---

# Adopt canonical Main and Operations stores in Mzizi contracts and packs

## Goal
Use Dryv's existing v1alpha1 store contracts to describe Mzizi's two PostgreSQL targets once, and generate store-scoped Rust models and SQL without duplicating namespace-to-database lists in pack inputs. Preserve the legacy product API authoring root and the existing Rust public model module paths.

## Context
The database foundation currently assigns 17 namespaces in a TypeScript catalogue and repeats them in both Rust pack activations. Dryv commit a7b13a30 adds named stores, application activations, explicit provided operations, store selection and portable approved checkpoints. Author owns declarations; Engine resolves store semantics and rejects invalid foreign keys; Client owns paths and environment references; project packs render Rust and SQL. The existing public.mzizi_migrations ledger and immutable SQL releases remain owned by the database CLI. Advanced temporal/check/exclusion mappings preclude automatic adoption of Dryv's initial PostgreSQL migration adapter. No live database, role, seed or object-store changes belong to this task.

## Acceptance checklist
- [x] Assign Main and Operations defaults in the persisted schema groups, declare stores and explicit access/provided operations on the database application, and retain non-persisted Accountability views without table assignments.
- [x] Configure the named database activation, per-store Rust pack activations/destinations and environment references; remove duplicated namespace inputs without silently changing physical database names or credentials.
- [x] Render per-store SQL/models from canonical store context and preserve cross-store reference metadata without emitting foreign keys; isolate shared Rust catalogue output ownership.
- [x] Replace catalogue duplication auditing with typed canonical-IR checks and update root tooling/selectors, portable author resolution and relevant test sources.
- [x] Update contract, pack, database and operations documentation with current commands, checkpoint approval and explicit migration limitations; preserve all existing releases and ledger code.
- [x] Complete code/docs and pass affected TypeScript typechecks and formatting before running the separately tracked generation/test validation phase.

## Exclusions and handoff
Do not migrate the legacy API to the new domain model, implement new business operations or claim arbitrary raw IDs have verified reference semantics. Do not replace the migration ledger, edit released SQL, invent version families, publish or commit without a later instruction. Record completed milestones through Task CLI. The following validation task receives the complete changed file list, static-check results and the exact app/store selections to exercise.

## Comments

### 2026-11-13T11:50:31.702Z · PETER IRUNGU

Code phase: canonical stores, five owned database pack activations, typed assignment audit, portable author paths and scoped root commands are implemented. Static checks found an unrelated legacy baseline: apps/main imports sixteen contracts/_archive modules absent from this checkout. Added a focused database tsconfig/script instead of recreating archived inputs or hiding the legacy failure. Task validation also reports an existing broken archive link in _plan/source-redesign/README.md. Preserving the unrelated concurrent scraping engine.py edit.

### 2026-11-13T11:52:06.025Z · PETER IRUNGU

Implementation static gates passed: root scripts typecheck and focused database typecheck (all neutral schemas and database entrypoint), changed TypeScript Biome formatting, manifest/document Prettier formatting and git diff --check. Root usage now activates per-store Rust model/SQL outputs plus a single stable catalogue; group facets own placement, database app owns both stores and provides its seven operations. Legacy full-contract typecheck still fails on missing archive imports, and task validate reports the pre-existing historical link; neither is claimed fixed. No tests, generation or database commands executed in the code phase.

### 2026-11-13T11:54:17.010Z · PETER IRUNGU

Validation: the database contract suite passes with current rebuilt local compiler (Main 81, Operations 46). Planning rejects inherited $(name) filename interpolation in the Rust pack templates; changing affected templates to the current explicit output-name token and repeating static gates before render.

### 2026-11-13T11:55:00.360Z · PETER IRUNGU

The filename token itself remains valid: discovery requires a declared template output.name before activation overrides apply. Added explicit default output names to store/verifier/snapshot templates, retained the per-store overrides, and formatted the manifests. Also corrected the historical docs link to the current contract workflow without restoring missing archives. No TypeScript API changes in this fix; prior typechecks remain current.
