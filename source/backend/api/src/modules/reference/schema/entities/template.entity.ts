import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { LevelsEntity } from "#/modules/geography/schema/entities/levels.entity.ts";
import { PatternEntity } from "#/modules/reference/schema/entities/pattern.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import { TemplateProduct } from "#/modules/reference/schema/enum/template-product.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One thing a pattern produces, how many (one per unit of a level), how it is named and coded, and the attributes it carries. Templates generate structure only, never people.
 */
@Entity({ schema: "reference", name: "templates" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["patternId", "code"], { unique: true })
@Index(["patternId"])
@Index(["fanOutLevelId"])
@Index(["parentTemplateId"])
@Index(["sourceCitationId"])
export class TemplateEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "arm_id", type: "uuid", nullable: true })
  armId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "arm_id" })
  arm?: Relation<ValueEntity>;

  @Column({ name: "class_id", type: "uuid", nullable: true })
  classId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "class_id" })
  class?: Relation<ValueEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "code_template", type: "varchar", length: 500 })
  codeTemplate!: NonEmptyString500;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "fan_out_level_id", type: "uuid", nullable: true })
  fanOutLevelId?: Id | null;

  @ManyToOne(() => LevelsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "fan_out_level_id" })
  fanOutLevel?: Relation<LevelsEntity>;

  @Column({ name: "institution_kind_id", type: "uuid", nullable: true })
  institutionKindId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "institution_kind_id" })
  institutionKind?: Relation<ValueEntity>;

  @Column({ name: "name_template", type: "varchar", length: 500 })
  nameTemplate!: NonEmptyString500;

  @Column({ name: "parent_template_id", type: "uuid", nullable: true })
  parentTemplateId?: Id | null;

  @ManyToOne(() => TemplateEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "parent_template_id" })
  parentTemplate?: Relation<TemplateEntity>;

  @Column({ name: "pattern_id", type: "uuid" })
  patternId!: Id;

  @ManyToOne(() => PatternEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "pattern_id" })
  pattern?: Relation<PatternEntity>;

  @Column({ name: "produces", type: "enum", enum: TemplateProduct })
  produces!: TemplateProduct;

  @Column({ name: "role_id", type: "uuid", nullable: true })
  roleId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "role_id" })
  role?: Relation<ValueEntity>;

  @Column({ name: "seat_basis_id", type: "uuid", nullable: true })
  seatBasisId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "seat_basis_id" })
  seatBasis?: Relation<ValueEntity>;

  @Column({ name: "seat_count", type: "integer", nullable: true })
  seatCount?: PositiveInteger | null;

  @Column({ name: "selection_method_id", type: "uuid", nullable: true })
  selectionMethodId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "selection_method_id" })
  selectionMethod?: Relation<ValueEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "term_limit", type: "integer", nullable: true })
  termLimit?: PositiveInteger | null;

  @Column({ name: "term_years", type: "integer", nullable: true })
  termYears?: PositiveInteger | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
