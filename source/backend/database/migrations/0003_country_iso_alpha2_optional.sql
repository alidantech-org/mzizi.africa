-- Release 0003: iso_alpha2 becomes optional.
--
-- Some countries have no ISO 3166 code (for example Somaliland and Transnistria); their `code` identifies them. The unique
-- index on iso_alpha2 stays: PostgreSQL allows many rows with no value in a unique index.

ALTER TABLE "reference"."countries" ALTER COLUMN "iso_alpha2" DROP NOT NULL;
