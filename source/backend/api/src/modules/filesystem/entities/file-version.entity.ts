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
import { FileEntity } from "#/modules/filesystem/entities/file.entity.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * File Version
 */
@Entity({ schema: "filesystem", name: "versions" })
@Index("idx_version_file_number", ["fileId", "versionNumber"], { unique: true })
@Index("idx_version_object", ["objectId"])
export class FileVersionEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "file_id", type: "uuid" })
  fileId!: Id;

  @ManyToOne(() => FileEntity)
  @JoinColumn({ name: "file_id" })
  file?: Relation<FileEntity>;

  @Column({ name: "note", type: "varchar", length: 4000, nullable: true })
  note?: Description | null;

  @Column({ name: "object_id", type: "uuid" })
  objectId!: Id;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "uploaded_by", type: "uuid", nullable: true })
  uploadedBy?: Id | null;

  @Column({ name: "version", type: "integer" })
  version!: Version;

  @Column({ name: "version_number", type: "integer" })
  versionNumber!: Version;
}