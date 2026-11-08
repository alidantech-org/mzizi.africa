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
import { TenderStatus } from "#/types/procurement/tender-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongCode } from "#/types/shared/long-code.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Tender
 */
@Entity({ schema: "procurement", name: "tenders" })
@Index("idx_tender_code", ["code"])
@Index("uq_tender_code_version", ["code", "versionNumber"], { unique: true })
@Index("idx_tender_issuer", ["issuingUnitId", "status"])
export class TenderEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "budget_id", type: "uuid", nullable: true })
  budgetId?: Id | null;

  @Column({ name: "closes_on", type: "date", nullable: true })
  closesOn?: Date | null;

  @Column({ name: "code", type: "varchar", length: 300 })
  code!: LongCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "currency_code", type: "varchar", length: 3 })
  currencyCode!: CurrencyCode;

  @Column({ name: "estimated_value", type: "numeric", precision: 20, scale: 4, transformer: new ColumnNumericTransformer(), nullable: true })
  estimatedValue?: Amount | null;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "issuing_unit_id", type: "uuid" })
  issuingUnitId!: Id;

  @Column({ name: "kind_id", type: "uuid" })
  kindId!: Id;

  @Column({ name: "legal_basis_id", type: "uuid", nullable: true })
  legalBasisId?: Id | null;

  @Column({ name: "method_id", type: "uuid" })
  methodId!: Id;

  @Column({ name: "procuring_office_id", type: "uuid", nullable: true })
  procuringOfficeId?: Id | null;

  @Column({ name: "published_on", type: "date", nullable: true })
  publishedOn?: Date | null;

  @Column({ name: "status", type: "enum", enum: TenderStatus })
  status!: TenderStatus;

  @Column({ name: "title", type: "varchar", length: 300 })
  title!: Name;

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

  @Column({ name: "version_number", type: "integer" })
  versionNumber!: Version;
}