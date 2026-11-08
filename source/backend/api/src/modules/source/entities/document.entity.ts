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
import { PublisherEntity } from "#/modules/source/entities/publisher.entity.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Citation } from "#/types/source/citation.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Document
 */
@Entity({ schema: "source", name: "documents" })
@Index("idx_document_publisher", ["publisherId"])
@Index("idx_document_published", ["publishedOn"])
export class DocumentEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "citation", type: "varchar", length: 1000, nullable: true })
  citation?: Citation | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "jurisdiction_id", type: "uuid", nullable: true })
  jurisdictionId?: Id | null;

  @Column({ name: "kind_id", type: "uuid" })
  kindId!: Id;

  @Column({ name: "language", type: "varchar", length: 300, nullable: true })
  language?: Label | null;

  @Column({ name: "licence", type: "varchar", length: 300, nullable: true })
  licence?: Name | null;

  @Column({ name: "published_on", type: "date", nullable: true })
  publishedOn?: Date | null;

  @Column({ name: "published_on_precision", type: "enum", enum: DatePrecision, nullable: true })
  publishedOnPrecision?: DatePrecision | null;

  @Column({ name: "publisher_id", type: "uuid" })
  publisherId!: Id;

  @ManyToOne(() => PublisherEntity)
  @JoinColumn({ name: "publisher_id" })
  publisher?: Relation<PublisherEntity>;

  @Column({ name: "site_id", type: "uuid", nullable: true })
  siteId?: Id | null;

  @Column({ name: "title", type: "varchar", length: 300 })
  title!: Name;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "url", type: "varchar", length: 1000, nullable: true })
  url?: Url | null;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}