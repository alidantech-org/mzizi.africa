// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as InstitutionsTypes from "#/modules/governance/schema/types/institutions/institutions.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  TERMS_RELATION_KEYS,
  TERMS_SORTABLE_FIELDS,
  TERMS_SEARCHABLE_FIELDS,
  TERMS_FILTERABLE_FIELDS,
  TERMS_DATE_RANGE_FIELDS,
  TERMS_SELECTABLE_FIELDS,
  TERMS_DEFAULT_SELECT_FIELDS,
  TERMS_EDITABLE_FIELDS,
} from "./terms.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A fixed period for which offices are filled: a presidential term, a parliament, a county assembly. Elections, by-elections, mandates and sittings belong to a term. */
export interface ITerms extends B.IBase {
  code: string;
  countryId: string;
  endsOn: Date | null;
  institutionId: string | null;
  ordinal: number | null;
  sourceCitationId: string | null;
  startsOn: Date;
  termKindId: string;
  unitFeatureId: string | null;
  readonly country?: CountryTypes.ICountry;
  readonly institution?: InstitutionsTypes.IInstitutions;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly termKind?: ValueTypes.IValue;
  readonly unitFeature?: FeaturesTypes.IFeatures;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type TermsKey = keyof ITerms;

export type TermsRelationKey = (typeof TERMS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ITermsReadonlyFields = B.IBaseReadonlyFields;

export type ITermsContextualFields = never;

export type ITermsSensitiveFields = never;

export type ITermsTransitionFields = never;

export type ITermsImmutableFields =
  ITermsReadonlyFields | ITermsContextualFields | ITermsSensitiveFields | ITermsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ITermsCreatable = Omit<ITerms, ITermsImmutableFields | TermsRelationKey>;

export type ITermsSystemWritable = Omit<ITerms, B.IBaseReadonlyFields | TermsRelationKey>;

export type ITermsUpdatable = Partial<Omit<ITerms, ITermsImmutableFields | TermsRelationKey>>;

export interface ITermsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type TermsSortableField = (typeof TERMS_SORTABLE_FIELDS)[number];

export type TermsSearchableField = (typeof TERMS_SEARCHABLE_FIELDS)[number];

export type TermsFilterableField = (typeof TERMS_FILTERABLE_FIELDS)[number];

export type TermsDateRangeField = (typeof TERMS_DATE_RANGE_FIELDS)[number];

export type TermsSelectableField = (typeof TERMS_SELECTABLE_FIELDS)[number];

export type TermsDefaultSelectField = (typeof TERMS_DEFAULT_SELECT_FIELDS)[number];

export type TermsEditableField = (typeof TERMS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ITermsAsOneRelationConfig = Q.IOneRelationConfig<"terms", TermsSelectableField>;

export type ITermsAsManyRelationConfig = Q.IManyRelationConfig<
  "terms",
  TermsSelectableField,
  TermsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ITermsAsOneRelationQuery = Q.IAsOneRelationQuery<ITerms, TermsSelectableField>;

export type ITermsAsManyRelationQuery = Q.IAsManyRelationQuery<
  ITerms,
  TermsSelectableField,
  TermsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ITermsRelationMap extends Record<TermsRelationKey, unknown> {
  country: CountryTypes.ICountryAsOneRelationQuery;
  institution: InstitutionsTypes.IInstitutionsAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  termKind: ValueTypes.IValueAsOneRelationQuery;
  unitFeature: FeaturesTypes.IFeaturesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ITermsRelationQueries = Q.IBaseRelationQueries<
  ITerms,
  TermsRelationKey,
  ITermsRelationMap
>;

export type ITermsItemQuery = Q.IBaseItemQuery<
  ITerms,
  TermsRelationKey,
  TermsSelectableField,
  TermsRelationKey,
  TermsSelectableField,
  ITermsRelationMap,
  ITermsRelationQueries
>;

export type ITermsListQuery = Q.IBaseListQuery<
  ITerms,
  TermsRelationKey,
  TermsSelectableField,
  TermsSortableField,
  TermsRelationKey,
  TermsSelectableField,
  TermsSortableField,
  TermsDateRangeField,
  TermsFilterableField,
  ITermsRelationMap,
  ITermsRelationQueries,
  ITermsItemQuery
>;
