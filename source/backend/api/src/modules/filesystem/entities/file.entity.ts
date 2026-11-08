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
import { FolderEntity } from "#/modules/filesystem/entities/folder.entity.ts";
import { FileStatus } from "#/types/filesystem/file-status.enum.ts";
import { Visibility } from "#/types/filesystem/visibility.enum.ts";
import type { FileName } from "#/types/filesystem/file-name.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * File
 */
@Entity({ schema: "filesystem", name: "files" })
@Index("idx_file_folder_name", ["folderId", "name"])
@Index("idx_file_status", ["status", "visibility"])
export class FileEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "current_version_id", type: "uuid", nullable: true })
  currentVersionId?: Id | null;

  @Column({ name: "folder_id", type: "uuid" })
  folderId!: Id;

  @ManyToOne(() => FolderEntity)
  @JoinColumn({ name: "folder_id" })
  folder?: Relation<FolderEntity>;

  @Column({ name: "is_legal_hold", type: "boolean" })
  isLegalHold!: Flag;

  @Column({ name: "name", type: "varchar", length: 255 })
  name!: FileName;

  @Column({ name: "owner_account_id", type: "uuid", nullable: true })
  ownerAccountId?: Id | null;

  @Column({ name: "status", type: "enum", enum: FileStatus })
  status!: FileStatus;

  @Column({ name: "trashed_at", type: "timestamptz", nullable: true })
  trashedAt?: Date | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;

  @Column({ name: "visibility", type: "enum", enum: Visibility })
  visibility!: Visibility;
}