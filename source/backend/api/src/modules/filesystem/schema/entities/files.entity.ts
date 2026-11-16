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
import { FoldersEntity } from "#/modules/filesystem/schema/entities/folders.entity.ts";
import { Retention } from "#/modules/filesystem/schema/enum/retention.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Stable logical file identity; equal content hashes may belong to different files.
 */
@Entity({ schema: "filesystem", name: "files" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["folderId"])
@Index(["currentVersionId"])
export class FilesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "current_version_id", type: "uuid", nullable: true })
  currentVersionId?: Id | null;

  @ManyToOne(() => FileVersionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "current_version_id" })
  currentVersion?: Relation<FileVersionsEntity>;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "folder_id", type: "uuid" })
  folderId!: Id;

  @ManyToOne(() => FoldersEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "folder_id" })
  folder?: Relation<FoldersEntity>;

  @Column({ name: "name", type: "varchar", length: 300 })
  name!: Name;

  @Column({ name: "retention", type: "enum", enum: Retention })
  retention!: Retention;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
