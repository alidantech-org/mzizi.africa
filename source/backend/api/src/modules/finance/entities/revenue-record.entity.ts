import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";

import { ColumnNumericTransformer } from "#/modules/common/entities/base/column-numeric.transformer.ts";
import { BudgetaryUnitEntity } from "#/modules/finance/entities/budgetary-unit.entity.ts";
import { FundRestriction } from "#/types/finance/fund-restriction.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Revenue Record
 */
@Entity({ schema: "finance", name: "revenues" })
@Index("idx_revenue_unit_year", ["unitId", "fiscalYearId"])
export class RevenueRecordEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "amount", type: "numeric", precision: 20, scale: 4, transformer: new ColumnNumericTransformer() })
  amount!: Amount;

  @Column({ name: "category_id", type: "uuid" })
  categoryId!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "currency_code", type: "varchar", length: 3 })
  currencyCode!: CurrencyCode;

  @Column({ name: "fiscal_year_id", type: "uuid" })
  fiscalYearId!: Id;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "payer_entity_id", type: "uuid", nullable: true })
  payerEntityId?: Id | null;

  @Column({ name: "received_on", type: "date" })
  receivedOn!: Date;

  @Column({ name: "restriction", type: "enum", enum: FundRestriction })
  restriction!: FundRestriction;

  @Column({ name: "unit_id", type: "uuid" })
  unitId!: Id;

  @ManyToOne(() => BudgetaryUnitEntity)
  @JoinColumn({ name: "unit_id" })
  unit?: Relation<BudgetaryUnitEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_from_precision", type: "enum", enum: DatePrecision, nullable: true })
  validFromPrecision?: DatePrecision | null;

  @Column({ name: "valid_to", type: "date", nullable: true })
  validTo?: Date | null;

  @Column({ name: "valid_to_precision", type: "enum", enum: DatePrecision, nullable: true })
  validToPrecision?: DatePrecision | null;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}