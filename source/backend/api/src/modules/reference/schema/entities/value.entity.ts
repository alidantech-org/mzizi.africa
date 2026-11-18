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

import { SchemeEntity } from "#/modules/reference/schema/entities/scheme.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A controlled classification member within one scheme, with optional supersession and an optional broader parent value in the same scheme. Wider, cross-scheme or many-parent links use value relations.
 */
@Entity({ schema: "reference", name: "values" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["schemeId"])
@Index(["supersedesId"])
@Index(["parentId"])
@Check("chk_value_value_does_not_supersede_itself", `id <> supersedes_id`)
@Check("chk_value_value_does_not_parent_itself", `id <> parent_id`)
export class ValueEntity {
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

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "parent_id" })
  parent?: Relation<ValueEntity>;

  @Column({ name: "position", type: "integer", nullable: true })
  position?: NonNegativeInteger | null;

  @Column({ name: "scheme_id", type: "uuid" })
  schemeId!: Id;

  @ManyToOne(() => SchemeEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "scheme_id" })
  scheme?: Relation<SchemeEntity>;

  @Column({ name: "supersedes_id", type: "uuid", nullable: true })
  supersedesId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "supersedes_id" })
  supersedes?: Relation<ValueEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
