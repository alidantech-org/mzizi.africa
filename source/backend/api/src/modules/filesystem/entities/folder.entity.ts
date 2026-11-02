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
import { Visibility } from "#/types/filesystem/visibility.enum.ts";
import type { FileName } from "#/types/filesystem/file-name.type.ts";
import type { FolderPath } from "#/types/filesystem/folder-path.type.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Folder
 */
@Entity({ schema: "filesystem", name: "folders" })
@Index("idx_folder_path", ["path"], { unique: true })
@Index("idx_folder_parent", ["parentId"])
export class FolderEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "depth", type: "integer" })
  depth!: Count;

  @Column({ name: "name", type: "varchar", length: 255 })
  name!: FileName;

  @Column({ name: "parent_id", type: "uuid", nullable: true })
  parentId?: Id | null;

  @Column({ name: "path", type: "varchar", length: 1000 })
  path!: FolderPath;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;

  @Column({ name: "visibility", type: "enum", enum: Visibility })
  visibility!: Visibility;
}