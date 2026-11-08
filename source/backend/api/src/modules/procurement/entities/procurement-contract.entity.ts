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
import { TenderEntity } from "#/modules/procurement/entities/tender.entity.ts";
import { ContractStatus } from "#/types/procurement/contract-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongCode } from "#/types/shared/long-code.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Procurement Contract
 */
@Entity({ schema: "procurement", name: "contracts" })
@Index("idx_contract_code", ["code"], { unique: true })
@Index("idx_contract_tender", ["tenderId"])
export class ProcurementContractEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "awarded_entity_id", type: "uuid" })
  awardedEntityId!: Id;

  @Column({ name: "awarded_on", type: "date", nullable: true })
  awardedOn?: Date | null;

  @Column({ name: "code", type: "varchar", length: 300 })
  code!: LongCode;

  @Column({ name: "contracting_office_id", type: "uuid", nullable: true })
  contractingOfficeId?: Id | null;

  @Column({ name: "contracting_unit_id", type: "uuid" })
  contractingUnitId!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "currency_code", type: "varchar", length: 3 })
  currencyCode!: CurrencyCode;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "status", type: "enum", enum: ContractStatus })
  status!: ContractStatus;

  @Column({ name: "tender_id", type: "uuid" })
  tenderId!: Id;

  @ManyToOne(() => TenderEntity)
  @JoinColumn({ name: "tender_id" })
  tender?: Relation<TenderEntity>;

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

  @Column({ name: "value", type: "numeric", precision: 20, scale: 4, transformer: new ColumnNumericTransformer() })
  value!: Amount;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}