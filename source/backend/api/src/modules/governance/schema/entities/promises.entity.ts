import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { OccurrencesEntity } from "#/modules/event/schema/entities/occurrences.entity.ts";
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { HoldersEntity } from "#/modules/governance/schema/entities/holders.entity.ts";
import { OfficesEntity } from "#/modules/governance/schema/entities/offices.entity.ts";
import { SittingsEntity } from "#/modules/governance/schema/entities/sittings.entity.ts";
import { SpeechesEntity } from "#/modules/governance/schema/entities/speeches.entity.ts";
import { IndividualsEntity } from "#/modules/official/schema/entities/individuals.entity.ts";
import { TopicEntity } from "#/modules/reference/schema/entities/topic.entity.ts";
import { UnitEntity } from "#/modules/reference/schema/entities/unit.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Something a leader said they would do, with where and when, what was promised and its checked status. 'No record found' is a status backed by source coverage, never an empty cell.
 */
@Entity({ schema: "governance", name: "promises" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["makerHolderId"])
@Index(["makerIndividualId"])
@Index(["officeId"])
@Index(["placeFeatureId"])
@Index(["topicId"])
@Index(["occurrenceId"])
@Index(["sittingId"])
@Index(["speechId"])
@Index(["statusId"])
@Index(["sourceCitationId"])
// Invariant "HasExactlyOneMaker" has no simple form, so it isn't enforced as a database check.
export class PromisesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "due_on", type: "date", nullable: true })
  dueOn?: Date | null;

  @Column({ name: "made_on", type: "date" })
  madeOn!: Date;

  @Column({ name: "maker_holder_id", type: "uuid", nullable: true })
  makerHolderId?: Id | null;

  @ManyToOne(() => HoldersEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "maker_holder_id" })
  makerHolder?: Relation<HoldersEntity>;

  @Column({ name: "maker_individual_id", type: "uuid", nullable: true })
  makerIndividualId?: Id | null;

  @ManyToOne(() => IndividualsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "maker_individual_id" })
  makerIndividual?: Relation<IndividualsEntity>;

  @Column({ name: "occurrence_id", type: "uuid", nullable: true })
  occurrenceId?: Id | null;

  @ManyToOne(() => OccurrencesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "occurrence_id" })
  occurrence?: Relation<OccurrencesEntity>;

  @Column({ name: "office_id", type: "uuid", nullable: true })
  officeId?: Id | null;

  @ManyToOne(() => OfficesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "office_id" })
  office?: Relation<OfficesEntity>;

  @Column({ name: "place_feature_id", type: "uuid", nullable: true })
  placeFeatureId?: Id | null;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "place_feature_id" })
  placeFeature?: Relation<FeaturesEntity>;

  @Column({ name: "quantity", type: "double precision", nullable: true })
  quantity?: Number | null;

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

  @Column({ name: "speech_id", type: "uuid", nullable: true })
  speechId?: Id | null;

  @ManyToOne(() => SpeechesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "speech_id" })
  speech?: Relation<SpeechesEntity>;

  @Column({ name: "statement", type: "varchar", length: 4000 })
  statement!: Description;

  @Column({ name: "status_as_of", type: "date" })
  statusAsOf!: Date;

  @Column({ name: "status_id", type: "uuid" })
  statusId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "status_id" })
  status?: Relation<ValueEntity>;

  @Column({ name: "topic_id", type: "uuid", nullable: true })
  topicId?: Id | null;

  @ManyToOne(() => TopicEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "topic_id" })
  topic?: Relation<TopicEntity>;

  @Column({ name: "unit_id", type: "uuid", nullable: true })
  unitId?: Id | null;

  @ManyToOne(() => UnitEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "unit_id" })
  unit?: Relation<UnitEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
