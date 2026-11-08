import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";

import { ColumnNumericTransformer } from "#/modules/common/entities/base/column-numeric.transformer.ts";
import { OfficeEntity } from "#/modules/governance/entities/office.entity.ts";
import { RuleKind } from "#/types/governance/rule-kind.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { RuleValue } from "#/types/governance/rule-value.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Office Rule
 */
@Entity({ schema: "governance", name: "rules" })
@Index("idx_office_rule_office", ["officeId", "kind"])
export class OfficeRuleEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "kind", type: "enum", enum: RuleKind })
  kind!: RuleKind;

  @Column({ name: "legal_basis_id", type: "uuid", nullable: true })
  legalBasisId?: Id | null;

  @Column({ name: "numeric_value", type: "numeric", precision: 12, scale: 2, transformer: new ColumnNumericTransformer(), nullable: true })
  numericValue?: RuleValue | null;

  @Column({ name: "office_id", type: "uuid" })
  officeId!: Id;

  @ManyToOne(() => OfficeEntity)
  @JoinColumn({ name: "office_id" })
  office?: Relation<OfficeEntity>;

  @Column({ name: "text_value", type: "varchar", length: 4000, nullable: true })
  textValue?: Description | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_from_precision", type: "enum", enum: DatePrecision, nullable: true })
  validFromPrecision?: DatePrecision | null;

  @Column({ name: "valid_to", type: "date", nullable: true })
  validTo?: Date | null;

  @Column({ name: "valid_to_precision", type: "enum", enum: DatePrecision, nullable: true })
  validToPrecision?: DatePrecision | null;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}