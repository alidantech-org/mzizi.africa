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
import { LoanStatus } from "#/types/debt/loan-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { ProvenanceMethod } from "#/types/shared/provenance-method.enum.ts";
import { VerificationState } from "#/types/shared/verification-state.enum.ts";
import type { TermMonths } from "#/types/debt/term-months.type.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Rate } from "#/types/shared/rate.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Loan
 */
@Entity({ schema: "debt", name: "loans" })
@Index("idx_loan_code", ["code"], { unique: true })
@Index("idx_loan_borrower", ["borrowerUnitId"])
export class LoanEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "artifact_checksum", type: "varchar", length: 64, nullable: true })
  artifactChecksum?: Checksum | null;

  @Column({ name: "artifact_id", type: "uuid", nullable: true })
  artifactId?: Id | null;

  @Column({ name: "borrower_unit_id", type: "uuid" })
  borrowerUnitId!: Id;

  @ManyToOne(() => BudgetaryUnitEntity)
  @JoinColumn({ name: "borrower_unit_id" })
  borrowerUnit?: Relation<BudgetaryUnitEntity>;

  @Column({ name: "code", type: "varchar", length: 200 })
  code!: BusinessCode;

  @Column({ name: "confidence", type: "double precision", nullable: true })
  confidence?: Confidence | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "currency_code", type: "varchar", length: 3 })
  currencyCode!: CurrencyCode;

  @Column({ name: "interest_rate", type: "numeric", precision: 9, scale: 4, transformer: new ColumnNumericTransformer(), nullable: true })
  interestRate?: Rate | null;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "legal_basis_id", type: "uuid", nullable: true })
  legalBasisId?: Id | null;

  @Column({ name: "lender_entity_id", type: "uuid", nullable: true })
  lenderEntityId?: Id | null;

  @Column({ name: "licence", type: "varchar", length: 300, nullable: true })
  licence?: Name | null;

  @Column({ name: "method", type: "enum", enum: ProvenanceMethod })
  method!: ProvenanceMethod;

  @Column({ name: "principal_amount", type: "numeric", precision: 20, scale: 4, transformer: new ColumnNumericTransformer() })
  principalAmount!: Amount;

  @Column({ name: "retrieved_at", type: "timestamptz", nullable: true })
  retrievedAt?: Date | null;

  @Column({ name: "source_name", type: "varchar", length: 300 })
  sourceName!: Name;

  @Column({ name: "source_reference", type: "varchar", length: 4000, nullable: true })
  sourceReference?: Description | null;

  @Column({ name: "source_url", type: "varchar", length: 1000, nullable: true })
  sourceUrl?: Url | null;

  @Column({ name: "status", type: "enum", enum: LoanStatus })
  status!: LoanStatus;

  @Column({ name: "term_months", type: "integer", nullable: true })
  termMonths?: TermMonths | null;

  @Column({ name: "tool_or_model", type: "varchar", length: 300, nullable: true })
  toolOrModel?: Name | null;

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

  @Column({ name: "verification_state", type: "enum", enum: VerificationState })
  verificationState!: VerificationState;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}