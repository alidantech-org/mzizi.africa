import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Domain provenance cleanup. `website.domains.source` becomes `origin` (a classification of how the hostname was
 * found: pattern, seed research, page link, redirect, manual) so it is not mistaken for provenance, which belongs
 * in the evidence/provenance records. The free-text `source_note` columns and the zone `source` text duplicated
 * provenance and are dropped (no row carried data in them before this migration).
 */
export class DomainOrigin1793900000001 implements MigrationInterface {
  name = "DomainOrigin1793900000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE website.domains RENAME COLUMN source TO origin`);
    await queryRunner.query(`ALTER TYPE website.domains_source_enum RENAME TO domains_origin_enum`);
    await queryRunner.query(`ALTER TABLE website.domains DROP COLUMN IF EXISTS source_note`);
    await queryRunner.query(`ALTER TABLE website.domain_zones DROP COLUMN IF EXISTS source_note, DROP COLUMN IF EXISTS source`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE website.domain_zones ADD COLUMN source text, ADD COLUMN source_note text`);
    await queryRunner.query(`ALTER TABLE website.domains ADD COLUMN source_note text`);
    await queryRunner.query(`ALTER TYPE website.domains_origin_enum RENAME TO domains_source_enum`);
    await queryRunner.query(`ALTER TABLE website.domains RENAME COLUMN origin TO source`);
  }
}
