// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  FISCAL_PERIODS_RELATION_KEYS,
  FISCAL_PERIODS_SORTABLE_FIELDS,
  FISCAL_PERIODS_SEARCHABLE_FIELDS,
  FISCAL_PERIODS_FILTERABLE_FIELDS,
  FISCAL_PERIODS_DATE_RANGE_FIELDS,
  FISCAL_PERIODS_SELECTABLE_FIELDS,
  FISCAL_PERIODS_DEFAULT_SELECT_FIELDS,
  FISCAL_PERIODS_EDITABLE_FIELDS,
} from "./fiscal-periods.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One fiscal reporting period for a country, with explicit date bounds and source citation. */
export interface IFiscalPeriods extends B.IBase {
  code: string;
  countryId: string | null;
  endsOn: Date;
  periodKindId: string;
  sourceCitationId: string | null;
  startsOn: Date;
  readonly country?: CountryTypes.ICountry;
  readonly periodKind?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type FiscalPeriodsKey = keyof IFiscalPeriods;

export type FiscalPeriodsRelationKey = (typeof FISCAL_PERIODS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IFiscalPeriodsReadonlyFields = B.IBaseReadonlyFields;

export type IFiscalPeriodsContextualFields = never;

export type IFiscalPeriodsSensitiveFields = never;

export type IFiscalPeriodsTransitionFields = never;

export type IFiscalPeriodsImmutableFields =
  | IFiscalPeriodsReadonlyFields
  | IFiscalPeriodsContextualFields
  | IFiscalPeriodsSensitiveFields
  | IFiscalPeriodsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IFiscalPeriodsCreatable = Omit<
  IFiscalPeriods,
  IFiscalPeriodsImmutableFields | FiscalPeriodsRelationKey
>;

export type IFiscalPeriodsSystemWritable = Omit<
  IFiscalPeriods,
  B.IBaseReadonlyFields | FiscalPeriodsRelationKey
>;

export type IFiscalPeriodsUpdatable = Partial<
  Omit<IFiscalPeriods, IFiscalPeriodsImmutableFields | FiscalPeriodsRelationKey>
>;

export interface IFiscalPeriodsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type FiscalPeriodsSortableField = (typeof FISCAL_PERIODS_SORTABLE_FIELDS)[number];

export type FiscalPeriodsSearchableField = (typeof FISCAL_PERIODS_SEARCHABLE_FIELDS)[number];

export type FiscalPeriodsFilterableField = (typeof FISCAL_PERIODS_FILTERABLE_FIELDS)[number];

export type FiscalPeriodsDateRangeField = (typeof FISCAL_PERIODS_DATE_RANGE_FIELDS)[number];

export type FiscalPeriodsSelectableField = (typeof FISCAL_PERIODS_SELECTABLE_FIELDS)[number];

export type FiscalPeriodsDefaultSelectField = (typeof FISCAL_PERIODS_DEFAULT_SELECT_FIELDS)[number];

export type FiscalPeriodsEditableField = (typeof FISCAL_PERIODS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IFiscalPeriodsAsOneRelationConfig = Q.IOneRelationConfig<
  "fiscalPeriods",
  FiscalPeriodsSelectableField
>;

export type IFiscalPeriodsAsManyRelationConfig = Q.IManyRelationConfig<
  "fiscalPeriods",
  FiscalPeriodsSelectableField,
  FiscalPeriodsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IFiscalPeriodsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IFiscalPeriods,
  FiscalPeriodsSelectableField
>;

export type IFiscalPeriodsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IFiscalPeriods,
  FiscalPeriodsSelectableField,
  FiscalPeriodsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IFiscalPeriodsRelationMap extends Record<FiscalPeriodsRelationKey, unknown> {
  country: CountryTypes.ICountryAsOneRelationQuery;
  periodKind: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IFiscalPeriodsRelationQueries = Q.IBaseRelationQueries<
  IFiscalPeriods,
  FiscalPeriodsRelationKey,
  IFiscalPeriodsRelationMap
>;

export type IFiscalPeriodsItemQuery = Q.IBaseItemQuery<
  IFiscalPeriods,
  FiscalPeriodsRelationKey,
  FiscalPeriodsSelectableField,
  FiscalPeriodsRelationKey,
  FiscalPeriodsSelectableField,
  IFiscalPeriodsRelationMap,
  IFiscalPeriodsRelationQueries
>;

export type IFiscalPeriodsListQuery = Q.IBaseListQuery<
  IFiscalPeriods,
  FiscalPeriodsRelationKey,
  FiscalPeriodsSelectableField,
  FiscalPeriodsSortableField,
  FiscalPeriodsRelationKey,
  FiscalPeriodsSelectableField,
  FiscalPeriodsSortableField,
  FiscalPeriodsDateRangeField,
  FiscalPeriodsFilterableField,
  IFiscalPeriodsRelationMap,
  IFiscalPeriodsRelationQueries,
  IFiscalPeriodsItemQuery
>;
