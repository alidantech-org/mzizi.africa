import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";

import { ColumnNumericTransformer } from "#/modules/common/entities/base/column-numeric.transformer.ts";
import { DimensionEntity } from "#/modules/statistics/entities/dimension.entity.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Date } from "#/types/shared/date.type.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { ObservationValue } from "#/types/statistics/observation-value.type.ts";

/** Member of a dimension, with hierarchy and reference code. */
@Entity({ schema: "statistical", name: "dimension_members" })
@Index("idx_dimension_member_code", ["dimensionId", "code"], { unique: true })
@Index("idx_dimension_member_parent", ["parentId"])
export class DimensionMemberEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 200 })
  code!: BusinessCode;

  @Column({ name: "dimension_id", type: "uuid" })
  dimensionId!: Id;

  @ManyToOne(() => DimensionEntity)
  @JoinColumn({ name: "dimension_id" })
  dimension?: Relation<DimensionEntity>;

  @Column({ name: "label", type: "varchar", length: 300 })
  label!: Label;

  @Column({ name: "parent_id", type: "uuid", nullable: true })
  parentId?: Id | null;

  @Column({ name: "reference_code", type: "varchar", nullable: true, length: 200 })
  referenceCode?: BusinessCode | null;

  @Column({ name: "sort_order", type: "integer", nullable: true })
  sortOrder?: number | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

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
}
