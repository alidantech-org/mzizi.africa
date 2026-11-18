import {
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
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One item of a sitting's order paper, in order, with the bill or motion it is about.
 */
@Entity({ schema: "governance", name: "agenda" })
@Index(["sittingId", "position"], { unique: true })
@Index(["agendaKindId"])
@Index(["motionId"])
@Index(["billId"])
@Index(["sourceCitationId"])
export class AgendaEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "agenda_kind_id", type: "uuid" })
  agendaKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "agenda_kind_id" })
  agendaKind?: Relation<ValueEntity>;

  @Column({ name: "bill_id", type: "uuid", nullable: true })
  billId?: Id | null;

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

  @Column({ name: "position", type: "integer" })
  position!: PositiveInteger;

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

  @Column({ name: "title", type: "varchar", length: 300 })
  title!: Name;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
