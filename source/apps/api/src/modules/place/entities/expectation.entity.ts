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
import { ExpectationBasis } from "#/types/place/expectation-basis.enum.ts";
import { ExpectationStatus } from "#/types/place/expectation-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Expectation
 */
@Entity({ schema: "place", name: "expectations" })
@Index("idx_expectation_subject", ["subjectKind", "subjectId"])
@Index("idx_expectation_scope", ["scopeGeoUnitId"])
@Index("idx_expectation_status", ["status"])
export class ExpectationEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "basis", type: "enum", enum: ExpectationBasis })
  basis!: ExpectationBasis;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "facility_type_id", type: "uuid", nullable: true })
  facilityTypeId?: Id | null;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "max_count", type: "integer", nullable: true })
  maxCount?: Count | null;

  @Column({ name: "min_count", type: "integer" })
  minCount!: Count;

  @Column({ name: "resolved_occupancy_id", type: "uuid", nullable: true })
  resolvedOccupancyId?: Id | null;

  @Column({ name: "role_id", type: "uuid" })
  roleId!: Id;

  @Column({ name: "scope_geo_unit_id", type: "uuid", nullable: true })
  scopeGeoUnitId?: Id | null;

  @Column({ name: "status", type: "enum", enum: ExpectationStatus })
  status!: ExpectationStatus;

  @Column({ name: "subject_id", type: "uuid" })
  subjectId!: Id;

  @Column({ name: "subject_kind", type: "varchar", length: 100 })
  subjectKind!: TargetKind;

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