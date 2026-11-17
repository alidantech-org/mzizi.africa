# Scripts: the root command runner

Every routine activity in this repository runs from the repository root through Bun. Python projects are driven with **uv**, JavaScript and TypeScript projects with **Bun**, and the runner knows which is which.

```bash
bun run setup        # first time: install everything, link Dryv, create the development sign-in keys
bun run help         # the full command table
bun run check        # format check, lint, typecheck, structure and tests
bun run dev          # API, engine, dashboard and public site together
```

Requirements: `bun` and `uv`. Optional: `docker` (local PostGIS and other local services), `flutter` (mobile app), `task` (work tracking), a Dryv checkout at `DRYV_HOME` (generation). TypeScript services run with Bun; no Node.js runtime is required. `bun run doctor` reports what is present.

## Commands

| Command                                   | What it does                                                                                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `bun run setup`                           | runs `sync`, then links the local Dryv checkout and creates the development sign-in keys         |
| `bun run sync`                            | runs `uv sync --all-packages` and installs each Bun project                        |
| `bun run doctor`                          | reports required tools and local files                                                                                                           |
| `bun run clean`                           | deletes caches and build output; `bun run clean -- --deep` also deletes `.venv` and every `node_modules`                                         |
| `bun run dev`                             | runs the services in watch mode; name some to run only those: `bun run dev api admin`                                                              |
| `bun run start`                           | runs the services without watchers (run `bun run build` first for the Next.js apps)                                                              |
| `bun run build`                           | builds the Python wheels into `.dev/dist` and the two Next.js apps                                                                             |
| `bun run format` / `format:check`         | ruff format; Biome for `scripts/` and `dryv/`; Prettier for the dashboard                                                                        |
| `bun run lint` / `lint:fix`               | ruff check; Biome; ESLint for the dashboard                                                                                                      |
| `bun run typecheck`                       | mypy for Python; `tsc` for every TypeScript project                                                                                              |
| `bun run test`                            | pytest, `bun test` and vitest                                                                                                                    |
| `bun run structure`                       | folder layout, file headers and hard file size limits for hand-written code                                                                      |
| `bun run boundaries`                      | report-only import-boundary check for packages and the engine (see ENGINE_RUNTIME_AND_PACKAGES); `-- --strict` fails on any violation          |
| `bun run check`                           | `format:check`, `lint`, `typecheck`, `structure` and `test`                                                                                      |
| `bun run check:all`                       | `check`, plus Dryv contract checks, the seed registry, `task validate` and the builds                                                            |
| `bun run dryv:link`                       | links the local Dryv author and compiler into `dryv/node_modules`                                                                                |
| `bun run dryv:check`                      | typechecks, audits, doctors and compiles the contracts; checks access rules, API boundary and schema                                             |
| `bun run dryv:generate`                   | generates the database SQL snapshot from the current contracts                         |
| `bun run dryv:verify`                     | fails when the tracked generated output is not what the contracts generate now                                                                   |
| `bun run dryv:api` / `dryv:api:stop`      | runs or stops the local Dryv engine API by hand                                                                                                  |
| `bun scripts/mz.ts dryv:trust`            | trusts the project packs (once per machine)                                                                                                      |
| `bun run catalog`                         | regenerates the dashboard's data catalog from the API list routes                                                                                |
| `bun run schemas:sync`                    | regenerates the Dryv table schemas and the job schema (`-- --prune` also deletes orphaned public objects), checks the schemas and examples, then uploads changed schemas to the public prefix (`-- --local`, `-- --dry-run`, `-- --no-dryv`) |
| `bun run schemas:forget-cache`            | deletes the YAML extension's cached copies of the published schemas; then reload the editor window |
| `bun run db:up` / `db:down`               | starts or stops the local PostGIS container (`MZIZI_PG_CONTAINER`, default `postgis`)                                                            |
| `bun run db generate` / `bun run db plan` | regenerates the Dryv persistence catalog and reports table-name coverage against current SQL migrations                                          |
| `bun run db status`                       | TypeScript owner: `status`, `migrate`, `verify`, local role provisioning, `seed`, guarded reset, admin bootstrap and pipeline release operations |
| `bun run infra:up` / `infra:down`         | invokes Docker Compose using `compose.local.yaml`; the file is absent in the current checkout                          |
| `bun run seed -- check`                   | `mzizi-manifest`: `check`, `lock`, `report`, `validate-structure <dir>`                                                                          |
| `bun run engine -- check`                 | `mzizi-engine`: `serve`, `capabilities`, `check`                                                                                                 |
| `bun run docs:validate`                   | `task validate` for the `.docs` workspace                                                                                                        |

Arguments after `--` go to the command. `bun scripts/mz.ts <command> [args]` is the same thing without the `--`.

### Limiting a command to some projects

Project commands (`sync`, `format`, `lint`, `typecheck`, `test`, `build`, `check`) take `--only` with project names or kinds:

```bash
bun scripts/mz.ts test --only python
bun scripts/mz.ts typecheck --only api,admin
bun scripts/mz.ts check --only bun
bun scripts/mz.ts test --only mobile      # the Flutter app is opt-in
```

Projects: `python` (the uv workspace: `source/packages/*` and `source/backend/engine`), `scripts` (this directory and the Dryv tooling), `dryv`, `api`, `admin`, `www`, `mobile`. Kinds: `python`, `bun`, `flutter`, or `all`.

## Services and ports

| Service     | Directory                  | Port | Override         |
| ----------- | -------------------------- | ---- | ---------------- |
| `api`       | `source/backend/api`       | 3000 | `API_PORT`       |
| `engine`    | `source/backend/engine`    | 8760 | `ENGINE_PORT`    |
| `admin`     | `source/apps/admin`        | 3100 | `ADMIN_PORT`     |
| `www`       | `source/apps/www`          | 3200 | `WWW_PORT`       |
| `web`       | `source/apps/web`          | 3300 | `WEB_PORT`       |
| `dev`       | `source/apps/dev`          | 3400 | `DEV_PORT`       |

`dev` and `start` give every service the values of the git-ignored root `.env` and its own port, prefix each output line with the service name and stop every service when the runner stops or when one service exits. `PORT` from `.env` is deliberately not passed through, because it would put two services on one port.

### Local data and workflow infrastructure

On a new checkout, copy `.env.example` to `.env` and set local-only service tokens. Keep an existing `.env` intact. The database administrator connection `MZIZI_DB_ADMIN_URL` is reserved for the Bun database CLI. The engine and the NestJS API each connect with their own role (`mzizi_engine`, `mzizi_api`) provisioned by `bun run db roles`; see their component guides for current configuration (see `.docs/design/data/DATABASE_ARCHITECTURE.md`).

Use `bun run db:up` and `bun run db:down` for the configured local PostGIS container. These commands start and stop an existing container. Apply migrations and provision roles against the intended scratch database with `bun run db migrate` and `bun run db roles`, then check with `bun run db verify`.

The active engine needs MongoDB for its supervised-run ledger and an S3-compatible endpoint for object-store workflows. Configure local services through the [engine guide](../source/backend/engine/README.md). The current checkout does not include `compose.local.yaml`, so the `infra:up` and `infra:down` wrappers require a separately supplied local configuration. The in-memory HTTP executor does not depend on Temporal.

## Dryv

The root generation command compiles the current database contracts and writes the SQL schema snapshot to `source/backend/database/sql/schema.sql`. `bun run db assemble | plan | status | migrate | verify | roles` is the Bun database CLI; see `source/backend/database/README.md`. Releases are immutable, so reconcile contract changes before preparing a new release stream.

`dryv:generate` and `dryv:verify` need the Dryv engine API. They start it from `DRYV_HOME` when nothing answers on its port and stop it afterwards; an engine that was already running is left alone. The engine is bound to `127.0.0.1` and started in Dryv's development mode, so no Dryv Platform login is needed. If port 8750 is taken by a different Dryv service, choose another: `DRYV_API_PORT=8751 bun run dryv:verify`. The log is `.dev/logs/dryv-api.log`. Traps and the manual steps are in `.docs/design/operations/running-dryv.md`.

## Code quality rules

One configuration per language, at the root:

- **Python**: `[tool.ruff]` and `[tool.mypy]` in `pyproject.toml`. Line length 120, every function annotated, sources type checked. Workspace members do not carry their own configuration.
- **TypeScript in `scripts/` and `dryv/`**: `biome.json` and `tsconfig.json` (strict).
- **Dashboard and public site**: their own Prettier, ESLint and `tsc` settings, run through their `package.json` scripts.
- **Generated API code** is formatted by Dryv during generation and is never reformatted by hand.

`bun run structure` enforces, for hand-written code only (Dryv-managed output is excluded):

| Scope                                                                     | Hard limit            |
| ------------------------------------------------------------------------- | --------------------- |
| Python sources in `source/packages/*`, `source/backend/engine`, `scripts` | 400 lines             |
| Python tests                                                              | 600 lines             |
| TypeScript in `scripts/` and `dryv/tools`                                 | 400 lines (tests 600) |
| Dryv contracts in `dryv/contracts` (declarative)                          | 800 lines             |

It also requires every Python project to have `pyproject.toml`, `README.md`, `tests/` and exactly one `src/mzizi_*` package with `__init__.py` and `py.typed`, and every source file to open with a docstring or comment that says what it is for. When a file reaches its limit, split it by responsibility; do not raise the limit. The limits live in `scripts/tasks/structure.ts`.

## How the runner is built

| File                 | Responsibility                                                                                 |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| `mz.ts`              | entry point: the command table, argument parsing and help                                      |
| `lib/projects.ts`    | the single registry of projects and services; add a project here and every command includes it |
| `lib/exec.ts`        | running steps, bounded parallelism and pass or fail summaries                                  |
| `lib/paths.ts`       | repository paths and `.env` loading                                                            |
| `tasks/quality.ts`   | format, lint, typecheck, test and build steps                                                  |
| `tasks/setup.ts`     | sync, setup, doctor and clean                                                                  |
| `tasks/serve.ts`     | dev and start                                                                                  |
| `tasks/dryv.ts`      | Dryv link, checks, engine API, generation and verification                                     |
| `tasks/structure.ts` | layout, header and size rules                                                                  |
| `mz.test.ts`         | tests for the runner itself (`bun test scripts`)                                               |

A Bun project is checked through its own `package.json` scripts when it defines them (`format`, `format:check`, `lint`, `typecheck`, `test`, `build`), so each project still works on its own and the root never duplicates its configuration.

## Python command wrappers

`db.py` and `seed_check.py` are thin wrappers kept for direct use with `uv run scripts/<name>.py`; they call the same package entry points as `bun run db` and `bun run seed`. They contain no logic of their own.

## Store-scoped database generation

`bun run dryv:generate` runs the active database app and its configured packs.
Use `bun run dryv:database:plan`, `bun run dryv:database:generate` or
`bun run dryv:database:verify` for the independent database foundation app. Forward a selector as
`bun run dryv:database:generate -- --store main` (or `operations`). These commands start the local
Dryv API only when needed and do not assemble/apply SQL releases or change database roles.
