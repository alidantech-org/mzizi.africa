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
import { WordingsEntity } from "#/modules/legal/schema/entities/wordings.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { ReviewStatus } from "#/modules/legal/schema/enum/review-status.enum.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * A reviewed assertion of what a wording establishes, governs, limits or changes for one subject record. Never mutates the subject.
 */
@Entity({ schema: "legal", name: "effects" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["wordingId", "subjectTable", "subjectId", "kindId", "fromYear"], {
  unique: true,
})
@Index(["subjectTable", "subjectId"])
@Index(["kindId"])
@Index(["wordingId"])
@Check(
  "chk_effects_period_years_are_ordered",
  `from_year = null OR to_year = null OR from_year <= to_year`,
)
@Check(
  "chk_effects_effects_dates_are_ordered",
  `effective_on = null OR ended_on = null OR effective_on <= ended_on`,
)
export class EffectsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "effective_on", type: "date", nullable: true })
  effectiveOn?: Date | null;

  @Column({ name: "ended_on", type: "date", nullable: true })
  endedOn?: Date | null;

  @Column({
    name: "explanation",
    type: "varchar",
    length: 4000,
    nullable: true,
  })
  explanation?: Description | null;

  @Column({
    name: "from_to_precision",
    type: "enum",
    enum: DatePrecision,
    nullable: true,
  })
  fromToPrecision?: DatePrecision | null;

  @Column({ name: "from_year", type: "integer", nullable: true })
  fromYear?: Year | null;

  @Column({ name: "kind_id", type: "uuid" })
  kindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "kind_id" })
  kind?: Relation<ValueEntity>;

  @Column({ name: "observed_at", type: "timestamptz" })
  observedAt!: Date;

  @Column({ name: "review_status", type: "enum", enum: ReviewStatus })
  reviewStatus!: ReviewStatus;

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

  @Column({ name: "wording_id", type: "uuid" })
  wordingId!: Id;

  @ManyToOne(() => WordingsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "wording_id" })
  wording?: Relation<WordingsEntity>;
}
