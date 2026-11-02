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
import { UploadState } from "#/types/filesystem/upload-state.enum.ts";
import type { FileName } from "#/types/filesystem/file-name.type.ts";
import type { ByteCount } from "#/types/shared/byte-count.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Upload Session
 */
@Entity({ schema: "filesystem", name: "uploads" })
@Index("idx_upload_state", ["state", "expiresAt"])
export class UploadSessionEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "completed_file_id", type: "uuid", nullable: true })
  completedFileId?: Id | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "expected_hash", type: "varchar", length: 64, nullable: true })
  expectedHash?: Checksum | null;

  @Column({ name: "expected_size_bytes", type: "bigint", transformer: new ColumnNumericTransformer() })
  expectedSizeBytes!: ByteCount;

  @Column({ name: "expires_at", type: "timestamptz" })
  expiresAt!: Date;

  @Column({ name: "file_name", type: "varchar", length: 255 })
  fileName!: FileName;

  @Column({ name: "folder_id", type: "uuid" })
  folderId!: Id;

  @Column({ name: "requested_by", type: "uuid", nullable: true })
  requestedBy?: Id | null;

  @Column({ name: "state", type: "enum", enum: UploadState })
  state!: UploadState;

  @Column({ name: "store_id", type: "uuid" })
  storeId!: Id;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}