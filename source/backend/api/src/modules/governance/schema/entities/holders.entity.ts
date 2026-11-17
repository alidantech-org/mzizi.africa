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
import { OfficesEntity } from "#/modules/governance/schema/entities/offices.entity.ts";
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { IndividualsEntity } from "#/modules/official/schema/entities/individuals.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * One person's continuous tenure in one office, with appointment kind and effective dates.
 */
@Entity({ schema: "governance", name: "holders" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["officeId", "fromYear", "toYear"])
@Index(["individualId"])
@Index(["sourceCitationId"])
@Check(
  "chk_holders_period_years_are_ordered",
  `from_year = null OR to_year = null OR from_year <= to_year`,
)
@Check(
  "chk_holders_holders_dates_are_ordered",
  `took_office_on = null OR left_office_on = null OR took_office_on <= left_office_on`,
)
export class HoldersEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "appointed_by_entity_id", type: "uuid", nullable: true })
  appointedByEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "appointed_by_entity_id" })
  appointedByEntity?: Relation<EntitiesEntity>;

  @Column({ name: "appointment_kind_id", type: "uuid" })
  appointmentKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "appointment_kind_id" })
  appointmentKind?: Relation<ValueEntity>;

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

  @Column({ name: "individual_id", type: "uuid" })
  individualId!: Id;

  @ManyToOne(() => IndividualsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "individual_id" })
  individual?: Relation<IndividualsEntity>;

  @Column({ name: "left_office_on", type: "date", nullable: true })
  leftOfficeOn?: Date | null;

  @Column({ name: "office_id", type: "uuid" })
  officeId!: Id;

  @ManyToOne(() => OfficesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "office_id" })
  office?: Relation<OfficesEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "to_year", type: "integer", nullable: true })
  toYear?: Year | null;

  @Column({ name: "took_office_on", type: "date", nullable: true })
  tookOfficeOn?: Date | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
