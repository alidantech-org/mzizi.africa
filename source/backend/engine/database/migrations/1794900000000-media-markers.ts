import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Three-state existence markers and Wikidata identifiers (TSK-A6C9B9251A15). `unknown` (the default meaning) differs
 * from `none` (known absent) and `has`, so the reinforcement loop knows what to search for. All columns are additive and
 * nullable: markers and Wikidata ids on geography units, parties, institutions and people, and the flag/emblem
 * expectation of a geography level (a classification record of scheme geography/level). Files and their licences are
 * not stored here: a file is a filesystem attachment with a role, its licence and author are on its source document.
 */
export class MediaMarkers1794900000000 implements MigrationInterface {
  name = "MediaMarkers1794900000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const marker = "ENUM('has', 'none', 'unknown')";
    const add = async (schema: string, table: string, column: string) => {
      await queryRunner.query(`CREATE TYPE "${schema}"."${table}_${column}_enum" AS ${marker}`);
      await queryRunner.query(`ALTER TABLE "${schema}"."${table}" ADD "${column}" "${schema}"."${table}_${column}_enum"`);
    };
    for (const [schema, table] of [["geography", "units"], ["political", "parties"], ["governance", "institutions"], ["person", "individuals"]]) {
      await queryRunner.query(`ALTER TABLE "${schema}"."${table}" ADD "wikidata_id" character varying(20)`);
      await queryRunner.query(`CREATE INDEX "idx_${table}_wikidata_id" ON "${schema}"."${table}" ("wikidata_id") WHERE "wikidata_id" IS NOT NULL`);
    }
    await add("geography", "units", "flag_marker");
    await add("geography", "units", "emblem_marker");
    await add("political", "parties", "logo_marker");
    await add("governance", "institutions", "logo_marker");
    await add("person", "individuals", "portrait_marker");
    await add("reference", "classifications", "flag_expected");
    await add("reference", "classifications", "emblem_expected");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const [schema, table, column] of [["reference", "classifications", "emblem_expected"], ["reference", "classifications", "flag_expected"], ["person", "individuals", "portrait_marker"], ["governance", "institutions", "logo_marker"], ["political", "parties", "logo_marker"], ["geography", "units", "emblem_marker"], ["geography", "units", "flag_marker"]]) {
      await queryRunner.query(`ALTER TABLE "${schema}"."${table}" DROP COLUMN "${column}"`);
      await queryRunner.query(`DROP TYPE "${schema}"."${table}_${column}_enum"`);
    }
    for (const [schema, table] of [["person", "individuals"], ["governance", "institutions"], ["political", "parties"], ["geography", "units"]]) {
      await queryRunner.query(`DROP INDEX "${schema}"."idx_${table}_wikidata_id"`);
      await queryRunner.query(`ALTER TABLE "${schema}"."${table}" DROP COLUMN "wikidata_id"`);
    }
  }
}
