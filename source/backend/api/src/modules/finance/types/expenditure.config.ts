// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as BudgetConfig from '#/modules/finance/types/budget.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IExpenditure,
  ExpenditureKey,
  ExpenditureRelationKey,
  ExpenditureSortableField,
  ExpenditureFilterableField,
  ExpenditureDateRangeField,
  ExpenditureSelectableField,
  IExpenditureAsOneRelationConfig,
  IExpenditureAsManyRelationConfig
} from './expenditure.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const EXPENDITURE_RELATION_KEYS = ['budget', ] as const satisfies readonly ExpenditureKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const EXPENDITURE_SORTABLE_FIELDS = ['amount', 'createdAt', 'stageOrder', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly ExpenditureKey[];

export const EXPENDITURE_SEARCHABLE_FIELDS = [] as const satisfies readonly ExpenditureKey[];

export const EXPENDITURE_FILTERABLE_FIELDS = ['amount', 'approverPersonId', 'budgetId', 'contractId', 'id', 'isCurrent', 'method', 'stageId', 'unitId', 'verificationState', 'version', ] as const satisfies readonly ExpenditureKey[];

export const EXPENDITURE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly ExpenditureKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const EXPENDITURE_SELECTABLE_FIELDS = ['amount', 'approverPersonId', 'artifactChecksum', 'artifactId', 'budgetId', 'confidence', 'contractId', 'createdAt', 'currencyCode', 'id', 'isCurrent', 'licence', 'method', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'stageId', 'stageOrder', 'toolOrModel', 'unitId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly ExpenditureKey[];

export const EXPENDITURE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ExpenditureSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const EXPENDITURE_EDITABLE_FIELDS = ['amount', 'approverPersonId', 'artifactChecksum', 'artifactId', 'budgetId', 'confidence', 'contractId', 'currencyCode', 'isCurrent', 'licence', 'method', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'stageId', 'stageOrder', 'toolOrModel', 'unitId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly ExpenditureKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const EXPENDITURE_AS_ONE_RELATION_CONFIG = {
  relation: 'expenditure',
  type: ERelationType.One,
  selectableFields: EXPENDITURE_SELECTABLE_FIELDS,
  defaultSelectFields: EXPENDITURE_DEFAULT_SELECT_FIELDS
} as const satisfies IExpenditureAsOneRelationConfig;

export const EXPENDITURE_AS_MANY_RELATION_CONFIG = {
  relation: 'expenditures',
  type: ERelationType.Many,
  selectableFields: EXPENDITURE_SELECTABLE_FIELDS,
  defaultSelectFields: EXPENDITURE_DEFAULT_SELECT_FIELDS,
  sortableFields: EXPENDITURE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IExpenditureAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const EXPENDITURE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ExpenditureRelationKey>().one(BudgetConfig.BUDGET_AS_ONE_RELATION_CONFIG, 'budget'),
] as const;

export const EXPENDITURE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const EXPENDITURE_QUERY_OPTIONS = {
  searchableFields: EXPENDITURE_SEARCHABLE_FIELDS,
  selectableFields: EXPENDITURE_SELECTABLE_FIELDS,
  defaultSelectFields: EXPENDITURE_DEFAULT_SELECT_FIELDS,
  sortableFields: EXPENDITURE_SORTABLE_FIELDS,
  filterFields: EXPENDITURE_FILTERABLE_FIELDS,
  dateRangeFields: EXPENDITURE_DATE_RANGE_FIELDS,
  oneRelations: EXPENDITURE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: EXPENDITURE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IExpenditure,
  ExpenditureSortableField,
  ExpenditureSelectableField,
  ExpenditureFilterableField,
  ExpenditureDateRangeField,
  ExpenditureRelationKey,
  typeof EXPENDITURE_ONE_RELATION_QUERY_OPTIONS,
  typeof EXPENDITURE_MANY_RELATION_QUERY_OPTIONS
>;