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
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { InstitutionsEntity } from "#/modules/governance/schema/entities/institutions.entity.ts";
import { PositionsEntity } from "#/modules/governance/schema/entities/positions.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * One established public office, independent of any current holder and optionally scoped to a geographic unit.
 */
@Entity({ schema: "governance", name: "offices" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["positionId"])
@Index(["institutionId"])
@Index(["unitFeatureId"])
@Index(["sourceCitationId"])
@Check(
  "chk_offices_period_years_are_ordered",
  `from_year = null OR to_year = null OR from_year <= to_year`,
)
@Check(
  "chk_offices_offices_dates_are_ordered",
  `created_on = null OR abolished_on = null OR created_on <= abolished_on`,
)
export class OfficesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "abolished_on", type: "date", nullable: true })
  abolishedOn?: Date | null;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "created_on", type: "date", nullable: true })
  createdOn?: Date | null;

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

  @Column({ name: "institution_id", type: "uuid" })
  institutionId!: Id;

  @ManyToOne(() => InstitutionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "institution_id" })
  institution?: Relation<InstitutionsEntity>;

  @Column({ name: "position_id", type: "uuid" })
  positionId!: Id;

  @ManyToOne(() => PositionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "position_id" })
  position?: Relation<PositionsEntity>;

  @Column({ name: "seat_ordinal", type: "integer", nullable: true })
  seatOrdinal?: PositiveInteger | null;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "to_year", type: "integer", nullable: true })
  toYear?: Year | null;

  @Column({ name: "unit_feature_id", type: "uuid", nullable: true })
  unitFeatureId?: Id | null;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "unit_feature_id" })
  unitFeature?: Relation<FeaturesEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
