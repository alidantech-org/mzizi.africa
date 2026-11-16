import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { DocumentsEntity } from "#/modules/source/schema/entities/documents.entity.ts";
import { ManifestReleasesEntity } from "#/modules/source/schema/entities/manifest-releases.entity.ts";
import { PathsEntity } from "#/modules/source/schema/entities/paths.entity.ts";
import { SourcesEntity } from "#/modules/source/schema/entities/sources.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { JsonText } from "#/modules/shared/schema/type/json-text.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Url } from "#/modules/shared/schema/type/url.type.ts";

/**
 * One retrieval of a path by a source: when, from which link, with what response. The content is a document, shared by every capture of the same bytes; failed requests remain in Operations.
 */
@Entity({ schema: "source", name: "captures" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["sourceId"])
@Index(["pathId"])
@Index(["documentId"])
@Index(["manifestReleaseId"])
export class CapturesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "document_id", type: "uuid", nullable: true })
  documentId?: Id | null;

  @ManyToOne(() => DocumentsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "document_id" })
  document?: Relation<DocumentsEntity>;

  @Column({ name: "manifest_release_id", type: "uuid", nullable: true })
  manifestReleaseId?: Id | null;

  @ManyToOne(() => ManifestReleasesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "manifest_release_id" })
  manifestRelease?: Relation<ManifestReleasesEntity>;

  @Column({ name: "original_url", type: "varchar", length: 2048 })
  originalUrl!: Url;

  @Column({ name: "path_id", type: "uuid", nullable: true })
  pathId?: Id | null;

  @ManyToOne(() => PathsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "path_id" })
  path?: Relation<PathsEntity>;

  @Column({ name: "response_metadata", type: "text" })
  responseMetadata!: JsonText;

  @Column({ name: "retrieved_at", type: "timestamptz" })
  retrievedAt!: Date;

  @Column({
    name: "retrieved_url",
    type: "varchar",
    length: 2048,
    nullable: true,
  })
  retrievedUrl?: Url | null;

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
