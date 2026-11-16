import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import type { CallingCode } from "#/modules/reference/schema/type/calling-code.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { IsoAlpha3 } from "#/modules/reference/schema/type/iso-alpha3.type.ts";
import type { IsoNumeric } from "#/modules/reference/schema/type/iso-numeric.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Canonical identity for a modern country; not a geographic unit or historical polity.
 */
@Entity({ schema: "reference", name: "countries" })
@Index(["code"], { unique: true })
@Index(["name"])
@Index(["isoAlpha2"], { unique: true })
@Index(["continentId"])
@Index(["subregionId"])
@Index(["currencyId"])
@Index(["recognitionStatusId"])
@Index(["designationId"])
export class CountryEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "calling_code", type: "varchar", length: 5, nullable: true })
  callingCode?: CallingCode | null;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "continent_id", type: "uuid", nullable: true })
  continentId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "continent_id" })
  continent?: Relation<ValueEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "currency_id", type: "uuid", nullable: true })
  currencyId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "currency_id" })
  currency?: Relation<ValueEntity>;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "designation_id", type: "uuid", nullable: true })
  designationId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "designation_id" })
  designation?: Relation<ValueEntity>;

  @Column({ name: "established_on", type: "date", nullable: true })
  establishedOn?: Date | null;

  @Column({ name: "iso_alpha2", type: "char", length: 2 })
  isoAlpha2!: IsoAlpha2;

  @Column({ name: "iso_alpha3", type: "char", length: 3, nullable: true })
  isoAlpha3?: IsoAlpha3 | null;

  @Column({ name: "iso_numeric", type: "char", length: 3, nullable: true })
  isoNumeric?: IsoNumeric | null;

  @Column({ name: "name", type: "varchar", length: 300 })
  name!: Name;

  @Column({
    name: "official_name",
    type: "varchar",
    length: 300,
    nullable: true,
  })
  officialName?: Name | null;

  @Column({ name: "recognition_status_id", type: "uuid", nullable: true })
  recognitionStatusId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "recognition_status_id" })
  recognitionStatus?: Relation<ValueEntity>;

  @Column({ name: "subregion_id", type: "uuid", nullable: true })
  subregionId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "subregion_id" })
  subregion?: Relation<ValueEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
