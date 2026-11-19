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

import { InstitutionsEntity } from "#/modules/governance/schema/entities/institutions.entity.ts";
import { PositionsEntity } from "#/modules/governance/schema/entities/positions.entity.ts";
import { ProceduresEntity } from "#/modules/governance/schema/entities/procedures.entity.ts";
import { ProvisionsEntity } from "#/modules/legal/schema/entities/provisions.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * One right held in law by a position or body over another, with its place in a procedure, the threshold and the provision that creates it. Influence is computed from these rows, never stored.
 */
@Entity({ schema: "governance", name: "powers" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(
  [
    "holderPositionId",
    "holderInstitutionId",
    "targetPositionId",
    "targetInstitutionId",
    "kindId",
    "procedureId",
    "stepOrder",
  ],
  { unique: true },
)
@Index(["holderPositionId", "kindId"])
@Index(["holderInstitutionId", "kindId"])
@Index(["targetPositionId", "kindId"])
@Index(["targetInstitutionId", "kindId"])
@Index(["procedureId", "stepOrder"])
@Index(["basisProvisionId"])
@Index(["sourceCitationId"])
@Check(
  "chk_powers_period_years_are_ordered",
  `from_year = null OR to_year = null OR from_year <= to_year`,
)
// Invariant "HasExactlyOneHolder" has no simple form, so it isn't enforced as a database check.
// Invariant "HasExactlyOneTarget" has no simple form, so it isn't enforced as a database check.
export class PowersEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "basis_provision_id", type: "uuid", nullable: true })
  basisProvisionId?: Id | null;

  @ManyToOne(() => ProvisionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "basis_provision_id" })
  basisProvision?: Relation<ProvisionsEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({
    name: "from_to_precision",
    type: "enum",
    enum: DatePrecision,
    nullable: true,
  })
  fromToPrecision?: DatePrecision | null;

  @Column({ name: "from_year", type: "integer", nullable: true })
  fromYear?: Year | null;

  @Column({ name: "holder_institution_id", type: "uuid", nullable: true })
  holderInstitutionId?: Id | null;

  @ManyToOne(() => InstitutionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "holder_institution_id" })
  holderInstitution?: Relation<InstitutionsEntity>;

  @Column({ name: "holder_position_id", type: "uuid", nullable: true })
  holderPositionId?: Id | null;

  @ManyToOne(() => PositionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "holder_position_id" })
  holderPosition?: Relation<PositionsEntity>;

  @Column({ name: "is_binding", type: "boolean" })
  isBinding!: Flag;

  @Column({ name: "kind_id", type: "uuid" })
  kindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "kind_id" })
  kind?: Relation<ValueEntity>;

  @Column({ name: "procedure_id", type: "uuid", nullable: true })
  procedureId?: Id | null;

  @ManyToOne(() => ProceduresEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "procedure_id" })
  procedure?: Relation<ProceduresEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "step_order", type: "integer", nullable: true })
  stepOrder?: PositiveInteger | null;

  @Column({ name: "target_institution_id", type: "uuid", nullable: true })
  targetInstitutionId?: Id | null;

  @ManyToOne(() => InstitutionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "target_institution_id" })
  targetInstitution?: Relation<InstitutionsEntity>;

  @Column({ name: "target_position_id", type: "uuid", nullable: true })
  targetPositionId?: Id | null;

  @ManyToOne(() => PositionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "target_position_id" })
  targetPosition?: Relation<PositionsEntity>;

  @Column({ name: "threshold_id", type: "uuid", nullable: true })
  thresholdId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "threshold_id" })
  threshold?: Relation<ValueEntity>;

  @Column({ name: "to_year", type: "integer", nullable: true })
  toYear?: Year | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
