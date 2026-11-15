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

import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/type/positive-integer.type.ts";

/**
 * Cross-domain discovery topic hierarchy; topics do not own domain records.
 */
@Entity({ schema: "reference", name: "topics" })
@Index(["code"], { unique: true })
@Index(["parentId"])
@Check("chk_topic_topic_does_not_parent_itself", `id <> parent_id`)
export class TopicEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "label", type: "varchar", length: 300 })
  label!: Name;

  @Column({ name: "parent_id", type: "uuid", nullable: true })
  parentId?: Id | null;

  @ManyToOne(() => TopicEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "parent_id" })
  parent?: Relation<TopicEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}