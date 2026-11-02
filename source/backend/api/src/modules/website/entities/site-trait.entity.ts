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
import { RelationOwnerKind } from "#/types/website/relation-owner-kind.enum.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { TraitTag } from "#/types/website/trait-tag.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Site Trait
 */
@Entity({ schema: "website", name: "traits" })
@Index("idx_trait_owner", ["ownerKind", "ownerId"])
@Index("idx_trait_tag", ["tag"])
export class SiteTraitEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "method_id", type: "uuid", nullable: true })
  methodId?: Id | null;

  @Column({ name: "observed_at", type: "timestamptz", nullable: true })
  observedAt?: Date | null;

  @Column({ name: "owner_id", type: "uuid" })
  ownerId!: Id;

  @Column({ name: "owner_kind", type: "enum", enum: RelationOwnerKind })
  ownerKind!: RelationOwnerKind;

  @Column({ name: "score", type: "double precision", nullable: true })
  score?: Confidence | null;

  @Column({ name: "tag", type: "varchar", length: 200 })
  tag!: TraitTag;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}