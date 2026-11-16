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
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A typed, dated directed relationship between features; separate rows allow overlapping administrative, electoral, statistical and other systems.
 */
@Entity({ schema: "geography", name: "relationships" })
@Index(["subjectFeatureId", "objectFeatureId", "relationshipKindId", "systemId", "validFrom"], {
  unique: true,
})
@Index(["subjectFeatureId", "relationshipKindId"])
@Index(["objectFeatureId", "relationshipKindId"])
@Index(["validFrom", "validUntil"])
@Check(
  "chk_relationships_validity_window_is_ordered",
  `valid_from = null OR valid_until = null OR valid_from < valid_until`,
)
@Check(
  "chk_relationships_start_bounds_are_ordered",
  `valid_from_earliest = null OR valid_from_latest = null OR valid_from_earliest < valid_from_latest`,
)
@Check(
  "chk_relationships_end_bounds_are_ordered",
  `valid_until_earliest = null OR valid_until_latest = null OR valid_until_earliest < valid_until_latest`,
)
@Check(
  "chk_relationships_relationship_must_not_be_self_referential",
  `subject_feature_id <> object_feature_id`,
)
export class GeographyRelationshipsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "object_feature_id", type: "uuid" })
  objectFeatureId!: Id;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "object_feature_id" })
  objectFeature?: Relation<FeaturesEntity>;

  @Column({ name: "relationship_kind_id", type: "uuid" })
  relationshipKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "relationship_kind_id" })
  relationshipKind?: Relation<ValueEntity>;

  @Column({ name: "source_ref_id", type: "uuid", nullable: true })
  sourceRefId?: Id | null;

  @Column({ name: "subject_feature_id", type: "uuid" })
  subjectFeatureId!: Id;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "subject_feature_id" })
  subjectFeature?: Relation<FeaturesEntity>;

  @Column({ name: "system_id", type: "uuid" })
  systemId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "system_id" })
  system?: Relation<ValueEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_from_earliest", type: "date", nullable: true })
  validFromEarliest?: Date | null;

  @Column({ name: "valid_from_latest", type: "date", nullable: true })
  validFromLatest?: Date | null;

  @Column({ name: "valid_until", type: "date", nullable: true })
  validUntil?: Date | null;

  @Column({ name: "valid_until_earliest", type: "date", nullable: true })
  validUntilEarliest?: Date | null;

  @Column({ name: "valid_until_latest", type: "date", nullable: true })
  validUntilLatest?: Date | null;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
