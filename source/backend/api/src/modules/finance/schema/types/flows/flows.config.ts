// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as AppropriationsConfig from "#/modules/finance/schema/types/appropriations/appropriations.config";
import * as ContractsConfig from "#/modules/civic/schema/types/contracts/contracts.config";
import * as EntitiesConfig from "#/modules/official/schema/types/entities/entities.config";
import * as IndividualsConfig from "#/modules/official/schema/types/individuals/individuals.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as DebtsConfig from "#/modules/finance/schema/types/debts/debts.config";
import * as FiscalPeriodsConfig from "#/modules/finance/schema/types/fiscal-periods/fiscal-periods.config";
import * as FundsConfig from "#/modules/finance/schema/types/funds/funds.config";
import * as InstitutionsConfig from "#/modules/governance/schema/types/institutions/institutions.config";
import * as ProjectsConfig from "#/modules/civic/schema/types/projects/projects.config";
import * as FeaturesConfig from "#/modules/geography/schema/types/features/features.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IFlows,
  FlowsKey,
  FlowsRelationKey,
  FlowsSortableField,
  FlowsFilterableField,
  FlowsDateRangeField,
  FlowsSelectableField,
  IFlowsAsOneRelationConfig,
  IFlowsAsManyRelationConfig,
} from "./flows.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const FLOWS_RELATION_KEYS = [
  "appropriation",
  "contract",
  "counterpartyEntity",
  "counterpartyIndividual",
  "currency",
  "debt",
  "expenditureClass",
  "fiscalPeriod",
  "flowKind",
  "fund",
  "institution",
  "project",
  "scopeUnitFeature",
  "sourceCitation",
] as const satisfies readonly FlowsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const FLOWS_SORTABLE_FIELDS = [
  "amountMinorUnits",
  "appropriationId",
  "code",
  "contractId",
  "counterpartyEntityId",
  "counterpartyIndividualId",
  "createdAt",
  "currencyId",
  "debtId",
  "deletedAt",
  "expenditureClassId",
  "fiscalPeriodId",
  "flowKindId",
  "fundId",
  "id",
  "institutionId",
  "occurredOn",
  "projectId",
  "scopeUnitFeatureId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly FlowsKey[];

export const FLOWS_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly FlowsKey[];

export const FLOWS_FILTERABLE_FIELDS = [
  "appropriationId",
  "contractId",
  "counterpartyEntityId",
  "counterpartyIndividualId",
  "currencyId",
  "debtId",
  "expenditureClassId",
  "fiscalPeriodId",
  "flowKindId",
  "fundId",
  "id",
  "institutionId",
  "projectId",
  "scopeUnitFeatureId",
  "sourceCitationId",
] as const satisfies readonly FlowsKey[];

export const FLOWS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "occurredOn",
  "updatedAt",
] as const satisfies readonly FlowsKey[];

export const FLOWS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IFlows> = {
  searchableFields: [...FLOWS_SEARCHABLE_FIELDS],
  filterFields: [...FLOWS_FILTERABLE_FIELDS],
  dateRangeFields: [...FLOWS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const FLOWS_SELECTABLE_FIELDS = [
  "amountMinorUnits",
  "appropriationId",
  "code",
  "contractId",
  "counterpartyEntityId",
  "counterpartyIndividualId",
  "createdAt",
  "currencyId",
  "debtId",
  "deletedAt",
  "expenditureClassId",
  "fiscalPeriodId",
  "flowKindId",
  "fundId",
  "id",
  "institutionId",
  "occurredOn",
  "projectId",
  "scopeUnitFeatureId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly FlowsKey[];

export const FLOWS_DEFAULT_SELECT_FIELDS = [
  "amountMinorUnits",
  "appropriationId",
  "code",
  "contractId",
  "counterpartyEntityId",
  "counterpartyIndividualId",
  "createdAt",
  "currencyId",
  "debtId",
  "deletedAt",
  "expenditureClassId",
  "fiscalPeriodId",
  "flowKindId",
  "fundId",
  "id",
  "institutionId",
  "occurredOn",
  "projectId",
  "scopeUnitFeatureId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly FlowsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const FLOWS_EDITABLE_FIELDS = [
  "amountMinorUnits",
  "appropriationId",
  "code",
  "contractId",
  "counterpartyEntityId",
  "counterpartyIndividualId",
  "currencyId",
  "debtId",
  "expenditureClassId",
  "fiscalPeriodId",
  "flowKindId",
  "fundId",
  "institutionId",
  "occurredOn",
  "projectId",
  "scopeUnitFeatureId",
  "sourceCitationId",
] as const satisfies readonly FlowsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const FLOWS_AS_ONE_RELATION_CONFIG = {
  relation: "flows",
  type: ERelationType.One,
  selectableFields: FLOWS_SELECTABLE_FIELDS,
  defaultSelectFields: FLOWS_DEFAULT_SELECT_FIELDS,
} as const satisfies IFlowsAsOneRelationConfig;

export const FLOWS_AS_MANY_RELATION_CONFIG = {
  relation: "flows",
  type: ERelationType.Many,
  selectableFields: FLOWS_SELECTABLE_FIELDS,
  defaultSelectFields: FLOWS_DEFAULT_SELECT_FIELDS,
  sortableFields: FLOWS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IFlowsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const FLOWS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<FlowsRelationKey>().one(
    () => AppropriationsConfig.APPROPRIATIONS_AS_ONE_RELATION_CONFIG,
    "appropriation",
  ),
  Q.createRelationKeyMapper<FlowsRelationKey>().one(
    () => ContractsConfig.CONTRACTS_AS_ONE_RELATION_CONFIG,
    "contract",
  ),
  Q.createRelationKeyMapper<FlowsRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "counterpartyEntity",
  ),
  Q.createRelationKeyMapper<FlowsRelationKey>().one(
    () => IndividualsConfig.INDIVIDUALS_AS_ONE_RELATION_CONFIG,
    "counterpartyIndividual",
  ),
  Q.createRelationKeyMapper<FlowsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "currency",
  ),
  Q.createRelationKeyMapper<FlowsRelationKey>().one(
    () => DebtsConfig.DEBTS_AS_ONE_RELATION_CONFIG,
    "debt",
  ),
  Q.createRelationKeyMapper<FlowsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "expenditureClass",
  ),
  Q.createRelationKeyMapper<FlowsRelationKey>().one(
    () => FiscalPeriodsConfig.FISCAL_PERIODS_AS_ONE_RELATION_CONFIG,
    "fiscalPeriod",
  ),
  Q.createRelationKeyMapper<FlowsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "flowKind",
  ),
  Q.createRelationKeyMapper<FlowsRelationKey>().one(
    () => FundsConfig.FUNDS_AS_ONE_RELATION_CONFIG,
    "fund",
  ),
  Q.createRelationKeyMapper<FlowsRelationKey>().one(
    () => InstitutionsConfig.INSTITUTIONS_AS_ONE_RELATION_CONFIG,
    "institution",
  ),
  Q.createRelationKeyMapper<FlowsRelationKey>().one(
    () => ProjectsConfig.PROJECTS_AS_ONE_RELATION_CONFIG,
    "project",
  ),
  Q.createRelationKeyMapper<FlowsRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "scopeUnitFeature",
  ),
  Q.createRelationKeyMapper<FlowsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const FLOWS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const FLOWS_QUERY_OPTIONS = {
  searchableFields: FLOWS_SEARCHABLE_FIELDS,
  selectableFields: FLOWS_SELECTABLE_FIELDS,
  defaultSelectFields: FLOWS_DEFAULT_SELECT_FIELDS,
  sortableFields: FLOWS_SORTABLE_FIELDS,
  filterFields: FLOWS_FILTERABLE_FIELDS,
  dateRangeFields: FLOWS_DATE_RANGE_FIELDS,
  relationKeys: FLOWS_RELATION_KEYS,
  editableFields: FLOWS_EDITABLE_FIELDS,
  asOne: FLOWS_AS_ONE_RELATION_CONFIG,
  asMany: FLOWS_AS_MANY_RELATION_CONFIG,
  oneRelations: FLOWS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: FLOWS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IFlows,
  FlowsSortableField,
  FlowsSelectableField,
  FlowsFilterableField,
  FlowsDateRangeField,
  FlowsRelationKey,
  typeof FLOWS_ONE_RELATION_QUERY_OPTIONS,
  typeof FLOWS_MANY_RELATION_QUERY_OPTIONS
>;
