// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as LanguageTypes from "#/modules/reference/schema/types/language/language.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  COPY_RELATION_KEYS,
  COPY_SORTABLE_FIELDS,
  COPY_SEARCHABLE_FIELDS,
  COPY_FILTERABLE_FIELDS,
  COPY_DATE_RANGE_FIELDS,
  COPY_SELECTABLE_FIELDS,
  COPY_DEFAULT_SELECT_FIELDS,
  COPY_EDITABLE_FIELDS,
} from "./copy.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One interface or explanatory wording for one copy key in one language, optionally specific to a country. Screens declare keys; the words live here. */
export interface ICopy extends B.IBase {
  countryId: string | null;
  key: string;
  languageId: string;
  text: string;
  readonly country?: CountryTypes.ICountry;
  readonly language?: LanguageTypes.ILanguage;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type CopyKey = keyof ICopy;

export type CopyRelationKey = (typeof COPY_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ICopyReadonlyFields = B.IBaseReadonlyFields;

export type ICopyContextualFields = never;

export type ICopySensitiveFields = never;

export type ICopyTransitionFields = never;

export type ICopyImmutableFields =
  ICopyReadonlyFields | ICopyContextualFields | ICopySensitiveFields | ICopyTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ICopyCreatable = Omit<ICopy, ICopyImmutableFields | CopyRelationKey>;

export type ICopySystemWritable = Omit<ICopy, B.IBaseReadonlyFields | CopyRelationKey>;

export type ICopyUpdatable = Partial<Omit<ICopy, ICopyImmutableFields | CopyRelationKey>>;

export interface ICopyTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type CopySortableField = (typeof COPY_SORTABLE_FIELDS)[number];

export type CopySearchableField = (typeof COPY_SEARCHABLE_FIELDS)[number];

export type CopyFilterableField = (typeof COPY_FILTERABLE_FIELDS)[number];

export type CopyDateRangeField = (typeof COPY_DATE_RANGE_FIELDS)[number];

export type CopySelectableField = (typeof COPY_SELECTABLE_FIELDS)[number];

export type CopyDefaultSelectField = (typeof COPY_DEFAULT_SELECT_FIELDS)[number];

export type CopyEditableField = (typeof COPY_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ICopyAsOneRelationConfig = Q.IOneRelationConfig<"copy", CopySelectableField>;

export type ICopyAsManyRelationConfig = Q.IManyRelationConfig<
  "copys",
  CopySelectableField,
  CopySortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ICopyAsOneRelationQuery = Q.IAsOneRelationQuery<ICopy, CopySelectableField>;

export type ICopyAsManyRelationQuery = Q.IAsManyRelationQuery<
  ICopy,
  CopySelectableField,
  CopySortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ICopyRelationMap extends Record<CopyRelationKey, unknown> {
  country: CountryTypes.ICountryAsOneRelationQuery;
  language: LanguageTypes.ILanguageAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ICopyRelationQueries = Q.IBaseRelationQueries<ICopy, CopyRelationKey, ICopyRelationMap>;

export type ICopyItemQuery = Q.IBaseItemQuery<
  ICopy,
  CopyRelationKey,
  CopySelectableField,
  CopyRelationKey,
  CopySelectableField,
  ICopyRelationMap,
  ICopyRelationQueries
>;

export type ICopyListQuery = Q.IBaseListQuery<
  ICopy,
  CopyRelationKey,
  CopySelectableField,
  CopySortableField,
  CopyRelationKey,
  CopySelectableField,
  CopySortableField,
  CopyDateRangeField,
  CopyFilterableField,
  ICopyRelationMap,
  ICopyRelationQueries,
  ICopyItemQuery
>;
