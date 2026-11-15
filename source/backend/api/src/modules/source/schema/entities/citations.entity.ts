import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { FileVersionsEntity } from "#/modules/filesystem/schema/entities/file-versions.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CapturesEntity } from "#/modules/source/schema/entities/captures.entity.ts";
import { DocumentsEntity } from "#/modules/source/schema/entities/documents.entity.ts";
import { EvidenceEntity } from "#/modules/source/schema/entities/evidence.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { JsonText } from "#/modules/shared/schema/type/json-text.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/schema/type/sha256.type.ts";

/**
 * Exact locator in immutable bytes: PDF page/paragraph, JSON path, CSV row/column, region, timestamp or dataset record.
 */
@Entity({ schema: "source", name: "citations" })
@Index(["evidenceId"])
@Index(["documentId"])
@Index(["captureId"])
@Index(["fileVersionId"])
@Index(["locatorKindId"])
export class CitationsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "capture_id", type: "uuid", nullable: true })
  captureId?: Id | null;

  @ManyToOne(() => CapturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "capture_id" })
  capture?: Relation<CapturesEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "document_id", type: "uuid", nullable: true })
  documentId?: Id | null;

  @ManyToOne(() => DocumentsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "document_id" })
  document?: Relation<DocumentsEntity>;

  @Column({ name: "evidence_id", type: "uuid" })
  evidenceId!: Id;

  @ManyToOne(() => EvidenceEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "evidence_id" })
  evidence?: Relation<EvidenceEntity>;

  @Column({ name: "file_version_id", type: "uuid" })
  fileVersionId!: Id;

  @ManyToOne(() => FileVersionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "file_version_id" })
  fileVersion?: Relation<FileVersionsEntity>;

  @Column({ name: "locator", type: "text" })
  locator!: JsonText;

  @Column({ name: "locator_kind_id", type: "uuid" })
  locatorKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "locator_kind_id" })
  locatorKind?: Relation<ValueEntity>;

  @Column({ name: "quoted_hash", type: "char", length: 64, nullable: true })
  quotedHash?: Sha256 | null;

  @Column({ name: "recorded_at", type: "timestamptz" })
  recordedAt!: Date;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
