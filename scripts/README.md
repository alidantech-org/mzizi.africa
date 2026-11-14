# Scripts: the root command runner

Every routine activity in this repository runs from the repository root through Bun. Python projects are driven with **uv**, JavaScript and TypeScript projects with **Bun**, and the runner knows which is which. Current limitation: `uv sync --all-packages` cannot resolve `mzizi-database`, which the engine and filesystem package still declare as a workspace dependency even though `source/packages/database/` does not exist. Commands that install or run the Python workspace (`setup`, full `check`, `build`, or `engine`) may therefore fail until this dependency gap is fixed.

```bash
bun run setup        # first time: install everything, link Dryv, create the development sign-in keys
bun run help         # the full command table
bun run check        # format check, lint, typecheck, structure and tests
bun run dev          # API, engine, dashboard and public site together
```

Requirements: `bun` and `uv`. Optional: `docker` (local PostGIS/Temporal/object store), `flutter` (mobile app), `task` (work tracking), a Dryv checkout at `DRYV_HOME` (generation). TypeScript services, including the Temporal worker, run with Bun; no Node.js runtime is required. `bun run doctor` reports what is present.

## Commands

| Command                                   | What it does                                                                                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `bun run setup`                           | attempts `sync`, then links the local Dryv checkout and creates the development sign-in keys; currently blocked at Python workspace sync         |
| `bun run sync`                            | attempts `uv sync --all-packages` and installs each Bun project; currently blocked by the missing Python workspace member                        |
| `bun run doctor`                          | reports required tools and local files                                                                                                           |
| `bun run clean`                           | deletes caches and build output; `bun run clean -- --deep` also deletes `.venv` and every `node_modules`                                         |
| `bun run dev`                             | runs the services in watch mode; name some to run only those: `bun run dev api web`                                                              |
| `bun run start`                           | runs the services without watchers (run `bun run build` first for the Next.js apps)                                                              |
| `bun run build`                           | builds the Python wheels into `.local/dist` and the two Next.js apps                                                                             |
| `bun run format` / `format:check`         | ruff format; Biome for `scripts/` and `dryv/`; Prettier for the dashboard                                                                        |
| `bun run lint` / `lint:fix`               | ruff check; Biome; ESLint for the dashboard                                                                                                      |
| `bun run typecheck`                       | mypy for Python; `tsc` for every TypeScript project                                                                                              |
| `bun run test`                            | pytest, `bun test` and vitest                                                                                                                    |
| `bun run structure`                       | folder layout, file headers and hard file size limits for hand-written code                                                                      |
| `bun run check`                           | `format:check`, `lint`, `typecheck`, `structure` and `test`                                                                                      |
| `bun run check:all`                       | `check`, plus Dryv contract checks, the seed registry, `task validate` and the builds                                                            |
| `bun run dryv:link`                       | links the local Dryv author and compiler into `dryv/node_modules`                                                                                |
| `bun run dryv:check`                      | typechecks, audits, doctors and compiles the contracts; checks access rules, API boundary and schema                                             |
| `bun run dryv:generate`                   | generates database models and SQL snapshots from the current contracts                         |
| `bun run dryv:verify`                     | fails when the tracked generated output is not what the contracts generate now                                                                   |
| `bun run dryv:export`                     | re-exports the access rules and the JSON schema                                                                                                  |
| `bun run dryv:api` / `dryv:api:stop`      | runs or stops the local Dryv engine API by hand                                                                                                  |
| `bun scripts/mz.ts dryv:trust`            | trusts the project packs (once per machine)                                                                                                      |
| `bun run catalog`                         | regenerates the dashboard's data catalog from the API list routes                                                                                |
| `bun run db:up` / `db:down`               | starts or stops the local PostGIS container (`MZIZI_PG_CONTAINER`, default `postgis`)                                                            |
| `bun run db generate` / `bun run db plan` | regenerates the Dryv persistence catalog and reports table-name coverage against current SQL migrations                                          |
| `bun run db status`                       | TypeScript owner: `status`, `migrate`, `verify`, local role provisioning, `seed`, guarded reset, admin bootstrap and pipeline release operations |
| `bun run infra:up` / `infra:down`         | starts or stops local Temporal and S3-compatible SeaweedFS; named volumes preserve development history and test objects                          |
| `bun run seed -- check`                   | `mzizi-manifest`: `check`, `lock`, `report`, `validate-structure <dir>`                                                                          |
| `bun run fs -- tree`                      | `mzizi-filesystem`: `sync --manifest <file>`, `tree`, `verify`, `cleanup-uploads` and the rest                                                   |
| `bun run engine -- check`                 | `mzizi-engine`: `serve`, `capabilities`, `check`                                                                                                 |
| `bun run docs:validate`                   | `task validate` for the `.docs` workspace                                                                                                        |

Arguments after `--` go to the command. `bun scripts/mz.ts <command> [args]` is the same thing without the `--`.

### Limiting a command to some projects

Project commands (`sync`, `format`, `lint`, `typecheck`, `test`, `build`, `check`) take `--only` with project names or kinds:

```bash
bun scripts/mz.ts test --only python
bun scripts/mz.ts typecheck --only api,web
bun scripts/mz.ts check --only bun
bun scripts/mz.ts test --only mobile      # the Flutter app is opt-in
```

Projects: `python` (the uv workspace: `source/packages/*` and `source/backend/engine`), `scripts` (this directory and the Dryv tooling), `dryv`, `api`, `web`, `www`, `mobile`. Kinds: `python`, `bun`, `flutter`, or `all`.

## Services and ports

| Service     | Directory                  | Port | Override         |
| ----------- | -------------------------- | ---- | ---------------- |
| `api`       | `source/backend/api`       | 3000 | `API_PORT`       |
| `database`  | `source/backend/database`  | 3301 | `DATABASE_PORT`  |
| `pipelines` | `source/backend/pipelines` | 3302 | `PIPELINES_PORT` |
| `engine`    | `source/backend/engine`    | 8760 | `ENGINE_PORT`    |
| `web`       | `source/apps/web`          | 3100 | `WEB_PORT`       |
| `www`       | `source/apps/www`          | 3200 | `WWW_PORT`       |

`dev` and `start` give every service the values of the git-ignored root `.env` and its own port, prefix each output line with the service name and stop every service when the runner stops or when one service exits. `PORT` from `.env` is deliberately not passed through, because it would put two services on one port.

### Local data and workflow infrastructure

On a new checkout, copy `.env.example` to `.env` and set local-only service tokens. Keep an existing `.env` intact. The database administrator connection `MZIZI_DATABASE_URL` is reserved for the Bun database CLI; the TypeScript database service uses `DATABASE_RUNTIME_URL`, and the NestJS API uses read-only `DATABASE_URL`.

The local PostGIS container is managed separately so a database reset cannot remove other local databases. Start it with `bun run db:up`, then start the persistent Temporal development service and isolated S3-compatible SeaweedFS object store with `bun run infra:up`. Temporal listens on `127.0.0.1:7233` and its UI on `http://127.0.0.1:8233`; its SQLite history is in the named `temporal-data` volume. SeaweedFS exposes its local S3 endpoint on `127.0.0.1:9000`; object bytes remain in the named `object-store-data` volume. The local endpoint is bound to loopback and configured for local development only. These services never connect to the existing `mzizi` S3 bucket.

The development sequence is `bun run db:up`, `bun run infra:up`, `bun run db reset --confirm mzizi_new`, `bun run db provision-local-roles`, and `bun run db verify`, then run the database, pipeline, engine, and API services with local URLs and tokens from `.env`. `bun run db status` reports schema migration state; `bun run db seed` reapplies the idempotent auth and reference seeds. Proposed workflow definitions can be imported with `bun run db seed pipelines <actor-uuid>`; they stay inactive until separately approved by hash. Stop application processes, then use `bun run infra:down` and `bun run db:down`. The infra down command retains its named volumes. To erase only local Temporal/SeaweedFS development data, explicitly run `docker compose -f compose.local.yaml down --volumes`; to rebuild application schema/data use only the guarded `mzizi_new` reset command. This stack provides local infrastructure; application service configuration and full end-to-end workflow acceptance remain in progress.

## Dryv

The root generation command compiles the current database contracts and writes Rust row models and SQL schema snapshots. `bun run db plan` compares the current entities and table names with the ordered SQL migrations. Reconcile differences before preparing incremental migrations.

`dryv:generate` and `dryv:verify` need the Dryv engine API. They start it from `DRYV_HOME` when nothing answers on its port and stop it afterwards; an engine that was already running is left alone. The engine is bound to `127.0.0.1` and started in Dryv's development mode, so no Dryv Platform login is needed. If port 8750 is taken by a different Dryv service, choose another: `DRYV_API_PORT=8751 bun run dryv:verify`. The log is `.local/dryv-api.log`. Traps and the manual steps are in `.docs/design/operations/running-dryv.md`.

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

`db.py`, `seed_check.py` and `filesystem.py` are thin wrappers kept for direct use with `uv run scripts/<name>.py`; they call the same package entry points as `bun run db`, `bun run seed` and `bun run fs`. They contain no logic of their own.

## Store-scoped database generation

`bun run dryv:generate` runs the active database app and its configured packs.
Use `bun run dryv:database:plan`, `bun run dryv:database:generate` or
`bun run dryv:database:verify` for the independent database foundation app. Forward a selector as
`bun run dryv:database:generate -- --store main` (or `operations`). These commands start the local
Dryv API only when needed and do not assemble/apply SQL releases or change database roles.
