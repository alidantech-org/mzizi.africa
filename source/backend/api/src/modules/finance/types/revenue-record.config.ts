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
  IRevenueRecord,
  RevenueRecordKey,
  RevenueRecordRelationKey,
  RevenueRecordSortableField,
  RevenueRecordFilterableField,
  RevenueRecordDateRangeField,
  RevenueRecordSelectableField,
  IRevenueRecordAsOneRelationConfig,
  IRevenueRecordAsManyRelationConfig
} from './revenue-record.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const REVENUE_RECORD_RELATION_KEYS = ['budgetaryUnit', ] as const satisfies readonly RevenueRecordKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const REVENUE_RECORD_SORTABLE_FIELDS = ['amount', 'createdAt', 'receivedOn', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly RevenueRecordKey[];

export const REVENUE_RECORD_SEARCHABLE_FIELDS = [] as const satisfies readonly RevenueRecordKey[];

export const REVENUE_RECORD_FILTERABLE_FIELDS = ['amount', 'categoryId', 'fiscalYearId', 'id', 'isCurrent', 'payerEntityId', 'restriction', 'unitId', 'version', ] as const satisfies readonly RevenueRecordKey[];

export const REVENUE_RECORD_DATE_RANGE_FIELDS = ['createdAt', 'receivedOn', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly RevenueRecordKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const REVENUE_RECORD_SELECTABLE_FIELDS = ['amount', 'categoryId', 'createdAt', 'currencyCode', 'fiscalYearId', 'id', 'isCurrent', 'payerEntityId', 'receivedOn', 'restriction', 'unitId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly RevenueRecordKey[];

export const REVENUE_RECORD_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly RevenueRecordSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const REVENUE_RECORD_EDITABLE_FIELDS = ['amount', 'categoryId', 'currencyCode', 'fiscalYearId', 'isCurrent', 'payerEntityId', 'receivedOn', 'restriction', 'unitId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly RevenueRecordKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const REVENUE_RECORD_AS_ONE_RELATION_CONFIG = {
  relation: 'revenueRecord',
  type: ERelationType.One,
  selectableFields: REVENUE_RECORD_SELECTABLE_FIELDS,
  defaultSelectFields: REVENUE_RECORD_DEFAULT_SELECT_FIELDS
} as const satisfies IRevenueRecordAsOneRelationConfig;

export const REVENUE_RECORD_AS_MANY_RELATION_CONFIG = {
  relation: 'revenueRecords',
  type: ERelationType.Many,
  selectableFields: REVENUE_RECORD_SELECTABLE_FIELDS,
  defaultSelectFields: REVENUE_RECORD_DEFAULT_SELECT_FIELDS,
  sortableFields: REVENUE_RECORD_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IRevenueRecordAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const REVENUE_RECORD_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<RevenueRecordRelationKey>().one(BudgetaryUnitConfig.BUDGETARY_UNIT_AS_ONE_RELATION_CONFIG, 'budgetaryUnit'),
] as const;

export const REVENUE_RECORD_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const REVENUE_RECORD_QUERY_OPTIONS = {
  searchableFields: REVENUE_RECORD_SEARCHABLE_FIELDS,
  selectableFields: REVENUE_RECORD_SELECTABLE_FIELDS,
  defaultSelectFields: REVENUE_RECORD_DEFAULT_SELECT_FIELDS,
  sortableFields: REVENUE_RECORD_SORTABLE_FIELDS,
  filterFields: REVENUE_RECORD_FILTERABLE_FIELDS,
  dateRangeFields: REVENUE_RECORD_DATE_RANGE_FIELDS,
  oneRelations: REVENUE_RECORD_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: REVENUE_RECORD_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IRevenueRecord,
  RevenueRecordSortableField,
  RevenueRecordSelectableField,
  RevenueRecordFilterableField,
  RevenueRecordDateRangeField,
  RevenueRecordRelationKey,
  typeof REVENUE_RECORD_ONE_RELATION_QUERY_OPTIONS,
  typeof REVENUE_RECORD_MANY_RELATION_QUERY_OPTIONS
>;