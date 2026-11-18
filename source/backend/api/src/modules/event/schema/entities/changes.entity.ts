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
import { ProvisionsEntity } from "#/modules/legal/schema/entities/provisions.entity.ts";
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One reschedule, postponement, adjournment, cancellation or confirmation of an occurrence, with the reason, who decided it and under which law. History is the list of changes.
 */
@Entity({ schema: "event", name: "changes" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["occurrenceId", "decidedOn"])
@Index(["changeKindId"])
@Index(["reasonId"])
@Index(["authorityEntityId"])
@Index(["basisProvisionId"])
@Index(["replacementOccurrenceId"])
@Index(["sourceCitationId"])
export class EventChangesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "authority_entity_id", type: "uuid", nullable: true })
  authorityEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "authority_entity_id" })
  authorityEntity?: Relation<EntitiesEntity>;

  @Column({ name: "basis_provision_id", type: "uuid", nullable: true })
  basisProvisionId?: Id | null;

  @ManyToOne(() => ProvisionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "basis_provision_id" })
  basisProvision?: Relation<ProvisionsEntity>;

  @Column({ name: "change_kind_id", type: "uuid" })
  changeKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "change_kind_id" })
  changeKind?: Relation<ValueEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "decided_on", type: "date", nullable: true })
  decidedOn?: Date | null;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({
    name: "explanation",
    type: "varchar",
    length: 4000,
    nullable: true,
  })
  explanation?: Description | null;

  @Column({ name: "from_on", type: "date", nullable: true })
  fromOn?: Date | null;

  @Column({ name: "occurrence_id", type: "uuid" })
  occurrenceId!: Id;

  @ManyToOne(() => OccurrencesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "occurrence_id" })
  occurrence?: Relation<OccurrencesEntity>;

  @Column({ name: "reason_id", type: "uuid", nullable: true })
  reasonId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "reason_id" })
  reason?: Relation<ValueEntity>;

  @Column({ name: "replacement_occurrence_id", type: "uuid", nullable: true })
  replacementOccurrenceId?: Id | null;

  @ManyToOne(() => OccurrencesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "replacement_occurrence_id" })
  replacementOccurrence?: Relation<OccurrencesEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "to_on", type: "date", nullable: true })
  toOn?: Date | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
