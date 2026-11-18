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
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { CountryEntity } from "#/modules/reference/schema/entities/country.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * The civic role of a geographic feature: a school, hospital, office, road, market or polling host. Size and capacity are observations on the feature; what it is and its levels are classifications; money reaches it through project links.
 */
@Entity({ schema: "civic", name: "facilities" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["featureId"], { unique: true })
@Index(["facilityClassId"])
@Index(["operatorEntityId"])
@Index(["ownerEntityId"])
@Index(["responsibleInstitutionId"])
@Index(["statusId"])
@Index(["sourceCitationId"])
@Check(
  "chk_facilities_facility_dates_are_ordered",
  `opened_on = null OR closed_on = null OR opened_on <= closed_on`,
)
export class FacilitiesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "closed_on", type: "date", nullable: true })
  closedOn?: Date | null;

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

  @Column({ name: "facility_class_id", type: "uuid" })
  facilityClassId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "facility_class_id" })
  facilityClass?: Relation<ValueEntity>;

  @Column({ name: "feature_id", type: "uuid" })
  featureId!: Id;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "feature_id" })
  feature?: Relation<FeaturesEntity>;

  @Column({ name: "opened_on", type: "date", nullable: true })
  openedOn?: Date | null;

  @Column({ name: "operator_entity_id", type: "uuid", nullable: true })
  operatorEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "operator_entity_id" })
  operatorEntity?: Relation<EntitiesEntity>;

  @Column({ name: "owner_entity_id", type: "uuid", nullable: true })
  ownerEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "owner_entity_id" })
  ownerEntity?: Relation<EntitiesEntity>;

  @Column({ name: "ownership_id", type: "uuid", nullable: true })
  ownershipId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "ownership_id" })
  ownership?: Relation<ValueEntity>;

  @Column({ name: "responsible_institution_id", type: "uuid", nullable: true })
  responsibleInstitutionId?: Id | null;

  @ManyToOne(() => InstitutionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "responsible_institution_id" })
  responsibleInstitution?: Relation<InstitutionsEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "status_id", type: "uuid" })
  statusId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "status_id" })
  status?: Relation<ValueEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
