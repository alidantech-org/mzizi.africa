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
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * The sole canonical identity for each geographic entity, whatever its type. Country, parentage and administrative or electoral membership are dated relationships, never columns here.
 */
@Entity({ schema: "geography", name: "features" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["featureTypeId"])
@Index(["fromYear", "toYear"])
@Check(
  "chk_features_period_years_are_ordered",
  `from_year = null OR to_year = null OR from_year <= to_year`,
)
@Check(
  "chk_features_features_dates_are_ordered",
  `established_on = null OR ended_on = null OR established_on <= ended_on`,
)
export class FeaturesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "ended_on", type: "date", nullable: true })
  endedOn?: Date | null;

  @Column({ name: "established_on", type: "date", nullable: true })
  establishedOn?: Date | null;

  @Column({ name: "feature_type_id", type: "uuid" })
  featureTypeId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "feature_type_id" })
  featureType?: Relation<ValueEntity>;

  @Column({
    name: "from_to_precision",
    type: "enum",
    enum: DatePrecision,
    nullable: true,
  })
  fromToPrecision?: DatePrecision | null;

  @Column({ name: "from_year", type: "integer", nullable: true })
  fromYear?: Year | null;

  @Column({ name: "to_year", type: "integer", nullable: true })
  toYear?: Year | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
