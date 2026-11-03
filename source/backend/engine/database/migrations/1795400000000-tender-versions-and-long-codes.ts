import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Procurement ids are source-assigned keys (OCDS ids reach 255 characters) and are never truncated: tender and contract codes widen to 300.
 * A tender seen again in a later release is a new version of the same canonical tender, so the code is no longer unique alone:
 * (code, version_number) is,; promotion keeps exactly one current row per code.
 */
export class TenderVersionsAndLongCodes1795400000000 implements MigrationInterface {
  name = "TenderVersionsAndLongCodes1795400000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "procurement"."tenders" ALTER COLUMN "code" TYPE character varying(300)');
    await queryRunner.query('ALTER TABLE "procurement"."contracts" ALTER COLUMN "code" TYPE character varying(300)');
    await queryRunner.query('ALTER TABLE "procurement"."tenders" ADD "version_number" integer NOT NULL DEFAULT 1');
    await queryRunner.query('ALTER TABLE "procurement"."tenders" ALTER COLUMN "version_number" DROP DEFAULT');
    await queryRunner.query('DROP INDEX "procurement"."idx_tender_code"');
    await queryRunner.query('CREATE INDEX "idx_tender_code" ON "procurement"."tenders" ("code")');
    await queryRunner.query('CREATE UNIQUE INDEX "uq_tender_code_version" ON "procurement"."tenders" ("code", "version_number")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "procurement"."uq_tender_code_version"');
    await queryRunner.query('DROP INDEX "procurement"."idx_tender_code"');
    await queryRunner.query('CREATE UNIQUE INDEX "idx_tender_code" ON "procurement"."tenders" ("code")');
    await queryRunner.query('ALTER TABLE "procurement"."tenders" DROP COLUMN "version_number"');
    await queryRunner.query('ALTER TABLE "procurement"."contracts" ALTER COLUMN "code" TYPE character varying(200)');
    await queryRunner.query('ALTER TABLE "procurement"."tenders" ALTER COLUMN "code" TYPE character varying(200)');
  }
}
