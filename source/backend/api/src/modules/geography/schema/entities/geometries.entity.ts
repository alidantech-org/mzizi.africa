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
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { GeometryArea } from "#/modules/geography/schema/type/geometry-area.type.ts";
import type { Confidence } from "#/modules/shared/schema/type/confidence.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * One drawing of a feature: a revision with a role, a basis, a confidence, a zoom range, a validity period and the stored file it came from. A feature has many; the current one has no end date.
 */
@Entity({ schema: "geography", name: "geometries" })
@Index(["featureId", "geometryRoleId", "revision"], { unique: true })
@Index(["featureId", "geometryRoleId"], {
  unique: true,
  where: '"to_year" IS NULL',
})
@Index(["featureId", "geometryRoleId"])
@Index(["fromYear", "toYear"])
@Index(["id", "featureId"], { unique: true })
@Index(["basisId"])
@Check(
  "chk_geometries_period_years_are_ordered",
  `from_year = null OR to_year = null OR from_year <= to_year`,
)
@Check(
  "chk_geometries_zoom_range_must_be_ordered",
  `min_zoom = null OR max_zoom = null OR min_zoom < max_zoom`,
)
@Check("chk_geometries_geometry_must_not_supersede_itself", `id <> supersedes_id`)
export class GeometriesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({
    name: "area",
    type: "double precision",
    insert: false,
    update: false,
  })
  readonly area!: GeometryArea;

  @Column({ name: "basis_id", type: "uuid" })
  basisId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "basis_id" })
  basis?: Relation<ValueEntity>;

  @Column({
    name: "centroid",
    type: "geometry",
    spatialFeatureType: "Point",
    srid: 4326,
    insert: false,
    update: false,
  })
  readonly centroid!: import("typeorm").Geometry;

  @Column({ name: "confidence", type: "double precision", nullable: true })
  confidence?: Confidence | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({
    name: "envelope",
    type: "geometry",
    spatialFeatureType: "Geometry",
    srid: 4326,
    insert: false,
    update: false,
  })
  readonly envelope!: import("typeorm").Geometry;

  @Column({ name: "feature_id", type: "uuid" })
  featureId!: Id;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "feature_id" })
  feature?: Relation<FeaturesEntity>;

  @Column({
    name: "from_to_precision",
    type: "enum",
    enum: DatePrecision,
    nullable: true,
  })
  fromToPrecision?: DatePrecision | null;

  @Column({ name: "from_year", type: "integer", nullable: true })
  fromYear?: Year | null;

  @Column({
    name: "geometry",
    type: "geometry",
    spatialFeatureType: "Geometry",
    srid: 4326,
  })
  geometry!: import("typeorm").Geometry;

  @Column({ name: "geometry_role_id", type: "uuid" })
  geometryRoleId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "geometry_role_id" })
  geometryRole?: Relation<ValueEntity>;

  @Column({ name: "max_zoom", type: "integer", nullable: true })
  maxZoom?: NonNegativeInteger | null;

  @Column({ name: "min_zoom", type: "integer", nullable: true })
  minZoom?: NonNegativeInteger | null;

  @Column({ name: "observed_at", type: "timestamptz", nullable: true })
  observedAt?: Date | null;

  @Column({ name: "revision", type: "integer" })
  revision!: PositiveInteger;

  @Column({ name: "srid", type: "integer" })
  srid!: PositiveInteger;

  @Column({ name: "supersedes_id", type: "uuid", nullable: true })
  supersedesId?: Id | null;

  @ManyToOne(() => GeometriesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "supersedes_id" })
  supersedes?: Relation<GeometriesEntity>;

  @Column({ name: "to_year", type: "integer", nullable: true })
  toYear?: Year | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
