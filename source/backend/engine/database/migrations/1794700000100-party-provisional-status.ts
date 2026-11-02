import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * The Registrar of Political Parties keeps two registers: fully registered parties and provisionally registered ones
 * (a provisional party has a certificate but may not yet have applied for full registration). The party status enum
 * had no way to say it, so a provisional party would have been recorded as `active`. Additive only.
 */
export class PartyProvisionalStatus1794700000100 implements MigrationInterface {
  name = "PartyProvisionalStatus1794700000100";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "political"."parties_status_enum" ADD VALUE IF NOT EXISTS 'provisional'`);
  }

  public async down(): Promise<void> {
    // A value cannot be dropped from an enum without rewriting the column; rows using it would block that. Intentionally a no-op.
  }
}
