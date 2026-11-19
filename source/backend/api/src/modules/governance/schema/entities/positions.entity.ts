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

import { LevelsEntity } from "#/modules/geography/schema/entities/levels.entity.ts";
import { InstitutionsEntity } from "#/modules/governance/schema/entities/institutions.entity.ts";
import { ProvisionsEntity } from "#/modules/legal/schema/entities/provisions.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * A kind of office with its seat rule: how it is filled, how many seats exist and where, the term, the legal basis. Offices are the individual seats of a position; holders are never part of it.
 */
@Entity({ schema: "governance", name: "positions" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["institutionId"])
@Index(["titleId"])
@Index(["roleId"])
@Index(["selectionMethodId"])
@Index(["jurisdictionLevelId"])
@Index(["seatUnitLevelId"])
@Index(["exposureId"])
@Index(["basisProvisionId"])
@Index(["sourceCitationId"])
@Check(
  "chk_positions_period_years_are_ordered",
  `from_year = null OR to_year = null OR from_year <= to_year`,
)
export class PositionsEntity {
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

  @Column({ name: "display_order", type: "integer", nullable: true })
  displayOrder?: NonNegativeInteger | null;

  @Column({ name: "exposure_id", type: "uuid", nullable: true })
  exposureId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "exposure_id" })
  exposure?: Relation<ValueEntity>;

  @Column({
    name: "from_to_precision",
    type: "enum",
    enum: DatePrecision,
    nullable: true,
  })
  fromToPrecision?: DatePrecision | null;

  @Column({ name: "from_year", type: "integer", nullable: true })
  fromYear?: Year | null;

  @Column({ name: "institution_id", type: "uuid" })
  institutionId!: Id;

  @ManyToOne(() => InstitutionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "institution_id" })
  institution?: Relation<InstitutionsEntity>;

  @Column({ name: "jurisdiction_level_id", type: "uuid", nullable: true })
  jurisdictionLevelId?: Id | null;

  @ManyToOne(() => LevelsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "jurisdiction_level_id" })
  jurisdictionLevel?: Relation<LevelsEntity>;

  @Column({ name: "role_id", type: "uuid" })
  roleId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "role_id" })
  role?: Relation<ValueEntity>;

  @Column({ name: "seat_basis_id", type: "uuid" })
  seatBasisId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "seat_basis_id" })
  seatBasis?: Relation<ValueEntity>;

  @Column({ name: "seat_count", type: "integer", nullable: true })
  seatCount?: PositiveInteger | null;

  @Column({ name: "seat_unit_level_id", type: "uuid", nullable: true })
  seatUnitLevelId?: Id | null;

  @ManyToOne(() => LevelsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "seat_unit_level_id" })
  seatUnitLevel?: Relation<LevelsEntity>;

  @Column({ name: "selection_method_id", type: "uuid" })
  selectionMethodId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "selection_method_id" })
  selectionMethod?: Relation<ValueEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "term_limit", type: "integer", nullable: true })
  termLimit?: PositiveInteger | null;

  @Column({ name: "term_years", type: "integer", nullable: true })
  termYears?: PositiveInteger | null;

  @Column({ name: "title_id", type: "uuid" })
  titleId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "title_id" })
  title?: Relation<ValueEntity>;

  @Column({ name: "to_year", type: "integer", nullable: true })
  toYear?: Year | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
