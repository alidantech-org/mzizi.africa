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
import { FeaturesEntity } from "#/modules/geography/entities/features.entity.ts";
import { ValueEntity } from "#/modules/reference/entities/value.entity.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";

/**
 * A dated spatial representation version for a feature. The geometry field remains an unsupported Dryv placeholder and is excluded from generation.
 */
@Entity({ schema: "geography", name: "geometries" })
@Index(["featureId"])
@Index(["validFrom", "validUntil"])
@Check("chk_geometries_validity_window_is_ordered", `valid_from = null OR valid_until = null OR valid_from < valid_until`)
export class GeometriesEntity {

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

  @Column({ name: "file_version_ref_id", type: "uuid", nullable: true })
  fileVersionRefId?: Id | null;

  @Column({ name: "geometry", type: "jsonb" })
  geometry!: unknown;

  @Column({ name: "geometry_role_id", type: "uuid" })
  geometryRoleId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "geometry_role_id" })
  geometryRole?: Relation<ValueEntity>;

  @Column({ name: "observed_at", type: "timestamptz", nullable: true })
  observedAt?: Date | null;

  @Column({ name: "source_ref_id", type: "uuid", nullable: true })
  sourceRefId?: Id | null;

  @Column({ name: "srid", type: "integer" })
  srid!: PositiveInteger;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_until", type: "date", nullable: true })
  validUntil?: Date | null;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}