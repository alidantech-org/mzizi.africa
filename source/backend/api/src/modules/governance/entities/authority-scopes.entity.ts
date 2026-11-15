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
import { UnitsEntity } from "#/modules/geography/entities/units.entity.ts";
import { InstitutionsEntity } from "#/modules/governance/entities/institutions.entity.ts";
import { OfficesEntity } from "#/modules/governance/entities/offices.entity.ts";
import { CountryEntity } from "#/modules/reference/entities/country.entity.ts";
import { ValueEntity } from "#/modules/reference/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/entities/citations.entity.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";

/**
 * One institution or office authority over a required Geography unit for an effective period.
 */
@Entity({ schema: "governance", name: "authority_scopes" })
@Index(["institutionId"])
@Index(["officeId"])
@Index(["unitFeatureId", "validFrom", "validUntil"])
@Index(["countryId"])
@Index(["sourceCitationId"])
@Check("chk_authority_scopes_validity_window_is_ordered", `valid_from = null OR valid_until = null OR valid_from < valid_until`)
export class AuthorityScopesEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "authority_kind_id", type: "uuid" })
  authorityKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "authority_kind_id" })
  authorityKind?: Relation<ValueEntity>;

  @Column({ name: "country_id", type: "uuid", nullable: true })
  countryId?: Id | null;

  @ManyToOne(() => CountryEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "country_id" })
  country?: Relation<CountryEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "institution_id", type: "uuid", nullable: true })
  institutionId?: Id | null;

  @ManyToOne(() => InstitutionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "institution_id" })
  institution?: Relation<InstitutionsEntity>;

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

  @Column({ name: "unit_feature_id", type: "uuid" })
  unitFeatureId!: Id;

  @ManyToOne(() => UnitsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "unit_feature_id" })
  unitFeature?: Relation<UnitsEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_until", type: "date", nullable: true })
  validUntil?: Date | null;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}