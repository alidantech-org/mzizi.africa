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
import { ReferendumOptionEntity } from "#/modules/elections/entities/referendum-option.entity.ts";
import { ResultStatus } from "#/types/elections/result-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { EvidenceForm } from "#/types/elections/evidence-form.type.ts";
import type { Votes } from "#/types/elections/votes.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Referendum Result
 */
@Entity({ schema: "electoral", name: "referendum_results" })
@Index("idx_referendum_result_option", ["optionId", "resultLevelId"])
@Index("idx_referendum_result_geo", ["geoUnitId"])
export class ReferendumResultEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "declared_at", type: "timestamptz", nullable: true })
  declaredAt?: Date | null;

  @Column({ name: "declaring_institution_id", type: "uuid", nullable: true })
  declaringInstitutionId?: Id | null;

  @Column({ name: "evidence_form", type: "varchar", length: 120, nullable: true })
  evidenceForm?: EvidenceForm | null;

  @Column({ name: "geo_unit_id", type: "uuid", nullable: true })
  geoUnitId?: Id | null;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "option_id", type: "uuid" })
  optionId!: Id;

  @ManyToOne(() => ReferendumOptionEntity)
  @JoinColumn({ name: "option_id" })
  option?: Relation<ReferendumOptionEntity>;

  @Column({ name: "result_level_id", type: "uuid" })
  resultLevelId!: Id;

  @Column({ name: "result_status", type: "enum", enum: ResultStatus, nullable: true })
  resultStatus?: ResultStatus | null;

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

  @Column({ name: "votes", type: "integer" })
  votes!: Votes;
}