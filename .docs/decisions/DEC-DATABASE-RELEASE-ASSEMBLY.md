---
id: DEC-DATABASE-RELEASE-ASSEMBLY
name: Generated SQL snapshots become immutable releases through mzizi-db assemble
type: decision
tags: [database, rust, dryv, migrations, sql]
---

# Decision: generated SQL snapshots become immutable releases through `mzizi-db assemble`

**Date:** 2026-11-12 · **Status:** accepted for the first release; schema evolution is open

## Decision

1. The `rust-sql` pack emits one complete, deterministic **schema snapshot** per database to `source/backend/database/generated/sql/{main,operations}.sql`. Generation never writes into `migrations/`.
2. `mzizi-db assemble --target <main|operations>` (no database access) owns the release stream:
   - empty stream: the snapshot is copied to `migrations/<target>/0001_init.sql` and its SHA-256 is recorded in `migrations/<target>/.snapshot`;
   - non-empty stream: the snapshot must still match the recorded checksum, otherwise assembly fails and leaves every release untouched.
3. Releases stay immutable. The existing ledger (`public.mzizi_migrations`, SHA-256, per-database advisory lock) is unchanged, so `migrate`, `plan` and `verify` need no new behavior.
4. The pack takes the namespace-to-database lists as pack inputs in `dryv.yaml` (packs cannot read TypeScript). `bun run database:assignments` (part of `database:check`) fails when they drift from `contracts/apps/database/persistence.ts`.
5. All SQL identifiers are quoted: the contracts contain reserved words as column names (for example `offset`).
6. Enums map to `text` without a CHECK in v1; arrays, records, composites, unions, tuples, generics, literals and nested schema values are rejected at generation. Invariants with a simple form become CHECK constraints; open (NULL) windows satisfy `from < until` in SQL.

## Open

- **Schema evolution.** A contract change after `0001_init` is refused by `assemble`. Generating ordered incremental releases (diffing snapshots) is a later milestone; until then a deliberate stream reset is only acceptable before any environment has applied the stream.
- **Error visibility.** Template rejections (unassigned namespace, cross-database foreign key, unsupported kind) abort generation with no output written, but Dryv's API reports only HTTP 500; the message is in the Jinja template server log.
- **Fixed column order.** Columns follow the engine's field order (alphabetical), not authoring order.

## Why

Snapshots keep generation a pure function of the contracts and keep releases, checksums and the ledger in the Rust system that applies them. Refusing a changed snapshot turns accidental drift into a loud failure rather than a silently edited release.
