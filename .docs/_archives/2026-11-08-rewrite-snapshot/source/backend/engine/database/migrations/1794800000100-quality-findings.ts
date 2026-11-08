import type { MigrationInterface, QueryRunner } from "typeorm";

/** Statistical quality findings (engine bookkeeping, hand-written like the staging schema): a rule, the figures involved and the decision of a named account. */
export class QualityFindings1794800000100 implements MigrationInterface {
  name = "QualityFindings1794800000100";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS engine.quality_findings (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      rule varchar(100) NOT NULL,
      severity varchar(20) NOT NULL CHECK (severity IN ('info','warning','error')),
      target_kind varchar(100) NOT NULL,
      target_id uuid,
      geo_unit_code varchar(300),
      source_a varchar(200),
      source_b varchar(200),
      figures jsonb NOT NULL,
      message text NOT NULL,
      fingerprint varchar(64) NOT NULL,
      status varchar(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open','accepted','resolved','disputed')),
      decided_by uuid,
      decision_rationale text,
      decided_at timestamptz,
      decision_id uuid,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_quality_finding_fingerprint ON engine.quality_findings (fingerprint)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_quality_finding_rule ON engine.quality_findings (rule, status)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS engine.quality_findings`);
  }
}
