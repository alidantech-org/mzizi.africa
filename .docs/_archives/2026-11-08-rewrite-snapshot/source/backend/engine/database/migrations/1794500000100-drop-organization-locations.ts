import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Retires organization.locations (TSK-28DC592B1E17). Its rows were moved to place.places and place.occupancies by
 * `migrate-locations` (src/location-migration.ts), which verifies every count. This migration refuses to drop the table while
 * it still holds rows that have not been moved or while evidence still points at it, so data cannot be lost by running it early.
 */
export class DropOrganizationLocations1794500000100 implements MigrationInterface {
  name = "DropOrganizationLocations1794500000100";

  public async up(q: QueryRunner): Promise<void> {
    const [{ n }] = await q.query(`SELECT count(*)::int AS n FROM "organization"."locations" l WHERE NOT EXISTS (SELECT 1 FROM "place"."occupancies" o WHERE o.subject_kind = 'organization.entities' AND o.subject_id = l.entity_id)`);
    if (n > 0) throw new Error(`${n} locations have no occupancy yet; run "bun src/cli.ts migrate-locations" first`);
    const [{ e }] = await q.query(`SELECT (SELECT count(*) FROM "source"."attributions" WHERE target_kind = 'organization.locations') + (SELECT count(*) FROM "source"."verifications" WHERE target_kind = 'organization.locations') AS e`);
    if (Number(e) > 0) throw new Error(`${e} evidence rows still point at organization.locations; run migrate-locations first`);
    await q.query(`DROP INDEX "organization"."idx_entity_location_entity"`);
    await q.query(`DROP TABLE "organization"."locations"`);
    await q.query(`DROP TYPE "organization"."locations_valid_to_precision_enum"`);
    await q.query(`DROP TYPE "organization"."locations_valid_from_precision_enum"`);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`CREATE TYPE "organization"."locations_valid_from_precision_enum" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')`);
    await q.query(`CREATE TYPE "organization"."locations_valid_to_precision_enum" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')`);
    await q.query(`CREATE TABLE "organization"."locations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "address_text" character varying(500), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "entity_id" uuid NOT NULL, "geo_unit_id" uuid, "is_current" boolean NOT NULL, "kind_id" uuid, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "valid_from" date, "valid_from_precision" "organization"."locations_valid_from_precision_enum", "valid_to" date, "valid_to_precision" "organization"."locations_valid_to_precision_enum", "version" integer NOT NULL, CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`);
    await q.query(`CREATE INDEX "idx_entity_location_entity" ON "organization"."locations" ("entity_id")`);
    // The moved rows are not copied back: places and occupancies are the record of them now.
  }
}
