import type { MigrationInterface, QueryRunner } from "typeorm";

/** Staging additions for validation and controlled promotion: candidate key fields and the promotion record (PromotionDecision contract). */
export class StagingPromotion1793610764924 implements MigrationInterface {
  name = "StagingPromotion1793610764924";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE staging.candidates ADD COLUMN key_fields text[] NOT NULL DEFAULT '{}'`);
    await queryRunner.query(`CREATE TABLE staging.promotions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      candidate_id uuid NOT NULL REFERENCES staging.candidates(id),
      audit_decision_id uuid,
      outcome text NOT NULL CHECK (outcome IN ('promoted','rejected','deferred')),
      target_kind text NOT NULL,
      target_id uuid,
      previous_target_id uuid,
      verification_state text NOT NULL,
      reasons jsonb NOT NULL DEFAULT '[]',
      decided_at timestamptz NOT NULL DEFAULT now()
    )`);
    await queryRunner.query(`CREATE INDEX idx_promotion_candidate ON staging.promotions (candidate_id)`);
    await queryRunner.query(`CREATE UNIQUE INDEX uq_promotion_promoted ON staging.promotions (candidate_id) WHERE outcome = 'promoted'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS staging.promotions`);
    await queryRunner.query(`ALTER TABLE staging.candidates DROP COLUMN IF EXISTS key_fields`);
  }
}
