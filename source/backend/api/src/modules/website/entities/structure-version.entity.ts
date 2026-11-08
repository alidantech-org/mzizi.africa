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
import { StructureEntity } from "#/modules/website/entities/structure.entity.ts";
import { VersionStatus } from "#/types/website/version-status.enum.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { SchemaVersion } from "#/types/website/schema-version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Structure Version
 */
@Entity({ schema: "website", name: "structure_versions" })
@Index("idx_structureversion_structure", ["structureId", "number"], { unique: true })
export class StructureVersionEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "created_by", type: "uuid", nullable: true })
  createdBy?: Id | null;

  @Column({ name: "folder_id", type: "uuid", nullable: true })
  folderId?: Id | null;

  @Column({ name: "manifest_hash", type: "varchar", length: 64 })
  manifestHash!: Checksum;

  @Column({ name: "method_id", type: "uuid", nullable: true })
  methodId?: Id | null;

  @Column({ name: "notes_summary", type: "varchar", length: 4000, nullable: true })
  notesSummary?: Description | null;

  @Column({ name: "number", type: "integer" })
  number!: Version;

  @Column({ name: "schema_version", type: "varchar", length: 60 })
  schemaVersion!: SchemaVersion;

  @Column({ name: "status", type: "enum", enum: VersionStatus })
  status!: VersionStatus;

  @Column({ name: "structure_id", type: "uuid" })
  structureId!: Id;

  @ManyToOne(() => StructureEntity)
  @JoinColumn({ name: "structure_id" })
  structure?: Relation<StructureEntity>;

  @Column({ name: "supersedes_id", type: "uuid", nullable: true })
  supersedesId?: Id | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "validation_report", type: "text", nullable: true })
  validationReport?: LongText | null;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}