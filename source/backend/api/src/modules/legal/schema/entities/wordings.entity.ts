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
import { LegalEditionsEntity } from "#/modules/legal/schema/entities/editions.entity.ts";
import { InstrumentsEntity } from "#/modules/legal/schema/entities/instruments.entity.ts";
import { ProvisionsEntity } from "#/modules/legal/schema/entities/provisions.entity.ts";
import { LanguageEntity } from "#/modules/reference/schema/entities/language.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString } from "#/modules/shared/schema/type/non-empty-string.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * Exact authority-bearing text of one provision in one edition and language. Translations are separate rows.
 */
@Entity({ schema: "legal", name: "wordings" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["provisionId", "editionId", "languageId"], { unique: true })
@Index(["editionId"])
@Index(["languageId"])
@Index(["citationId"])
@Index(["supersedesId"])
@Check(
  "chk_wordings_period_years_are_ordered",
  `from_year = null OR to_year = null OR from_year <= to_year`,
)
@Check(
  "chk_wordings_wordings_dates_are_ordered",
  `starts_on = null OR ends_on = null OR starts_on <= ends_on`,
)
export class WordingsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "citation_id", type: "uuid", nullable: true })
  citationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "citation_id" })
  citation?: Relation<CitationsEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "edition_id", type: "uuid" })
  editionId!: Id;

  @ManyToOne(() => LegalEditionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "edition_id" })
  edition?: Relation<LegalEditionsEntity>;

  @Column({ name: "ends_on", type: "date", nullable: true })
  endsOn?: Date | null;

  @Column({
    name: "from_to_precision",
    type: "enum",
    enum: DatePrecision,
    nullable: true,
  })
  fromToPrecision?: DatePrecision | null;

  @Column({ name: "from_year", type: "integer", nullable: true })
  fromYear?: Year | null;

  @Column({ name: "instrument_id", type: "uuid" })
  instrumentId!: Id;

  @ManyToOne(() => InstrumentsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "instrument_id" })
  instrument?: Relation<InstrumentsEntity>;

  @Column({ name: "language_id", type: "uuid" })
  languageId!: Id;

  @ManyToOne(() => LanguageEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "language_id" })
  language?: Relation<LanguageEntity>;

  @Column({ name: "observed_at", type: "timestamptz" })
  observedAt!: Date;

  @Column({ name: "provision_id", type: "uuid" })
  provisionId!: Id;

  @ManyToOne(() => ProvisionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "provision_id" })
  provision?: Relation<ProvisionsEntity>;

  @Column({ name: "starts_on", type: "date", nullable: true })
  startsOn?: Date | null;

  @Column({ name: "supersedes_id", type: "uuid", nullable: true })
  supersedesId?: Id | null;

  @ManyToOne(() => WordingsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "supersedes_id" })
  supersedes?: Relation<WordingsEntity>;

  @Column({ name: "text", type: "text" })
  text!: NonEmptyString;

  @Column({ name: "to_year", type: "integer", nullable: true })
  toYear?: Year | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
