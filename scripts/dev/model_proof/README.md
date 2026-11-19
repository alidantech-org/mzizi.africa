# Model proof (scratch database only)

Hand-written test rows and queries that prove the schema change inventory of 19 November 2026
(`.docs/design/data/SCHEMA_CHANGE_INVENTORY_20261119.md`) holds Kenya and a second country, with no change to a contract.

Run against an **empty scratch database** (`mzizi_test`), never `mzizi` or `mzizi_ui`, in this order:

```bash
A=postgres://postgres@127.0.0.1:5432
psql $A/postgres -c "drop database if exists mzizi_test with (force)" -c "create database mzizi_test template template_postgis"
MZIZI_DB_ADMIN_URL=$A/mzizi_test bun run db migrate
for f in 00_helpers 10_structure 20_queries_structure 30_money 40_queries_money; do psql $A/mzizi_test -v ON_ERROR_STOP=0 -f scripts/dev/model_proof/$f.sql; done
```

`00_helpers.sql` creates a `t` schema with row-making helpers (system columns filled, scheme and value created by code). The data is invented test data
tagged `test`; it never goes into `seed/`. Query 5 of `20_queries_structure.sql` shows constraint violations on purpose.

## Generated integrity regression

After applying the latest generated snapshot to an isolated proof database, run `psql -v ON_ERROR_STOP=1 -f scripts/dev/model_proof/50_integrity.sql`. It rolls back every fixture and checks declared enum rejection, incompatible template attributes, distinct numbered seats, duplicate seat rejection and office/position institution consistency. It does not apply or reset any schema.
