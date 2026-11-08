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
import { StoreEntity } from "#/modules/filesystem/entities/store.entity.ts";
import { ScanStatus } from "#/types/filesystem/scan-status.enum.ts";
import type { Dimension } from "#/types/filesystem/dimension.type.ts";
import type { ObjectKey } from "#/types/filesystem/object-key.type.ts";
import type { Seconds } from "#/types/filesystem/seconds.type.ts";
import type { ByteCount } from "#/types/shared/byte-count.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Stored Object
 */
@Entity({ schema: "filesystem", name: "objects" })
@Index("idx_object_content", ["storeId", "contentHash", "sizeBytes"], { unique: true })
@Index("idx_object_key", ["storeId", "objectKey"], { unique: true })
export class StoredObjectEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "content_hash", type: "varchar", length: 64 })
  contentHash!: Checksum;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "duration_seconds", type: "numeric", precision: 12, scale: 3, transformer: new ColumnNumericTransformer(), nullable: true })
  durationSeconds?: Seconds | null;

  @Column({ name: "format_id", type: "uuid", nullable: true })
  formatId?: Id | null;

  @Column({ name: "media_height", type: "integer", nullable: true })
  mediaHeight?: Dimension | null;

  @Column({ name: "media_width", type: "integer", nullable: true })
  mediaWidth?: Dimension | null;

  @Column({ name: "object_key", type: "varchar", length: 500 })
  objectKey!: ObjectKey;

  @Column({ name: "page_count", type: "integer", nullable: true })
  pageCount?: Dimension | null;

  @Column({ name: "scan_status", type: "enum", enum: ScanStatus })
  scanStatus!: ScanStatus;

  @Column({ name: "size_bytes", type: "bigint", transformer: new ColumnNumericTransformer() })
  sizeBytes!: ByteCount;

  @Column({ name: "store_id", type: "uuid" })
  storeId!: Id;

  @ManyToOne(() => StoreEntity)
  @JoinColumn({ name: "store_id" })
  store?: Relation<StoreEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}