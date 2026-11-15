// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PATTERN_RELATION_KEYS,
  PATTERN_SORTABLE_FIELDS,
  PATTERN_SEARCHABLE_FIELDS,
  PATTERN_FILTERABLE_FIELDS,
  PATTERN_DATE_RANGE_FIELDS,
  PATTERN_SELECTABLE_FIELDS,
  PATTERN_DEFAULT_SELECT_FIELDS,
  PATTERN_EDITABLE_FIELDS,
} from "./pattern.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Stable identity for a reusable, reviewed pattern definition. */
export interface IPattern extends B.IBase {
  code: string;
  title: string;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PatternKey = keyof IPattern;

export type PatternRelationKey = (typeof PATTERN_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPatternReadonlyFields = B.IBaseReadonlyFields;

export type IPatternContextualFields = never;

export type IPatternSensitiveFields = never;

export type IPatternTransitionFields = never;

export type IPatternImmutableFields =
  | IPatternReadonlyFields
  | IPatternContextualFields
  | IPatternSensitiveFields
  | IPatternTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPatternCreatable = Omit<IPattern, IPatternImmutableFields | PatternRelationKey>;

export type IPatternSystemWritable = Omit<IPattern, B.IBaseReadonlyFields | PatternRelationKey>;

export type IPatternUpdatable = Partial<
  Omit<IPattern, IPatternImmutableFields | PatternRelationKey>
>;

export interface IPatternTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PatternSortableField = (typeof PATTERN_SORTABLE_FIELDS)[number];

export type PatternSearchableField = (typeof PATTERN_SEARCHABLE_FIELDS)[number];

export type PatternFilterableField = (typeof PATTERN_FILTERABLE_FIELDS)[number];

export type PatternDateRangeField = (typeof PATTERN_DATE_RANGE_FIELDS)[number];

export type PatternSelectableField = (typeof PATTERN_SELECTABLE_FIELDS)[number];

export type PatternDefaultSelectField = (typeof PATTERN_DEFAULT_SELECT_FIELDS)[number];

export type PatternEditableField = (typeof PATTERN_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPatternAsOneRelationConfig = Q.IOneRelationConfig<"pattern", PatternSelectableField>;

export type IPatternAsManyRelationConfig = Q.IManyRelationConfig<
  "patterns",
  PatternSelectableField,
  PatternSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPatternAsOneRelationQuery = Q.IAsOneRelationQuery<IPattern, PatternSelectableField>;

export type IPatternAsManyRelationQuery = Q.IAsManyRelationQuery<
  IPattern,
  PatternSelectableField,
  PatternSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPatternRelationMap extends Record<PatternRelationKey, unknown> {}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPatternRelationQueries = Q.IBaseRelationQueries<
  IPattern,
  PatternRelationKey,
  IPatternRelationMap
>;

export type IPatternItemQuery = Q.IBaseItemQuery<
  IPattern,
  PatternRelationKey,
  PatternSelectableField,
  PatternRelationKey,
  PatternSelectableField,
  IPatternRelationMap,
  IPatternRelationQueries
>;

export type IPatternListQuery = Q.IBaseListQuery<
  IPattern,
  PatternRelationKey,
  PatternSelectableField,
  PatternSortableField,
  PatternRelationKey,
  PatternSelectableField,
  PatternSortableField,
  PatternDateRangeField,
  PatternFilterableField,
  IPatternRelationMap,
  IPatternRelationQueries,
  IPatternItemQuery
>;
