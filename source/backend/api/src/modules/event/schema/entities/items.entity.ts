import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { EventsEntity } from "#/modules/event/schema/entities/events.entity.ts";
import { OccurrencesEntity } from "#/modules/event/schema/entities/occurrences.entity.ts";
import { SchedulesEntity } from "#/modules/event/schema/entities/schedules.entity.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One line of a schedule: an event placed at an offset from the anchor, and the occurrence it became.
 */
@Entity({ schema: "event", name: "items" })
@Index(["scheduleId", "position"], { unique: true })
@Index(["eventId"])
@Index(["occurrenceId"])
export class ItemsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "counts_working_days", type: "boolean" })
  countsWorkingDays!: Flag;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "event_id", type: "uuid" })
  eventId!: Id;

  @ManyToOne(() => EventsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "event_id" })
  event?: Relation<EventsEntity>;

  @Column({ name: "note", type: "varchar", length: 4000, nullable: true })
  note?: Description | null;

  @Column({ name: "occurrence_id", type: "uuid", nullable: true })
  occurrenceId?: Id | null;

  @ManyToOne(() => OccurrencesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "occurrence_id" })
  occurrence?: Relation<OccurrencesEntity>;

  @Column({ name: "offset_days", type: "integer", nullable: true })
  offsetDays?: Integer | null;

  @Column({ name: "position", type: "integer" })
  position!: NonNegativeInteger;

  @Column({ name: "schedule_id", type: "uuid" })
  scheduleId!: Id;

  @ManyToOne(() => SchedulesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "schedule_id" })
  schedule?: Relation<SchedulesEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
