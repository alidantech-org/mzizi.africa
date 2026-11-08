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
import type { AttachmentRole } from "#/types/filesystem/attachment-role.type.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * File Attachment
 */
@Entity({ schema: "filesystem", name: "attachments" })
@Index("idx_attachment_target", ["targetKind", "targetId", "role"])
@Index("idx_attachment_file", ["fileId"])
export class FileAttachmentEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "file_id", type: "uuid" })
  fileId!: Id;

  @ManyToOne(() => FileEntity)
  @JoinColumn({ name: "file_id" })
  file?: Relation<FileEntity>;

  @Column({ name: "position", type: "integer" })
  position!: Count;

  @Column({ name: "role", type: "varchar", length: 100 })
  role!: AttachmentRole;

  @Column({ name: "target_id", type: "uuid" })
  targetId!: Id;

  @Column({ name: "target_kind", type: "varchar", length: 100 })
  targetKind!: TargetKind;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}