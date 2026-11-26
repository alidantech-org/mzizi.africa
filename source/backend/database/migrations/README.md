# Migrations

One immutable release stream for the single database `mzizi`. `bun run db assemble` writes `0001_init.sql` from the generated snapshot (`sql/schema.sql`) and records its SHA-256 in `.snapshot`. `bun run db migrate` applies each release in one transaction together with its row in `public.mzizi_migrations`; a changed checksum is refused forever after. Do not edit committed releases. Details: [database README](../README.md).

## Releases

- `0001_init.sql`: the one baseline, reassembled on 26 November 2026 from the contracts after the database design and seed rethink ([decision](../../../../.docs/decisions/DEC-DB-RETHINK-ROOTS-UNITS-SLOTS-20261125.md)): the `template` schema, `geography.areas`, premises, office terms and holder slots, and the guards, the `template.generate` function and the coverage views rendered by the project pack. The earlier baseline and the hand-written `0002_reference_metadata.sql` were deleted, not continued (the `legal.references.metadata` column is in the baseline). The assembled file is never edited by hand.

## Later releases

Schema evolution releases are not generated yet. A change to the contracts after the stream is deployed needs a hand-written next numbered release; check on a scratch database that the earlier releases plus the new one equal the regenerated snapshot, then record the new snapshot checksum in `.snapshot`. `bun test` fails if the record and the snapshot disagree. While the database is still disposable, regenerate the snapshot, delete the release, run `bun run db assemble` and recreate the database.
