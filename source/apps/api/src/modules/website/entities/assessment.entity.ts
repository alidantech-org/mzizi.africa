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
import { SiteEntity } from "#/modules/website/entities/site.entity.ts";
import { AccessBasis } from "#/types/website/access-basis.enum.ts";
import { AssessmentSourceType } from "#/types/website/assessment-source-type.enum.ts";
import { LegalReviewStatus } from "#/types/website/legal-review-status.enum.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { JsonText } from "#/types/website/json-text.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Assessment
 */
@Entity({ schema: "website", name: "assessments" })
@Index("idx_assessment_site_current", ["siteId", "isCurrent"])
export class AssessmentEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "access_basis", type: "enum", enum: AccessBasis })
  accessBasis!: AccessBasis;

  @Column({ name: "access_conditions", type: "text", nullable: true })
  accessConditions?: LongText | null;

  @Column({ name: "approved_scope", type: "text" })
  approvedScope!: JsonText;

  @Column({ name: "conditions", type: "text", nullable: true })
  conditions?: JsonText | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "evidence", type: "text", nullable: true })
  evidence?: JsonText | null;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "jurisdiction_id", type: "uuid", nullable: true })
  jurisdictionId?: Id | null;

  @Column({ name: "lawful_basis", type: "varchar", length: 4000, nullable: true })
  lawfulBasis?: Description | null;

  @Column({ name: "licence_name", type: "varchar", length: 300, nullable: true })
  licenceName?: Name | null;

  @Column({ name: "licence_url", type: "varchar", length: 1000, nullable: true })
  licenceUrl?: Url | null;

  @Column({ name: "licence_version", type: "varchar", length: 300, nullable: true })
  licenceVersion?: Label | null;

  @Column({ name: "personal_data_categories", type: "text" })
  personalDataCategories!: JsonText;

  @Column({ name: "processing_purpose", type: "varchar", length: 4000, nullable: true })
  processingPurpose?: Description | null;

  @Column({ name: "rationale", type: "text", nullable: true })
  rationale?: LongText | null;

  @Column({ name: "review_due_at", type: "timestamptz", nullable: true })
  reviewDueAt?: Date | null;

  @Column({ name: "reviewed_at", type: "timestamptz", nullable: true })
  reviewedAt?: Date | null;

  @Column({ name: "reviewed_by", type: "uuid", nullable: true })
  reviewedBy?: Id | null;

  @Column({ name: "rights_holder", type: "varchar", length: 300 })
  rightsHolder!: Name;

  @Column({ name: "site_id", type: "uuid" })
  siteId!: Id;

  @ManyToOne(() => SiteEntity)
  @JoinColumn({ name: "site_id" })
  site?: Relation<SiteEntity>;

  @Column({ name: "source_type", type: "enum", enum: AssessmentSourceType })
  sourceType!: AssessmentSourceType;

  @Column({ name: "status", type: "enum", enum: LegalReviewStatus })
  status!: LegalReviewStatus;

  @Column({ name: "supersedes_id", type: "uuid", nullable: true })
  supersedesId?: Id | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}