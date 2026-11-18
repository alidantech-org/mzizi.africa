import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { WordingsEntity } from "#/modules/legal/schema/entities/wordings.entity.ts";
import { LanguageEntity } from "#/modules/reference/schema/entities/language.entity.ts";
import { ReviewStatus } from "#/modules/legal/schema/enum/review-status.enum.ts";
import { TranslationMethod } from "#/modules/legal/schema/enum/translation-method.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { JsonText } from "#/modules/shared/schema/type/json-text.type.ts";
import type { NonEmptyString } from "#/modules/shared/schema/type/non-empty-string.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A translated representation of one exact wording. Several translations into one language are valid; review never makes a translation legal authority.
 */
@Entity({ schema: "legal", name: "translations" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["id", "wordingId"], { unique: true })
@Index(["wordingId"])
@Index(["languageId"])
export class TranslationsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "language_id", type: "uuid" })
  languageId!: Id;

  @ManyToOne(() => LanguageEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "language_id" })
  language?: Relation<LanguageEntity>;

  @Column({ name: "method", type: "enum", enum: TranslationMethod })
  method!: TranslationMethod;

  @Column({ name: "notes", type: "varchar", length: 4000, nullable: true })
  notes?: Description | null;

  @Column({ name: "produced_at", type: "timestamptz", nullable: true })
  producedAt?: Date | null;

  @Column({ name: "produced_by", type: "text", nullable: true })
  producedBy?: JsonText | null;

  @Column({ name: "review_status", type: "enum", enum: ReviewStatus })
  reviewStatus!: ReviewStatus;

  @Column({ name: "reviewed_at", type: "timestamptz", nullable: true })
  reviewedAt?: Date | null;

  @Column({ name: "reviewed_by_snapshot", type: "text", nullable: true })
  reviewedBySnapshot?: JsonText | null;

  @Column({ name: "text", type: "text" })
  text!: NonEmptyString;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;

  @Column({ name: "wording_id", type: "uuid" })
  wordingId!: Id;

  @ManyToOne(() => WordingsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "wording_id" })
  wording?: Relation<WordingsEntity>;
}
