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
import type { ByteCount } from "#/types/shared/byte-count.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { HttpStatus } from "#/types/website/http-status.type.ts";
import type { SectionLabel } from "#/types/website/section-label.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Document Sighting
 */
@Entity({ schema: "website", name: "document_sightings" })
@Index("idx_sighting_url_hash", ["url", "contentHash"], { unique: true })
@Index("idx_sighting_document", ["documentId"])
export class DocumentSightingEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "capture_id", type: "uuid", nullable: true })
  captureId?: Id | null;

  @Column({ name: "content_hash", type: "varchar", length: 64 })
  contentHash!: Checksum;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "depth", type: "integer" })
  depth!: Count;

  @Column({ name: "document_id", type: "uuid" })
  documentId!: Id;

  @Column({ name: "headers", type: "text", nullable: true })
  headers?: LongText | null;

  @Column({ name: "http_status", type: "integer" })
  httpStatus!: HttpStatus;

  @Column({ name: "page_url", type: "varchar", length: 1000, nullable: true })
  pageUrl?: Url | null;

  @Column({ name: "rule_index", type: "integer", nullable: true })
  ruleIndex?: Count | null;

  @Column({ name: "section_label", type: "varchar", length: 60, nullable: true })
  sectionLabel?: SectionLabel | null;

  @Column({ name: "seen_at", type: "timestamptz" })
  seenAt!: Date;

  @Column({ name: "site_id", type: "uuid" })
  siteId!: Id;

  @ManyToOne(() => SiteEntity)
  @JoinColumn({ name: "site_id" })
  site?: Relation<SiteEntity>;

  @Column({ name: "size_bytes", type: "bigint", transformer: new ColumnNumericTransformer() })
  sizeBytes!: ByteCount;

  @Column({ name: "structure_version_id", type: "uuid", nullable: true })
  structureVersionId?: Id | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "url", type: "varchar", length: 1000 })
  url!: Url;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}