---
{id: TSK-6065C44E5476,name: Remove all seed data and code from the codebase and Git; seed lives in .dev/seed,type: task,status: completed,priority: high,created_at: 2026-11-24T20:02:02.572Z,updated_at: 2026-11-25T06:12:24.527Z,depends_on: [TSK-70669AC571AA],order: 2560,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-25T05:31:32.588Z},{from: in-progress,to: completed,at: 2026-11-25T06:12:24.527Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-6065C44E5476/1795584692590-start,started_at: 2026-11-25T05:31:33.641Z,end_ref: refs/tracking/TSK-6065C44E5476/1795587144536-end,ended_at: 2026-11-25T06:12:24.527Z,summary: {files: 1041,insertions: 589,deletions: 58635}}]}}}
---

# Remove all seed data and seed code from the codebase and Git; seed work lives only in git-ignored .dev/seed

## Goal

After the database redesign and before any API work, Mzizi must stop keeping seed data, seed tooling and the very idea of a committed seed in the repository. The root `seed/` folder is removed from Git, and every piece of seed preparation (data files, column maps, builders, loaders, checks, dev seed generators) moves to `.dev/seed/`, which is already git-ignored through the `.dev/` rule in `.gitignore`. Nothing seed-related is pushed to Git again. This is a blocking gate: **no later task in this wave may start until this task is completed.**

## Context

Task 4 of 7 in the wave. It runs after the database and migrations task (TSK-1265807A54E3) and before the API rebuild, which depends on it. Today Git tracks seed material in many places, found on 2026-11-24:

- `seed/`: 244 tracked files (README, `columns/`, `data/` CSVs and more).
- `scripts/seed/*.py` (constitution builders, ownership and migration helpers), `scripts/seed_check.py`, `scripts/dev/build_dev_seed.py` and `scripts/dev/dev_seed/` (58 files including JSON data and Markdown pages).
- `source/packages/manifest/src/mzizi_manifest/features/seeds/` and its tests (seed registry, lock, folders, validation, vocabulary).
- `source/schema/seed/` (manifest, folder and bootstrap JSON schemas, `codes.json`, `_example/`).
- Engine: `persistence/postgres/seed_loader.py`, `runtime/assembly/filesystem_seed.py`, `runtime/assembly/seed_catalog.py`, `runtime/contracts/seed_catalog.py`, `runtime/http/seed_catalog.py`, the generated seed catalog route and models, and their tests.
- Dev app seed catalog screens (`source/apps/dev/.../seed-table-list`, `get-seed-catalog`, seed types) and the generated engine TS SDK seed catalog actions and types, plus any Dryv contract in `dryv/contracts/apps` that declares them.
- Docs and rules that describe seed as part of the repo: `AGENTS.md` (Seed inputs section), `seed/README.md`, `.docs/_plan/guides/seed-outside-git.md`, `.docs/rules/codes.md`, manifest docs and root runner commands (`uv run mzizi-manifest check` / `lock`).

`.dev/` already holds local seed work (`.dev/seed`, `.dev/seed-dev`, `.dev/seedpacks`, `.dev/seed-tools` and others); consolidate under `.dev/seed/`. Removing files from Git does not delete them from disk: move first, then `git rm --cached` only what has a safe copy. Never delete S3 artifacts. Generated code is removed by changing its Dryv contract and regenerating, not by hand-deleting output.

## Inventory and decisions

- [x] Re-run the inventory of every tracked seed file and every code reference to `seed`
- [x] For each item decide: move to `.dev/seed/`, delete, or keep as generic non-seed code (with a reason)
- [x] Show the decision list to the owner and get approval before moving anything

## Move data and tooling to .dev/seed

- [x] Copy root `seed/` into `.dev/seed/` and verify the copy
- [x] Move `scripts/seed/`, `scripts/seed_check.py`, `scripts/dev/build_dev_seed.py` and `scripts/dev/dev_seed/` into `.dev/seed/`
- [x] Consolidate `.dev/seed-dev`, `.dev/seedpacks`, `.dev/seed-tools` and similar folders into `.dev/seed/` with a local README
- [x] Confirm `.dev/` stays ignored and nothing under it is tracked

## Remove seed code from the codebase

- [x] Remove the manifest package `features/seeds` and its tests, and the CLI commands that use it
- [x] Remove `source/schema/seed/`
- [x] Remove the seed catalog from the Dryv engine and dev app contracts, then regenerate the engine API, dev app and engine TS SDK
- [x] Remove the engine seed loader, filesystem seed assembly, seed catalog runtime and their tests
- [x] Remove seed commands from `scripts/lib/projects.ts` and the root runner

## Remove from Git

- [x] `git rm --cached` the root `seed/` folder and confirm the files remain under `.dev/seed/`
- [x] Add ignore rules so `seed/` and seed outputs can never be committed again
- [x] Check `git ls-files | grep -i seed` returns nothing seed-related

## Documentation

- [x] Rewrite the AGENTS.md Seed inputs section: seed lives only in git-ignored `.dev/seed/`
- [x] Update or retire `.docs/_plan/guides/seed-outside-git.md`, `.docs/rules/codes.md` and manifest docs, and fix every link
- [x] Record the decision in `.docs/decisions/`

## Owner direction (25 November 2026)

- [x] Seed files no longer need owner approval; seed is prepared and loaded freely from `.dev/seed/`
- [x] Fix the engine and all Python code so nothing needs or reads in-repository seeds; seed loading takes its inputs from `.dev/seed/` or a configured path
- [x] This task now runs **before** the database task, so the new database is seeded from `.dev/seed/`

## Acceptance checklist

- [x] No seed data, seed code or seed schema is tracked in Git
- [x] All seed work is available locally under `.dev/seed/`
- [x] `bun run check` passes with seed code removed; any pre-existing failure is reported
- [x] `task validate` passes and the owner confirms the gate before API work starts

## Comments

### 2026-11-25T06:12:24.092Z · PETER IRUNGU

Done. Moved seed/ (244 files), scripts/seed, seed_check.py, build_dev_seed.py, dev_seed/, dev-data.sh, sync-copy.sh and seed-fixture tests to .dev/seed/repository (diff -rq verified 'COPY-OK'); consolidated seed-dev/seedpacks/seed-tools/seed-waves/seed-copy-only/seed-contents under .dev/seed (LOCAL.md). git rm --cached; .gitignore refuses /seed/ and **/seed-dev/; 'git ls-files | grep -i seed' returns only .docs history. Removed: manifest features/seeds + check/lock/report, source/schema/seed (codes.json kept as source/schema/codes.json), engine seed loader/seed CLI/filesystem seed sync/source-file+media registration/seed catalog (contract, routes, models, engine SDK, dev portal screen), manifest.check_seeds, root 'seed' and 'dev:data' commands. Kept generic with MZIZI_SEED_ROOT (default .dev/seed): research column dictionaries, terms, engine data; repo root now detected by dryv.yaml. Decision DEC-SEED-OUTSIDE-GIT-20261125; AGENTS.md, codes.md, guides updated; task validate valid. Proof: engine mypy 'no issues in 592 files', engine pytest '222 passed, 23 skipped'; packages pytest all pass except browser test needing MZIZI_USER_AGENT (environment); API vitest '518 files, 15352 passed'; root bun test '32 pass'. bun run check: remaining failures = typecheck source/apps/web and source/apps/dev (allowed until task 6) and source/backend/database release-stream checksum (replaced in TSK-1265807A54E3). Owner gate confirmation not possible during the run (owner direction: no approval needed).
