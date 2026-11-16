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
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * The sole canonical identity for each geographic entity, whatever its type. Country, parentage and administrative or electoral membership are dated relationships, never columns here.
 */
@Entity({ schema: "geography", name: "features" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["featureTypeId"])
@Index(["validFrom", "validUntil"])
@Check(
  "chk_features_validity_window_is_ordered",
  `valid_from = null OR valid_until = null OR valid_from < valid_until`,
)
@Check(
  "chk_features_start_bounds_are_ordered",
  `valid_from_earliest = null OR valid_from_latest = null OR valid_from_earliest < valid_from_latest`,
)
@Check(
  "chk_features_end_bounds_are_ordered",
  `valid_until_earliest = null OR valid_until_latest = null OR valid_until_earliest < valid_until_latest`,
)
export class FeaturesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "feature_type_id", type: "uuid" })
  featureTypeId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "feature_type_id" })
  featureType?: Relation<ValueEntity>;

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
