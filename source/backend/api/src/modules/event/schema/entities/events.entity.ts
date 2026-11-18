import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { CalendarsEntity } from "#/modules/event/schema/entities/calendars.entity.ts";
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { ProvisionsEntity } from "#/modules/legal/schema/entities/provisions.entity.ts";
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { CountryEntity } from "#/modules/reference/schema/entities/country.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One event or a recurring series of events: a public holiday, a national day, an election, a sitting, a government visit. Names, rules and dated occurrences are separate; content and media attach through the subject mechanism.
 */
@Entity({ schema: "event", name: "events" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["countryId", "eventKindId"])
@Index(["scopeFeatureId"])
@Index(["organiserEntityId"])
@Index(["basisProvisionId"])
@Index(["sourceCitationId"])
export class EventsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "basis_provision_id", type: "uuid", nullable: true })
  basisProvisionId?: Id | null;

  @ManyToOne(() => ProvisionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "basis_provision_id" })
  basisProvision?: Relation<ProvisionsEntity>;

  @Column({ name: "calendar_id", type: "uuid", nullable: true })
  calendarId?: Id | null;

  @ManyToOne(() => CalendarsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "calendar_id" })
  calendar?: Relation<CalendarsEntity>;

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

  @Column({ name: "event_kind_id", type: "uuid" })
  eventKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "event_kind_id" })
  eventKind?: Relation<ValueEntity>;

  @Column({ name: "organiser_entity_id", type: "uuid", nullable: true })
  organiserEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "organiser_entity_id" })
  organiserEntity?: Relation<EntitiesEntity>;

  @Column({ name: "scope_feature_id", type: "uuid", nullable: true })
  scopeFeatureId?: Id | null;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "scope_feature_id" })
  scopeFeature?: Relation<FeaturesEntity>;

  @Column({ name: "scope_level_kind_id", type: "uuid", nullable: true })
  scopeLevelKindId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "scope_level_kind_id" })
  scopeLevelKind?: Relation<ValueEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
