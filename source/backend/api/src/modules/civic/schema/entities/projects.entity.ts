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
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One public development or infrastructure project with responsible institution, status, geographic scope and evidence.
 */
@Entity({ schema: "civic", name: "projects" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["statusId"])
@Index(["responsibleInstitutionId"])
@Index(["scopeUnitFeatureId"])
@Index(["sourceCitationId"])
@Check(
  "chk_projects_project_dates_are_ordered",
  `started_on = null OR completed_on = null OR started_on <= completed_on`,
)
export class ProjectsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "completed_on", type: "date", nullable: true })
  completedOn?: Date | null;

  @Column({ name: "country_id", type: "uuid", nullable: true })
  countryId?: Id | null;

  @ManyToOne(() => CountryEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "country_id" })
  country?: Relation<CountryEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "description", type: "varchar", length: 4000 })
  description!: Description;

  @Column({ name: "implementing_entity_id", type: "uuid", nullable: true })
  implementingEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "implementing_entity_id" })
  implementingEntity?: Relation<EntitiesEntity>;

  @Column({
    name: "location",
    type: "geometry",
    spatialFeatureType: "Point",
    srid: 4326,
    nullable: true,
  })
  location?: import("typeorm").Geometry | null;

  @Column({ name: "name", type: "varchar", length: 300 })
  name!: Name;

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

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "sponsor_entity_id", type: "uuid", nullable: true })
  sponsorEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "sponsor_entity_id" })
  sponsorEntity?: Relation<EntitiesEntity>;

  @Column({ name: "started_on", type: "date", nullable: true })
  startedOn?: Date | null;

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
