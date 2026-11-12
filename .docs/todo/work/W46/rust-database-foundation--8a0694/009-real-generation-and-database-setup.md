---
{id: TSK-E05B82CCB0F4,name: Real generation and database setup,type: task,status: in-progress,priority: medium,created_at: 2026-11-12T14:18:14.766Z,updated_at: 2026-11-12T14:18:33.008Z,order: 9216,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-12T14:18:33.008Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-E05B82CCB0F4/1794493113012-start,started_at: 2026-11-12T14:18:34.550Z}]}}}
---

# Rust database foundation: real generation and database setup

## Goal

Make the database foundation's generation pipeline real and stand the databases up. After this task, one `dryv generate` run compiles both authoring sources (the legacy NestJS app and the database foundation app), the Rust packs emit real models into `crates/mzizi-db-generated` and real per-database SQL into `source/backend/database/migrations/{main,operations}`, the CLI assembles those fragments into immutable checksummed releases, and a fresh isolated local PostgreSQL instance holds `mzizi` and `mzizi_operations` migrated and verified end to end through `mzizi-db`.

## Context

The skeleton (contracts, packs, Cargo workspace, docs, DEC-DATABASE-FOUNDATION-OWNERSHIP) is committed on develop from TSK-09BB6037F7D7. The Dryv multi-authoring enhancement is done and committed (unpushed) in the local Dryv checkout (`~/Projects/personal/alidantech-org/codepot/dryv`, commits 279a7479, ff65d9ce, ea17e59c): one dryv.yaml can now declare several authoring sources, with per-pack `authoring` selectors and per-source IR destinations. The `rust-models` and `rust-sql` activations in `dryv.yaml` are commented out and the pack templates are skeletons; the schema-to-database catalogue lives in `dryv/contracts/apps/database/persistence.ts`. Schemas and columns are never hand-written — only Dryv contracts and generation; only the Rust boundary talks SQL. Existing dev databases, the legacy Bun service (port 3301) and object storage stay untouched; `source/schema/database` must not be recreated. Related: `.docs/design/data/DATABASE_FOUNDATION.md`, `.docs/rules/database-naming.md`, `.docs/_plan/database-foundation/DRYV_MULTI_AUTHORING.md`.

## Acceptance checklist

- [x] `dryv.yaml` pins the new Dryv engine commit and activates `rust-models` and `rust-sql` with per-pack `authoring` refs to the `database` source; the legacy NestJS generation flow is unchanged.
- [x] `rust-models` emits deterministic Rust structs for every stored entity of the database app into `crates/mzizi-db-generated/src/models/`; unsupported property kinds fail generation with actionable errors.
- [x] `rust-sql` emits deterministic per-database schema snapshots (main.sql, operations.sql); unassigned storage namespaces and cross-database foreign keys are rejected with actionable errors.
- [x] Decision recorded in `.docs/decisions/` for how snapshots become immutable checksummed releases (DEC-DATABASE-RELEASE-ASSEMBLY).

- [x] Snapshots assembled into ordered release files under `migrations/{main,operations}`; releases are immutable and checksummed by the existing ledger.
- [x] Fresh isolated local PostgreSQL provisioned with `mzizi` and `mzizi_operations`; existing dev databases untouched.
- [x] `mzizi-db migrate` and `mzizi-db verify` succeed on both targets.

- [x] `mzizi-db-core` hand-written SQL (auth, reference) matches the generated tables (reference rows now use the generated models). No `.sqlx/` offline cache is needed: core uses runtime `query_as`, not compile-time macros.
- [x] `roles` CLI command implemented and covered by the live test (DML-only `mzizi_service`, `_mzizi` hidden).
- [ ] `seed` CLI command: blocked. `seed/_fixtures` is documented test-only and "never applied as seeds"; needs a reviewed seed set or an explicit dev-fixture decision from the owner. The command fails with that explanation.
- [x] Gated integration tests cover fresh apply, rerun, concurrent migrators and checksum refusal.
- [x] `cargo test`, `bun run check` (only pre-existing failures) and `task validate` pass; `.docs/design/data/DATABASE_FOUNDATION.md` and `source/backend/database/README.md` state what is implemented.

## Comments

### 2026-11-12T14:33:43.470Z · PETER IRUNGU

Paused at user request; full handoff in ~/.config/Claude/side-session-notes/local_580658bf-a791-4c7c-b1e9-410595091077/HANDOVER-rust-db-generation.md. Done so far: dryv.yaml edited (engine pin 089607c2, database IR destination bound to the database source, rust-models/rust-sql activations uncommented with namespace-list inputs; rust-sql destination now source/backend/database/generated/sql). Packs/templates not yet rewritten; nothing committed.

### 2026-11-12T14:49:53.048Z · PETER IRUNGU

Resumed. Done: packs rewritten (rust-models/rust-sql), generation deterministic (56 models, main.sql/operations.sql), assignments audit wired into database:check, mzizi-db assemble + tests, DEC-DATABASE-RELEASE-ASSEMBLY, isolated Postgres container mzizi-db-foundation on 127.0.0.1:55432 (creds in gitignored .data/db-foundation.env), both targets migrated+verified. Fixed engine-invalid reference EffectiveWindowMustBeOrdered invariant. Remaining: core SQL alignment/.sqlx, roles+seed, gated integration tests, docs, final checks.

### 2026-11-12T14:55:38.741Z · PETER IRUNGU

Checks: cargo test (workspace + live tests) pass; bun run check shows only the known pre-existing failures (filesystem_api.py line limit, ruff format/lint, mypy, pytest, api test). Open: seed (blocked on a reviewed seed set), not committed. Postgres: container mzizi-db-foundation, 127.0.0.1:55432, creds in .data/db-foundation.env.
