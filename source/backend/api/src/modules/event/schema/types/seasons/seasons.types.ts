// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SEASONS_RELATION_KEYS,
  SEASONS_SORTABLE_FIELDS,
  SEASONS_SEARCHABLE_FIELDS,
  SEASONS_FILTERABLE_FIELDS,
  SEASONS_DATE_RANGE_FIELDS,
  SEASONS_SELECTABLE_FIELDS,
  SEASONS_DEFAULT_SELECT_FIELDS,
  SEASONS_EDITABLE_FIELDS,
} from "./seasons.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A recurring yearly window, natural or human: the long rains, a planting season, a school term, for a country or a place. Gives the calendar its seasonal context and explains recurring patterns in data. */
export interface ISeasons extends B.IBase {
  code: string;
  countryId: string;
  description: string | null;
  endDay: number | null;
  endMonth: number;
  fromToPrecision: DatePrecision | null;
  fromYear: number | null;
  isNatural: boolean;
  scopeFeatureId: string | null;
  seasonKindId: string;
  sourceCitationId: string | null;
  startDay: number | null;
  startMonth: number;
  toYear: number | null;
  readonly country?: CountryTypes.ICountry;
  readonly scopeFeature?: FeaturesTypes.IFeatures;
  readonly seasonKind?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SeasonsKey = keyof ISeasons;

export type SeasonsRelationKey = (typeof SEASONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISeasonsReadonlyFields = B.IBaseReadonlyFields;

export type ISeasonsContextualFields = never;

export type ISeasonsSensitiveFields = never;

export type ISeasonsTransitionFields = never;

export type ISeasonsImmutableFields =
  | ISeasonsReadonlyFields
  | ISeasonsContextualFields
  | ISeasonsSensitiveFields
  | ISeasonsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISeasonsCreatable = Omit<ISeasons, ISeasonsImmutableFields | SeasonsRelationKey>;

export type ISeasonsSystemWritable = Omit<ISeasons, B.IBaseReadonlyFields | SeasonsRelationKey>;

export type ISeasonsUpdatable = Partial<
  Omit<ISeasons, ISeasonsImmutableFields | SeasonsRelationKey>
>;

export interface ISeasonsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SeasonsSortableField = (typeof SEASONS_SORTABLE_FIELDS)[number];

export type SeasonsSearchableField = (typeof SEASONS_SEARCHABLE_FIELDS)[number];

export type SeasonsFilterableField = (typeof SEASONS_FILTERABLE_FIELDS)[number];

export type SeasonsDateRangeField = (typeof SEASONS_DATE_RANGE_FIELDS)[number];

export type SeasonsSelectableField = (typeof SEASONS_SELECTABLE_FIELDS)[number];

export type SeasonsDefaultSelectField = (typeof SEASONS_DEFAULT_SELECT_FIELDS)[number];

export type SeasonsEditableField = (typeof SEASONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISeasonsAsOneRelationConfig = Q.IOneRelationConfig<"seasons", SeasonsSelectableField>;

export type ISeasonsAsManyRelationConfig = Q.IManyRelationConfig<
  "seasons",
  SeasonsSelectableField,
  SeasonsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISeasonsAsOneRelationQuery = Q.IAsOneRelationQuery<ISeasons, SeasonsSelectableField>;

export type ISeasonsAsManyRelationQuery = Q.IAsManyRelationQuery<
  ISeasons,
  SeasonsSelectableField,
  SeasonsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISeasonsRelationMap extends Record<SeasonsRelationKey, unknown> {
  country: CountryTypes.ICountryAsOneRelationQuery;
  scopeFeature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  seasonKind: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISeasonsRelationQueries = Q.IBaseRelationQueries<
  ISeasons,
  SeasonsRelationKey,
  ISeasonsRelationMap
>;

export type ISeasonsItemQuery = Q.IBaseItemQuery<
  ISeasons,
  SeasonsRelationKey,
  SeasonsSelectableField,
  SeasonsRelationKey,
  SeasonsSelectableField,
  ISeasonsRelationMap,
  ISeasonsRelationQueries
>;

export type ISeasonsListQuery = Q.IBaseListQuery<
  ISeasons,
  SeasonsRelationKey,
  SeasonsSelectableField,
  SeasonsSortableField,
  SeasonsRelationKey,
  SeasonsSelectableField,
  SeasonsSortableField,
  SeasonsDateRangeField,
  SeasonsFilterableField,
  ISeasonsRelationMap,
  ISeasonsRelationQueries,
  ISeasonsItemQuery
>;
