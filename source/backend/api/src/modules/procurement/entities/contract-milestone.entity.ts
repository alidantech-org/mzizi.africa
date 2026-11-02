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
import { ProcurementContractEntity } from "#/modules/procurement/entities/procurement-contract.entity.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Contract Milestone
 */
@Entity({ schema: "procurement", name: "milestones" })
@Index("idx_milestone_contract", ["contractId"])
export class ContractMilestoneEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "amount", type: "numeric", precision: 20, scale: 4, transformer: new ColumnNumericTransformer(), nullable: true })
  amount?: Amount | null;

  @Column({ name: "completed_on", type: "date", nullable: true })
  completedOn?: Date | null;

  @Column({ name: "contract_id", type: "uuid" })
  contractId!: Id;

  @ManyToOne(() => ProcurementContractEntity)
  @JoinColumn({ name: "contract_id" })
  contract?: Relation<ProcurementContractEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "currency_code", type: "varchar", length: 3, nullable: true })
  currencyCode?: CurrencyCode | null;

  @Column({ name: "due_on", type: "date", nullable: true })
  dueOn?: Date | null;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

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
}