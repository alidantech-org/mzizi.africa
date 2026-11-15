import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";

import { FileVersionsEntity } from "#/modules/filesystem/entities/file-versions.entity.ts";
import { ValueEntity } from "#/modules/reference/entities/value.entity.ts";
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { JsonText } from "#/modules/shared/type/json-text.type.ts";
import type { PositiveInteger } from "#/modules/shared/type/positive-integer.type.ts";

/**
 * Directed exact input-to-output lineage with a pinned processing description; originals remain immutable.
 */
@Entity({ schema: "filesystem", name: "file_relations" })
@Index(["sourceVersionId", "derivedVersionId", "kindId"], { unique: true })
@Index(["derivedVersionId"])
@Index(["kindId"])
@Check("chk_file_relations_versions_must_differ", `source_version_id <> derived_version_id`)
export class FileRelationsEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "derived_version_id", type: "uuid" })
  derivedVersionId!: Id;

  @ManyToOne(() => FileVersionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "derived_version_id" })
  derivedVersion?: Relation<FileVersionsEntity>;

  @Column({ name: "kind_id", type: "uuid" })
  kindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "kind_id" })
  kind?: Relation<ValueEntity>;

  @Column({ name: "processing_provenance", type: "text" })
  processingProvenance!: JsonText;

  @Column({ name: "source_version_id", type: "uuid" })
  sourceVersionId!: Id;

  @ManyToOne(() => FileVersionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_version_id" })
  sourceVersion?: Relation<FileVersionsEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}