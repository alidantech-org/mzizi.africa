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

import { FunctionsEntity } from "#/modules/governance/schema/entities/functions.entity.ts";
import { InstitutionsEntity } from "#/modules/governance/schema/entities/institutions.entity.ts";
import { PositionsEntity } from "#/modules/governance/schema/entities/positions.entity.ts";
import { ProvisionsEntity } from "#/modules/legal/schema/entities/provisions.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * Who is responsible for a function, how it is shared, where a person starts, and the law that assigns it.
 */
@Entity({ schema: "governance", name: "assignments" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["functionId"])
@Index(["institutionId"])
@Index(["obligorKindId"])
@Index(["startPositionId"])
@Index(["startInstitutionId"])
@Index(["basisProvisionId"])
@Index(["sourceCitationId"])
@Check(
  "chk_assignments_period_years_are_ordered",
  `from_year = null OR to_year = null OR from_year <= to_year`,
)
@Check(
  "chk_assignments_has_one_responsible_form",
  `institution_id <> null OR obligor_kind_id <> null`,
)
export class AssignmentsEntity {
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

  @Column({ name: "function_id", type: "uuid" })
  functionId!: Id;

  @ManyToOne(() => FunctionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "function_id" })
  function?: Relation<FunctionsEntity>;

  @Column({ name: "institution_id", type: "uuid", nullable: true })
  institutionId?: Id | null;

  @ManyToOne(() => InstitutionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "institution_id" })
  institution?: Relation<InstitutionsEntity>;

  @Column({ name: "obligor_kind_id", type: "uuid", nullable: true })
  obligorKindId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "obligor_kind_id" })
  obligorKind?: Relation<ValueEntity>;

  @Column({ name: "share_id", type: "uuid" })
  shareId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "share_id" })
  share?: Relation<ValueEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "start_institution_id", type: "uuid", nullable: true })
  startInstitutionId?: Id | null;

  @ManyToOne(() => InstitutionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "start_institution_id" })
  startInstitution?: Relation<InstitutionsEntity>;

  @Column({ name: "start_position_id", type: "uuid", nullable: true })
  startPositionId?: Id | null;

  @ManyToOne(() => PositionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "start_position_id" })
  startPosition?: Relation<PositionsEntity>;

  @Column({ name: "to_year", type: "integer", nullable: true })
  toYear?: Year | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
