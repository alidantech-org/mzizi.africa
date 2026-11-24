---
{id: GOAL-GRP-57FE018A0694,name: Rust database foundation goal,type: documentation,extra: {created_at: 2026-11-12T07:13:13.085Z,group: GRP-57FE018A0694}}
---

# Goal

Establish the Rust database foundation for Mzizi: a Rust service and administration CLI under `source/backend/database` that becomes the exclusive application access boundary for the two PostgreSQL databases, `mzizi` (main domain data) and `mzizi_operations` (platform operations). Database schemas, columns and column definitions are never written by hand: they are authored as Dryv contracts and generated through project-owned Rust packs, exactly as the NestJS API is generated today through the existing packs. The former `source/schema/database` folder has been deleted and must not be recreated; all database artefacts (generated Rust models, SQL migration releases, checksums) belong to the database backend itself.

Success is measured by a working, tested foundation slice: Dryv contracts for platform authorization (operations) and the reference vocabulary (main) compile and generate deterministic Rust models and SQL releases; the CLI plans, applies and verifies migrations on a fresh isolated PostgreSQL instance with advisory-locked, checksummed releases; the Axum service on port 3303 exposes the named auth and reference operations with fail-closed authorization; NestJS and the Python engine reach data only through generated HTTP clients, never through direct SQL; and the repository quality gates (`bun run check`, `task validate`, Rust checks) pass with pre-existing failures reported accurately.
