---
{id: TSK-09BB6037F7D7,name: "Docs, contracts, packs and workspace skeleton",type: task,status: in-progress,priority: medium,created_at: 2026-11-12T07:13:16.623Z,updated_at: 2026-11-12T07:13:32.827Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-12T07:13:32.827Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-09BB6037F7D7/1794467612830-start,started_at: 2026-11-12T07:13:33.653Z}]}}}
---

# Rust database foundation: docs, contracts, packs and workspace skeleton

## Goal

Create the complete, documented skeleton of the Rust database foundation so that every later milestone (generation, migrations, service operations) lands into an already-agreed structure. This covers the design documentation, the decision record, the separate Dryv foundation entrypoint with the auth and reference contracts, the project-owned Rust generation packs, and a compiling Cargo workspace in `source/backend/database` with its service, CLI, core and generated crates. Hand-written code is limited to infrastructure (configuration, the two bounded connection pools, authorization enforcement, named operations, CLI commands); schemas, columns and column definitions come only from Dryv contracts and generation.

## Context

The repository already generates the NestJS API from Dryv contracts through project packs (`dryv/packs/type-files`, `dryv/packs/use-cases`). The database foundation follows the same pattern with a second entrypoint so the existing generation run is untouched. The deleted `source/schema/database` folder must not be recreated: generated SQL releases and models live inside `source/backend/database`. The legacy Bun TypeScript service in the same folder keeps working untouched on port 3301; the Rust service defaults to 3303. Targets are two databases, `mzizi` and `mzizi_operations`, on a fresh isolated local PostgreSQL; existing dev databases and object storage are preserved. Only the Rust boundary talks SQL: NestJS and the Python engine use generated HTTP clients, and packages such as filesystem or ocr never touch the database directly — the engine persists operational state through the database service. Related rules: `.docs/rules/database-naming.md`, `.docs/rules/code-columns.md`, decision DEC-AUTO-APPROVAL, and the agreed database/domain-schema catalogue.

## Acceptance checklist

- [x] Design guide for the database foundation added under `.docs/design/data/` covering ownership catalogue, generation flow, boundaries and transition state, with links from the affected READMEs.
- [x] Decision recorded in `.docs/decisions/` reconciling the deleted `source/schema/database` location with the new backend-owned layout.
- [x] `source/backend/database/README.md` rewritten to describe both the legacy Bun service and the Rust workspace, marking unimplemented behavior clearly.
- [x] `task validate` passes after all `.docs/` edits.

- [x] `dryv/contracts/foundation-db/` entrypoint composes auth (operations) and reference (main) groups with database assignment metadata; `bun run check` in `dryv/` still passes.
- [x] `dryv/packs/rust-models/` pack manifest and templates scaffolded, emitting into the generated crate.
- [x] `dryv/packs/rust-sql/` pack manifest and templates scaffolded, emitting checksummed releases into `source/backend/database/migrations/{main,operations}`.
- [ ] Unsupported definitions (cross-database foreign keys, unassigned schemas) are rejected with actionable errors, by pack validation or the contract audit.

- [x] Cargo workspace with crates `mzizi-db-core`, `mzizi-db-generated`, `mzizi-db-service`, `mzizi-db-cli` compiles with `cargo check`, `cargo fmt --check` and `cargo clippy` clean.
- [x] Core provides configuration loading and two separately bounded SQLx pools for main and operations, with administrative credentials reachable only from the CLI binary.
- [x] Service starts on configurable port defaulting to 3303 with health and readiness endpoints, request IDs and structured logs free of credentials.
- [x] CLI exposes plan, migrate, status, verify, roles and seed subcommands with explicit target selection (stubs may return "not implemented" but parse and dispatch correctly).
- [x] Root Bun tooling (`scripts/lib/projects.ts`) runs Rust format, lint, test and build as part of `bun run check`.

## Notes

Anything the current Dryv engine or pack format cannot express (for example SQL release emission or persistence metadata) is raised to the project owner as a proposed Dryv enhancement before any workaround is built.

## Comments

### 2026-11-12T11:32:18.284Z · PETER IRUNGU

Skeleton complete. User restructured contracts into schemas/{mzizi,operational} + apps/{main,database}; entrypoints repointed (dryv.yaml, package.json, tools/lib/ir.ts). Item 8 (pack-side rejection of cross-database FKs/unassigned schemas) waits on Dryv multi-authoring: engine side landed in the Dryv repo (commit 279a7479); CLI per-source compile orchestration requested from the dryv-multi-authoring session. Rust workspace verified: cargo check/clippy/fmt/test clean, service boots on 3303 (health ok, ready fails closed), mzizi-db CLI parses and fails closed without admin URLs. Root check: new failures fixed; remaining failures are pre-existing (ruff format/lint, mypy, pytest, api test, filesystem_api.py line limit).
