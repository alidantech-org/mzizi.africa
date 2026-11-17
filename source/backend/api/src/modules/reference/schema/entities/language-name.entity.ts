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
import { LanguageNameKind } from "#/modules/reference/schema/enum/language-name-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A name of a language written in a language, such as Kiswahili (endonym) and Swahili (exonym).
 */
@Entity({ schema: "reference", name: "language_names" })
@Index(["languageId", "inLanguageId", "nameKind", "name"], { unique: true })
@Index(["languageId"])
@Index(["inLanguageId"])
@Check(
  "chk_language_name_validity_window_is_ordered",
  `valid_from = null OR valid_until = null OR valid_from < valid_until`,
)
export class LanguageNameEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "in_language_id", type: "uuid" })
  inLanguageId!: Id;

  @ManyToOne(() => LanguageEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "in_language_id" })
  inLanguage?: Relation<LanguageEntity>;

  @Column({ name: "language_id", type: "uuid" })
  languageId!: Id;

  @ManyToOne(() => LanguageEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "language_id" })
  language?: Relation<LanguageEntity>;

  @Column({ name: "name", type: "varchar", length: 300 })
  name!: Name;

  @Column({ name: "name_kind", type: "enum", enum: LanguageNameKind })
  nameKind!: LanguageNameKind;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_until", type: "date", nullable: true })
  validUntil?: Date | null;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
