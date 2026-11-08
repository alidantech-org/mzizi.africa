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
import { MembershipBasis } from "#/types/website/membership-basis.enum.ts";
import { RelationOwnerKind } from "#/types/website/relation-owner-kind.enum.ts";
import { SiteRelationKind } from "#/types/website/site-relation-kind.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Score } from "#/types/website/score.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Site Relation
 */
@Entity({ schema: "website", name: "relations" })
@Index("idx_relation_from", ["fromKind", "fromId"])
@Index("idx_relation_to", ["toKind", "toId"])
export class SiteRelationEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "basis", type: "enum", enum: MembershipBasis })
  basis!: MembershipBasis;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "evidence", type: "text", nullable: true })
  evidence?: LongText | null;

  @Column({ name: "from_id", type: "uuid" })
  fromId!: Id;

  @Column({ name: "from_kind", type: "enum", enum: RelationOwnerKind })
  fromKind!: RelationOwnerKind;

  @Column({ name: "relation", type: "enum", enum: SiteRelationKind })
  relation!: SiteRelationKind;

  @Column({ name: "score", type: "numeric", precision: 7, scale: 4, transformer: new ColumnNumericTransformer(), nullable: true })
  score?: Score | null;

  @Column({ name: "to_id", type: "uuid" })
  toId!: Id;

  @Column({ name: "to_kind", type: "enum", enum: RelationOwnerKind })
  toKind!: RelationOwnerKind;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}