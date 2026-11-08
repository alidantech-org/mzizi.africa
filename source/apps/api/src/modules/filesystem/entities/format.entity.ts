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
import { FormatCategory } from "#/types/filesystem/format-category.enum.ts";
import type { Extension } from "#/types/filesystem/extension.type.ts";
import type { MimeType } from "#/types/filesystem/mime-type.type.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { ByteCount } from "#/types/shared/byte-count.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Format
 */
@Entity({ schema: "filesystem", name: "formats" })
@Index("idx_format_code", ["code"], { unique: true })
@Index("idx_format_mime", ["mimeType"])
export class FormatEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "category", type: "enum", enum: FormatCategory })
  category!: FormatCategory;

  @Column({ name: "code", type: "varchar", length: 200 })
  code!: BusinessCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "extension", type: "varchar", length: 20 })
  extension!: Extension;

  @Column({ name: "is_previewable", type: "boolean" })
  isPreviewable!: Flag;

  @Column({ name: "max_size_bytes", type: "bigint", transformer: new ColumnNumericTransformer(), nullable: true })
  maxSizeBytes?: ByteCount | null;

  @Column({ name: "mime_type", type: "varchar", length: 200 })
  mimeType!: MimeType;

  @Column({ name: "name", type: "varchar", length: 300 })
  name!: Name;

  @Column({ name: "processing_strategy", type: "varchar", length: 300, nullable: true })
  processingStrategy?: Label | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}