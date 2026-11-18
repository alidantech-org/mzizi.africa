import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { CountryEntity } from "#/modules/reference/schema/entities/country.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A way of counting time that gives events their dates: the civil calendar, a lunar calendar, a fiscal or school year.
 */
@Entity({ schema: "event", name: "calendars" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["countryId"])
@Index(["calendarKindId"])
@Index(["sourceCitationId"])
export class CalendarsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "calendar_kind_id", type: "uuid" })
  calendarKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "calendar_kind_id" })
  calendarKind?: Relation<ValueEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "country_id", type: "uuid", nullable: true })
  countryId?: Id | null;

  @ManyToOne(() => CountryEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "country_id" })
  country?: Relation<CountryEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({
    name: "description",
    type: "varchar",
    length: 4000,
    nullable: true,
  })
  description?: Description | null;

  @Column({ name: "is_observed", type: "boolean" })
  isObserved!: Flag;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;

  @Column({ name: "year_start_day", type: "integer", nullable: true })
  yearStartDay?: PositiveInteger | null;

  @Column({ name: "year_start_month", type: "integer", nullable: true })
  yearStartMonth?: PositiveInteger | null;
}
