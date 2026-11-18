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

import { CountryEntity } from "#/modules/reference/schema/entities/country.entity.ts";
import { LanguageEntity } from "#/modules/reference/schema/entities/language.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * One public address segment for one subject row. Identifies a thing by a clean name under its parent; closed rows keep history so a renamed or re-parented thing redirects instead of breaking. Carries no title: titles come from the name tables.
 */
@Entity({ schema: "source", name: "slugs" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["countryId", "namespaceId", "parentSlugId", "slug", "languageId"], {
  unique: true,
  where: '"to_year" IS NULL',
})
@Index(["subjectTable", "subjectId"])
@Index(["parentSlugId"])
@Index(["canonicalSlugId"])
@Index(["namespaceId"])
@Check(
  "chk_slugs_period_years_are_ordered",
  `from_year = null OR to_year = null OR from_year <= to_year`,
)
export class SlugsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "canonical_slug_id", type: "uuid", nullable: true })
  canonicalSlugId?: Id | null;

  @ManyToOne(() => SlugsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "canonical_slug_id" })
  canonicalSlug?: Relation<SlugsEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "country_id", type: "uuid" })
  countryId!: Id;

  @ManyToOne(() => CountryEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "country_id" })
  country?: Relation<CountryEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({
    name: "from_to_precision",
    type: "enum",
    enum: DatePrecision,
    nullable: true,
  })
  fromToPrecision?: DatePrecision | null;

  @Column({ name: "from_year", type: "integer", nullable: true })
  fromYear?: Year | null;

  @Column({ name: "language_id", type: "uuid", nullable: true })
  languageId?: Id | null;

  @ManyToOne(() => LanguageEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "language_id" })
  language?: Relation<LanguageEntity>;

  @Column({ name: "namespace_id", type: "uuid" })
  namespaceId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "namespace_id" })
  namespace?: Relation<ValueEntity>;

  @Column({ name: "parent_slug_id", type: "uuid", nullable: true })
  parentSlugId?: Id | null;

  @ManyToOne(() => SlugsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "parent_slug_id" })
  parentSlug?: Relation<SlugsEntity>;

  @Column({ name: "slug", type: "varchar", length: 255 })
  slug!: NonEmptyString255;

  @Column({ name: "subject_id", type: "uuid" })
  subjectId!: Id;

  @Column({ name: "subject_table", type: "enum", enum: SubjectTable })
  subjectTable!: SubjectTable;

  @Column({ name: "to_year", type: "integer", nullable: true })
  toYear?: Year | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
