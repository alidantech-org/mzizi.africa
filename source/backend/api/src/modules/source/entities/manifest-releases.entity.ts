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
import { ManifestsEntity } from "#/modules/source/entities/manifests.entity.ts";
import { ReleaseStatus } from "#/modules/source/release-status.enum.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { JsonText } from "#/modules/shared/json-text.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/non-empty-string100.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/sha256.type.ts";

/**
 * Pinned approved manifest content; schema and capabilities are immutable release inputs.
 */
@Entity({ schema: "source", name: "manifest_releases" })
@Index(["manifestId", "releaseLabel"], { unique: true })
@Index(["fileVersionId"])
@Check("chk_manifest_releases_effective_window_is_ordered", `effective_from = null OR effective_until = null OR effective_from < effective_until`)
export class ManifestReleasesEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "approved_at", type: "timestamptz" })
  approvedAt!: Date;

  @Column({ name: "approved_by_snapshot", type: "text" })
  approvedBySnapshot!: JsonText;

  @Column({ name: "content_hash", type: "char", length: 64 })
  contentHash!: Sha256;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "effective_from", type: "timestamptz" })
  effectiveFrom!: Date;

  @Column({ name: "effective_until", type: "timestamptz", nullable: true })
  effectiveUntil?: Date | null;

  @Column({ name: "file_version_id", type: "uuid" })
  fileVersionId!: Id;

  @ManyToOne(() => FileVersionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "file_version_id" })
  fileVersion?: Relation<FileVersionsEntity>;

  @Column({ name: "input_schema_code", type: "varchar", length: 255 })
  inputSchemaCode!: IdentityCode;

  @Column({ name: "input_schema_version", type: "varchar", length: 100 })
  inputSchemaVersion!: NonEmptyString100;

  @Column({ name: "manifest_id", type: "uuid" })
  manifestId!: Id;

  @ManyToOne(() => ManifestsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "manifest_id" })
  manifest?: Relation<ManifestsEntity>;

  @Column({ name: "release_label", type: "varchar", length: 100 })
  releaseLabel!: NonEmptyString100;

  @Column({ name: "required_capabilities", type: "text" })
  requiredCapabilities!: JsonText;

  @Column({ name: "status", type: "enum", enum: ReleaseStatus })
  status!: ReleaseStatus;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}