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
import { LedgerReferenceKind } from "#/types/finance/ledger-reference-kind.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { AccountCode } from "#/types/finance/account-code.type.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Ledger Entry
 */
@Entity({ schema: "finance", name: "entries" })
@Index("idx_ledger_unit", ["unitId", "postedOn"])
@Index("idx_ledger_reference", ["referenceKind", "referenceId"])
export class LedgerEntryEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "account_code", type: "varchar", length: 100 })
  accountCode!: AccountCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "credit_amount", type: "numeric", precision: 20, scale: 4, transformer: new ColumnNumericTransformer() })
  creditAmount!: Amount;

  @Column({ name: "currency_code", type: "varchar", length: 3 })
  currencyCode!: CurrencyCode;

  @Column({ name: "debit_amount", type: "numeric", precision: 20, scale: 4, transformer: new ColumnNumericTransformer() })
  debitAmount!: Amount;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "posted_on", type: "date" })
  postedOn!: Date;

  @Column({ name: "reference_id", type: "uuid", nullable: true })
  referenceId?: Id | null;

  @Column({ name: "reference_kind", type: "enum", enum: LedgerReferenceKind })
  referenceKind!: LedgerReferenceKind;

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