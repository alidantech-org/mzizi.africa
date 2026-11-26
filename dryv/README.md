# Mzizi Dryv: Backend-Only Contracts

TypeScript contracts (`@dryvcode/author`) for the canonical Mzizi model. Dryv compiles them to Runtime IR and the packs generate:

- **NestJS product API** (`source/backend/api`) with TypeScript and Dart SDKs
- **Python engine API** (`source/backend/engine`) with TypeScript SDK
- **PostgreSQL schema** (`source/backend/database/sql`) from the single canonical store

Frontend applications are built independently; Dryv generates only backend services and SDK clients.

## Layout

- `../dryv.yaml`: the Dryv project file. It lives at the repository root because generation destinations may not leave the project root. It pins the engine (`a7b13a30`) and the packs repository (`7fdaa6f0d0d35f0522aabcd2699e48cabf31b46a`).
- `contracts/schemas/`: the new design — one file per Postgres schema in `postgres/` (no per-database split), Mongo document contracts in `mongo/` (empty until staging contracts are authored), over the `_base.ts` and `_shared.ts` bases; shared by every app.
- `contracts/schemas/theme.ts`: the shared `brand.Mzizi` theme (colour, radius, type and shadow tokens, fifteen semantic roles including glass surfaces, a dark mode). Colours may be written in any CSS notation (hex, rgb, hsl, hwb, lab, lch, oklab, oklch, `color()`, names): CSS keeps the notation, Flutter receives sRGB `argb` from Dryv. The palette is graded in OKLCH. Its palette comes from the landing page, `source/apps/www/src/app/globals.css`; the `danger` and dark-mode `bark` colours are proposals. Frontend application contracts select it with `.groups(brand)` and `.theme(themes.Mzizi)`; the official Dryv frontend packs render it.
- `contracts/apps/api/`: the user-facing operations on the product API (NestJS); statistics, leaderboards, elections, parties, motions, leaders, civic delivery, tenders, global search (hand-written use cases), place reads and geography (see `.docs/design/data/`).
- `contracts/apps/engine/`: the operations the Python engine offers to the API and SDK clients — research, staging, system, scripts, explore, runtime management.
- `contracts/apps/pgsql/`: the database application; lists every persisted group and exists only to generate the SQL snapshot. The persisted groups select their store through storage facets.
- `packs/sdk-ts`, `packs/sdk-engine-ts`: generate TypeScript SDK clients from the product API and engine API into `source/sdk/api-ts` and `source/sdk/engine-ts`.
- `packs/type-files`, `packs/use-cases`: project packs that scaffold shared types and per-operation use cases for the NestJS API.
- `packs/postgres-sql`: writes one PostgreSQL schema snapshot to `source/backend/database/sql/schema.sql`. `database:assignments` audits compiled canonical placement without namespace lists in usage.
- `packs/python-rows`, `packs/python-mongo`, `packs/python-api`: generate Python row models, Mongo models, and FastAPI schemas for the engine.

Generated output lands in:
- NestJS API: `source/backend/api/src/modules/<group>/...`, `src/types/<group>/...`, `src/app.module.ts`, `src/database/`
- Python engine: `source/backend/engine/src/mzizi_engine/api/schemas/<store>/...`, `routes/`, tests
- TypeScript SDKs: `source/sdk/api-ts/src/...`, `source/sdk/engine-ts/src/...`
- Database: `source/backend/database/sql/schema.sql`
- System catalogs: `source/backend/api/src/system/catalog/`, `source/backend/engine/src/mzizi_engine/api/catalog/`

Do not edit managed files; files marked "Scaffolded by Dryv once" belong to the project.

## Contract rules

- Domain entities extend `HistoricalEntity` (valid time) over `BaseEntity` (identity, record time, version); system schemas (`audit`, `source`, `filesystem`, `identity`) extend `BaseEntity`. Provenance and verification are never columns: the `source` schema points at records (`.docs/design/data/SOURCING_DESIGN.md`).
- A physical foreign key may cross PostgreSQL namespaces inside one logical store. Cross-store foreign keys fail in Engine validation. Existing external Main IDs in staging remain application-verified plain IDs; declare a typed application reference only when its real provider/resolver operation exists.
- Business codes are hierarchical and lowercase, such as `ke/nairobi/westlands`.
- Levels, institution types, election types, selection methods and fiscal stages are `ClassificationRecord` rows scoped by jurisdiction, never enums or columns. Contracts never name a country.
- Strings with a maximum length become `varchar(max)`; leave out the maximum for unbounded text such as GeoJSON.
- The entity pack names a relation property after its target, so two relations to one entity collide; keep the second reference a plain id.

## Workflow (backend-only)

```bash
cd dryv
bun install && bun run link          # link the local Dryv checkout (set DRYV_HOME if not in the default place)
bun run check                        # Main model quality suite
bun run database:check               # Operational database contracts: typecheck, Biome, doctor, compile
# From repository root, generate all three backend apps:
bun run dryv:api                     # Start the Dryv engine API (needs DRYV_HOME and local Dryv checkout)
# In another shell:
bun "$DRYV_HOME/source/apps/cli/bin/dryv.ts" --api "$DRYV_API" --yes --no-input generate --app pgsql --app api --app engine
# Verify the generated API
cd source/backend/api && bun run typecheck && bun run test
```

Frontend applications are built independently; they consume the generated SDK clients from `source/sdk/{api-ts,engine-ts}`.

## Contract checks

`bun run database:check` validates the dedicated database authoring entrypoint at `contracts/apps/pgsql/index.ts`: TypeScript typecheck, Biome formatting, `dryv-ts doctor`, and Runtime IR compilation. It composes the approved Operational groups with the existing shared and reference dependencies. This check does not generate or apply SQL migrations. Use `bun run database:format` to apply the configured Biome formatter to the database contract files.

`bun run check` runs, in order: `tsc` over the contracts, `tools/audit-contracts.ts`, `dryv-ts doctor` and `dryv-ts compile`. The audit compiles to Runtime IR and fails when:

- an entity does not extend `shared.EvidencedEntity` (provenance, valid time, verification);
- one entity has two relations to the same target (the entity pack would generate colliding properties);
- a stored entity has no storage name or reuses another entity's;
- a string maximum exceeds PostgreSQL's varchar limit;
- a contract names a country (Kenya is data, never contract);
- an HTTP operation is not under `/v1/` or maps no failures.

### Table lists derived from the contracts

`SubjectTable` (`contracts/schemas/_subjects.ts`) and `source/schema/codes.json` are derived from the generated tables in `source/backend/database/sql/schema.sql`, not edited by hand. After generating a new table run `bun run tables:sync`; `bun run tables:check` (part of `bun run check`) fails when either file is out of sync. Existing entries are preserved (hand-chosen `short` names, `kind`, `parent`, enum member names); a new table gets the first three letters of its name as `short`, made unique within its schema, and audit and auth tables are never subjects. Tool: `tools/sync-tables.ts`.

The local Dryv checkout is used instead of the published packages (they are out of date): `bun install` links it through `scripts/link-dryv.sh` (set `DRYV_HOME`).

## Database naming

Every group sets a storage namespace (a PostgreSQL schema) and every entity a short plural table name: `geo.units`, not `geo_units` in `public`. The rule and the full map are in `.docs/rules/database-naming.md`, and the contract audit enforces it (namespace present, never `public`, singular one-word schema, table not prefixed with its schema, at most one underscore, unique per schema). Audit `targetKind` values are the schema-qualified names (`geo.units`), exported by `access:export`. TypeORM creates enum types before a table's schema, so schemas must exist before `synchronize`; `synchronizeDomainSchemas` (api `src/database/scratch-database.ts`) does that for dev and tests, and the database engine must do the same.

## Local Dryv author: types versus runtime

`node_modules/@dryvcode/author` and `compiler` are symlinks (`bun run link`) into the Dryv checkout at `DRYV_HOME`. Two different things read them:

- **Editor and `tsc`** resolve `@dryvcode/author` to the Dryv _source_ through the `paths` entry in `tsconfig.json`, so authoring-API changes show up immediately. The entry is relative to the linked package under `node_modules`; no checkout-specific path is committed.
- **`dryv-ts compile`, `doctor` and generation** run the package's built `dist/`. After changing Dryv, rebuild the compiler (`bun run build` in `source/plugins/authoring/typescript/compiler`); it also rebuilds the author. Otherwise linked `dist/` files may silently omit new contract fields.

## Generator limits and workarounds

Found while generating the full model; the contract audit enforces the first three.

- **One relation per target.** The entity pack names a relation property after its target, so two relations from one entity to the same target collide. Keep one relation and make the others plain ids (`plainId()` in `foundation/shared/builders.ts`).
- **Reserved schema names.** A schema named `Contract` collides with the generated test helper `contractExample`; the procurement schema is `ProcurementContract`.
- **Varchar limits.** A string maximum becomes `varchar(max)`; PostgreSQL caps that at 10485760, so unbounded text (GeoJSON, legal provisions) omits the maximum.
- **Removed or renamed contracts leave stale files** (entities, DTOs, types, scaffolds). The stale-entity finder was removed with the old API; rebuild one when the API is regenerated.
- **Renames leave stale files.** Renaming a contract does not delete its old generated files or the old project-owned scaffolds (use cases, service implementation methods). Delete the old files, then add the new methods to the `*.service.impl.ts`; the typecheck that runs after generation lists what is left.
- **Project-owned scaffolds.** Use cases, `*.service.impl.ts`, `database.module.ts` and `vitest.config.ts` are created once and never regenerated. A new operation needs a method in the service implementation by hand.

## Local setup, start to finish

```bash
# 1. Dryv engine API (from the Dryv checkout at the pinned ref; DRYV_HOME defaults to ~/Projects/personal/alidantech-org/codepot/dryv)
cd $DRYV_HOME && uv run --project source/engine/python/api dryv-api serve --host 127.0.0.1 --port 8750 --template-server source/engine/python/api/dryv.server.yaml

# 2. Contracts: install, link the local Dryv packages, check
cd dryv && bun install && bun run check

# 3. Generate (first time: bun $DRYV_HOME/source/apps/cli/bin/dryv.ts trust --yes), then adopt the shared list helper for new Find use cases
cd .. && bun $DRYV_HOME/source/apps/cli/bin/dryv.ts --api http://127.0.0.1:8750 --yes --no-input generate

# 4. API: typecheck and test; the PostgreSQL suites need a PostGIS server
docker run -d --name mzizi-test-pg -e POSTGRES_PASSWORD=test -p 55432:5432 postgis/postgis:18-3.6
cd source/backend/api && bun install && bun run typecheck
TEST_DATABASE_URL=postgres://postgres:test@localhost:55432/postgres bun run test
```

Without `TEST_DATABASE_URL` the PostgreSQL suites are skipped and the generated specs still run. The integration suites create their own scratch databases and roles.

## Checks

| Command (in `dryv/`)      | What it guards                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `bun run check`           | contracts typecheck, contract audit (including database naming), Dryv doctor and compile, access rules current, API boundary |

## Canonical single-store setup

The `pgsql` application `contracts/apps/pgsql/index.ts` declares one store, `main`, mapped by
root `dryv.yaml` to the PostgreSQL database `mzizi` (runtime variable `MZIZI_DB_URL`, administrative
`MZIZI_DB_ADMIN_URL`; values stay client-local and credentials never go in the YAML). Every group
under `contracts/schemas/postgres` selects `main` through its storage facet. Mongo document
contracts will live in `contracts/schemas/mongo`; Dryv has no document-store driver yet, so those
are schemas without storage (see `.docs/design/data/DRYV_GAPS.md`). The app provides six named
operations from `reference.ts`, `filesystem.ts` and `auth.ts`. Non-persisted Accountability view
models have no store or table. The 2026-11-15 owner decision removed the Operations store and the
Rust service: see `DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115`.

From the repository root:

```bash
bun run typecheck --only scripts
# Focused static check before generation:
bun run dryv:database:typecheck
bun run dryv:database:check
bun run dryv:database:plan
bun run dryv:database:generate
bun run dryv:database:generate -- --store main
bun run dryv:database:verify
```

Generation writes one file, `source/backend/database/sql/schema.sql`, and the `format-sql` action in `dryv.yaml` formats it with the database CLI before it is written (`bun run db format`). Regenerating over a snapshot that was formatted by hand needs `--conflicts overwrite` once. The Bun CLI (`bun run db assemble`)
turns it into the immutable release stream under `source/backend/database/migrations`.

Dryv checkpoints are local by default. After actual successful generation/checks, use the local
Dryv CLI to run `checkpoint approve --app pgsql` or approve a complete selected store with
`checkpoint approve --store main`. Inspect `checkpoint status` and
`explain change --baseline approved --app pgsql --diff full`. Change `checkpoints.storage`
to `repository` only when the project chooses to commit compressed baselines; Dryv never commits
or silently approves. Formatting/final checks must succeed before approval.

This config deliberately does not enable Dryv migration execution: its initial PostgreSQL mapping
does not cover Mzizi's temporal properties, advanced constraints and PostGIS placeholder. The
Bun CLI releases and `public.mzizi_migrations` are authoritative for applied state. Generation
can change a schema snapshot but never rewrites an immutable release or applies it. A changed
snapshot still requires a reviewed incremental migration procedure; do not reset a release stream.

The database typecheck uses `tsconfig.database.json` and includes every neutral schema and the
database application entrypoint. The configured pack emits the SQL snapshot.


### Database service contracts

The database authoring root uses `#/` for imports from the root of `dryv/contracts`.
Use `bun run --cwd dryv database:typecheck` and `bun run --cwd dryv database:compile`
to check this root independently.

The reference module binds the two browse routes to named, paged queries. It keeps
the `schemes` and `values` envelopes and uses authored camelCase field names.
These names also appear on the generated HTTP surface. Member lookup uses
the live `{ scheme, code }` request and `{ value }` response. The filesystem module
uses a read projection for the folder returned by registration. The auth module
describes account resolution and permission evaluation using the live wire fields.
Shared HTTP failure mappings and the page window for the API are in `contracts/apps/api/_shared.ts`.

Before switching runtime handlers, reconcile the immutable initial migration with
the current model snapshot. The initial reference and folder tables use snake_case
columns and omit fields present in the newer generated snapshot. When activating
the Axum repository pack, set `repositories: true` and `snake_case_columns: true`
to match the SQL column names. Member lookup needs an
Engine uniqueness proof for the applicable live-row indexes. Folder registration
also needs the acting account permission evaluated across the Operations and Main
stores. The current lookup, auth, and folder routes therefore use service handlers.

The official Python SDK pack's flat model filenames collide across groups on the
full database IR. The scratch generation used group-qualified filenames and
symbols (this matters for generating typed Python models; see `.docs/design/data/DRYV_GAPS.md`).

## Generating the API

The `api` application is bound to the NestJS packs (types, DTOs, entities, type files, use cases, server) with everything under `source/backend/api/src/modules`. From the repository root:

```bash
bun run dryv:api                       # start the Dryv engine API (needs the Dryv checkout)
# in another shell, with DRYV_HOME, DRYV_API=http://127.0.0.1:8750 and DRYV_API_KEY=local-development set:
bun "$DRYV_HOME/source/apps/cli/bin/dryv.ts" --api "$DRYV_API" --yes --no-input generate --app api
bun "$DRYV_HOME/source/apps/cli/bin/dryv.ts" --api "$DRYV_API" --yes --no-input generate --app api --check
```

The `official` pack source is a `file://` git source pinned to a local commit of the packs repository that declares TypeORM store support and null-safe invariants; switch it back to the GitHub repository once those commits are published. Scaffolded use cases are created once and then belong to the project.

<!-- dryv:begin -->
# Dryv in this project

Written by `dryv init`. Refresh it with `dryv docs --write`; this file is replaced when you do.

## Files

| File | Purpose |
| --- | --- |
| `dryv.yaml` | Project contract: sources, packs, destinations, build behaviour |
| `dryv/contracts/` | Authored software meaning (TypeScript or Python) |
| `dryv/packs/` | Local packs, if any |
| `dryv/ir/` | Compiled Runtime IR (build output) |

## Daily loop

```bash
dryv validate
dryv plan
dryv generate --dry-run
dryv generate
dryv why <generated-path>
```

## Built-in guides

- `dryv docs workflow`: The Dryv loop
- `dryv docs dryv-yaml`: dryv.yaml
- `dryv docs pack-yaml`: dryv.pack.yaml and pack development
- `dryv docs authoring`: Authoring contracts
- `dryv docs errors`: Errors and what to do
- `dryv docs agents`: Working with Dryv as an agent

1. **Author** software meaning (schemas, operations, events) in TypeScript or Python.
2. **Configure** `dryv.yaml`: where the meaning lives, which packs run, where output goes.
3. **Check** with `dryv validate`, then `dryv plan` (writes nothing).
4. **Preview** with `dryv generate --dry-run`. Read the diff.
5. **Generate** with `dryv generate`. Dryv asks before writing.
6. **Understand** with `dryv status`, `dryv why <path>`, `dryv explain change`.
7. **Undo** with `dryv undo` if the last apply was wrong.

Rules of thumb:

- Never edit generated files marked as managed. Change the authored meaning or the pack instead.
- Files with `.sf` before the renderer extension are scaffolds: created once, then yours.
- In CI use `dryv generate --check --json --no-input`. It exits 2 when output is stale.
- If a command fails, the JSON `code` tells you why (`dryv docs errors`).


## Project configuration

[Open dryv.yaml](../dryv.yaml). Working folder: dryv. Explicit source and destination paths are relative to dryv.yaml; changing workspace.path does not relocate files.

servers.api connects CLI and editor clients. Optional servers.templates entries support explicit doctor/conformance workflows; they do not configure the Engine's renderer connections. Project ignore patterns control client workspace collection. Reusable argv declarations live in the top-level commands list; actions reference their IDs with commands: [id]. Lockfile and default IR/staging/repository checkpoint/migration paths follow workspace.path; machine caches and local state remain outside the project.

See [agent instructions](AGENTS.md), [skills](agents/README.md), and [official documentation](https://dryv.alidantech.org/docs).
## Configured authoring sources

| Name | Type | Project-relative path | Entrypoint |
| --- | --- | --- | --- |
| pgsql | typescript | dryv/contracts | apps/pgsql/index.ts |
| api | typescript | dryv/contracts | apps/api/index.ts |
| engine | typescript | dryv/contracts | apps/engine/index.ts |
<!-- dryv:end -->

## Database objects from the project pack

Dryv cannot author triggers, routines or joined views yet (see `.docs/design/data/DRYV_GAPS.md`). The project pack `packs/postgres-sql` therefore renders them into `source/backend/database/sql/schema.sql`: guards on `geography.areas`, `geography.geometries` and `template.templates`, the text transforms and `template.generate` / `template.generate_pattern`, and the coverage views in the `template` schema. A field tag `template-product:<kind>` (set by `templateFields("<kind>")` in `contracts/schemas/_templates.ts`) makes the pack emit the product guard for that root table. Never edit the snapshot or an assembled release by hand; change the pack or the contracts and regenerate.

`tsconfig.database.json` covers the schema, pgsql and engine contracts only; the API contract (`contracts/apps/api`) still reads removed columns (`geography.relationships` hierarchy and level) and is deliberately left unchanged until the API work.

## Enums

Closed value sets that code and the interface branch on are enums defined once in `contracts/schemas/_enums.ts` (same in every country, about a dozen values or fewer, a status or structural kind, never added by data entry); anything country-specific or growable is a `term(...)` of the vocabulary. Each enum value needs an interface label in `product.keys` (`enum.<enum name in kebab case>.<value>`) and a message; a test fails when one is missing.
