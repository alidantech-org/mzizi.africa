# Database

`source/backend/database` is where the single PostgreSQL database `mzizi` is defined and administered. It is not a service: there is no server process. The Python engine and the NestJS API connect to PostgreSQL directly with their own roles. Design and rules: [DATABASE_ARCHITECTURE](../../../.docs/design/data/DATABASE_ARCHITECTURE.md); owner decision: [DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115](../../../.docs/decisions/DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115.md).

```text
sql/schema.sql        generated schema snapshot (Dryv pack postgres-sql); never edited by hand
migrations/           immutable release stream: 0001_init.sql plus the .snapshot checksum record
src/                  the Bun CLI: cli.ts, commands.ts, ledger.ts, releases.ts, config.ts (+ tests)
package.json          bun run db | typecheck | test
```

Schemas, tables and columns are authored as Dryv contracts in `dryv/contracts/schemas/postgres` and generated; they are never written by hand here. The snapshot currently holds 12 schemas and 94 tables (reference, geography, legal, official, governance, politics, finance, civic, source, filesystem, auth, audit).

## Commands

Run from the repository root (`bun run db <command>`) or from this folder.

| Command | Needs the database | Does |
|---|---|---|
| `assemble` | no | Turns `sql/schema.sql` into `migrations/0001_init.sql` and records its checksum; refuses a changed snapshot |
| `plan` | yes | Lists pending releases and verifies checksums without applying anything |
| `status` | yes | Shows applied and pending releases |
| `migrate` | yes | Applies pending releases under an advisory lock, each in one transaction with its ledger row |
| `verify` | yes | Checks applied releases against recorded checksums and the database identity |
| `roles` | yes | Provisions the `mzizi_engine` and `mzizi_api` roles and grants (idempotent) |

Environment: `MZIZI_DB_ADMIN_URL` (administrative connection, used only here), `MZIZI_DB_ENGINE_PASSWORD` and `MZIZI_DB_API_PASSWORD` (for `roles`), optional `MZIZI_DB_SNAPSHOT` and `MZIZI_DB_MIGRATIONS_DIR`. Application roles can read and write every domain schema, cannot run DDL, and cannot read the ledger tables in `public`.

## Workflow

```bash
bun run dryv:api                 # starts the Dryv engine API (needs the Dryv checkout; see dryv/README.md)
bun run dryv:database:generate   # writes sql/schema.sql
bun run db assemble              # first release only; a changed snapshot is refused
MZIZI_DB_ADMIN_URL=postgres://… bun run db migrate
```

Use a fresh database. The earlier databases (`mzizi`, `mzizi_dev`, `mzizi_new`) were created from the removed release streams, so their ledgers do not match; nothing here drops them.

## Tests

`bun run test` runs the pure tests for snapshot assembly and checksum reconciliation. The end-to-end run against a scratch PostgreSQL database (assemble, plan, migrate, repeat migrate, status, verify, roles, role permissions) was done by hand on 15 November 2026 and is not yet an automated test.

## Known limits

- Releases are immutable and no schema-evolution releases are generated, so a changed contract needs a deliberate new stream or a hand-authored release.
- `seed` is not implemented; there is no reviewed seed set (`seed/_fixtures` is test-only).
- `geography.geometries` has no geometry column yet (see [DRYV_GAPS](../../../.docs/design/data/DRYV_GAPS.md)).
- Staging, acquisition, engine-run and analytics tables were removed from PostgreSQL; their replacement is MongoDB (planned).
