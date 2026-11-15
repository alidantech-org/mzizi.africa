// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  COUNTRY_RELATION_KEYS,
  COUNTRY_SORTABLE_FIELDS,
  COUNTRY_SEARCHABLE_FIELDS,
  COUNTRY_FILTERABLE_FIELDS,
  COUNTRY_DATE_RANGE_FIELDS,
  COUNTRY_SELECTABLE_FIELDS,
  COUNTRY_DEFAULT_SELECT_FIELDS,
  COUNTRY_EDITABLE_FIELDS
} from './country.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Canonical identity for a modern country; not a geographic unit or historical polity. */
export interface ICountry extends B.IBase {
  code: string;
  name: string;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type CountryKey = keyof ICountry;

export type CountryRelationKey = (typeof COUNTRY_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ICountryReadonlyFields = B.IBaseReadonlyFields;

export type ICountryContextualFields = never;

export type ICountrySensitiveFields = never;

export type ICountryTransitionFields = never;

export type ICountryImmutableFields =
  | ICountryReadonlyFields
  | ICountryContextualFields
  | ICountrySensitiveFields
  | ICountryTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ICountryCreatable = Omit<ICountry, ICountryImmutableFields | CountryRelationKey>;

export type ICountrySystemWritable = Omit<ICountry, B.IBaseReadonlyFields | CountryRelationKey>;

export type ICountryUpdatable = Partial<Omit<ICountry, ICountryImmutableFields | CountryRelationKey>>;

export interface ICountryTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type CountrySortableField = (typeof COUNTRY_SORTABLE_FIELDS)[number];

export type CountrySearchableField = (typeof COUNTRY_SEARCHABLE_FIELDS)[number];

export type CountryFilterableField = (typeof COUNTRY_FILTERABLE_FIELDS)[number];

export type CountryDateRangeField = (typeof COUNTRY_DATE_RANGE_FIELDS)[number];

export type CountrySelectableField = (typeof COUNTRY_SELECTABLE_FIELDS)[number];

export type CountryDefaultSelectField = (typeof COUNTRY_DEFAULT_SELECT_FIELDS)[number];

export type CountryEditableField = (typeof COUNTRY_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ICountryAsOneRelationConfig = Q.IOneRelationConfig<'country', CountrySelectableField>;

export type ICountryAsManyRelationConfig = Q.IManyRelationConfig<'countrys', CountrySelectableField, CountrySortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ICountryAsOneRelationQuery = Q.IAsOneRelationQuery<ICountry, CountrySelectableField>;

export type ICountryAsManyRelationQuery = Q.IAsManyRelationQuery<ICountry, CountrySelectableField, CountrySortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ICountryRelationMap extends Record<CountryRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ICountryRelationQueries = Q.IBaseRelationQueries<ICountry, CountryRelationKey, ICountryRelationMap>;

export type ICountryItemQuery = Q.IBaseItemQuery<
  ICountry,
  CountryRelationKey,
  CountrySelectableField,
  CountryRelationKey,
  CountrySelectableField,
  ICountryRelationMap,
  ICountryRelationQueries
>;

export type ICountryListQuery = Q.IBaseListQuery<
  ICountry,
  CountryRelationKey,
  CountrySelectableField,
  CountrySortableField,
  CountryRelationKey,
  CountrySelectableField,
  CountrySortableField,
  CountryDateRangeField,
  CountryFilterableField,
  ICountryRelationMap,
  ICountryRelationQueries,
  ICountryItemQuery
>;