---
{id: TSK-A5D7B8F87A9D,name: "Restructure into packages, single Python engine and archived history",type: task,status: completed,priority: medium,created_at: 2026-11-08T09:00:22.023Z,updated_at: 2026-11-11T04:29:39.867Z,depends_on: [TSK-0F4398B91D38],order: 1792,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-08T09:00:27.617Z},{from: in-progress,to: completed,at: 2026-11-11T04:29:39.867Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-A5D7B8F87A9D/1794128427627-start,started_at: 2026-11-08T09:00:28.287Z,end_ref: refs/tracking/TSK-A5D7B8F87A9D/1794371379869-end,ended_at: 2026-11-11T04:29:39.867Z,summary: {files: 915,insertions: 12737,deletions: 575}}]}}}
---

---
{id: TSK-A5D7B8F87A9D,name: "Restructure into packages, single Python engine and archived history",type: task,status: in-progress,priority: medium,created_at: 2026-11-08T09:00:22.023Z,updated_at: 2026-11-08T09:00:27.617Z,depends_on: [TSK-0F4398B91D38],order: 1792,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-08T09:00:27.617Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-A5D7B8F87A9D/1794128427627-start,started_at: 2026-11-08T09:00:28.287Z}]}}}
---

# Restructure into packages, a single Python engine and an archived history

## Goal

Establish the approved package-first layout before the later source, filesystem and pipeline milestones: reusable capability packages under `source/packages/`, one complete Python orchestration project under `source/backend/engine/`, the NestJS product API relocated to `source/backend/api/` with its finished auth intact, system input schemas under `source/schema/`, and the previous implementations preserved as clearly historical, non-executable learning material under `.docs/_archives/`. This enabling work runs now and before later feature work; it does not complete the later domain schemas, source intelligence or pipelines, and none of those milestones may be marked complete because a directory or scaffold exists.

## Context

The user authorized this restructuring on 8 November 2026 (see `.docs/improvements/independent-data-pipelines.md`, section "Approved package-first layout and single Python engine"); it supersedes the earlier undecided runtime topology. Decisions recorded with the authorization: the active auth SQL and tooling are ported from Bun to Python with SQL under `source/schema/database/auth`; the filesystem package publishes seeds through a registry port with mocked S3 plus in-memory and local-ledger registry adapters, and a PostgreSQL adapter waits for the filesystem schema task; the engine API is FastAPI, bound locally and called by the NestJS API, scripts and agents, which owns decisions, UI and canonical writes while the engine writes only its own `engine` tables, delivers results to NestJS through HTTP callbacks with an outbox and retries, streams runs through SSE that NestJS relays to the admin site, and runs asyncio plus worker processes with one queue and admission boundary; a minimal provisional engine schema is created in `mzizi_new`, explicitly not final.

Constraints: bucket `mzizi`, region `us-east-1`, existing credentials, only `public/` anonymous, no new infrastructure, existing S3 objects never migrated or deleted, `mzizi_new` is the only database that may be reset (host and `current_database()` verified first), no compatibility copies or symlinks, no `.github/**` changes, branch `develop` only. Related tasks: `TSK-3EA8C40B0F60` (filesystem), `TSK-0B9CCF587F64` (source), `TSK-7ED801464BFD` (pipelines), seed consolidation `TSK-0F4398B91D38` (completed, preserved).

## Acceptance checklist

- [x] Archive `source/backend/api-legacy` and the old `engine/data` and `engine/database` under `.docs/_archives/<dated snapshot>/` with their relative paths, source commit, README and a relocation inventory (old path, archive location, reusable knowledge, active owner, remaining gap); remove `source/backend/files` and `source/backend/intelligence` after accounting for them; no active code, build, generator or document validation depends on archived paths.
- [x] Extract reusable packages (filesystem, database, source client, scraping, extraction, OCR, agent, manifest/schema validation) as Python packages with metadata, explicit dependencies, public interfaces and tests; create the Python engine project with a documented uv workspace and lock; packages never import engine internals.
- [x] Relocate the NestJS API to `source/backend/api` updating Dryv destinations, imports, scripts and docs, and port the auth schema, seed application and checks to Python so authorization checks survive.
- [x] Implement seed publication in the filesystem package (dry run, hash dedup within access boundaries, upload verification, idempotent retries, versioned releases and non-versioned current items, explicit conflicts) with mocked S3 tests, and the engine API skeleton (health, capabilities, jobs, SSE events, outbox) with its provisional engine schema.
- [x] Run focused verification, document actual functionality and remaining gaps, run `task validate`, commit and push to `develop`.

## Progress and findings (2026-11-08)

**Layout delivered.** `source/packages/{filesystem,database,source,scraping,extraction,ocr,agent,manifest}` (uv workspace, root `pyproject.toml`, committed `uv.lock`), `source/backend/engine` (FastAPI engine), `source/backend/api` (NestJS API relocated, Dryv destinations and tools updated, auth specs pass), `source/schema/{site,contracts,database}`, `scripts/` (thin wrappers), archive `.docs/_archives/2026-11-08-rewrite-snapshot/` (source commit `3e2f8c5d7a6f12d1c44851951e752a0ccf1db7fb`, README, `RELOCATION_INVENTORY.md`). `source/backend/files`, `intelligence`, `api-legacy`, `engine/data`, `engine/database` are gone from the active tree.

**Auth preserved.** The auth SQL moved to `source/schema/database/auth`; the Bun tooling was ported to `mzizi_database` (migrate, reset, auth seed loader, `mzizi-db`) and the checks to pytest (`source/packages/database/tests/test_auth_schema.py`, 14 tests plus safety tests) against `mzizi_new`, which was reset with the new tool after verifying the host and `current_database()`. The NestJS database-auth guard specs still pass after relocation (148).

**Seed publication.** `mzizi_filesystem.publish_seeds` plus `mzizi-publish-seed`: dry run, verified uploads, hash deduplication inside access boundaries, idempotent retry and interrupted-run recovery, immutable versioned releases, `current` pointer mode with revision conflicts and journaled `fixed_key` mode, explicit conflict outcomes; 24 mocked-S3 tests. No live S3 call was made and nothing was uploaded.

**Engine.** Health, capabilities, jobs, runs, SSE with replay, executor (asyncio plus worker processes, per-capability limits, retries, cancellation, restart recovery), callback outbox and an auth guard on the `auth` schema; provisional `engine` schema (explicitly not final) applied to `mzizi_new`; started with uvicorn and exercised with real requests against `mzizi_new`.

**Verification.** `uv run pytest source` (145 tests: packages 130 plus engine 15), API auth specs 148, `uv lock --check`, `task validate`.

**Gaps.** Domain schemas, source intelligence, scheduling, NestJS callback endpoint and SSE relay, agent provider, PostgreSQL filesystem registry adapter, live S3 smoke, source-specific extraction and candidate staging/promotion are untouched; API integration specs that need the old Dryv-entity schema cannot run until entities are rebuilt in `mzizi_new`.

## Closeout verification — 2026-11-11

The package layout, archive boundary, Python workspace, NestJS location, SQL ownership and executable capability registry were inspected. Fresh checks: 175 Python tests passed; the API auth selection passed 148 tests with 10 todo cases in matched legal suites; uv lock check passed. Manifest validation passed for 54 entries with 101 existing provenance-review warnings. These warnings require content review and are not a missing package-layout implementation.

The original five acceptance items remain satisfied. Later filesystem work supersedes the earlier publication adapter/command notes: use mzizi-filesystem sync and the PostgreSQL repository, with file_relations for version lineage. PostgreSQL filesystem support and live S3 verification are no longer outstanding restructuring gaps; see task 02. Domain schemas, scheduling, source manifest execution, canonical promotion, real agent providers and NestJS callback/SSE integration remain later milestones explicitly excluded from this foundational task. Implementation commits are present in local origin/develop history. No archive code was executed and no live S3 write was repeated in this review.
