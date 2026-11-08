import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * A political party can be a finance unit (it receives Political Parties Fund allocations and reports income and
 * expenditure), but a finance unit could link only to a legal entity, an institution or a geography unit. A party is
 * none of these, so the link would have lived in the unit code alone. Additive: a nullable plain uuid (no cross-schema
 * foreign key, like the other links of this table).
 */
export class FinanceUnitParty1794700000200 implements MigrationInterface {
  name = "FinanceUnitParty1794700000200";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "finance"."units" ADD COLUMN IF NOT EXISTS "party_id" uuid`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_budgetary_unit_party" ON "finance"."units" ("party_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "finance"."idx_budgetary_unit_party"`);
    await queryRunner.query(`ALTER TABLE "finance"."units" DROP COLUMN IF EXISTS "party_id"`);
  }
}
