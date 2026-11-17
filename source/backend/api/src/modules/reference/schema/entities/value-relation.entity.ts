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

import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { ValueRelationKind } from "#/modules/reference/schema/enum/value-relation-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * A directed, typed, relation between classification values; supports multi-parent and cross-scheme taxonomy, such as a regional label that maps to a broader global kind.
 */
@Entity({ schema: "reference", name: "value_relations" })
@Index(["sourceValueId", "targetValueId", "relationKind"], { unique: true })
@Index(["sourceValueId", "relationKind"])
@Index(["targetValueId", "relationKind"])
@Check(
  "chk_value_relation_value_relation_must_not_be_self_referential",
  `source_value_id <> target_value_id`,
)
export class ValueRelationEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "relation_kind", type: "enum", enum: ValueRelationKind })
  relationKind!: ValueRelationKind;

  @Column({ name: "source_value_id", type: "uuid" })
  sourceValueId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_value_id" })
  sourceValue?: Relation<ValueEntity>;

  @Column({ name: "target_value_id", type: "uuid" })
  targetValueId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "target_value_id" })
  targetValue?: Relation<ValueEntity>;
}
