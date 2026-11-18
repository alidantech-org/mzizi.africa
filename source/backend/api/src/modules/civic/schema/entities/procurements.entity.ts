import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { ProjectsEntity } from "#/modules/civic/schema/entities/projects.entity.ts";
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { CountryEntity } from "#/modules/reference/schema/entities/country.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One public procurement process run by a buyer, optionally linked to a project.
 */
@Entity({ schema: "civic", name: "procurements" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["buyerEntityId"])
@Index(["sourceCitationId"])
export class ProcurementsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "awarded_on", type: "date", nullable: true })
  awardedOn?: Date | null;

  @Column({ name: "buyer_entity_id", type: "uuid" })
  buyerEntityId!: Id;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "buyer_entity_id" })
  buyerEntity?: Relation<EntitiesEntity>;

  @Column({ name: "category_id", type: "uuid", nullable: true })
  categoryId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "category_id" })
  category?: Relation<ValueEntity>;

  @Column({ name: "closes_on", type: "date", nullable: true })
  closesOn?: Date | null;

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

  @Column({ name: "nature_id", type: "uuid", nullable: true })
  natureId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "nature_id" })
  nature?: Relation<ValueEntity>;

  @Column({ name: "procedure_kind_id", type: "uuid" })
  procedureKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "procedure_kind_id" })
  procedureKind?: Relation<ValueEntity>;

  @Column({ name: "project_id", type: "uuid", nullable: true })
  projectId?: Id | null;

  @ManyToOne(() => ProjectsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "project_id" })
  project?: Relation<ProjectsEntity>;

  @Column({ name: "published_on", type: "date", nullable: true })
  publishedOn?: Date | null;

  @Column({ name: "reference", type: "varchar", length: 300, nullable: true })
  reference?: Name | null;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "status_id", type: "uuid", nullable: true })
  statusId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "status_id" })
  status?: Relation<ValueEntity>;

  @Column({ name: "title", type: "varchar", length: 300, nullable: true })
  title?: Name | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
