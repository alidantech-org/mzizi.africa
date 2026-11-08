// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { FundRestriction } from '#/types/finance/fund-restriction.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as BudgetaryUnitTypes from '#/modules/finance/types/budgetary-unit.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  REVENUE_RECORD_RELATION_KEYS,
  REVENUE_RECORD_SORTABLE_FIELDS,
  REVENUE_RECORD_SEARCHABLE_FIELDS,
  REVENUE_RECORD_FILTERABLE_FIELDS,
  REVENUE_RECORD_DATE_RANGE_FIELDS,
  REVENUE_RECORD_SELECTABLE_FIELDS,
  REVENUE_RECORD_DEFAULT_SELECT_FIELDS,
  REVENUE_RECORD_EDITABLE_FIELDS
} from './revenue-record.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Revenue Record */
export interface IRevenueRecord extends B.IBase {
  amount: number;
  categoryId: string;
  currencyCode: string;
  fiscalYearId: string;
  isCurrent: boolean;
  payerEntityId: string | null;
  receivedOn: Date;
  restriction: FundRestriction;
  unitId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly budgetaryUnit?: BudgetaryUnitTypes.IBudgetaryUnit;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type RevenueRecordKey = keyof IRevenueRecord;

export type RevenueRecordRelationKey = (typeof REVENUE_RECORD_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IRevenueRecordReadonlyFields = B.IBaseReadonlyFields;

export type IRevenueRecordContextualFields = never;

export type IRevenueRecordSensitiveFields = never;

export type IRevenueRecordTransitionFields = never;

export type IRevenueRecordImmutableFields =
  | IRevenueRecordReadonlyFields
  | IRevenueRecordContextualFields
  | IRevenueRecordSensitiveFields
  | IRevenueRecordTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IRevenueRecordCreatable = Omit<IRevenueRecord, IRevenueRecordImmutableFields | RevenueRecordRelationKey>;

export type IRevenueRecordSystemWritable = Omit<IRevenueRecord, B.IBaseReadonlyFields | RevenueRecordRelationKey>;

export type IRevenueRecordUpdatable = Partial<Omit<IRevenueRecord, IRevenueRecordImmutableFields | RevenueRecordRelationKey>>;

export interface IRevenueRecordTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type RevenueRecordSortableField = (typeof REVENUE_RECORD_SORTABLE_FIELDS)[number];

export type RevenueRecordSearchableField = (typeof REVENUE_RECORD_SEARCHABLE_FIELDS)[number];

export type RevenueRecordFilterableField = (typeof REVENUE_RECORD_FILTERABLE_FIELDS)[number];

export type RevenueRecordDateRangeField = (typeof REVENUE_RECORD_DATE_RANGE_FIELDS)[number];

export type RevenueRecordSelectableField = (typeof REVENUE_RECORD_SELECTABLE_FIELDS)[number];

export type RevenueRecordDefaultSelectField = (typeof REVENUE_RECORD_DEFAULT_SELECT_FIELDS)[number];

export type RevenueRecordEditableField = (typeof REVENUE_RECORD_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IRevenueRecordAsOneRelationConfig = Q.IOneRelationConfig<'revenueRecord', RevenueRecordSelectableField>;

export type IRevenueRecordAsManyRelationConfig = Q.IManyRelationConfig<'revenueRecords', RevenueRecordSelectableField, RevenueRecordSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IRevenueRecordAsOneRelationQuery = Q.IAsOneRelationQuery<IRevenueRecord, RevenueRecordSelectableField>;

export type IRevenueRecordAsManyRelationQuery = Q.IAsManyRelationQuery<IRevenueRecord, RevenueRecordSelectableField, RevenueRecordSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IRevenueRecordRelationMap extends Record<RevenueRecordRelationKey, unknown> {
  budgetaryUnit: BudgetaryUnitTypes.IBudgetaryUnitAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IRevenueRecordRelationQueries = Q.IBaseRelationQueries<IRevenueRecord, RevenueRecordRelationKey, IRevenueRecordRelationMap>;

export type IRevenueRecordItemQuery = Q.IBaseItemQuery<
  IRevenueRecord,
  RevenueRecordRelationKey,
  RevenueRecordSelectableField,
  RevenueRecordRelationKey,
  RevenueRecordSelectableField,
  IRevenueRecordRelationMap,
  IRevenueRecordRelationQueries
>;

export type IRevenueRecordListQuery = Q.IBaseListQuery<
  IRevenueRecord,
  RevenueRecordRelationKey,
  RevenueRecordSelectableField,
  RevenueRecordSortableField,
  RevenueRecordRelationKey,
  RevenueRecordSelectableField,
  RevenueRecordSortableField,
  RevenueRecordDateRangeField,
  RevenueRecordFilterableField,
  IRevenueRecordRelationMap,
  IRevenueRecordRelationQueries,
  IRevenueRecordItemQuery
>;