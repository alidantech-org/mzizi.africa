# Migrations

One immutable release stream for the single database `mzizi`. `bun run db assemble` writes `0001_init.sql` from the generated snapshot (`sql/schema.sql`) and records its SHA-256 in `.snapshot`. `bun run db migrate` applies each release in one transaction together with its row in `public.mzizi_migrations`; a changed checksum is refused forever after. Do not edit committed releases. Details: [database README](../README.md).

## Releases

- `0001_init.sql`: the one baseline, assembled on 25 November 2026 from the redesigned contracts ([FOUNDATION_REDESIGN](../../../../.docs/design/data/FOUNDATION_REDESIGN.md)). The earlier stream (an `0001_init.sql` of the old design and `0002_subject_integrity.sql`) was deleted, not continued: the new design keeps subject links only in `source`, so no subject-integrity release exists.

## Later releases

Schema evolution releases are not generated yet. A change to the contracts after the stream is deployed needs a hand-written next numbered release; check on a scratch database that the earlier releases plus the new one equal the regenerated snapshot, then record the new snapshot checksum in `.snapshot`. `bun test` fails if the record and the snapshot disagree. While the database is still disposable, regenerate the snapshot, delete the release, run `bun run db assemble` and recreate the database.
