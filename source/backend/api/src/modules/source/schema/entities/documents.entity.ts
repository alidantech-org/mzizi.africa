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
import { PublishersEntity } from "#/modules/source/schema/entities/publishers.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/schema/type/sha256.type.ts";

/**
 * A distinct piece of content identified by its sha256. The same file fetched from many sources is one document with many captures.
 */
@Entity({ schema: "source", name: "documents" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["sha256"], { unique: true })
@Index(["publisherId"])
@Index(["kindId"])
@Index(["fileVersionId"])
@Index(["parentId"])
export class DocumentsEntity {
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

  @Column({ name: "file_version_id", type: "uuid", nullable: true })
  fileVersionId?: Id | null;

  @ManyToOne(() => FileVersionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "file_version_id" })
  fileVersion?: Relation<FileVersionsEntity>;

  @Column({ name: "kind_id", type: "uuid" })
  kindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "kind_id" })
  kind?: Relation<ValueEntity>;

  @Column({ name: "parent_id", type: "uuid", nullable: true })
  parentId?: Id | null;

  @ManyToOne(() => DocumentsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "parent_id" })
  parent?: Relation<DocumentsEntity>;

  @Column({ name: "published_on", type: "date", nullable: true })
  publishedOn?: Date | null;

  @Column({ name: "publisher_id", type: "uuid", nullable: true })
  publisherId?: Id | null;

  @ManyToOne(() => PublishersEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "publisher_id" })
  publisher?: Relation<PublishersEntity>;

  @Column({ name: "sha256", type: "char", length: 64 })
  sha256!: Sha256;

  @Column({ name: "size_bytes", type: "integer", nullable: true })
  sizeBytes?: PositiveInteger | null;

  @Column({ name: "title", type: "varchar", length: 300 })
  title!: Name;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
