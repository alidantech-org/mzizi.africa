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
| 15 | **No input means no operation.** `operation input must declare at least one field` rejects `GET /v1/account` | Verified 2026-11-15 | Operations with no parameters need a dummy field or cannot be authored | Dryv: allow empty input |
| 16 | **Nameless reference errors.** `unregistered schema declaration reference` does not say which schema or group is missing; an app must list every group a relation points at | Verified | Found by compiling each feature alone | Dryv: name the schema and the missing group in the diagnostic, or add groups transitively |
| 17 | **Properties and nested schemas must be registered.** `field(property)` fails unless the property came from `group.properties({...})`; a schema used as a field must be a named registered schema | Verified | Small response shapes are verbose | Dryv: clearer type error; allow anonymous nested schemas |
| 18 | **A projection cannot be a query result.** The engine rejects a query-bound output that is not query-derived (`ir.query.invalid_binding`), though the author compiler accepts it | Verified | Reads cannot reuse `projection(Entity).read()` shapes; they use `schema.fromQuery(query)` | Dryv: let a query select into a projection, or fail at author time |
| 19 | **A projection cannot carry the page window.** `projected schemas cannot extend another schema` | Verified | A filter derived from stored fields cannot also be paged; filters are declared fields reusing the stored property | Dryv: allow `projection(...).query()` to combine with paging |
| 20 | **Stable-order rule rejects valid roots.** `stable ordering must include the root primary key` is reported for `Units` (own primary key `featureId`) and for validity-based roots (`Institutions`, `Offices`) even when the ordering names the key; roots on `CodedEntity` (`Scheme`, `Value`) and `Created` (`Accounts`) pass | Verified: ScanUnits, FindUnit, ScanInstitutions, FindInstitution, FindOffice fail; ScanSchemes, ScanMembers, ScanAccounts pass | Five of nine queries cannot validate until fixed | Dryv engine: resolve the effective primary key for inherited and custom keys |
| 21 | **Unique lookups through partial or joined keys.** `zero-or-one queries require equality on a declared unique key` fails for a lookup by `code`, which `CodedEntity` declares as a partial unique index (live records only), and for a lookup through a joined scheme code | Verified: FindMember | Natural-key lookups cannot be declared | Dryv: accept partial unique keys; or a way to declare the live-record predicate |
| 22 | **Plan needs a pack.** `selection matches no enabled pack activations` blocks validating an app that has no pack, so the `api` app carries a plan-only SQL activation | Verified | Contracts cannot be validated alone | Dryv: a `validate` that needs no pack |
| 23 | **Registry pack manifests skew from the engine.** The registry `unit/documentation/openapi` pack fails to load (`package.name: Input should be a valid dictionary or instance of PackInputRef`) | Verified | Registry packs cannot be assumed to run on the local engine | Dryv: keep packs and engine in step |
| 24 | **`dryv pack add` rewrites `dryv.yaml`.** It reformatted the whole file and moved the pinned `official` ref to the registry commit | Verified, reverted | Adding one pack changes every pack's pin | Dryv: edit in place and keep refs |

## What was checked and works

On 15 November 2026 Dryv compiled the single-store application (251 runtime IR records), generated `source/backend/database/sql/schema.sql` (12 schemas, 94 tables), and the Bun CLI applied it to an empty PostgreSQL 18 database. The migration ledger, checksum verification, advisory-locked migrate, a second idempotent migrate and role provisioning all passed. Engine and API roles were confirmed to read and write, to be refused DDL, and to be refused the ledger tables.

## What was not checked

- That every authored invariant appears as a database constraint; only the totals above were counted.
- Any Python, Mongo or TypeORM generation.
- Behaviour on a database that already holds the older `mzizi` release stream.
