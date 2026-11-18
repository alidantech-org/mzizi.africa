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

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  LEVELS_RELATION_KEYS,
  LEVELS_SORTABLE_FIELDS,
  LEVELS_SEARCHABLE_FIELDS,
  LEVELS_FILTERABLE_FIELDS,
  LEVELS_DATE_RANGE_FIELDS,
  LEVELS_SELECTABLE_FIELDS,
  LEVELS_DEFAULT_SELECT_FIELDS,
  LEVELS_EDITABLE_FIELDS,
} from "./levels.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One level of a country's administrative or electoral ladder: its depth and the kind of place found there. The ladder is data, so no screen or read names levels. */
export interface ILevels extends B.IBase {
  code: string;
  countryId: string;
  depth: number;
  featureKindId: string;
  hierarchyKindId: string;
  isRoutingHierarchy: boolean;
  readonly country?: CountryTypes.ICountry;
  readonly featureKind?: ValueTypes.IValue;
  readonly hierarchyKind?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type LevelsKey = keyof ILevels;

export type LevelsRelationKey = (typeof LEVELS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ILevelsReadonlyFields = B.IBaseReadonlyFields;

export type ILevelsContextualFields = never;

export type ILevelsSensitiveFields = never;

export type ILevelsTransitionFields = never;

export type ILevelsImmutableFields =
  | ILevelsReadonlyFields
  | ILevelsContextualFields
  | ILevelsSensitiveFields
  | ILevelsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ILevelsCreatable = Omit<ILevels, ILevelsImmutableFields | LevelsRelationKey>;

export type ILevelsSystemWritable = Omit<ILevels, B.IBaseReadonlyFields | LevelsRelationKey>;

export type ILevelsUpdatable = Partial<Omit<ILevels, ILevelsImmutableFields | LevelsRelationKey>>;

export interface ILevelsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type LevelsSortableField = (typeof LEVELS_SORTABLE_FIELDS)[number];

export type LevelsSearchableField = (typeof LEVELS_SEARCHABLE_FIELDS)[number];

export type LevelsFilterableField = (typeof LEVELS_FILTERABLE_FIELDS)[number];

export type LevelsDateRangeField = (typeof LEVELS_DATE_RANGE_FIELDS)[number];

export type LevelsSelectableField = (typeof LEVELS_SELECTABLE_FIELDS)[number];

export type LevelsDefaultSelectField = (typeof LEVELS_DEFAULT_SELECT_FIELDS)[number];

export type LevelsEditableField = (typeof LEVELS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ILevelsAsOneRelationConfig = Q.IOneRelationConfig<"levels", LevelsSelectableField>;

export type ILevelsAsManyRelationConfig = Q.IManyRelationConfig<
  "levels",
  LevelsSelectableField,
  LevelsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ILevelsAsOneRelationQuery = Q.IAsOneRelationQuery<ILevels, LevelsSelectableField>;

export type ILevelsAsManyRelationQuery = Q.IAsManyRelationQuery<
  ILevels,
  LevelsSelectableField,
  LevelsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ILevelsRelationMap extends Record<LevelsRelationKey, unknown> {
  country: CountryTypes.ICountryAsOneRelationQuery;
  featureKind: ValueTypes.IValueAsOneRelationQuery;
  hierarchyKind: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ILevelsRelationQueries = Q.IBaseRelationQueries<
  ILevels,
  LevelsRelationKey,
  ILevelsRelationMap
>;

export type ILevelsItemQuery = Q.IBaseItemQuery<
  ILevels,
  LevelsRelationKey,
  LevelsSelectableField,
  LevelsRelationKey,
  LevelsSelectableField,
  ILevelsRelationMap,
  ILevelsRelationQueries
>;

export type ILevelsListQuery = Q.IBaseListQuery<
  ILevels,
  LevelsRelationKey,
  LevelsSelectableField,
  LevelsSortableField,
  LevelsRelationKey,
  LevelsSelectableField,
  LevelsSortableField,
  LevelsDateRangeField,
  LevelsFilterableField,
  ILevelsRelationMap,
  ILevelsRelationQueries,
  ILevelsItemQuery
>;
