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
 * One dated classification of a feature by a scheme value, so a feature can answer several classification questions and change over time.
 */
@Entity({ schema: "geography", name: "classifications" })
@Index(["featureId", "valueId", "validFrom"], { unique: true })
@Index(["featureId"])
@Index(["valueId"])
@Check(
  "chk_classifications_validity_window_is_ordered",
  `valid_from = null OR valid_until = null OR valid_from < valid_until`,
)
@Check(
  "chk_classifications_start_bounds_are_ordered",
  `valid_from_earliest = null OR valid_from_latest = null OR valid_from_earliest < valid_from_latest`,
)
@Check(
  "chk_classifications_end_bounds_are_ordered",
  `valid_until_earliest = null OR valid_until_latest = null OR valid_until_earliest < valid_until_latest`,
)
export class ClassificationsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "feature_id", type: "uuid" })
  featureId!: Id;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "feature_id" })
  feature?: Relation<FeaturesEntity>;

  @Column({ name: "source_ref_id", type: "uuid", nullable: true })
  sourceRefId?: Id | null;

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

  @Column({ name: "value_id", type: "uuid" })
  valueId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "value_id" })
  value?: Relation<ValueEntity>;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
