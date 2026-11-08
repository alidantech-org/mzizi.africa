import type { MigrationInterface, QueryRunner } from "typeorm";

/** Claim review and promotion record (TSK-D16F9399E4B6): who accepted or rejected a claim, why, and when it was promoted into the data table. */
export class ClaimReview1794900000001 implements MigrationInterface {
  name = "ClaimReview1794900000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE engine.claims ADD COLUMN reviewed_by uuid, ADD COLUMN reviewed_at timestamptz, ADD COLUMN review_rationale text, ADD COLUMN promoted_at timestamptz`);
    await queryRunner.query(`CREATE INDEX idx_claims_review ON engine.claims (review, promoted_at)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX engine.idx_claims_review`);
    await queryRunner.query(`ALTER TABLE engine.claims DROP COLUMN reviewed_by, DROP COLUMN reviewed_at, DROP COLUMN review_rationale, DROP COLUMN promoted_at`);
  }
}
