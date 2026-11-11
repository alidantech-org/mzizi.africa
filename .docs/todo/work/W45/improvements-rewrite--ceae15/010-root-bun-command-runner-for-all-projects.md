---
{id: TSK-8068616F9798,name: Root Bun command runner for all projects,type: task,status: in-progress,priority: medium,created_at: 2026-11-11T14:03:14.545Z,updated_at: 2026-11-11T14:03:48.651Z,order: 8192,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-11T14:03:48.651Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-8068616F9798/1794405828654-start,started_at: 2026-11-11T14:03:49.432Z}]}}}
---

# Root command runner: operate every project from the repository root with Bun

## Goal

Every routine activity in this repository (installing, syncing, formatting, linting, type checking, testing, building, running in development and in start mode, Dryv contract checks and generation, database and seed management) must be runnable from the repository root through one documented set of Bun helper scripts, in the same way the Dryv repository exposes `bun run <command>` from its root `package.json`. A contributor or agent should never need to remember which directory a command lives in or which tool a project uses.

## Context

The repository holds several independent projects: a uv workspace of Python packages (`source/packages/*`) and the engine (`source/backend/engine`), the NestJS API (`source/backend/api`), two Next.js apps (`source/apps/web`, `source/apps/www`), a Flutter app (`source/apps/mobile`) and the Dryv contracts project (`dryv/`). Today each has its own commands, the root `package.json` is git-ignored and has no scripts, and the Python code has no formatter, linter or type checker configured. The user direction of 11 November 2026 is: all Python projects use uv, all JavaScript and TypeScript projects use Bun, manual code is formatted, type checked and documented, hand-written code has a required folder structure and hard file size limits, and generation stays connected through Dryv. The reference for the command surface is the root `package.json` of the Dryv checkout. This work adds tooling only; it does not change any service responsibility in `AGENTS.md`, and Dryv-managed files are excluded from the manual-code limits.

## Acceptance checklist

- [x] Root `package.json` is tracked and exposes setup, sync, dev, start, build, format, lint, typecheck, test, check, clean and doctor commands that delegate to `scripts/`.
- [x] The runner has a single project registry, bounded parallel execution, clear pass and fail summaries and a `--only` filter, and every script file is documented.
- [x] `bun run dev` and `bun run start` launch the API, the engine and the web apps with the local environment loaded, and stop all children cleanly.

- [x] Ruff formatting and linting and mypy type checking are configured once in the root `pyproject.toml` and pass for every package and the engine.
- [x] A structure check enforces the package folder layout and hard file size limits for manual Python and TypeScript code, and it passes.

- [x] Dryv link, contract check, engine API start and stop, generate and generated-output check are available from the root.
- [x] Database, seed manifest and filesystem commands are available from the root.

- [x] `scripts/README.md`, the root `README.md` and the development setup document describe the commands, and `task validate` passes.
- [ ] Every root command has been run and its result recorded under Progress in this task.

## Progress

11 November 2026. The runner is in `scripts/` (`mz.ts`, `lib/`, `tasks/`), exposed through the tracked root `package.json`; the guide is `scripts/README.md`.

Commands run from the root and their results:

- `setup`, `sync`, `doctor`, `clean`, `help`: pass.
- `dev` and `start`: all four services answered on their ports and no listener remained after SIGTERM. Port 3000 was held by an unrelated process on this machine, so the API was verified with `API_PORT=3900`.
- `build`: pass (Python wheels, dashboard, public site).
- `format:check`, `typecheck`, `structure`: pass. Ruff reformatted the Python sources, mypy went from 246 errors to none, `seed_registry.py` was split into four modules behind the same import surface, and the dashboard was formatted with Prettier.
- `lint`: ruff and Biome pass. ESLint in `source/apps/web` reports 62 errors and 85 warnings that predate this work (mostly `no-explicit-any` and React compiler rules).
- `test`: runner tests, dashboard tests and the API suite pass (16,910 tests). One API test, `app.e2e.spec.ts` for `GET /v1/pipeline/candidates/:id`, failed in two of four full runs and passes alone. pytest has 107 passing, 22 failing and 2 collection errors; the same set fails on the commit before this work (paths from before the seed relocation, such as `seed/fixtures/...`).
- `dryv:check`, `dryv:export`, `dryv:verify`, `catalog`: pass. `dryv:verify` was run with `DRYV_API_PORT=8751` because 8750 is used by a Dryv Platform container on this machine; the generated output is current.
- `db status`, `seed check`, `engine capabilities`, `docs:validate`: pass.

Not run: `dryv:generate` (verify reports nothing to generate), `dryv:trust`, `dryv:api`, `db:up`, `db:down`, `db init`, `db reset`, `fs`, `check:all`.

Decisions: Dryv contracts get an 800 line limit because they are declarative; the web and public apps keep their own lint and format settings; the Flutter app is opt-in (`--only mobile`).
