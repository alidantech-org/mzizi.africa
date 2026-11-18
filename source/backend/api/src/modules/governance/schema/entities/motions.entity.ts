import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { BudgetVersionsEntity } from "#/modules/finance/schema/entities/budget-versions.entity.ts";
import { FiscalPeriodsEntity } from "#/modules/finance/schema/entities/fiscal-periods.entity.ts";
import { BillsEntity } from "#/modules/governance/schema/entities/bills.entity.ts";
import { HoldersEntity } from "#/modules/governance/schema/entities/holders.entity.ts";
import { SittingsEntity } from "#/modules/governance/schema/entities/sittings.entity.ts";
import { InstrumentsEntity } from "#/modules/legal/schema/entities/instruments.entity.ts";
import { ProvisionsEntity } from "#/modules/legal/schema/entities/provisions.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One matter put to a sitting, with its outcome, tied to the bill, law provision or budget it concerns.
 */
@Entity({ schema: "governance", name: "motions" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["sittingId"])
@Index(["motionKindId"])
@Index(["outcomeId"])
@Index(["movedByHolderId"])
@Index(["billId"])
@Index(["instrumentId"])
@Index(["provisionId"])
@Index(["budgetVersionId"])
@Index(["fiscalPeriodId"])
@Index(["sourceCitationId"])
export class MotionsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "bill_id", type: "uuid", nullable: true })
  billId?: Id | null;

  @ManyToOne(() => BillsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "bill_id" })
  bill?: Relation<BillsEntity>;

  @Column({ name: "budget_version_id", type: "uuid", nullable: true })
  budgetVersionId?: Id | null;

  @ManyToOne(() => BudgetVersionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "budget_version_id" })
  budgetVersion?: Relation<BudgetVersionsEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "fiscal_period_id", type: "uuid", nullable: true })
  fiscalPeriodId?: Id | null;

  @ManyToOne(() => FiscalPeriodsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "fiscal_period_id" })
  fiscalPeriod?: Relation<FiscalPeriodsEntity>;

  @Column({ name: "instrument_id", type: "uuid", nullable: true })
  instrumentId?: Id | null;

  @ManyToOne(() => InstrumentsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "instrument_id" })
  instrument?: Relation<InstrumentsEntity>;

  @Column({ name: "motion_kind_id", type: "uuid" })
  motionKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "motion_kind_id" })
  motionKind?: Relation<ValueEntity>;

  @Column({ name: "moved_by_holder_id", type: "uuid", nullable: true })
  movedByHolderId?: Id | null;

  @ManyToOne(() => HoldersEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "moved_by_holder_id" })
  movedByHolder?: Relation<HoldersEntity>;

  @Column({ name: "outcome_id", type: "uuid" })
  outcomeId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "outcome_id" })
  outcome?: Relation<ValueEntity>;

  @Column({ name: "provision_id", type: "uuid", nullable: true })
  provisionId?: Id | null;

  @ManyToOne(() => ProvisionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "provision_id" })
  provision?: Relation<ProvisionsEntity>;

  @Column({ name: "sitting_id", type: "uuid" })
  sittingId!: Id;

  @ManyToOne(() => SittingsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "sitting_id" })
  sitting?: Relation<SittingsEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "summary", type: "varchar", length: 4000, nullable: true })
  summary?: Description | null;

  @Column({ name: "title", type: "varchar", length: 300 })
  title!: Name;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
