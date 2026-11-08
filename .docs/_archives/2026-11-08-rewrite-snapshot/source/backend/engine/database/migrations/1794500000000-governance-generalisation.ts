import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Governance generalisation (TSK-AA0A323E646D, PLACES_AND_PRESENCE_ASSESSMENT.md).
 * - governance.relationships: subject and object are kind + id pairs (any schema), six added kinds. Existing rows keep their meaning:
 *   parent becomes the subject, child the object, both of kind `institution`. The foreign key to institutions is dropped.
 * - governance.institutions: optional soft `entity_id`; `geo_unit_id` is renamed `scope_geo_unit_id` (jurisdiction scope, not a building).
 * - governance.offices: `scope_geo_unit_id` (the unit a seat represents) and `definition_code` (the reusable pattern).
 * - civic.amenities: `geo_unit_id` dropped (a facility's position is a place occupancy; its operator and owner are relationships).
 * Written by hand rather than generated so that the relationship rows are carried over. Data backfills are in src/governance-backfill.ts.
 */
export class GovernanceGeneralisation1794500000000 implements MigrationInterface {
  name = "GovernanceGeneralisation1794500000000";

  public async up(q: QueryRunner): Promise<void> {
    for (const kind of ["owned_by", "operated_by", "funded_by", "regulated_by", "overseen_by", "part_of"]) {
      await q.query(`ALTER TYPE "governance"."relationships_kind_enum" ADD VALUE IF NOT EXISTS '${kind}'`);
    }
    await q.query(`ALTER TABLE "governance"."relationships" ADD "subject_kind" character varying(100), ADD "subject_id" uuid, ADD "object_kind" character varying(100), ADD "object_id" uuid`);
    await q.query(`UPDATE "governance"."relationships" SET "subject_kind" = 'institution', "subject_id" = "parent_institution_id", "object_kind" = 'institution', "object_id" = "child_institution_id"`);
    await q.query(`ALTER TABLE "governance"."relationships" ALTER COLUMN "subject_kind" SET NOT NULL, ALTER COLUMN "subject_id" SET NOT NULL, ALTER COLUMN "object_kind" SET NOT NULL, ALTER COLUMN "object_id" SET NOT NULL`);
    await q.query(`ALTER TABLE "governance"."relationships" DROP CONSTRAINT "FK_f5f0946a7c954abaeb31a4d14a7"`);
    await q.query(`DROP INDEX "governance"."idx_institution_relationship_parent"`);
    await q.query(`ALTER TABLE "governance"."relationships" DROP COLUMN "parent_institution_id", DROP COLUMN "child_institution_id"`);
    await q.query(`CREATE INDEX "idx_relationship_subject" ON "governance"."relationships" ("subject_kind", "subject_id", "kind")`);
    await q.query(`CREATE INDEX "idx_relationship_object" ON "governance"."relationships" ("object_kind", "object_id", "kind")`);

    await q.query(`ALTER TABLE "governance"."institutions" RENAME COLUMN "geo_unit_id" TO "scope_geo_unit_id"`);
    await q.query(`ALTER TABLE "governance"."institutions" ADD "entity_id" uuid`);
    await q.query(`CREATE INDEX "idx_institution_entity" ON "governance"."institutions" ("entity_id")`);
    await q.query(`CREATE INDEX "idx_institution_scope" ON "governance"."institutions" ("scope_geo_unit_id")`);

    await q.query(`ALTER TABLE "governance"."offices" ADD "definition_code" character varying(200), ADD "scope_geo_unit_id" uuid`);
    await q.query(`CREATE INDEX "idx_office_scope" ON "governance"."offices" ("scope_geo_unit_id")`);

    await q.query(`DROP INDEX "civic"."idx_amenity_geo"`);
    await q.query(`ALTER TABLE "civic"."amenities" DROP COLUMN "geo_unit_id"`);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`ALTER TABLE "civic"."amenities" ADD "geo_unit_id" uuid`);
    await q.query(`CREATE INDEX "idx_amenity_geo" ON "civic"."amenities" ("geo_unit_id")`);
    await q.query(`DROP INDEX "governance"."idx_office_scope"`);
    await q.query(`ALTER TABLE "governance"."offices" DROP COLUMN "scope_geo_unit_id", DROP COLUMN "definition_code"`);
    await q.query(`DROP INDEX "governance"."idx_institution_scope"`);
    await q.query(`DROP INDEX "governance"."idx_institution_entity"`);
    await q.query(`ALTER TABLE "governance"."institutions" DROP COLUMN "entity_id"`);
    await q.query(`ALTER TABLE "governance"."institutions" RENAME COLUMN "scope_geo_unit_id" TO "geo_unit_id"`);
    await q.query(`ALTER TABLE "governance"."relationships" ADD "parent_institution_id" uuid, ADD "child_institution_id" uuid`);
    // Only institution-to-institution edges can go back; edges between other subjects have no old form and are removed.
    await q.query(`DELETE FROM "governance"."relationships" WHERE "subject_kind" <> 'institution' OR "object_kind" <> 'institution' OR "kind"::text IN ('owned_by','operated_by','funded_by','regulated_by','overseen_by','part_of')`);
    await q.query(`UPDATE "governance"."relationships" SET "parent_institution_id" = "subject_id", "child_institution_id" = "object_id"`);
    await q.query(`ALTER TABLE "governance"."relationships" ALTER COLUMN "parent_institution_id" SET NOT NULL, ALTER COLUMN "child_institution_id" SET NOT NULL`);
    await q.query(`DROP INDEX "governance"."idx_relationship_object"`);
    await q.query(`DROP INDEX "governance"."idx_relationship_subject"`);
    await q.query(`ALTER TABLE "governance"."relationships" DROP COLUMN "subject_kind", DROP COLUMN "subject_id", DROP COLUMN "object_kind", DROP COLUMN "object_id"`);
    await q.query(`CREATE INDEX "idx_institution_relationship_parent" ON "governance"."relationships" ("parent_institution_id", "kind")`);
    await q.query(`ALTER TABLE "governance"."relationships" ADD CONSTRAINT "FK_f5f0946a7c954abaeb31a4d14a7" FOREIGN KEY ("parent_institution_id") REFERENCES "governance"."institutions"("id")`);
    // Enum values cannot be removed from a Postgres enum; the six added kinds stay in the type.
  }
}
