import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { EntitiesEntity } from "#/modules/official/entities/entities.entity.ts";
import { CountryEntity } from "#/modules/reference/entities/country.entity.ts";
import { ValueEntity } from "#/modules/reference/entities/value.entity.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";

/**
 * Accepted publisher; an optional official identity distinguishes organization from publication channel.
 */
@Entity({ schema: "source", name: "publishers" })
@Index(["code"], { unique: true })
@Index(["kindId"])
@Index(["countryId"])
export class PublishersEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

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

  @Column({ name: "kind_id", type: "uuid" })
  kindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "kind_id" })
  kind?: Relation<ValueEntity>;

  @Column({ name: "name", type: "varchar", length: 300 })
  name!: Name;

  @Column({ name: "official_entity_id", type: "uuid", nullable: true })
  officialEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "official_entity_id" })
  officialEntity?: Relation<EntitiesEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}