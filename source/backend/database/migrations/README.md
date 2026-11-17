# Migrations

One immutable release stream for the single database `mzizi`. `bun run db assemble` writes `0001_init.sql` from the generated snapshot and records its SHA-256 in `.snapshot`. `bun run db migrate` applies each release in one transaction together with its row in `public.mzizi_migrations`; a changed checksum is refused forever after. Do not edit committed releases. Details: [database README](../README.md).

## Later releases

Schema evolution releases are not generated yet. Until they are, a change to the contracts is released by hand: write the next numbered file (`0002_<name>.sql`) with the additive statements, check on a scratch database that the earlier releases plus the new one equal the regenerated snapshot (`sql/schema.sql`), then record the new snapshot checksum in `.snapshot` (`sha256sum sql/schema.sql | cut -d' ' -f1 > migrations/.snapshot`). `bun test` fails if the record and the snapshot disagree. Committed releases are never edited. The stream was reset to a single fresh `0001_init` on 17 November 2026, built from the current snapshot, because the database was disposable; any earlier ledger is obsolete and must be recreated.


## Release 0002

`0002_languages_codes_matching.sql` adds the language registry, a `code` on every seedable table that lacked one, `is_default` on geography names and the `pg_trgm`, `unaccent` and `fuzzystrmatch` extensions. It was produced from a schema diff (migra) of release 0001 against the regenerated snapshot, and checked: 0001 followed by 0002 has no difference from `sql/schema.sql`. It needs a role that may create extensions and tables that are empty.
