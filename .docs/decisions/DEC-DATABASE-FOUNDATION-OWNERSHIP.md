---
id: DEC-DATABASE-FOUNDATION-OWNERSHIP
name: Database artefacts are owned by the Rust database backend
type: decision
tags: [database, rust, dryv, layout]
---

# Decision: database artefacts are owned by the Rust database backend

**Date:** 2026-11-12 · **Status:** accepted

## Decision

1. `source/schema/database` has been deleted and is not recreated. Generated database artefacts — Rust models, SQL migration releases and their checksums — live inside `source/backend/database`, the system that applies and serves them.
2. Database schemas, tables, columns and column definitions are never authored by hand. They are defined only in Dryv contracts and produced by generation.
3. Rust generation runs separately from the existing NestJS generation: a second entrypoint `dryv/contracts/apps/database` drives project-owned packs `dryv/packs/rust-models` and `dryv/packs/rust-sql`. The existing entrypoint and packs are untouched.
4. Dryv's existing client generation produces the TypeScript and Python HTTP clients; no project tool reimplements client generation.
5. Two databases, `mzizi` and `mzizi_operations`, with the catalogue recorded in [DATABASE_FOUNDATION](../design/data/DATABASE_FOUNDATION.md). The Rust service is the target exclusive access boundary; capability packages never touch a database, the engine persists operational state through the database service, and the API reaches data only through the generated client.
6. The legacy Bun service in `source/backend/database` coexists untouched (port 3301) while the Rust workspace is added beside it (port 3303). The foundation uses a fresh isolated local PostgreSQL instance and preserves existing databases and object storage.

## Why

Keeping generated SQL in a standalone `source/schema/database` tree separated the artefacts from the only system allowed to apply them, inviting drift and a second source of truth. Owning them in the database backend keeps generation output, migration ledger and runtime behavior in one reviewed place, and the separate Dryv entrypoint lets the foundation evolve without destabilising the generated NestJS API.
