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
import { SiteFamilyEntity } from "#/modules/website/entities/site-family.entity.ts";
import { DomainRole } from "#/types/website/domain-role.enum.ts";
import { PatternStatus } from "#/types/website/pattern-status.enum.ts";
import { UrlScheme } from "#/types/website/url-scheme.enum.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DomainTemplate } from "#/types/website/domain-template.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Domain Pattern
 */
@Entity({ schema: "website", name: "domain_patterns" })
@Index("idx_pattern_family", ["familyId"])
export class DomainPatternEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "domain_role", type: "enum", enum: DomainRole })
  domainRole!: DomainRole;

  @Column({ name: "family_id", type: "uuid" })
  familyId!: Id;

  @ManyToOne(() => SiteFamilyEntity)
  @JoinColumn({ name: "family_id" })
  family?: Relation<SiteFamilyEntity>;

  @Column({ name: "notes", type: "varchar", length: 4000, nullable: true })
  notes?: Description | null;

  @Column({ name: "scheme", type: "enum", enum: UrlScheme })
  scheme!: UrlScheme;

  @Column({ name: "status", type: "enum", enum: PatternStatus })
  status!: PatternStatus;

  @Column({ name: "template", type: "varchar", length: 300 })
  template!: DomainTemplate;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "variables", type: "text" })
  variables!: LongText;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}