import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";

import { ColumnNumericTransformer } from "#/modules/common/entities/base/column-numeric.transformer.ts";
import { GeoUnitEntity } from "#/modules/geography/entities/geo-unit.entity.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { GeoJson } from "#/types/geography/geo-json.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Geo Boundary Version
 */
@Entity({ schema: "geography", name: "boundaries" })
@Index("idx_geo_boundary_unit_current", ["unitId", "isCurrent"])
@Index("uq_geo_boundary_unit_version", ["unitId", "versionNumber"], { unique: true })
export class GeoBoundaryVersionEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "geometry", type: "text" })
  geometry!: GeoJson;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "label_point", type: "text", nullable: true })
  labelPoint?: GeoJson | null;

  @Column({ name: "reference_year", type: "integer", nullable: true })
  referenceYear?: Version | null;

  @Column({ name: "unit_id", type: "uuid" })
  unitId!: Id;

  @ManyToOne(() => GeoUnitEntity)
  @JoinColumn({ name: "unit_id" })
  unit?: Relation<GeoUnitEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_from_precision", type: "enum", enum: DatePrecision, nullable: true })
  validFromPrecision?: DatePrecision | null;

  @Column({ name: "valid_to", type: "date", nullable: true })
  validTo?: Date | null;

  @Column({ name: "valid_to_precision", type: "enum", enum: DatePrecision, nullable: true })
  validToPrecision?: DatePrecision | null;

  @Column({ name: "version", type: "integer" })
  version!: Version;

  @Column({ name: "version_number", type: "integer" })
  versionNumber!: Version;
}