---
id: DOC-DRYV-GAPS-20261115
name: DRYV_GAPS
type: documentation
tags: [dryv,gaps,generation,postgres,mongo,python,typeorm]
---

# Dryv gaps that affect Mzizi

**Status: register, 15 November 2026.** This lists what Dryv does not yet do for the one-PostgreSQL, Mongo-staging design in [DATABASE_ARCHITECTURE](DATABASE_ARCHITECTURE.md). Each row says how it was found. "Verified" means observed in this repository or by running a command on 15 November 2026; "reported" means stated in a contract or README comment and not re-tested.

## Gaps in order of impact

| # | Gap | Evidence | Effect on Mzizi | Where to fix |
|---|---|---|---|---|
| 1 | **No change-aware SQL.** Generation produces a full snapshot only; `bun run db assemble` refuses any changed snapshot, so no `0002` release can be produced | Verified: `releases.ts` and the `postgres-sql` pack; the earlier decision DEC-CANONICAL-STORES says Dryv's initial migration adapter does not cover Mzizi's model | Every contract change after the first release needs a hand-written release or a fresh stream | Dryv: diff-aware migration generation; or Mzizi: write releases by hand and keep the snapshot as a check |
| 2 | **No Mongo or document store.** Dryv stores accept only `driver: postgresql` | Verified: Dryv engine `usage/document.py` declares `driver: Literal["postgresql"]` | Mongo contracts can be authored as schemas but no collection, index or validator is generated | Dryv: add a document-store driver and pack contract |
| 3 | **No Python model generation in the project.** The repo has no Python or Pydantic pack | Verified: `dryv/packs` holds only `postgres-sql`, `type-files`, `use-cases` | Typed Python for Postgres and Mongo (a hard requirement of the owner order) does not exist | Dryv repo has an example `fastapi-backend` pack (Pydantic models, services, routers) that is untried here; a models-only variant or JSON Schema export plus a generator is needed |
| 4 | **TypeORM entities are not generated from the contracts.** The `pgsql` application binds only the SQL pack and the `api` application is plan-only; the NestJS packs in `dryv.yaml` are not bound to an application | Verified: `dryv.yaml` `applications.database.packs` | The API's TypeORM layer is inherited code, not derived from the new schemas | Mzizi: bind the `typeorm` pack to the database app and fix the next gap |
| 5 | **Entity pack collisions.** Two relations from one entity to the same target generate colliding property names | Reported: `dryv/README.md` contract rules; many contracts hold two relations to `Accounts` (for example `grantedBy` and `revokedBy`) | TypeORM generation from the current auth and audit contracts would fail or need plain-id fields | Dryv: name relations by field; or Mzizi: workaround per contract |
| 6 | **Geometry has no type.** `geography.geometries.geometry` is `dryv.unknown()` and is excluded from the SQL | Verified: no geometry column in the generated `schema.sql`; the schema asks only for `btree_gist`; the local server has PostGIS installed | No stored boundaries, so spatial queries (point in unit, nearby, intersect) are impossible | Dryv: a geometry/geography property type that renders `geometry(...)` and requires PostGIS; Mzizi: decide SRID and storage |
| 7 | **Local checkout and running API required.** Generation needs the Dryv engine API running from a checkout outside the repository, plus pack trust | Verified: `bun run dryv:api` then `dryv:database:generate`; `DRYV_HOME` | New machines and CI cannot generate without that checkout; the README says the published packages are out of date | Dryv: publish matching packages and packs; Mzizi: pin and document |
| 8 | **Pin and local-patch mismatch.** The database README says null comparisons in invariants need a local engine change not in the pinned commit | Reported: former database README | CHECK constraints involving nulls may differ between machines | Dryv: land the change upstream |
| 9 | **Cross-scheme integrity not enforceable.** A column that must hold a value from one specific vocabulary scheme (for example a feature type) cannot be checked | Reported: comments in `geography.ts` and `reference.ts` | Bad classification links can be stored | Dryv: scheme-scoped reference constraints; or Mzizi: engine validation |
| 10 | **No cycle check through edge tables.** `value_relations` and similar edges can form cycles | Reported: `reference.ts` header | Hierarchies and supersession through edges are unchecked | Dryv: acyclic constraint across an edge table |
| 11 | **Whole-repository upload on each run.** Plan and generate load about 5,265 files (23 MiB) | Verified in the command output | Slow runs; unrelated files sent to the engine | Mzizi: add a `.dryvignore` |
| 12 | **Planner warning.** The SQL template declares a static output name | Verified in the plan output (`planner.output.static_name`) | Cosmetic now; may become an error | Mzizi: move the filename into the pack layout |
| 13 | **Import resolution differs by tool.** The Dryv CLI authoring runner could not load `#/apps/<app>/_shared` without a `.ts` extension though Bun's own compile accepted it | Verified and fixed on 15 November 2026 | Contract files must use explicit `.ts` import paths | Mzizi: keep the rule; Dryv: resolve extensionless paths |
| 14 | **Python SDK pack file collisions.** The official Python SDK pack's flat model filenames collide across groups on the full database IR | Reported: `dryv/README.md` (scratch generation used group-qualified names) | Typed Python from all 12 schemas needs group-qualified output or a fixed pack | Dryv: group-qualified output paths |
| 15 | **Empty operation input.** `.input({})` is rejected. Omitting `.input(...)` works | Verified | Not a blocker; the message now says to omit it | **Fixed** (author message) |
| 16 | **Nameless reference errors.** An app that omits a group a relation points at got `unregistered schema declaration reference` | Verified | The error now names the declaration (`geography.Units`) and says to list its group | **Fixed** (author and compiler) |
| 17 | **Properties and nested schemas must be registered.** `field(property)` fails unless the property came from `group.properties({...})`; a schema used as a field must be a named registered schema | Verified | Small response shapes are verbose | Open: clearer type error |
| 18 | **A projection cannot be a query result.** The engine requires a query-bound output to be query-derived | Verified | Reads use `schema.fromQuery(query)`; projections stay for non-query shapes. The message now names the operation and query | **Message fixed**; the rule is by design, a way to select into a projection is open |
| 19 | **A projection cannot carry the page window.** `projected schemas cannot extend another schema` | Verified | A paged filter takes its fields from the stored properties instead of a projection | Open (design) |
| 20 | **Stable ordering on nested selections.** Every many-row related selection needs an ordering that includes its primary key. This was an authoring mistake, reported misleadingly as a root problem | Verified | The message now names the selection, schema and key | **Message fixed**; contracts corrected |
| 21 | **Unique lookup through a partial unique key.** A zero-or-one query keyed on a soft-delete partial unique index was rejected | Verified | Accepted now when the query restricts to the index's rows (`deletedAt` is null) | **Fixed** (engine) |
| 22 | **Validation needs a pack.** `selection matches no enabled pack activations` blocks planning an app with no pack | Verified | Contracts cannot be validated alone | Open (design) |
| 23 | **Registry pack manifest skew.** The registry OpenAPI pack fails to load on the local engine (`package.name: Input should be a valid dictionary or instance of PackInputRef`) | Verified | Registry packs cannot be assumed to run on the local engine | Open (packs repository) |
| 24 | **`dryv pack add` rewrites `dryv.yaml`** and moves the pinned `official` ref | Verified, reverted | Adding one pack changes every pack's pin | Open (client) |
| 25 | **TypeORM pack declared no store support.** A persistence pack must declare `capabilities.stores` when the app declares stores | Verified | The entities pack could not run | **Fixed** locally in the packs repository (not pushed) |
| 26 | **Invariant null guards ignored omitted fields.** class-validator rendered `=== null`, so an omitted optional field failed validation and did not typecheck | Verified (50 type errors) | Generated DTOs were wrong | **Fixed** locally in the packs repository (not pushed) |
| 27 | **Generated entity integrity spec keys on schema name.** Schemas named alike in different groups (`Names`, `Identifiers`, `Relationships`) share one class symbol and the spec matches the wrong contract | Verified: 15 of 3,326 generated tests fail | A green generated test run needs unique schema names or a pack fix | Open (packs repository; or rename in Mzizi) |
| 28 | **Removed contracts leave generated files.** Removing a contract left its DTO, interface, spec and example in place | Verified | Stale files broke the typecheck and had to be deleted by hand | **Fixed** (client: unchanged managed files no longer produced are deleted; hand-edited ones are conflicts) |
| 30 | **Types pack wrote flat files and duplicate entity interfaces.** `*.enum.ts`, `*.type.ts` and `*.interface.ts` sat in each module root, and every stored entity got an interface that nothing imported (the type-files pack owns entity types) | Verified (154 files) | Cluttered modules and duplicate declarations | **Fixed** locally in the packs repository: `enum/`, `type/` and `interface/` folders, no interface for stored entities |
| 29 | **A local pack source cannot be outside the project.** `usage paths must not traverse outside the project`, so a local packs checkout cannot be a path source | Verified | The project pins a `file://` git source to a local commit until the packs change is published | Open (design) |

## Generation test, 15 November 2026

The `api` application (auth, reference, geography, governance) plans and generates 788 files through the NestJS packs. `dryv generate --app api --check` reports the output matches the workspace, and the package typecheck passes. 3,296 generated tests pass and 15 fail (gap 27); 15 are todo scaffolds.

## What was checked and works

On 15 November 2026 Dryv compiled the single-store application (251 runtime IR records), generated `source/backend/database/sql/schema.sql` (12 schemas, 94 tables), and the Bun CLI applied it to an empty PostgreSQL 18 database. The migration ledger, checksum verification, advisory-locked migrate, a second idempotent migrate and role provisioning all passed. Engine and API roles were confirmed to read and write, to be refused DDL, and to be refused the ledger tables.

## What was not checked

- That every authored invariant appears as a database constraint; only the totals above were counted.
- Any Python, Mongo or TypeORM generation.
- Behaviour on a database that already holds the older `mzizi` release stream.
| 31 | **Static folders and per-entity folders.** Dryv warns about static `output.path` segments and forbids a dynamic directory in a template path, so a layout like `types/<entity>/` needs one static segment in the path | Verified | Three planner warnings remain for the type-files pack | Open (engine: allow a dynamic directory after a static one, or a path template) |
| 32 | **Deleting stale files left empty folders.** The cleanup removed 688 files but kept 104 empty directories | Verified | Cluttered module trees | **Fixed** (client prunes folders a deletion empties) |
| 33 | **Layout split needs static path segments.** `schema/`, `types/` and `features/` before a dynamic entity or feature folder cannot live in the pack filesystem, so 14 planner warnings remain | Verified | Noisy generate output | Open (same as gap 31) |
