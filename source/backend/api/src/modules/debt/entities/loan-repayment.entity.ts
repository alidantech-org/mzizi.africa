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
import { LoanEntity } from "#/modules/debt/entities/loan.entity.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Loan Repayment
 */
@Entity({ schema: "debt", name: "repayments" })
@Index("idx_loan_repayment_loan", ["loanId"])
export class LoanRepaymentEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "currency_code", type: "varchar", length: 3 })
  currencyCode!: CurrencyCode;

  @Column({ name: "fees_paid", type: "numeric", precision: 20, scale: 4, transformer: new ColumnNumericTransformer(), nullable: true })
  feesPaid?: Amount | null;

  @Column({ name: "interest_paid", type: "numeric", precision: 20, scale: 4, transformer: new ColumnNumericTransformer() })
  interestPaid!: Amount;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "ledger_entry_id", type: "uuid", nullable: true })
  ledgerEntryId?: Id | null;

  @Column({ name: "loan_id", type: "uuid" })
  loanId!: Id;

  @ManyToOne(() => LoanEntity)
  @JoinColumn({ name: "loan_id" })
  loan?: Relation<LoanEntity>;

  @Column({ name: "paid_on", type: "date" })
  paidOn!: Date;

  @Column({ name: "principal_paid", type: "numeric", precision: 20, scale: 4, transformer: new ColumnNumericTransformer() })
  principalPaid!: Amount;

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