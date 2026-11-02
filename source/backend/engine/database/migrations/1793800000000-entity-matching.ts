import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Entity matching (deduplication and profiling). Nothing is merged by deleting or rewriting records: a pair of
 * records that may be the same person or organisation is a row in `engine.match_candidates` with its score, the
 * features behind the score and the decision (auto-merged above the threshold with corroboration, flagged for a
 * reviewer otherwise, rejected). `engine.match_clusters` is the current grouping of records into one entity, rebuilt
 * from the merged pairs; one member of each cluster is the canonical record, the others point to it.
 */
export class EntityMatching1793800000000 implements MigrationInterface {
  name = "EntityMatching1793800000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS engine`);
    await queryRunner.query(`CREATE TABLE engine.match_candidates (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      kind text NOT NULL CHECK (kind IN ('person', 'organization')),
      left_id uuid NOT NULL,
      right_id uuid NOT NULL,
      score numeric(5,4) NOT NULL,
      features jsonb NOT NULL,
      decision text NOT NULL CHECK (decision IN ('auto_merged', 'flagged', 'rejected')),
      decided_by uuid,
      rationale text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      version integer NOT NULL DEFAULT 1,
      CHECK (left_id < right_id),
      UNIQUE (kind, left_id, right_id)
    )`);
    await queryRunner.query(`CREATE INDEX idx_match_candidates_decision ON engine.match_candidates (kind, decision, score DESC)`);
    await queryRunner.query(`CREATE TABLE engine.match_clusters (
      kind text NOT NULL CHECK (kind IN ('person', 'organization')),
      cluster_id uuid NOT NULL,
      member_id uuid NOT NULL,
      is_canonical boolean NOT NULL,
      built_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (kind, member_id)
    )`);
    await queryRunner.query(`CREATE INDEX idx_match_clusters_cluster ON engine.match_clusters (kind, cluster_id)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS engine.match_clusters`);
    await queryRunner.query(`DROP TABLE IF EXISTS engine.match_candidates`);
  }
}
