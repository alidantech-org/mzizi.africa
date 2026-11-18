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
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One typed relationship between a Civic project and one Geography feature.
 */
@Entity({ schema: "civic", name: "project_features" })
@Index(["projectId", "featureId", "featureKindId"], { unique: true })
@Index(["featureId"])
@Index(["sourceCitationId"])
export class ProjectFeaturesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "feature_id", type: "uuid" })
  featureId!: Id;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "feature_id" })
  feature?: Relation<FeaturesEntity>;

  @Column({ name: "feature_kind_id", type: "uuid" })
  featureKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "feature_kind_id" })
  featureKind?: Relation<ValueEntity>;

  @Column({ name: "project_id", type: "uuid" })
  projectId!: Id;

  @ManyToOne(() => ProjectsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "project_id" })
  project?: Relation<ProjectsEntity>;

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
