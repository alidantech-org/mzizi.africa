// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  FISCAL_YEAR_RELATION_KEYS,
  FISCAL_YEAR_SORTABLE_FIELDS,
  FISCAL_YEAR_SEARCHABLE_FIELDS,
  FISCAL_YEAR_FILTERABLE_FIELDS,
  FISCAL_YEAR_DATE_RANGE_FIELDS,
  FISCAL_YEAR_SELECTABLE_FIELDS,
  FISCAL_YEAR_DEFAULT_SELECT_FIELDS,
  FISCAL_YEAR_EDITABLE_FIELDS
} from './fiscal-year.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Fiscal Year */
export interface IFiscalYear extends B.IBase {
  code: string;
  endsOn: Date;
  isCurrent: boolean;
  jurisdictionId: string;
  startsOn: Date;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type FiscalYearKey = keyof IFiscalYear;

export type FiscalYearRelationKey = (typeof FISCAL_YEAR_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IFiscalYearReadonlyFields = B.IBaseReadonlyFields;

export type IFiscalYearContextualFields = never;

export type IFiscalYearSensitiveFields = never;

export type IFiscalYearTransitionFields = never;

export type IFiscalYearImmutableFields =
  | IFiscalYearReadonlyFields
  | IFiscalYearContextualFields
  | IFiscalYearSensitiveFields
  | IFiscalYearTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IFiscalYearCreatable = Omit<IFiscalYear, IFiscalYearImmutableFields | FiscalYearRelationKey>;

export type IFiscalYearSystemWritable = Omit<IFiscalYear, B.IBaseReadonlyFields | FiscalYearRelationKey>;

export type IFiscalYearUpdatable = Partial<Omit<IFiscalYear, IFiscalYearImmutableFields | FiscalYearRelationKey>>;

export interface IFiscalYearTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type FiscalYearSortableField = (typeof FISCAL_YEAR_SORTABLE_FIELDS)[number];

export type FiscalYearSearchableField = (typeof FISCAL_YEAR_SEARCHABLE_FIELDS)[number];

export type FiscalYearFilterableField = (typeof FISCAL_YEAR_FILTERABLE_FIELDS)[number];

export type FiscalYearDateRangeField = (typeof FISCAL_YEAR_DATE_RANGE_FIELDS)[number];

export type FiscalYearSelectableField = (typeof FISCAL_YEAR_SELECTABLE_FIELDS)[number];

export type FiscalYearDefaultSelectField = (typeof FISCAL_YEAR_DEFAULT_SELECT_FIELDS)[number];

export type FiscalYearEditableField = (typeof FISCAL_YEAR_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IFiscalYearAsOneRelationConfig = Q.IOneRelationConfig<'fiscalYear', FiscalYearSelectableField>;

export type IFiscalYearAsManyRelationConfig = Q.IManyRelationConfig<'fiscalYears', FiscalYearSelectableField, FiscalYearSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IFiscalYearAsOneRelationQuery = Q.IAsOneRelationQuery<IFiscalYear, FiscalYearSelectableField>;

export type IFiscalYearAsManyRelationQuery = Q.IAsManyRelationQuery<IFiscalYear, FiscalYearSelectableField, FiscalYearSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IFiscalYearRelationMap extends Record<FiscalYearRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IFiscalYearRelationQueries = Q.IBaseRelationQueries<IFiscalYear, FiscalYearRelationKey, IFiscalYearRelationMap>;

export type IFiscalYearItemQuery = Q.IBaseItemQuery<
  IFiscalYear,
  FiscalYearRelationKey,
  FiscalYearSelectableField,
  FiscalYearRelationKey,
  FiscalYearSelectableField,
  IFiscalYearRelationMap,
  IFiscalYearRelationQueries
>;

export type IFiscalYearListQuery = Q.IBaseListQuery<
  IFiscalYear,
  FiscalYearRelationKey,
  FiscalYearSelectableField,
  FiscalYearSortableField,
  FiscalYearRelationKey,
  FiscalYearSelectableField,
  FiscalYearSortableField,
  FiscalYearDateRangeField,
  FiscalYearFilterableField,
  IFiscalYearRelationMap,
  IFiscalYearRelationQueries,
  IFiscalYearItemQuery
>;