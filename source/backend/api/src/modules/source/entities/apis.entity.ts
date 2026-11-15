import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { SourcesEntity } from "#/modules/source/entities/sources.entity.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Url } from "#/modules/shared/url.type.ts";

/**
 * API channel with named credential binding only; request behavior is pinned in manifest releases.
 */
@Entity({ schema: "source", name: "apis" })
@Index(["sourceId"], { unique: true })
export class ApisEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "base_url", type: "varchar", length: 2048 })
  baseUrl!: Url;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "credential_binding", type: "varchar", length: 255, nullable: true })
  credentialBinding?: NonEmptyString255 | null;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

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