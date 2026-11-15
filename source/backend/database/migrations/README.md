# Migrations

One immutable release stream for the single database `mzizi`. `bun run db assemble` writes `0001_init.sql` from the generated snapshot and records its SHA-256 in `.snapshot`. `bun run db migrate` applies each release in one transaction together with its row in `public.mzizi_migrations`; a changed checksum is refused forever after. Do not edit committed releases. Details: [database README](../README.md).
