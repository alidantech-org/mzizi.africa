import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";

import { ColumnNumericTransformer } from "#/modules/common/entities/base/column-numeric.transformer.ts";
import { LaunchStage } from "#/types/website/launch-stage.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { JsonText } from "#/types/website/json-text.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Dossier
 */
@Entity({ schema: "website", name: "dossiers" })
@Index("idx_dossier_jurisdiction_current", ["jurisdictionId", "isCurrent"])
export class DossierEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "applicable_laws", type: "text" })
  applicableLaws!: JsonText;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "jurisdiction_id", type: "uuid" })
  jurisdictionId!: Id;

  @Column({ name: "launch_stage", type: "enum", enum: LaunchStage })
  launchStage!: LaunchStage;

  @Column({ name: "legislation_repository_url", type: "varchar", length: 1000, nullable: true })
  legislationRepositoryUrl?: Url | null;

  @Column({ name: "open_questions", type: "text", nullable: true })
  openQuestions?: LongText | null;

  @Column({ name: "regulator", type: "varchar", length: 300, nullable: true })
  regulator?: Name | null;

  @Column({ name: "review_due_at", type: "timestamptz", nullable: true })
  reviewDueAt?: Date | null;

  @Column({ name: "reviewed_at", type: "timestamptz", nullable: true })
  reviewedAt?: Date | null;

  @Column({ name: "reviewer_id", type: "uuid", nullable: true })
  reviewerId?: Id | null;

  @Column({ name: "supersedes_id", type: "uuid", nullable: true })
  supersedesId?: Id | null;

  @Column({ name: "treaty_status", type: "text", nullable: true })
  treatyStatus?: JsonText | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}