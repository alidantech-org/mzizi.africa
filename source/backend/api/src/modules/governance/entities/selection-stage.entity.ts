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
import { SelectionProcedureEntity } from "#/modules/governance/entities/selection-procedure.entity.ts";
import { StageKind } from "#/types/governance/stage-kind.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { StageOrder } from "#/types/governance/stage-order.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Selection Stage
 */
@Entity({ schema: "governance", name: "stages" })
@Index("idx_selection_stage_procedure", ["procedureId", "stageOrder"])
export class SelectionStageEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "actor_institution_id", type: "uuid", nullable: true })
  actorInstitutionId?: Id | null;

  @Column({ name: "actor_office_id", type: "uuid", nullable: true })
  actorOfficeId?: Id | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "description", type: "varchar", length: 4000, nullable: true })
  description?: Description | null;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "kind", type: "enum", enum: StageKind })
  kind!: StageKind;

  @Column({ name: "procedure_id", type: "uuid" })
  procedureId!: Id;

  @ManyToOne(() => SelectionProcedureEntity)
  @JoinColumn({ name: "procedure_id" })
  procedure?: Relation<SelectionProcedureEntity>;

  @Column({ name: "stage_order", type: "integer" })
  stageOrder!: StageOrder;

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