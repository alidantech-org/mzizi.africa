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
import { ProvisionsEntity } from "#/modules/legal/schema/entities/provisions.entity.ts";
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { CountryEntity } from "#/modules/reference/schema/entities/country.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A published plan of dated items: an election timetable, a school year, a parliamentary calendar. Items are placed by offset from an anchor, so moving the anchor moves the plan.
 */
@Entity({ schema: "event", name: "schedules" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["countryId", "scheduleKindId"])
@Index(["anchorEventId"])
@Index(["issuerEntityId"])
@Index(["statusId"])
@Index(["supersedesScheduleId"])
@Index(["sourceCitationId"])
export class SchedulesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "anchor_event_id", type: "uuid", nullable: true })
  anchorEventId?: Id | null;

  @ManyToOne(() => EventsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "anchor_event_id" })
  anchorEvent?: Relation<EventsEntity>;

  @Column({ name: "anchor_on", type: "date", nullable: true })
  anchorOn?: Date | null;

  @Column({ name: "basis_provision_id", type: "uuid", nullable: true })
  basisProvisionId?: Id | null;

  @ManyToOne(() => ProvisionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "basis_provision_id" })
  basisProvision?: Relation<ProvisionsEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "country_id", type: "uuid", nullable: true })
  countryId?: Id | null;

  @ManyToOne(() => CountryEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "country_id" })
  country?: Relation<CountryEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "issuer_entity_id", type: "uuid", nullable: true })
  issuerEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "issuer_entity_id" })
  issuerEntity?: Relation<EntitiesEntity>;

  @Column({ name: "published_on", type: "date", nullable: true })
  publishedOn?: Date | null;

  @Column({ name: "schedule_kind_id", type: "uuid" })
  scheduleKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "schedule_kind_id" })
  scheduleKind?: Relation<ValueEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "status_id", type: "uuid" })
  statusId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "status_id" })
  status?: Relation<ValueEntity>;

  @Column({ name: "supersedes_schedule_id", type: "uuid", nullable: true })
  supersedesScheduleId?: Id | null;

  @ManyToOne(() => SchedulesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "supersedes_schedule_id" })
  supersedesSchedule?: Relation<SchedulesEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
