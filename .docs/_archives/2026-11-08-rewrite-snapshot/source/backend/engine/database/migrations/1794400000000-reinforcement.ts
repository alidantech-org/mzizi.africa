import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Reinforcement (TSK-BF88B31E115A, TSK-D16F9399E4B6; DEC-CLAIMS-AND-CONFLICTS). Nullable data becomes a managed
 * backlog: `engine.gaps` is the queue of fields that are missing or stale, `engine.gap_attempts` the log of every
 * search so nothing is repeated without reason. `engine.claims` holds each value a source asserts for a field of a
 * record (all kept, none overwritten); `engine.claim_standings` is the derived winner per field with the corroboration
 * count and dispute flag. Claims point at their `source.attributions` row by plain uuid: no cross-schema foreign keys.
 */
export class Reinforcement1794400000000 implements MigrationInterface {
  name = "Reinforcement1794400000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS engine`);
    await queryRunner.query(`CREATE TABLE engine.gaps (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      target_kind text NOT NULL,
      target_id uuid NOT NULL,
      field text NOT NULL,
      reason text NOT NULL DEFAULT 'missing' CHECK (reason IN ('missing', 'stale', 'disputed')),
      status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'queued', 'found', 'not_found', 'ambiguous', 'known_absent')),
      priority integer NOT NULL DEFAULT 0,
      refill_sources jsonb NOT NULL DEFAULT '[]',
      attempts integer NOT NULL DEFAULT 0,
      last_attempt_at timestamptz,
      retry_after timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE (target_kind, target_id, field)
    )`);
    await queryRunner.query(`CREATE INDEX idx_gaps_queue ON engine.gaps (status, priority DESC, retry_after)`);
    await queryRunner.query(`CREATE TABLE engine.gap_attempts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      gap_id uuid NOT NULL REFERENCES engine.gaps (id),
      refill_source text NOT NULL,
      outcome text NOT NULL CHECK (outcome IN ('found', 'not_found', 'ambiguous', 'error')),
      result jsonb,
      job_id uuid,
      created_at timestamptz NOT NULL DEFAULT now()
    )`);
    await queryRunner.query(`CREATE INDEX idx_gap_attempts_gap ON engine.gap_attempts (gap_id, created_at DESC)`);
    await queryRunner.query(`CREATE TABLE engine.claims (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      target_kind text NOT NULL,
      target_id uuid NOT NULL,
      field text NOT NULL,
      value jsonb NOT NULL,
      value_hash char(64) NOT NULL,
      attribution_id uuid NOT NULL,
      publisher_id uuid,
      trust numeric(5,4) NOT NULL DEFAULT 0.5 CHECK (trust BETWEEN 0 AND 1),
      observed_at timestamptz NOT NULL DEFAULT now(),
      valid_from date,
      valid_to date,
      review text NOT NULL DEFAULT 'proposed' CHECK (review IN ('proposed', 'accepted', 'rejected')),
      created_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE (attribution_id, field, value_hash)
    )`);
    await queryRunner.query(`CREATE INDEX idx_claims_target ON engine.claims (target_kind, target_id, field)`);
    await queryRunner.query(`CREATE TABLE engine.claim_standings (
      target_kind text NOT NULL,
      target_id uuid NOT NULL,
      field text NOT NULL,
      winning_claim_id uuid NOT NULL REFERENCES engine.claims (id),
      corroboration integer NOT NULL,
      disputed boolean NOT NULL,
      distinct_values integer NOT NULL,
      why text NOT NULL,
      computed_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (target_kind, target_id, field)
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS engine.claim_standings`);
    await queryRunner.query(`DROP TABLE IF EXISTS engine.claims`);
    await queryRunner.query(`DROP TABLE IF EXISTS engine.gap_attempts`);
    await queryRunner.query(`DROP TABLE IF EXISTS engine.gaps`);
  }
}
