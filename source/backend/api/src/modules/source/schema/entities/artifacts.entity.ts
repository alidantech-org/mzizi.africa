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
import { FileVersionsEntity } from "#/modules/filesystem/schema/entities/file-versions.entity.ts";
import { SourceEditionsEntity } from "#/modules/source/schema/entities/editions.entity.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { NonNegativeInt64 } from "#/modules/shared/schema/type/non-negative-int64.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/schema/type/sha256.type.ts";

/**
 * One exact representation of an edition, tied to immutable bytes. Identical downloads from many sources are one artifact with many captures.
 */
@Entity({ schema: "source", name: "artifacts" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["editionId", "sha256"], { unique: true })
@Index(["sha256"])
@Index(["fileVersionId"])
@Index(["parentId"])
export class ArtifactsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({
    name: "content_type",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  contentType?: NonEmptyString255 | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({
    name: "description",
    type: "varchar",
    length: 4000,
    nullable: true,
  })
  description?: Description | null;

  @Column({ name: "edition_id", type: "uuid" })
  editionId!: Id;

  @ManyToOne(() => SourceEditionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "edition_id" })
  edition?: Relation<SourceEditionsEntity>;

  @Column({ name: "file_version_id", type: "uuid", nullable: true })
  fileVersionId?: Id | null;

  @ManyToOne(() => FileVersionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "file_version_id" })
  fileVersion?: Relation<FileVersionsEntity>;

  @Column({ name: "format", type: "varchar", length: 100, nullable: true })
  format?: NonEmptyString100 | null;

  @Column({ name: "location", type: "varchar", length: 1000, nullable: true })
  location?: NonEmptyString1000 | null;

  @Column({ name: "parent_id", type: "uuid", nullable: true })
  parentId?: Id | null;

  @ManyToOne(() => ArtifactsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "parent_id" })
  parent?: Relation<ArtifactsEntity>;

  @Column({ name: "sha256", type: "char", length: 64 })
  sha256!: Sha256;

  @Column({
    name: "size_bytes",
    type: "bigint",
    transformer: new ColumnNumericTransformer(),
    nullable: true,
  })
  sizeBytes?: NonNegativeInt64 | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
