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
import { OfficesEntity } from "#/modules/governance/schema/entities/offices.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * One responsibility or authority assignment for an institution or office.
 */
@Entity({ schema: "governance", name: "mandates" })
@Index(["institutionId", "officeId", "mandateKindId", "description"], {
  unique: true,
})
@Index(["institutionId"])
@Index(["officeId"])
@Index(["sourceCitationId"])
@Check(
  "chk_mandates_period_years_are_ordered",
  `from_year = null OR to_year = null OR from_year <= to_year`,
)
@Check(
  "chk_mandates_mandates_dates_are_ordered",
  `starts_on = null OR ends_on = null OR starts_on <= ends_on`,
)
export class MandatesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "description", type: "varchar", length: 4000 })
  description!: Description;

  @Column({ name: "ends_on", type: "date", nullable: true })
  endsOn?: Date | null;

  @Column({
    name: "from_to_precision",
    type: "enum",
    enum: DatePrecision,
    nullable: true,
  })
  fromToPrecision?: DatePrecision | null;

  @Column({ name: "from_year", type: "integer", nullable: true })
  fromYear?: Year | null;

  @Column({ name: "institution_id", type: "uuid", nullable: true })
  institutionId?: Id | null;

  @ManyToOne(() => InstitutionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "institution_id" })
  institution?: Relation<InstitutionsEntity>;

  @Column({ name: "mandate_kind_id", type: "uuid" })
  mandateKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "mandate_kind_id" })
  mandateKind?: Relation<ValueEntity>;

  @Column({ name: "office_id", type: "uuid", nullable: true })
  officeId?: Id | null;

  @ManyToOne(() => OfficesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "office_id" })
  office?: Relation<OfficesEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "starts_on", type: "date", nullable: true })
  startsOn?: Date | null;

  @Column({ name: "to_year", type: "integer", nullable: true })
  toYear?: Year | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
