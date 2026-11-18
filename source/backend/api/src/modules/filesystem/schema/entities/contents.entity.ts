import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { FileVersionsEntity } from "#/modules/filesystem/schema/entities/file-versions.entity.ts";
import { LanguageEntity } from "#/modules/reference/schema/entities/language.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString } from "#/modules/shared/schema/type/non-empty-string.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One authored text (markdown) about a subject record: an institution, a place, a person, the Constitution or general knowledge. Media is referenced, never embedded.
 */
@Entity({ schema: "filesystem", name: "contents" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["slug", "languageId"], { unique: true })
@Index(["subjectTable", "subjectId"])
@Index(["categoryId"])
@Index(["classificationId"])
export class ContentsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "body", type: "text" })
  body!: NonEmptyString;

  @Column({ name: "category_id", type: "uuid" })
  categoryId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "category_id" })
  category?: Relation<ValueEntity>;

  @Column({ name: "classification_id", type: "uuid", nullable: true })
  classificationId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "classification_id" })
  classification?: Relation<ValueEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "file_version_id", type: "uuid", nullable: true })
  fileVersionId?: Id | null;

  @ManyToOne(() => FileVersionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "file_version_id" })
  fileVersion?: Relation<FileVersionsEntity>;

  @Column({ name: "is_development_text", type: "boolean" })
  isDevelopmentText!: Flag;

  @Column({ name: "language_id", type: "uuid" })
  languageId!: Id;

  @ManyToOne(() => LanguageEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "language_id" })
  language?: Relation<LanguageEntity>;

  @Column({ name: "slug", type: "varchar", length: 255 })
  slug!: NonEmptyString255;

  @Column({ name: "subject_id", type: "uuid" })
  subjectId!: Id;

  @Column({ name: "subject_table", type: "enum", enum: SubjectTable })
  subjectTable!: SubjectTable;

  @Column({ name: "summary", type: "varchar", length: 4000, nullable: true })
  summary?: Description | null;

  @Column({ name: "title", type: "varchar", length: 300 })
  title!: Name;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
