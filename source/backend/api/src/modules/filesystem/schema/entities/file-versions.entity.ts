import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";

import { ColumnNumericTransformer } from "#/modules/common/schema/entities/base/column-numeric.transformer.ts";
import { FileExtensionsEntity } from "#/modules/filesystem/schema/entities/file-extensions.entity.ts";
import { FilesEntity } from "#/modules/filesystem/schema/entities/files.entity.ts";
import { Access } from "#/modules/filesystem/schema/enum/access.enum.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { JsonText } from "#/modules/shared/schema/type/json-text.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { NonNegativeInt64 } from "#/modules/shared/schema/type/non-negative-int64.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/schema/type/sha256.type.ts";

/**
 * Immutable exact bytes in the mzizi bucket; verify object hash, size and access before acceptance.
 */
@Entity({ schema: "filesystem", name: "file_versions" })
@Index(["fileId", "revision"], { unique: true })
@Index(["sha256"])
@Index(["s3Key"])
@Index(["fileExtensionId"])
export class FileVersionsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "access", type: "enum", enum: Access })
  access!: Access;

  @Column({ name: "content_type", type: "varchar", length: 255 })
  contentType!: NonEmptyString255;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "created_by_snapshot", type: "text" })
  createdBySnapshot!: JsonText;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "file_extension_id", type: "uuid", nullable: true })
  fileExtensionId?: Id | null;

  @ManyToOne(() => FileExtensionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "file_extension_id" })
  fileExtension?: Relation<FileExtensionsEntity>;

  @Column({ name: "file_id", type: "uuid" })
  fileId!: Id;

  @ManyToOne(() => FilesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "file_id" })
  file?: Relation<FilesEntity>;

  @Column({
    name: "original_filename",
    type: "varchar",
    length: 500,
    nullable: true,
  })
  originalFilename?: NonEmptyString500 | null;

  @Column({ name: "pinned", type: "boolean" })
  pinned!: Flag;

  @Column({ name: "provenance", type: "text" })
  provenance!: JsonText;

  @Column({ name: "revision", type: "integer" })
  revision!: PositiveInteger;

  @Column({ name: "s3_key", type: "varchar", length: 1000 })
  s3Key!: NonEmptyString1000;

  @Column({ name: "sha256", type: "char", length: 64 })
  sha256!: Sha256;

  @Column({
    name: "size_bytes",
    type: "bigint",
    transformer: new ColumnNumericTransformer(),
  })
  sizeBytes!: NonNegativeInt64;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "verified_at", type: "timestamptz" })
  verifiedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
