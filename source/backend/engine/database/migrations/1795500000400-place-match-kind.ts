import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Duplicate places are scored and flagged like duplicate people and organisations (DEC-ENTITY-MATCHING): the match tables accept
 * the kind `place`. A flag is a review item; places are never merged on a name alone.
 */
export class PlaceMatchKind1795500000400 implements MigrationInterface {
  name = "PlaceMatchKind1795500000400";

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const table of ["match_candidates", "match_clusters"]) {
      await queryRunner.query(`ALTER TABLE engine.${table} DROP CONSTRAINT ${table}_kind_check`);
      await queryRunner.query(`ALTER TABLE engine.${table} ADD CONSTRAINT ${table}_kind_check CHECK (kind IN ('person', 'organization', 'place'))`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM engine.match_clusters WHERE kind = 'place'`);
    await queryRunner.query(`DELETE FROM engine.match_candidates WHERE kind = 'place'`);
    for (const table of ["match_candidates", "match_clusters"]) {
      await queryRunner.query(`ALTER TABLE engine.${table} DROP CONSTRAINT ${table}_kind_check`);
      await queryRunner.query(`ALTER TABLE engine.${table} ADD CONSTRAINT ${table}_kind_check CHECK (kind IN ('person', 'organization'))`);
    }
  }
}
