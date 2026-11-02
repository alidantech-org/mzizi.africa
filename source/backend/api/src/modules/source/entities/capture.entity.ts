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
import { DocumentEntity } from "#/modules/source/entities/document.entity.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { HttpStatus } from "#/types/source/http-status.type.ts";
import type { ToolName } from "#/types/source/tool-name.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Capture
 */
@Entity({ schema: "source", name: "captures" })
@Index("idx_capture_document", ["documentId", "retrievedAt"])
export class CaptureEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "content_hash", type: "varchar", length: 64, nullable: true })
  contentHash?: Checksum | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "document_id", type: "uuid" })
  documentId!: Id;

  @ManyToOne(() => DocumentEntity)
  @JoinColumn({ name: "document_id" })
  document?: Relation<DocumentEntity>;

  @Column({ name: "file_version_id", type: "uuid", nullable: true })
  fileVersionId?: Id | null;

  @Column({ name: "http_status", type: "integer", nullable: true })
  httpStatus?: HttpStatus | null;

  @Column({ name: "retrieved_at", type: "timestamptz" })
  retrievedAt!: Date;

  @Column({ name: "retrieved_by", type: "uuid", nullable: true })
  retrievedBy?: Id | null;

  @Column({ name: "retrieved_url", type: "varchar", length: 1000, nullable: true })
  retrievedUrl?: Url | null;

  @Column({ name: "tool", type: "varchar", length: 200, nullable: true })
  tool?: ToolName | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}