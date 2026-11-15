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
import type { Name } from "#/modules/shared/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Url } from "#/modules/shared/url.type.ts";

/**
 * Website-specific identity attached to a source channel.
 */
@Entity({ schema: "source", name: "websites" })
@Index(["sourceId"], { unique: true })
@Index(["canonicalUrl"], { unique: true })
export class WebsitesEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "canonical_url", type: "varchar", length: 2048 })
  canonicalUrl!: Url;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "source_id", type: "uuid" })
  sourceId!: Id;

  @ManyToOne(() => SourcesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_id" })
  source?: Relation<SourcesEntity>;

  @Column({ name: "title", type: "varchar", length: 300 })
  title!: Name;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}