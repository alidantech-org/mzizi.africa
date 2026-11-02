import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";

import { ColumnNumericTransformer } from "#/modules/common/entities/base/column-numeric.transformer.ts";
import { ObservationEntity } from "#/modules/statistics/entities/observation.entity.ts";
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

/** One dimension member attached to an observation. */
@Entity({ schema: "statistical", name: "observation_dimensions" })
@Index("idx_observation_dimension_unique", ["observationId", "dimensionId"], { unique: true })
@Index("idx_observation_dimension_member", ["memberId"])
export class ObservationDimensionEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "dimension_id", type: "uuid" })
  dimensionId!: Id;

  @Column({ name: "member_id", type: "uuid" })
  memberId!: Id;

  @Column({ name: "observation_id", type: "uuid" })
  observationId!: Id;

  @ManyToOne(() => ObservationEntity)
  @JoinColumn({ name: "observation_id" })
  observation?: Relation<ObservationEntity>;

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
