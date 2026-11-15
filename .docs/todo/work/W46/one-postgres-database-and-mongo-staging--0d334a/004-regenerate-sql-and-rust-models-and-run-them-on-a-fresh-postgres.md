---
{id: TSK-E4F66863838C,name: Regenerate SQL and Rust models and run them on a fresh Postgres,type: task,status: planned,priority: medium,created_at: 2026-11-15T16:32:04.288Z,updated_at: 2026-11-15T16:32:04.288Z,order: 4096}
---

# Regenerate SQL and Rust models and run them on a fresh Postgres

## Goal

Generate the SQL snapshot and Rust models from the single-store contracts, assemble a migration release, and apply it to a fresh empty Postgres database, proving the schema really works. Existing development databases are not touched.

## Context

Generation needs the Dryv checkout and API from outside this repository, started as described in `dryv/README.md`. The Rust CLI assembles releases with `mzizi-db assemble`. Generated SQL and models from the old contracts are stale. The geometry column in geography is a placeholder and needs a stated decision. Use a scratch database and never the shared development servers for lifecycle tests.

## Acceptance checklist

- [ ] Dryv generates SQL and Rust models for one store with no operations output left over.
- [ ] A migration release is assembled and applied to an empty scratch Postgres, and the expected tables exist.
- [ ] `cargo test` for the database crates passes against the scratch database, or failures are reported accurately.
- [ ] The geometry handling decision is written down in this task.
