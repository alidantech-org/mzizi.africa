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
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One provider's service provision at a physical place or geographic coverage unit during a service period.
 */
@Entity({ schema: "civic", name: "services" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["providerEntityId"])
@Index(["responsibleInstitutionId"])
@Index(["placeFeatureId"])
@Index(["scopeUnitFeatureId"])
@Index(["sourceCitationId"])
@Check(
  "chk_services_has_place_or_coverage",
  `place_feature_id <> null OR scope_unit_feature_id <> null`,
)
@Check(
  "chk_services_service_dates_are_ordered",
  `starts_on = null OR ends_on = null OR starts_on <= ends_on`,
)
export class ServicesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "description", type: "varchar", length: 4000 })
  description!: Description;

  @Column({ name: "ends_on", type: "date", nullable: true })
  endsOn?: Date | null;

  @Column({ name: "name", type: "varchar", length: 300 })
  name!: Name;

  @Column({ name: "place_feature_id", type: "uuid", nullable: true })
  placeFeatureId?: Id | null;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "place_feature_id" })
  placeFeature?: Relation<FeaturesEntity>;

  @Column({ name: "provider_entity_id", type: "uuid" })
  providerEntityId!: Id;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "provider_entity_id" })
  providerEntity?: Relation<EntitiesEntity>;

  @Column({ name: "responsible_institution_id", type: "uuid", nullable: true })
  responsibleInstitutionId?: Id | null;

  @ManyToOne(() => InstitutionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "responsible_institution_id" })
  responsibleInstitution?: Relation<InstitutionsEntity>;

  @Column({ name: "scope_unit_feature_id", type: "uuid", nullable: true })
  scopeUnitFeatureId?: Id | null;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "scope_unit_feature_id" })
  scopeUnitFeature?: Relation<FeaturesEntity>;

  @Column({ name: "service_kind_id", type: "uuid" })
  serviceKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "service_kind_id" })
  serviceKind?: Relation<ValueEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "starts_on", type: "date", nullable: true })
  startsOn?: Date | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
