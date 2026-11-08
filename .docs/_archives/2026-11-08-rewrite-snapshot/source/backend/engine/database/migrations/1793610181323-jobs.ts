import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * The data engine's job table (DEC-DATA-ENGINE-DESIGN, item 4): a plain Postgres queue claimed with
 * FOR UPDATE SKIP LOCKED. A job is idempotent on (kind, input_hash, generation); a rerun is a new
 * generation and produces a new result, never an update of an old one.
 */
export class Jobs1793610181323 implements MigrationInterface {
  name = "Jobs1793610181323";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS engine`);
    await queryRunner.query(`CREATE TABLE engine.jobs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      kind text NOT NULL,
      input_hash char(64) NOT NULL,
      generation integer NOT NULL DEFAULT 1,
      input jsonb NOT NULL,
      status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','running','succeeded','failed','cancelled')),
      attempts integer NOT NULL DEFAULT 0,
      max_attempts integer NOT NULL DEFAULT 3,
      run_after timestamptz NOT NULL DEFAULT now(),
      locked_by text,
      locked_at timestamptz,
      result jsonb,
      result_file_version_id uuid,
      error text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE (kind, input_hash, generation)
    )`);
    await queryRunner.query(`CREATE INDEX idx_job_claim ON engine.jobs (status, run_after)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS engine.jobs`);
  }
}
