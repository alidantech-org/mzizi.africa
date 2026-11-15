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
import { CountryEntity } from "#/modules/reference/entities/country.entity.ts";
import { ValueEntity } from "#/modules/reference/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/entities/citations.entity.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";

/**
 * Stable identity for one organization or legally identified entity; its names are stored in official.names.
 */
@Entity({ schema: "official", name: "entities" })
@Index(["code"], { unique: true })
@Index(["kindId"])
@Index(["registrationCountryId"])
@Index(["sourceCitationId"])
@Check("chk_entities_registration_and_dissolution_are_ordered", `registered_on = null OR dissolved_on = null OR registered_on <= dissolved_on`)
export class EntitiesEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "dissolved_on", type: "date", nullable: true })
  dissolvedOn?: Date | null;

  @Column({ name: "kind_id", type: "uuid" })
  kindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "kind_id" })
  kind?: Relation<ValueEntity>;

  @Column({ name: "registered_on", type: "date", nullable: true })
  registeredOn?: Date | null;

  @Column({ name: "registration_country_id", type: "uuid", nullable: true })
  registrationCountryId?: Id | null;

  @ManyToOne(() => CountryEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "registration_country_id" })
  registrationCountry?: Relation<CountryEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}