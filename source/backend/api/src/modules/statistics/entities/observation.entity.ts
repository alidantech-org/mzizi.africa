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
import { StatisticsTableEntity } from "#/modules/statistics/entities/statistics-table.entity.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { ConfidenceLevel } from "#/types/statistics/confidence-level.enum.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { ObservationValue } from "#/types/statistics/observation-value.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Observation
 */
@Entity({ schema: "statistical", name: "observations" })
@Index("idx_observation_table", ["tableId"])
@Index("idx_observation_lookup", ["indicatorId", "periodId", "geoUnitId"])
export class ObservationEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "column_id", type: "uuid", nullable: true })
  columnId?: Id | null;

  @Column({ name: "confidence_level", type: "enum", enum: ConfidenceLevel })
  confidenceLevel!: ConfidenceLevel;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "geo_unit_id", type: "uuid", nullable: true })
  geoUnitId?: Id | null;

  @Column({ name: "indicator_id", type: "uuid" })
  indicatorId!: Id;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "numeric_value", type: "numeric", precision: 25, scale: 4, transformer: new ColumnNumericTransformer(), nullable: true })
  numericValue?: ObservationValue | null;

  @Column({ name: "period_id", type: "uuid" })
  periodId!: Id;

  @Column({ name: "table_id", type: "uuid" })
  tableId!: Id;

  @ManyToOne(() => StatisticsTableEntity)
  @JoinColumn({ name: "table_id" })
  table?: Relation<StatisticsTableEntity>;

  @Column({ name: "text_value", type: "varchar", length: 4000, nullable: true })
  textValue?: Description | null;

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