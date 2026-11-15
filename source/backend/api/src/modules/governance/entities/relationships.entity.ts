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
import { InstitutionsEntity } from "#/modules/governance/entities/institutions.entity.ts";
import { ValueEntity } from "#/modules/reference/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/entities/citations.entity.ts";
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/type/positive-integer.type.ts";

/**
 * One dated, typed relationship between two government institutions.
 */
@Entity({ schema: "governance", name: "relationships" })
@Index(["subjectInstitutionId", "relationshipKindId"])
@Index(["objectInstitutionId", "relationshipKindId"])
@Index(["sourceCitationId"])
@Check("chk_relationships_validity_window_is_ordered", `valid_from = null OR valid_until = null OR valid_from < valid_until`)
@Check("chk_relationships_relationship_is_not_self_referential", `subject_institution_id <> object_institution_id`)
export class RelationshipsEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "object_institution_id", type: "uuid" })
  objectInstitutionId!: Id;

  @ManyToOne(() => InstitutionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "object_institution_id" })
  objectInstitution?: Relation<InstitutionsEntity>;

  @Column({ name: "relationship_kind_id", type: "uuid" })
  relationshipKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "relationship_kind_id" })
  relationshipKind?: Relation<ValueEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "subject_institution_id", type: "uuid" })
  subjectInstitutionId!: Id;

  @ManyToOne(() => InstitutionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "subject_institution_id" })
  subjectInstitution?: Relation<InstitutionsEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_until", type: "date", nullable: true })
  validUntil?: Date | null;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}