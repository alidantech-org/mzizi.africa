# Database

`source/backend/database` is where the single PostgreSQL database `mzizi` is defined and administered. It is not a service: there is no server process. The Python engine and the NestJS API connect to PostgreSQL directly with their own roles. Design and rules: [DATABASE_ARCHITECTURE](../../../.docs/design/data/DATABASE_ARCHITECTURE.md); owner decision: [DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115](../../../.docs/decisions/DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115.md).

```text
sql/schema.sql        generated, formatted schema snapshot (Dryv pack postgres-sql + `db format`); never edited by hand
migrations/           immutable release stream: one baseline 0001_init.sql and the .snapshot checksum record
src/                  the Bun CLI: cli.ts, commands.ts, ledger.ts, releases.ts, maintenance.ts, config.ts (+ tests)
package.json          bun run db | typecheck | test
```

Schemas, tables and columns are authored as Dryv contracts in `dryv/contracts/schemas/postgres` and generated; they are never written by hand here. The snapshot holds the 22 schemas of [FOUNDATION_REDESIGN](../../../.docs/design/data/FOUNDATION_REDESIGN.md) (202 tables, 18 of them partitioned), with table and column comments from the contract descriptions. Provenance lives only in `source.evidence` (subject links without foreign keys, by design).

## Commands

Run from the repository root (`bun run db <command>`) or from this folder.

| Command | Needs the database | Does |
|---|---|---|
| `format [--check] [file…]` | no | Formats generated SQL with sql-formatter (the snapshot by default); `--check` only reports. Dryv runs it automatically after generation |
| `assemble` | no | Turns `sql/schema.sql` into `migrations/0001_init.sql` and records its checksum; refuses a changed snapshot. Later releases are written by hand (see `migrations/README.md`) |
| `plan` | yes | Lists pending releases and verifies checksums without applying anything |
| `status` | yes | Shows applied and pending releases |
| `migrate` | yes | Applies pending releases under an advisory lock, each in one transaction with its ledger row |
| `verify` | yes | Checks applied releases against recorded checksums and the database identity |
| `roles` | yes | Provisions the `mzizi_engine` and `mzizi_api` roles and grants (idempotent) |
| `refresh [outlines\|pieces\|figures…]` | yes | Rebuilds prepared tables: map outlines per zoom band (0–3, coordinates rounded to 5 decimals), "where am I?" pieces (`ST_Subdivide`, 256 vertices) and `statistics.figures` (chosen by `statistics.priorities`, then revision, then final). Run after every data load |
| `partitions [--through YYYY-MM]` | yes | Adds the missing monthly partitions of every month-partitioned table (default: 12 months ahead). The baseline creates January 2024 to December 2027 plus a DEFAULT partition |

Environment: `MZIZI_DB_ADMIN_URL` (administrative connection, used only here), `MZIZI_DB_ENGINE_PASSWORD` and `MZIZI_DB_API_PASSWORD` (for `roles`), optional `MZIZI_DB_SNAPSHOT` and `MZIZI_DB_MIGRATIONS_DIR`. Application roles can read and write every domain schema, cannot run DDL, and cannot read the ledger tables in `public`.

## Workflow

```bash
bun run dryv:database:generate   # writes sql/schema.sql (Dryv engine API on DRYV_API_PORT)
bun run db assemble              # first release only; a changed snapshot is refused
MZIZI_DB_ADMIN_URL=postgres://… bun run db migrate
bun run db roles
bun run db refresh               # after loading data
```

## The rebuild database

The rebuild run (25 November 2026) created a new, separate database **`mzizi_rebuild`** on the local server (`postgres://postgres@127.0.0.1:5432/mzizi_rebuild`, template `template_postgis`) from the new baseline. The application roles are the usual `mzizi_engine` and `mzizi_api` (passwords from `.env`); point `DATABASE_URL`, `DATABASE_WRITE_URL` and `MZIZI_DB_ADMIN_URL` at `mzizi_rebuild` to use it. Earlier databases (`mzizi`, `mzizix`, `mzizi_ui`, `mzizi_ux`) belong to the old design and are untouched. It is seeded from the git-ignored `.dev/seed/rebuild/` (`export.py` builds the CSV inputs, `load.py` loads them), then `bun run db refresh`.

Query plans recorded on it (`EXPLAIN (ANALYZE, BUFFERS)`, 25 November 2026): figures for a place 0.10 ms and one indicator across places 0.05 ms (both one hash partition of `statistics.figures`, index scans); names of an identity 0.1 ms (index scan per kind partition; reads that know the kind prune to one); children of a place 0.11 ms; offices of a place 0.07 ms; outline by band 0.04 ms; point lookup in `geography.pieces` 0.17 ms (GiST); place by code 0.04 ms.

## Tests

`bun run test` runs the pure tests for snapshot assembly and checksum reconciliation. The end-to-end run against a scratch PostgreSQL database (assemble, plan, migrate, repeat migrate, status, verify, roles, role permissions) was done by hand on 15 November 2026 and is not yet an automated test.

## Known limits

- Releases are immutable and no schema-evolution releases are generated, so a changed contract needs a deliberate new stream or a hand-authored release.
- Seeding is local tooling in the git-ignored `.dev/seed/`, never a command here ([decision](../../../.docs/decisions/DEC-SEED-OUTSIDE-GIT-20261125.md)).
- Neighbouring outlines are simplified one by one (`ST_SimplifyPreserveTopology`), not as one shared topology yet, so small gaps can appear between neighbours at band 0.
- A month that already has rows in a DEFAULT partition must be moved before `partitions` can add it.
- Staging, acquisition, engine-run and analytics tables were removed from PostgreSQL; their replacement is MongoDB (planned).
