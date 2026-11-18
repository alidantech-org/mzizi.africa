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

import { ProvisionsEntity } from "#/modules/legal/schema/entities/provisions.entity.ts";
import { TranslationsEntity } from "#/modules/legal/schema/entities/translations.entity.ts";
import { WordingsEntity } from "#/modules/legal/schema/entities/wordings.entity.ts";
import { ReferenceMethod } from "#/modules/legal/schema/enum/reference-method.enum.ts";
import { ReferenceRelation } from "#/modules/legal/schema/enum/reference-relation.enum.ts";
import { ReviewStatus } from "#/modules/legal/schema/enum/review-status.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A textual mention of a provision inside a wording or translation, with the exact span. A mention is not an amendment.
 */
@Entity({ schema: "legal", name: "references" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["wordingId", "targetProvisionId", "spanStart"], { unique: true })
@Index(["translationId", "targetProvisionId", "spanStart"], { unique: true })
@Index(["wordingId"])
@Index(["translationId"])
@Index(["targetProvisionId"])
@Index(["targetWordingId"])
// Invariant "ExactlyOneOrigin" has no simple form, so it isn't enforced as a database check.
@Check(
  "chk_references_span_must_be_ordered",
  `span_start = null OR span_end = null OR span_start < span_end`,
)
@Check("chk_references_span_must_be_non_empty", `span_start <> span_end`)
export class ReferencesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "method", type: "enum", enum: ReferenceMethod })
  method!: ReferenceMethod;

  @Column({ name: "relation", type: "enum", enum: ReferenceRelation })
  relation!: ReferenceRelation;

  @Column({ name: "review_status", type: "enum", enum: ReviewStatus })
  reviewStatus!: ReviewStatus;

  @Column({ name: "span_end", type: "integer" })
  spanEnd!: PositiveInteger;

  @Column({ name: "span_start", type: "integer" })
  spanStart!: NonNegativeInteger;

  @Column({ name: "span_text", type: "varchar", length: 500 })
  spanText!: NonEmptyString500;

  @Column({ name: "target_provision_id", type: "uuid" })
  targetProvisionId!: Id;

  @ManyToOne(() => ProvisionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "target_provision_id" })
  targetProvision?: Relation<ProvisionsEntity>;

  @Column({ name: "target_wording_id", type: "uuid", nullable: true })
  targetWordingId?: Id | null;

  @ManyToOne(() => WordingsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "target_wording_id" })
  targetWording?: Relation<WordingsEntity>;

  @Column({ name: "translation_id", type: "uuid", nullable: true })
  translationId?: Id | null;

  @ManyToOne(() => TranslationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "translation_id" })
  translation?: Relation<TranslationsEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;

  @Column({ name: "wording_id", type: "uuid", nullable: true })
  wordingId?: Id | null;

  @ManyToOne(() => WordingsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "wording_id" })
  wording?: Relation<WordingsEntity>;
}
