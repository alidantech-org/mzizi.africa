import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { FileVersionsEntity } from "#/modules/filesystem/entities/file-versions.entity.ts";
import { DocumentsEntity } from "#/modules/source/entities/documents.entity.ts";
import { ManifestReleasesEntity } from "#/modules/source/entities/manifest-releases.entity.ts";
import { SourcesEntity } from "#/modules/source/entities/sources.entity.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { JsonText } from "#/modules/shared/json-text.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/sha256.type.ts";
import type { Url } from "#/modules/shared/url.type.ts";

/**
 * Immutable accepted retrieval snapshot with exact bytes; failed requests remain in Operations.
 */
@Entity({ schema: "source", name: "captures" })
@Index(["sourceId"])
@Index(["documentId"])
@Index(["fileVersionId"])
@Index(["manifestReleaseId"])
export class CapturesEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "content_hash", type: "char", length: 64 })
  contentHash!: Sha256;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "document_id", type: "uuid", nullable: true })
  documentId?: Id | null;

  @ManyToOne(() => DocumentsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "document_id" })
  document?: Relation<DocumentsEntity>;

  @Column({ name: "file_version_id", type: "uuid" })
  fileVersionId!: Id;

  @ManyToOne(() => FileVersionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "file_version_id" })
  fileVersion?: Relation<FileVersionsEntity>;

  @Column({ name: "manifest_release_id", type: "uuid", nullable: true })
  manifestReleaseId?: Id | null;

  @ManyToOne(() => ManifestReleasesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "manifest_release_id" })
  manifestRelease?: Relation<ManifestReleasesEntity>;

  @Column({ name: "response_metadata", type: "text" })
  responseMetadata!: JsonText;

  @Column({ name: "retrieved_at", type: "timestamptz" })
  retrievedAt!: Date;

  @Column({ name: "retrieved_url", type: "varchar", length: 2048 })
  retrievedUrl!: Url;

  @Column({ name: "source_id", type: "uuid" })
  sourceId!: Id;

  @ManyToOne(() => SourcesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_id" })
  source?: Relation<SourcesEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}