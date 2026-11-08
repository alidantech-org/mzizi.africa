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
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Comment
 */
@Entity({ schema: "audit", name: "comments" })
@Index("idx_comment_target", ["targetKind", "targetId"])
export class CommentEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "actor_id", type: "uuid" })
  actorId!: Id;

  @Column({ name: "body", type: "text" })
  body!: LongText;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "parent_comment_id", type: "uuid", nullable: true })
  parentCommentId?: Id | null;

  @Column({ name: "target_id", type: "uuid" })
  targetId!: Id;

  @Column({ name: "target_kind", type: "varchar", length: 100 })
  targetKind!: TargetKind;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}