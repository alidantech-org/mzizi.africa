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
import { LanguageEntity } from "#/modules/reference/schema/entities/language.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { ValueLabelKind } from "#/modules/reference/schema/enum/value-label-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A label of a value in one language and of one kind, so a value can be shown in English, Swahili and other languages, with alternative names, abbreviations and definitions. The value's own label is the default display text.
 */
@Entity({ schema: "reference", name: "value_labels" })
@Index(["valueId", "languageId", "labelKind", "label"], { unique: true })
@Index(["valueId"])
@Index(["languageId"])
@Check(
  "chk_value_label_validity_window_is_ordered",
  `valid_from = null OR valid_until = null OR valid_from < valid_until`,
)
export class ValueLabelEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "label", type: "varchar", length: 300 })
  label!: Name;

  @Column({ name: "label_kind", type: "enum", enum: ValueLabelKind })
  labelKind!: ValueLabelKind;

  @Column({ name: "language_id", type: "uuid" })
  languageId!: Id;

  @ManyToOne(() => LanguageEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "language_id" })
  language?: Relation<LanguageEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_until", type: "date", nullable: true })
  validUntil?: Date | null;

  @Column({ name: "value_id", type: "uuid" })
  valueId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "value_id" })
  value?: Relation<ValueEntity>;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
