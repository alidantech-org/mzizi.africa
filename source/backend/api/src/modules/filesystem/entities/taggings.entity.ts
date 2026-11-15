import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { FilesEntity } from "#/modules/filesystem/entities/files.entity.ts";
import { FoldersEntity } from "#/modules/filesystem/entities/folders.entity.ts";
import { TagsEntity } from "#/modules/filesystem/entities/tags.entity.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";

/**
 * One tag assignment to exactly one typed file or folder target.
 */
@Entity({ schema: "filesystem", name: "taggings" })
@Index(["tagId", "fileId"], { unique: true })
@Index(["tagId", "folderId"], { unique: true })
@Index(["fileId"])
@Index(["folderId"])
// Invariant "ExactlyOneTarget" has no simple form, so it isn't enforced as a database check.
export class TaggingsEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "file_id", type: "uuid", nullable: true })
  fileId?: Id | null;

  @ManyToOne(() => FilesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "file_id" })
  file?: Relation<FilesEntity>;

  @Column({ name: "folder_id", type: "uuid", nullable: true })
  folderId?: Id | null;

  @ManyToOne(() => FoldersEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "folder_id" })
  folder?: Relation<FoldersEntity>;

  @Column({ name: "tag_id", type: "uuid" })
  tagId!: Id;

  @ManyToOne(() => TagsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "tag_id" })
  tag?: Relation<TagsEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}