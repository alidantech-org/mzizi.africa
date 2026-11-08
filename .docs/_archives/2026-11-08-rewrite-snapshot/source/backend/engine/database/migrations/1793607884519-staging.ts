import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Staging area between extraction and canonical data (DATA_INTAKE_PLAN.md section 4). Not generated
 * from Dryv entities and not served by the API. References to other schemas are plain ids.
 */
export class Staging1793607884519 implements MigrationInterface {
  name = "Staging1793607884519";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS staging`);
    await queryRunner.query(`CREATE TABLE staging.runs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      dataset text NOT NULL,
      mapping_version text NOT NULL,
      capture_id uuid,
      extraction_result_id uuid,
      status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','running','completed','failed','cancelled')),
      created_at timestamptz NOT NULL DEFAULT now()
    )`);
    await queryRunner.query(`CREATE TABLE staging.candidates (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      run_id uuid NOT NULL REFERENCES staging.runs(id),
      target_kind text NOT NULL,
      natural_key_hash char(64) NOT NULL,
      payload_hash char(64) NOT NULL,
      payload jsonb NOT NULL,
      extraction_result_id uuid NOT NULL,
      segment_key text,
      locator jsonb,
      method text NOT NULL CHECK (method IN ('extracted','inferred','curated','ai_assisted')),
      confidence numeric(5,4) CHECK (confidence BETWEEN 0 AND 1),
      status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','invalid','in_review','approved','rejected','promoted','superseded','quarantined')),
      supersedes_candidate_id uuid REFERENCES staging.candidates(id),
      resolved_target_id uuid,
      created_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE (target_kind, natural_key_hash, payload_hash)
    )`);
    await queryRunner.query(`CREATE INDEX idx_candidate_run ON staging.candidates (run_id)`);
    await queryRunner.query(`CREATE INDEX idx_candidate_status ON staging.candidates (status)`);
    await queryRunner.query(`CREATE TABLE staging.issues (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      candidate_id uuid NOT NULL REFERENCES staging.candidates(id),
      rule text NOT NULL,
      severity text NOT NULL CHECK (severity IN ('info','warning','error')),
      message text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`);
    await queryRunner.query(`CREATE INDEX idx_issue_candidate ON staging.issues (candidate_id)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA IF EXISTS staging CASCADE`);
  }
}
