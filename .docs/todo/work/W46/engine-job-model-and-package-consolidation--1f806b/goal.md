---
{id: GOAL-GRP-CB1B861F806B,name: Engine job model and package consolidation goal,type: documentation,extra: {created_at: 2026-11-13T09:53:00.964Z,group: GRP-CB1B861F806B}}
---

# Goal

Move Mzizi's Python side to a clear split: small pure packages that compute, and one engine that owns every side effect. When this group is finished, no package under `source/packages/` knows a database exists, packages are small and well organised, and the engine exposes one job model that behaves identically whether a job is submitted from the web through NestJS, from the local CLI, or from Temporal.

## Success measures

- `uv sync --all-packages` resolves from a clean checkout for every remaining package, with no reference to the missing `mzizi-database` package.
- The package set is reduced to what is useful: `agent` removed, `ocr` folded into `extraction`, `source` replaced by a `fetch` package plus pieces moved to `scraping` and the engine, and `manifest` kept as a pure schema and validation layer.
- No Python module in a package exceeds roughly 400 lines and package roots contain only `__init__.py` plus subfolders.
- The engine has a documented job model (plan, steps, ports) with adapters for the Rust database service, the object store and a staging store, plus a local mode used by the CLI and tests.
- Collected data can be staged in a temporary document store with provenance and expiry instead of large JSON and CSV files.
- `source/backend/agent/` exists with a README describing the future assistive application, and the docs describe where the agent hooks into the engine.

The design is in `.docs/design/architecture/ENGINE_JOB_MODEL.md` and the decision in `.docs/decisions/DEC-ENGINE-JOB-MODEL-20261113.md`.
