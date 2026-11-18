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
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One dated instance of an event with its planned and actual dates, status, how we know the date, venue and format. Planned dates are never overwritten; changes are recorded.
 */
@Entity({ schema: "event", name: "occurrences" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["eventId", "plannedStartsOn"])
@Index(["statusId"])
@Index(["knowledgeId"])
@Index(["venueFeatureId"])
@Index(["organiserEntityId"])
@Index(["continuesOccurrenceId"])
@Index(["sourceCitationId"])
@Check(
  "chk_occurrences_planned_dates_are_ordered",
  `planned_starts_on = null OR planned_ends_on = null OR planned_starts_on <= planned_ends_on`,
)
@Check(
  "chk_occurrences_actual_dates_are_ordered",
  `actual_starts_on = null OR actual_ends_on = null OR actual_starts_on <= actual_ends_on`,
)
export class OccurrencesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "actual_ends_on", type: "date", nullable: true })
  actualEndsOn?: Date | null;

  @Column({ name: "actual_starts_on", type: "date", nullable: true })
  actualStartsOn?: Date | null;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "continues_occurrence_id", type: "uuid", nullable: true })
  continuesOccurrenceId?: Id | null;

  @ManyToOne(() => OccurrencesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "continues_occurrence_id" })
  continuesOccurrence?: Relation<OccurrencesEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "event_id", type: "uuid" })
  eventId!: Id;

  @ManyToOne(() => EventsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "event_id" })
  event?: Relation<EventsEntity>;

  @Column({ name: "format_id", type: "uuid", nullable: true })
  formatId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "format_id" })
  format?: Relation<ValueEntity>;

  @Column({ name: "is_all_day", type: "boolean" })
  isAllDay!: Flag;

  @Column({ name: "knowledge_id", type: "uuid" })
  knowledgeId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "knowledge_id" })
  knowledge?: Relation<ValueEntity>;

  @Column({ name: "organiser_entity_id", type: "uuid", nullable: true })
  organiserEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "organiser_entity_id" })
  organiserEntity?: Relation<EntitiesEntity>;

  @Column({ name: "planned_ends_on", type: "date", nullable: true })
  plannedEndsOn?: Date | null;

  @Column({ name: "planned_starts_on", type: "date" })
  plannedStartsOn!: Date;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "starts_at", type: "timestamptz", nullable: true })
  startsAt?: Date | null;

  @Column({ name: "status_id", type: "uuid" })
  statusId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "status_id" })
  status?: Relation<ValueEntity>;

  @Column({ name: "timezone", type: "varchar", length: 100, nullable: true })
  timezone?: NonEmptyString100 | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "venue_feature_id", type: "uuid", nullable: true })
  venueFeatureId?: Id | null;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "venue_feature_id" })
  venueFeature?: Relation<FeaturesEntity>;

  @Column({ name: "venue_note", type: "varchar", length: 4000, nullable: true })
  venueNote?: Description | null;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
