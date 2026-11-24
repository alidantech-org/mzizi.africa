---
{id: TSK-6065C44E5476,name: Remove all seed data and code from the codebase and Git; seed lives in .dev/seed,type: task,status: planned,priority: high,created_at: 2026-11-24T20:02:02.572Z,updated_at: 2026-11-24T20:02:04.915Z,depends_on: [TSK-1265807A54E3],order: 3584}
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

- [ ] Re-run the inventory of every tracked seed file and every code reference to `seed`
- [ ] For each item decide: move to `.dev/seed/`, delete, or keep as generic non-seed code (with a reason)
- [ ] Show the decision list to the owner and get approval before moving anything

## Move data and tooling to .dev/seed

- [ ] Copy root `seed/` into `.dev/seed/` and verify the copy
- [ ] Move `scripts/seed/`, `scripts/seed_check.py`, `scripts/dev/build_dev_seed.py` and `scripts/dev/dev_seed/` into `.dev/seed/`
- [ ] Consolidate `.dev/seed-dev`, `.dev/seedpacks`, `.dev/seed-tools` and similar folders into `.dev/seed/` with a local README
- [ ] Confirm `.dev/` stays ignored and nothing under it is tracked

## Remove seed code from the codebase

- [ ] Remove the manifest package `features/seeds` and its tests, and the CLI commands that use it
- [ ] Remove `source/schema/seed/`
- [ ] Remove the seed catalog from the Dryv engine and dev app contracts, then regenerate the engine API, dev app and engine TS SDK
- [ ] Remove the engine seed loader, filesystem seed assembly, seed catalog runtime and their tests
- [ ] Remove seed commands from `scripts/lib/projects.ts` and the root runner

## Remove from Git

- [ ] `git rm --cached` the root `seed/` folder and confirm the files remain under `.dev/seed/`
- [ ] Add ignore rules so `seed/` and seed outputs can never be committed again
- [ ] Check `git ls-files | grep -i seed` returns nothing seed-related

## Documentation

- [ ] Rewrite the AGENTS.md Seed inputs section: seed lives only in git-ignored `.dev/seed/`
- [ ] Update or retire `.docs/_plan/guides/seed-outside-git.md`, `.docs/rules/codes.md` and manifest docs, and fix every link
- [ ] Record the decision in `.docs/decisions/`

## Acceptance checklist

- [ ] No seed data, seed code or seed schema is tracked in Git
- [ ] All seed work is available locally under `.dev/seed/`
- [ ] `bun run check` passes with seed code removed; any pre-existing failure is reported
- [ ] `task validate` passes and the owner confirms the gate before API work starts
