import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { BillsEntity } from "#/modules/governance/schema/entities/bills.entity.ts";
import { MotionsEntity } from "#/modules/governance/schema/entities/motions.entity.ts";
import { SittingsEntity } from "#/modules/governance/schema/entities/sittings.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One step of a bill's passage in order: a reading, a committee, a vote in the other house, assent, publication.
 */
@Entity({ schema: "governance", name: "stages" })
@Index(["billId", "sequenceNumber"], { unique: true })
@Index(["stageKindId"])
@Index(["sittingId"])
@Index(["motionId"])
@Index(["sourceCitationId"])
@Check("chk_stages_stage_has_sitting_or_date", `sitting_id <> null OR on_date <> null`)
export class StagesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "bill_id", type: "uuid" })
  billId!: Id;

  @ManyToOne(() => BillsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "bill_id" })
  bill?: Relation<BillsEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "motion_id", type: "uuid", nullable: true })
  motionId?: Id | null;

  @ManyToOne(() => MotionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "motion_id" })
  motion?: Relation<MotionsEntity>;

  @Column({ name: "on_date", type: "date", nullable: true })
  onDate?: Date | null;

  @Column({ name: "outcome_id", type: "uuid", nullable: true })
  outcomeId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "outcome_id" })
  outcome?: Relation<ValueEntity>;

  @Column({ name: "sequence_number", type: "integer" })
  sequenceNumber!: PositiveInteger;

  @Column({ name: "sitting_id", type: "uuid", nullable: true })
  sittingId?: Id | null;

  @ManyToOne(() => SittingsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "sitting_id" })
  sitting?: Relation<SittingsEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "stage_kind_id", type: "uuid" })
  stageKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "stage_kind_id" })
  stageKind?: Relation<ValueEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
