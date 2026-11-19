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
import { ContractsEntity } from "#/modules/civic/schema/entities/contracts.entity.ts";
import { ProjectsEntity } from "#/modules/civic/schema/entities/projects.entity.ts";
import { AppropriationsEntity } from "#/modules/finance/schema/entities/appropriations.entity.ts";
import { DebtsEntity } from "#/modules/finance/schema/entities/debts.entity.ts";
import { FiscalPeriodsEntity } from "#/modules/finance/schema/entities/fiscal-periods.entity.ts";
import { FundsEntity } from "#/modules/finance/schema/entities/funds.entity.ts";
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { InstitutionsEntity } from "#/modules/governance/schema/entities/institutions.entity.ts";
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { IndividualsEntity } from "#/modules/official/schema/entities/individuals.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One reported financial flow at its source transaction grain, not a rolled-up aggregate.
 */
@Entity({ schema: "finance", name: "flows" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["occurredOn", "flowKindId"])
@Index(["fiscalPeriodId"])
@Index(["fundId"])
@Index(["appropriationId"])
@Index(["contractId"])
@Index(["counterpartyEntityId"])
@Index(["counterpartyIndividualId"])
@Index(["debtId"])
@Index(["projectId"])
@Index(["institutionId"])
@Index(["scopeUnitFeatureId"])
@Index(["expenditureClassId"])
@Index(["sourceCitationId"])
// Invariant "AtMostOneCounterparty" has no simple form, so it isn't enforced as a database check.
export class FlowsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({
    name: "amount_minor_units",
    type: "bigint",
    transformer: new ColumnNumericTransformer(),
  })
  amountMinorUnits!: AmountMinorUnits;

  @Column({ name: "appropriation_id", type: "uuid", nullable: true })
  appropriationId?: Id | null;

  @ManyToOne(() => AppropriationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "appropriation_id" })
  appropriation?: Relation<AppropriationsEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "contract_id", type: "uuid", nullable: true })
  contractId?: Id | null;

  @ManyToOne(() => ContractsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "contract_id" })
  contract?: Relation<ContractsEntity>;

  @Column({ name: "counterparty_entity_id", type: "uuid", nullable: true })
  counterpartyEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "counterparty_entity_id" })
  counterpartyEntity?: Relation<EntitiesEntity>;

  @Column({ name: "counterparty_individual_id", type: "uuid", nullable: true })
  counterpartyIndividualId?: Id | null;

  @ManyToOne(() => IndividualsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "counterparty_individual_id" })
  counterpartyIndividual?: Relation<IndividualsEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "currency_id", type: "uuid" })
  currencyId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "currency_id" })
  currency?: Relation<ValueEntity>;

  @Column({ name: "debt_id", type: "uuid", nullable: true })
  debtId?: Id | null;

  @ManyToOne(() => DebtsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "debt_id" })
  debt?: Relation<DebtsEntity>;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "expenditure_class_id", type: "uuid", nullable: true })
  expenditureClassId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "expenditure_class_id" })
  expenditureClass?: Relation<ValueEntity>;

  @Column({ name: "fiscal_period_id", type: "uuid", nullable: true })
  fiscalPeriodId?: Id | null;

  @ManyToOne(() => FiscalPeriodsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "fiscal_period_id" })
  fiscalPeriod?: Relation<FiscalPeriodsEntity>;

  @Column({ name: "flow_kind_id", type: "uuid" })
  flowKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "flow_kind_id" })
  flowKind?: Relation<ValueEntity>;

  @Column({ name: "fund_id", type: "uuid", nullable: true })
  fundId?: Id | null;

  @ManyToOne(() => FundsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "fund_id" })
  fund?: Relation<FundsEntity>;

  @Column({ name: "institution_id", type: "uuid", nullable: true })
  institutionId?: Id | null;

  @ManyToOne(() => InstitutionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "institution_id" })
  institution?: Relation<InstitutionsEntity>;

  @Column({ name: "occurred_on", type: "date" })
  occurredOn!: Date;

  @Column({ name: "project_id", type: "uuid", nullable: true })
  projectId?: Id | null;

  @ManyToOne(() => ProjectsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "project_id" })
  project?: Relation<ProjectsEntity>;

  @Column({ name: "scope_unit_feature_id", type: "uuid", nullable: true })
  scopeUnitFeatureId?: Id | null;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "scope_unit_feature_id" })
  scopeUnitFeature?: Relation<FeaturesEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
