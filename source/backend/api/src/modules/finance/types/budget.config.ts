// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as BudgetaryUnitConfig from '#/modules/finance/types/budgetary-unit.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IBudget,
  BudgetKey,
  BudgetRelationKey,
  BudgetSortableField,
  BudgetFilterableField,
  BudgetDateRangeField,
  BudgetSelectableField,
  IBudgetAsOneRelationConfig,
  IBudgetAsManyRelationConfig
} from './budget.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const BUDGET_RELATION_KEYS = ['budgetaryUnit', ] as const satisfies readonly BudgetKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const BUDGET_SORTABLE_FIELDS = ['approvedAmount', 'createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly BudgetKey[];

export const BUDGET_SEARCHABLE_FIELDS = [] as const satisfies readonly BudgetKey[];

export const BUDGET_FILTERABLE_FIELDS = ['approvedAmount', 'fiscalYearId', 'id', 'isCurrent', 'kind', 'legalBasisId', 'method', 'programCode', 'unitId', 'verificationState', 'version', ] as const satisfies readonly BudgetKey[];

export const BUDGET_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly BudgetKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const BUDGET_SELECTABLE_FIELDS = ['approvedAmount', 'artifactChecksum', 'artifactId', 'confidence', 'createdAt', 'currencyCode', 'fiscalYearId', 'id', 'isCurrent', 'kind', 'legalBasisId', 'licence', 'method', 'programCode', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'unitId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly BudgetKey[];

export const BUDGET_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly BudgetSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const BUDGET_EDITABLE_FIELDS = ['approvedAmount', 'artifactChecksum', 'artifactId', 'confidence', 'currencyCode', 'fiscalYearId', 'isCurrent', 'kind', 'legalBasisId', 'licence', 'method', 'programCode', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'unitId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly BudgetKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const BUDGET_AS_ONE_RELATION_CONFIG = {
  relation: 'budget',
  type: ERelationType.One,
  selectableFields: BUDGET_SELECTABLE_FIELDS,
  defaultSelectFields: BUDGET_DEFAULT_SELECT_FIELDS
} as const satisfies IBudgetAsOneRelationConfig;

export const BUDGET_AS_MANY_RELATION_CONFIG = {
  relation: 'budgets',
  type: ERelationType.Many,
  selectableFields: BUDGET_SELECTABLE_FIELDS,
  defaultSelectFields: BUDGET_DEFAULT_SELECT_FIELDS,
  sortableFields: BUDGET_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IBudgetAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const BUDGET_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<BudgetRelationKey>().one(BudgetaryUnitConfig.BUDGETARY_UNIT_AS_ONE_RELATION_CONFIG, 'budgetaryUnit'),
] as const;

export const BUDGET_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const BUDGET_QUERY_OPTIONS = {
  searchableFields: BUDGET_SEARCHABLE_FIELDS,
  selectableFields: BUDGET_SELECTABLE_FIELDS,
  defaultSelectFields: BUDGET_DEFAULT_SELECT_FIELDS,
  sortableFields: BUDGET_SORTABLE_FIELDS,
  filterFields: BUDGET_FILTERABLE_FIELDS,
  dateRangeFields: BUDGET_DATE_RANGE_FIELDS,
  oneRelations: BUDGET_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: BUDGET_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IBudget,
  BudgetSortableField,
  BudgetSelectableField,
  BudgetFilterableField,
  BudgetDateRangeField,
  BudgetRelationKey,
  typeof BUDGET_ONE_RELATION_QUERY_OPTIONS,
  typeof BUDGET_MANY_RELATION_QUERY_OPTIONS
>;