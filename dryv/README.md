# Mzizi Dryv contracts

TypeScript contracts (`@dryvcode/author`) for the canonical Mzizi model. Dryv compiles them to Runtime IR and the packs generate the NestJS API in `source/backend/api`, using the same structure and packs as the Alidantech backend. Only the project-owned use cases and service implementations are hand-written.

## Layout

- `../dryv.yaml`: the Dryv project file. It lives at the repository root because generation destinations may not leave the project root. It pins the engine (`a7b13a30`) and the packs repository (`7fdaa6f0d0d35f0522aabcd2699e48cabf31b46a`).
- `contracts/schemas/`: the new design — one file per database schema, grouped by database (`mzizi/` for canonical domain data, `operational/` for `mzizi_operations`), over the `_shared.ts` base; shared by every app.
- `contracts/apps/database/`: database app, named provided operations and the two logical store identities. The neutral schema groups select their store through storage facets.
- `contracts/apps/main/index.ts`: the legacy pre-foundation application; its groups moved to `contracts/_archive/{foundation,domains}` and keep generating the existing NestJS API until migration to the new design.
- `packs/type-files`, `packs/use-cases`: project packs that scaffold shared types and per-operation use cases for the NestJS API.
- `packs/rust-models`, `packs/rust-sql`: store-scoped database packs; each activates once for Main and once for Operations. `packs/rust-catalog` owns the stable shared Rust catalogue. `database:assignments` audits compiled canonical placement without namespace lists in usage.

Generated output lands in `source/backend/api/src/modules/<group>/...`, `src/types/<group>/...`, `src/app.module.ts` and `src/database/`. Do not edit managed files; files marked "Scaffolded by Dryv once" belong to the project.

## Contract rules

- Domain entities extend `HistoricalEntity` (valid time) over `BaseEntity` (identity, record time, version); system schemas (`audit`, `source`, `filesystem`, `identity`) extend `BaseEntity`. Provenance and verification are never columns: the `source` schema points at records (`.docs/design/data/SOURCING_DESIGN.md`).
- A physical foreign key may cross PostgreSQL namespaces inside one logical store. Cross-store foreign keys fail in Engine validation. Existing external Main IDs in staging remain application-verified plain IDs; declare a typed application reference only when its real provider/resolver operation exists.
- Business codes are hierarchical and lowercase, such as `ke/nairobi/westlands`.
- Levels, institution types, election types, selection methods and fiscal stages are `ClassificationRecord` rows scoped by jurisdiction, never enums or columns. Contracts never name a country.
- Strings with a maximum length become `varchar(max)`; leave out the maximum for unbounded text such as GeoJSON.
- The entity pack names a relation property after its target, so two relations to one entity collide; keep the second reference a plain id.

## Workflow

```bash
cd dryv
bun install && bun run link          # link the local Dryv checkout (set DRYV_HOME if not in the default place)
bun run check                        # Main model quality suite
bun run database:check               # Operational database contracts: typecheck, Biome, doctor, compile
bun run generated:check              # after generating: fails if a plan would still change files (needs the Dryv API)
# start the Dryv API (from the Dryv checkout): uv run --project source/engine/python/api dryv-api serve --port 8750 --template-server source/engine/python/api/dryv.server.yaml
cd .. && bun $DRYV_HOME/source/apps/cli/bin/dryv.ts --api http://127.0.0.1:8750 generate
cd source/backend/api && bun run typecheck && bun run test
```

`bun run test` in the API runs the generated specs. The PostgreSQL integration test runs when `TEST_DATABASE_URL` points at a scratch PostGIS database, for example `postgres://postgres:test@localhost:55432/mzizi`.

## Contract checks

`bun run database:check` validates the dedicated database authoring entrypoint at `contracts/apps/database/index.ts`: TypeScript typecheck, Biome formatting, `dryv-ts doctor`, and Runtime IR compilation. It composes the approved Operational groups with the existing shared and reference dependencies. This check does not generate or apply SQL migrations. Use `bun run database:format` to apply the configured Biome formatter to the database contract files.

`bun run check` runs, in order: `tsc` over the contracts, `tools/audit-contracts.ts`, `dryv-ts doctor` and `dryv-ts compile`. The audit compiles to Runtime IR and fails when:

- an entity does not extend `shared.EvidencedEntity` (provenance, valid time, verification);
- one entity has two relations to the same target (the entity pack would generate colliding properties);
- a stored entity has no storage name or reuses another entity's;
- a string maximum exceeds PostgreSQL's varchar limit;
- a contract names a country (Kenya is data, never contract);
- an HTTP operation is not under `/v1/` or maps no failures.

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
- **Database module wiring.** `AppModule` only imports `DatabaseModule` once some operation reads an entity through a projection, which is why every entity gets a read surface (`readSurface`).
- **Removed or renamed contracts leave stale files** (entities, DTOs, types, scaffolds); `generated:stale` finds stale entities, which would otherwise create phantom tables.
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
(cd dryv && bun run adopt:list && bun run generated:check)

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
| `bun run generated:check` | generated output is current and no stale entities remain (needs the Dryv API)                                                |
| `bun run access:export`   | re-export policies and target kinds after changing operations or entities                                                    |
| `bun run adopt:list`      | give newly scaffolded Find use cases the shared paging and filter helper                                                     |

## Canonical Main and Operations setup

Both stores are declared by `contracts/apps/database/index.ts`. Persisted groups under
`contracts/schemas/mzizi` select `main`; those under `operational` select `operations`. The schema
storage facet can override its group default explicitly. Namespace and table remain separate.
The database app declares read/write access to both stores and explicitly provides six
named operations from `reference.ts`, `filesystem.ts` and `auth.ts`. Non-persisted Accountability view models have no store/table.
The legacy API remains a separate authoring root; this setup does not mix its old domain entities
with the database foundation or create an engine/client app implicitly.

Root `dryv.yaml` maps `main` to `mzizi` and `operations` to `mzizi_operations`. Runtime variables
are `MZIZI_DB_MAIN_URL` and `MZIZI_DB_OPERATIONS_URL`; administrative names have `_ADMIN_URL`.
Values remain client-local. A deployment using different database names must explicitly adjust
those two usage identities to match its environment; do not put credentials in the YAML.

From the repository root:

```bash
bun run typecheck --only scripts
# Focused static check before generation:
bun run dryv:database:typecheck
bun run dryv:database:check
bun run dryv:database:plan
bun run dryv:database:generate
bun run dryv:database:generate -- --store main
bun run dryv:database:generate -- --store operations
bun run dryv:database:verify
```

The first complete database generation creates shared catalogue modules. Thereafter store-only
generation writes only that store's models, verifier and SQL snapshot. Rust rows live below
`models/main/<namespace>/` and `models/operations/<namespace>/`; the public Rust module paths stay
`models::main::<namespace>::<entity>` and `models::operations::<namespace>::<entity>`. SQL remains
`generated/sql/main.sql` and `operations.sql` for the existing administration CLI. Shared
`mod.rs` and `contract.rs` belong only to `rust-catalog`; no two activations own one output.
Legacy `bun run dryv:generate` selects only its six API packs and retains its API follow-ups.

Dryv checkpoints are local by default. After actual successful generation/checks, use the local
Dryv CLI to run `checkpoint approve --app database` or approve a complete selected store with
`checkpoint approve --store main`. Inspect `checkpoint status` and
`explain change --baseline approved --app database --diff full`. Change `checkpoints.storage`
to `repository` only when the project chooses to commit compressed baselines; Dryv never commits
or silently approves. Formatting/final checks must succeed before approval.

This config deliberately does not enable Dryv migration execution: its initial PostgreSQL mapping
does not cover Mzizi's temporal properties, advanced constraints and PostGIS placeholder. Existing
`mzizi-db` releases and `public.mzizi_migrations` remain authoritative for applied state. Generation
can change a schema snapshot but never rewrites an immutable release or applies it. A changed
snapshot still requires a reviewed incremental migration procedure; do not reset a release stream.

The database typecheck uses `tsconfig.database.json` and includes every neutral schema plus its
own application entrypoint. The legacy all-contract typecheck remains separate: its main entrypoint
currently imports `_archive` files absent from this checkout. This setup does not recreate those
historical contracts or claim the legacy API can be regenerated from missing inputs.


### Database service contracts

The database authoring root uses `#/` for imports from the root of `dryv/contracts`.
Use `bun run --cwd dryv database:typecheck` and `bun run --cwd dryv database:compile`
to check this root independently.

The reference module binds the two browse routes to named, paged queries. It keeps
the live `schemes` and `values` envelopes and snake_case fields. Member lookup uses
the live `{ scheme, code }` request and `{ value }` response. The filesystem module
uses a read projection for the folder returned by registration. The auth module
describes account resolution and permission evaluation using the live wire fields.
Shared HTTP failure mappings are in `contracts/apps/database/failures.ts`.

Before switching runtime handlers, reconcile the immutable initial migration with
the current model snapshot. The initial reference and folder tables use snake_case
columns and omit fields present in the newer generated snapshot. The current SeaORM
pack uses authored column names, and its paging executor requires supplied numeric
arguments even when an input schema declares a default. Member lookup needs an
Engine uniqueness proof for the applicable live-row indexes. Folder registration
also needs the acting account permission evaluated across the Operations and Main
stores. The current lookup, auth, and folder routes therefore use service handlers.

The independent product API root still refers to missing `contracts/_archive`
modules in this checkout. The database check covers the active database root.
The official Python SDK pack's flat model filenames collide across groups on the
full database IR. The scratch generation used group-qualified filenames and
symbols. The generated Rust crate also needs an empty-policy registry fix
before it passes strict Clippy for this app.
