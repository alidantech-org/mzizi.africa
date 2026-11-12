---
{id: GRP-57FE018A0694,name: Rust database foundation,type: documentation,extra: {created_at: 2026-11-12T07:13:13.085Z}}
---

# Plan

The approach is contracts-first and generation-driven. A separate Dryv entrypoint (`dryv/contracts/foundation-db`) composes only the foundation slice — platform authorization for `mzizi_operations` and the reference vocabulary for `mzizi` — so the existing NestJS generation run stays untouched. New project-owned packs under `dryv/packs/` (`rust-models`, `rust-sql`) consume the compiled Runtime IR and emit a generated Rust crate plus immutable, checksummed SQL migration releases per target database. The packs, not a bespoke generator, enforce the boundary rules: every schema must be assigned to exactly one database, cross-database foreign keys are rejected, and output is deterministic with contract digests recorded in the release checksums. TypeScript and Python clients come from Dryv's existing HTTP client generation.

The Rust side is a Cargo workspace of four crates: `mzizi-db-generated` (pack output only), `mzizi-db-core` (configuration, two bounded SQLx pools, typed identifiers, fail-closed authorization and all hand-written named operations), `mzizi-db-service` (Axum HTTP service, default port 3303) and `mzizi-db-cli` (the only holder of administrative credentials: plan, migrate, status, verify, roles, seed).

Milestones: (1) documentation and decisions recorded; (2) skeleton of contracts, packs and workspace committed and compiling; (3) generation producing deterministic artefacts; (4) migrations applying and verifying on an isolated local PostgreSQL; (5) service operations and tests green; (6) root Bun tooling integration.

Risks: Dryv pack capabilities may need enhancement for SQL emission and persistence metadata (raise with the owner before working around); the legacy Bun service shares the folder and must keep working untouched; and the missing Python `mzizi-database` workspace member remains an explicitly tracked gap that the generated Python client must not masquerade as.
