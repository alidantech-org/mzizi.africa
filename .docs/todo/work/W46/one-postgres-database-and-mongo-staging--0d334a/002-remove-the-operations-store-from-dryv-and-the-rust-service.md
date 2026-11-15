---
{id: TSK-7363069AF5C1,name: Remove the Operations store from Dryv and the Rust service,type: task,status: planned,priority: medium,created_at: 2026-11-15T16:32:03.434Z,updated_at: 2026-11-15T16:32:03.434Z,order: 2048}
---

# Remove the Operations store from Dryv and the Rust service

## Goal

Make Dryv and the Rust database service know a single Postgres store. The `operations` store, the `rust-operations-models` and `rust-operations-sql` packs, the `mzizi_operations` configuration and the operations models disappear from active configuration, while existing migration releases and databases are left untouched.

## Context

`dryv.yaml` declares two stores and two sets of packs. `dryv/contracts/apps/database/index.ts` composes the operational groups. The Rust crates `mzizi-db-core` (config, ids), `mzizi-db-generated` (models/operations), `mzizi-db-service` and `mzizi-db-cli` reference the operations pool and target. The hand-written Rust SQL must be read first to confirm which operational tables it uses, because auth tables are retained. The operational schema files are removed from the app, and only the retained auth subset and audit events move into the postgres folder in the next task.

## Acceptance checklist

- [ ] The Rust SQL was read and the list of operational tables it needs is recorded in this task.
- [ ] `dryv.yaml`, the database app and the Rust crates use one store and one pair of environment variables.
- [ ] Operational schema files are removed from the app composition without deleting historical migration releases.
- [ ] `bun run database:check` and `cargo check` pass, or each failure is reported with its cause.
