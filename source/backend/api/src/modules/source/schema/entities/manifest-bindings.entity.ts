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

import { ManifestReleasesEntity } from "#/modules/source/schema/entities/manifest-releases.entity.ts";
import { SourcesEntity } from "#/modules/source/schema/entities/sources.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Dated release binding; activation never changes releases already pinned by running jobs.
 */
@Entity({ schema: "source", name: "manifest_bindings" })
@Index(["sourceId", "manifestReleaseId", "effectiveFrom"], { unique: true })
@Index(["manifestReleaseId"])
@Check("chk_manifest_bindings_effective_window_is_ordered", `effective_from = null OR effective_until = null OR effective_from < effective_until`)
export class ManifestBindingsEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "activated_at", type: "timestamptz" })
  activatedAt!: Date;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deactivated_at", type: "timestamptz", nullable: true })
  deactivatedAt?: Date | null;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "effective_from", type: "timestamptz" })
  effectiveFrom!: Date;

  @Column({ name: "effective_until", type: "timestamptz", nullable: true })
  effectiveUntil?: Date | null;

  @Column({ name: "manifest_release_id", type: "uuid" })
  manifestReleaseId!: Id;

  @ManyToOne(() => ManifestReleasesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "manifest_release_id" })
  manifestRelease?: Relation<ManifestReleasesEntity>;

  @Column({ name: "source_id", type: "uuid" })
  sourceId!: Id;

  @ManyToOne(() => SourcesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_id" })
  source?: Relation<SourcesEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}