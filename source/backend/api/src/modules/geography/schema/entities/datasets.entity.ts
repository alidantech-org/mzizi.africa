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
import { UnitEntity } from "#/modules/reference/schema/entities/unit.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Catalog metadata for vector, raster, climate, elevation, historical and derived datasets. Large assets remain in the existing Filesystem/SeaweedFS S3 system; external references await executable Source and Filesystem contracts.
 */
@Entity({ schema: "geography", name: "datasets" })
@Index(["code"], { unique: true })
@Index(["subjectId"])
@Index(["representationId"])
@Index(["coverageFeatureId"])
@Check("chk_datasets_dataset_resolution_must_be_positive", `resolution = null OR resolution > 0`)
export class DatasetsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "coverage_feature_id", type: "uuid", nullable: true })
  coverageFeatureId?: Id | null;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "coverage_feature_id" })
  coverageFeature?: Relation<FeaturesEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "crs", type: "varchar", length: 100, nullable: true })
  crs?: NonEmptyString100 | null;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "file_version_ref_id", type: "uuid", nullable: true })
  fileVersionRefId?: Id | null;

  @Column({ name: "format", type: "varchar", length: 100 })
  format!: NonEmptyString100;

  @Column({
    name: "quality_notes",
    type: "varchar",
    length: 4000,
    nullable: true,
  })
  qualityNotes?: Description | null;

  @Column({ name: "representation_id", type: "uuid" })
  representationId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "representation_id" })
  representation?: Relation<ValueEntity>;

  @Column({ name: "resolution", type: "double precision", nullable: true })
  resolution?: Number | null;

  @Column({ name: "resolution_unit_id", type: "uuid", nullable: true })
  resolutionUnitId?: Id | null;

  @ManyToOne(() => UnitEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "resolution_unit_id" })
  resolutionUnit?: Relation<UnitEntity>;

  @Column({ name: "source_ref_id", type: "uuid", nullable: true })
  sourceRefId?: Id | null;

  @Column({ name: "subject_id", type: "uuid" })
  subjectId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "subject_id" })
  subject?: Relation<ValueEntity>;

  @Column({ name: "title", type: "varchar", length: 255 })
  title!: NonEmptyString255;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
