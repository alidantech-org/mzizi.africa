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
import { ValueEntity } from "#/modules/reference/entities/value.entity.ts";
import { ValueRelationKind } from "#/modules/reference/value-relation-kind.enum.ts";
import type { Id } from "#/modules/shared/id.type.ts";

/**
 * Proposed directed, typed, time-aware relation between classification values; supports multi-parent and cross-scheme taxonomy.
 */
@Entity({ schema: "reference", name: "value_relations" })
@Index(["sourceValueId", "relationKind", "validFrom"])
@Index(["targetValueId", "relationKind"])
@Check("chk_value_relation_value_relation_must_not_be_self_referential", `source_value_id <> target_value_id`)
@Check("chk_value_relation_value_relation_window_must_be_ordered", `valid_from = null OR valid_until = null OR valid_from < valid_until`)
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

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_until", type: "date", nullable: true })
  validUntil?: Date | null;
}