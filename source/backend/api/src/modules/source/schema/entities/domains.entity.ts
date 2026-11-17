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
import { SourcesEntity } from "#/modules/source/schema/entities/sources.entity.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * A host name a source is served from. A host belongs to one source at a time; its validity period records moves.
 */
@Entity({ schema: "source", name: "domains" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["host"], { unique: true })
@Index(["sourceId"])
@Check(
  "chk_domains_period_years_are_ordered",
  `from_year = null OR to_year = null OR from_year <= to_year`,
)
@Check(
  "chk_domains_domains_dates_are_ordered",
  `starts_on = null OR ends_on = null OR starts_on <= ends_on`,
)
export class DomainsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

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

  @Column({ name: "host", type: "varchar", length: 255 })
  host!: NonEmptyString255;

  @Column({ name: "source_id", type: "uuid" })
  sourceId!: Id;

  @ManyToOne(() => SourcesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_id" })
  source?: Relation<SourcesEntity>;

  @Column({ name: "starts_on", type: "date", nullable: true })
  startsOn?: Date | null;

  @Column({ name: "to_year", type: "integer", nullable: true })
  toYear?: Year | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
