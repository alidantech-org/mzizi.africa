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
import type { Count } from "#/types/shared/count.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { SectionLabel } from "#/types/website/section-label.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Section Visit
 */
@Entity({ schema: "website", name: "section_visits" })
@Index("idx_sectionvisit_site_section", ["siteId", "sectionLabel", "visitedAt"])
export class SectionVisitEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "depth", type: "integer" })
  depth!: Count;

  @Column({ name: "items_found", type: "integer" })
  itemsFound!: Count;

  @Column({ name: "page_url", type: "varchar", length: 1000, nullable: true })
  pageUrl?: Url | null;

  @Column({ name: "rule_index", type: "integer", nullable: true })
  ruleIndex?: Count | null;

  @Column({ name: "section_label", type: "varchar", length: 60 })
  sectionLabel!: SectionLabel;

  @Column({ name: "site_id", type: "uuid" })
  siteId!: Id;

  @ManyToOne(() => SiteEntity)
  @JoinColumn({ name: "site_id" })
  site?: Relation<SiteEntity>;

  @Column({ name: "structure_version_id", type: "uuid", nullable: true })
  structureVersionId?: Id | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;

  @Column({ name: "visited_at", type: "timestamptz" })
  visitedAt!: Date;
}