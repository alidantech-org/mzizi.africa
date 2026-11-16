-- Release 0002: richer country identity (additive).
--
-- reference.countries gains the official name, ISO 3166 codes, the calling code, the established date and links to the
-- classification values for continent, subregion, currency, recognition status and designation. Every link is optional and
-- points at reference.values, which points at reference.schemes; nothing points back, so there is no cycle.
-- iso_alpha2 is required: this release assumes reference.countries is still empty (no country was seeded before it).
-- The generated snapshot (sql/schema.sql) is the target state; releases 0001 and 0002 together produce it.

ALTER TABLE "reference"."countries"
  ADD COLUMN "official_name" varchar(300),
  ADD COLUMN "iso_alpha2" char(2) NOT NULL,
  ADD COLUMN "iso_alpha3" char(3),
  ADD COLUMN "iso_numeric" char(3),
  ADD COLUMN "calling_code" varchar(5),
  ADD COLUMN "established_on" date,
  ADD COLUMN "continent_id" uuid,
  ADD COLUMN "subregion_id" uuid,
  ADD COLUMN "currency_id" uuid,
  ADD COLUMN "recognition_status_id" uuid,
  ADD COLUMN "designation_id" uuid;

ALTER TABLE "reference"."countries"
ADD CONSTRAINT "fk_countries_continent_id" FOREIGN KEY ("continent_id") REFERENCES "reference"."values" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "reference"."countries"
ADD CONSTRAINT "fk_countries_currency_id" FOREIGN KEY ("currency_id") REFERENCES "reference"."values" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "reference"."countries"
ADD CONSTRAINT "fk_countries_designation_id" FOREIGN KEY ("designation_id") REFERENCES "reference"."values" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "reference"."countries"
ADD CONSTRAINT "fk_countries_recognition_status_id" FOREIGN KEY ("recognition_status_id") REFERENCES "reference"."values" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "reference"."countries"
ADD CONSTRAINT "fk_countries_subregion_id" FOREIGN KEY ("subregion_id") REFERENCES "reference"."values" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

CREATE UNIQUE INDEX "uq_countries__iso_alpha2" ON "reference"."countries" ("iso_alpha2");

CREATE INDEX "ix_countries__continent_id" ON "reference"."countries" ("continent_id");

CREATE INDEX "ix_countries__subregion_id" ON "reference"."countries" ("subregion_id");

CREATE INDEX "ix_countries__currency_id" ON "reference"."countries" ("currency_id");

CREATE INDEX "ix_countries__recognition_status_id" ON "reference"."countries" ("recognition_status_id");

CREATE INDEX "ix_countries__designation_id" ON "reference"."countries" ("designation_id");
