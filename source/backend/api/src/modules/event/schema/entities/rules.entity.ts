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
import { EventsEntity } from "#/modules/event/schema/entities/events.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * How the dates of an event are produced, with the adjustment the law applies when a date falls on a rest day. Occurrences generated from a rule are projected until announced.
 */
@Entity({ schema: "event", name: "rules" })
@Index(["eventId", "ruleKindId"], { unique: true })
@Index(["eventId"])
@Index(["ruleKindId"])
@Index(["sourceCitationId"])
@Check(
  "chk_rules_period_years_are_ordered",
  `from_year = null OR to_year = null OR from_year <= to_year`,
)
export class RulesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "adjustment_id", type: "uuid", nullable: true })
  adjustmentId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "adjustment_id" })
  adjustment?: Relation<ValueEntity>;

  @Column({ name: "anchor_on", type: "date", nullable: true })
  anchorOn?: Date | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "day_of_month", type: "integer", nullable: true })
  dayOfMonth?: PositiveInteger | null;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "event_id", type: "uuid" })
  eventId!: Id;

  @ManyToOne(() => EventsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "event_id" })
  event?: Relation<EventsEntity>;

  @Column({
    name: "from_to_precision",
    type: "enum",
    enum: DatePrecision,
    nullable: true,
  })
  fromToPrecision?: DatePrecision | null;

  @Column({ name: "from_year", type: "integer", nullable: true })
  fromYear?: Year | null;

  @Column({ name: "interval_years", type: "integer", nullable: true })
  intervalYears?: PositiveInteger | null;

  @Column({ name: "month", type: "integer", nullable: true })
  month?: PositiveInteger | null;

  @Column({ name: "nth_weekday", type: "integer", nullable: true })
  nthWeekday?: PositiveInteger | null;

  @Column({ name: "rrule", type: "varchar", length: 500, nullable: true })
  rrule?: NonEmptyString500 | null;

  @Column({ name: "rule_kind_id", type: "uuid" })
  ruleKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "rule_kind_id" })
  ruleKind?: Relation<ValueEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "to_year", type: "integer", nullable: true })
  toYear?: Year | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;

  @Column({ name: "weekday", type: "integer", nullable: true })
  weekday?: PositiveInteger | null;
}
