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
import { StructureFileRole } from "#/types/website/structure-file-role.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { BundlePath } from "#/types/website/bundle-path.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Structure File
 */
@Entity({ schema: "website", name: "structure_files" })
@Index("idx_structurefile_version_path", ["versionId", "path"], { unique: true })
export class StructureFileEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "file_version_id", type: "uuid" })
  fileVersionId!: Id;

  @Column({ name: "path", type: "varchar", length: 500 })
  path!: BundlePath;

  @Column({ name: "role", type: "enum", enum: StructureFileRole })
  role!: StructureFileRole;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;

  @Column({ name: "version_id", type: "uuid" })
  versionId!: Id;
}