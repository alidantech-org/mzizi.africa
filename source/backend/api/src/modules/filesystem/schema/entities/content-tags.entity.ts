import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { ContentsEntity } from "#/modules/filesystem/schema/entities/contents.entity.ts";
import { TagsEntity } from "#/modules/filesystem/schema/entities/tags.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Tags a content text; a text may have several.
 */
@Entity({ schema: "filesystem", name: "content_tags" })
@Index(["contentId", "tagId"], { unique: true })
@Index(["tagId"])
export class ContentTagsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "content_id", type: "uuid" })
  contentId!: Id;

  @ManyToOne(() => ContentsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "content_id" })
  content?: Relation<ContentsEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "tag_id", type: "uuid" })
  tagId!: Id;

  @ManyToOne(() => TagsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "tag_id" })
  tag?: Relation<TagsEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
