import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";

import { ColumnNumericTransformer } from "#/modules/common/schema/entities/base/column-numeric.transformer.ts";
import { ProjectsEntity } from "#/modules/civic/schema/entities/projects.entity.ts";
import { BudgetVersionsEntity } from "#/modules/finance/schema/entities/budget-versions.entity.ts";
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One classified amount authorized in a budget version, optionally nested and assigned to a project or unit.
 */
@Entity({ schema: "finance", name: "appropriations" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["budgetVersionId"])
@Index(["parentAppropriationId"])
@Index(["projectId"])
@Index(["unitFeatureId"])
@Index(["sourceCitationId"])
export class AppropriationsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({
    name: "amount_minor_units",
    type: "bigint",
    transformer: new ColumnNumericTransformer(),
  })
  amountMinorUnits!: AmountMinorUnits;

  @Column({ name: "budget_version_id", type: "uuid" })
  budgetVersionId!: Id;

  @ManyToOne(() => BudgetVersionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "budget_version_id" })
  budgetVersion?: Relation<BudgetVersionsEntity>;

  @Column({ name: "classification_id", type: "uuid" })
  classificationId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "classification_id" })
  classification?: Relation<ValueEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "currency_id", type: "uuid" })
  currencyId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "currency_id" })
  currency?: Relation<ValueEntity>;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "parent_appropriation_id", type: "uuid", nullable: true })
  parentAppropriationId?: Id | null;

  @ManyToOne(() => AppropriationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "parent_appropriation_id" })
  parentAppropriation?: Relation<AppropriationsEntity>;

  @Column({ name: "project_id", type: "uuid", nullable: true })
  projectId?: Id | null;

  @ManyToOne(() => ProjectsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "project_id" })
  project?: Relation<ProjectsEntity>;

  @Column({ name: "recipient_entity_id", type: "uuid", nullable: true })
  recipientEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "recipient_entity_id" })
  recipientEntity?: Relation<EntitiesEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "unit_feature_id", type: "uuid", nullable: true })
  unitFeatureId?: Id | null;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "unit_feature_id" })
  unitFeature?: Relation<FeaturesEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
