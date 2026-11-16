// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  CLASSIFICATIONS_RELATION_KEYS,
  CLASSIFICATIONS_SORTABLE_FIELDS,
  CLASSIFICATIONS_SEARCHABLE_FIELDS,
  CLASSIFICATIONS_FILTERABLE_FIELDS,
  CLASSIFICATIONS_DATE_RANGE_FIELDS,
  CLASSIFICATIONS_SELECTABLE_FIELDS,
  CLASSIFICATIONS_DEFAULT_SELECT_FIELDS,
  CLASSIFICATIONS_EDITABLE_FIELDS,
} from "./classifications.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One dated classification of a feature by a scheme value, so a feature can answer several classification questions and change over time. */
export interface IClassifications extends B.IBase {
  featureId: string;
  validFrom: Date | null;
  validFromEarliest: Date | null;
  validFromLatest: Date | null;
  validUntil: Date | null;
  validUntilEarliest: Date | null;
  validUntilLatest: Date | null;
  valueId: string;
  readonly feature?: FeaturesTypes.IFeatures;
  readonly value?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ClassificationsKey = keyof IClassifications;

export type ClassificationsRelationKey = (typeof CLASSIFICATIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IClassificationsReadonlyFields = B.IBaseReadonlyFields;

export type IClassificationsContextualFields = never;

export type IClassificationsSensitiveFields = never;

export type IClassificationsTransitionFields = never;

export type IClassificationsImmutableFields =
  | IClassificationsReadonlyFields
  | IClassificationsContextualFields
  | IClassificationsSensitiveFields
  | IClassificationsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IClassificationsCreatable = Omit<
  IClassifications,
  IClassificationsImmutableFields | ClassificationsRelationKey
>;

export type IClassificationsSystemWritable = Omit<
  IClassifications,
  B.IBaseReadonlyFields | ClassificationsRelationKey
>;

export type IClassificationsUpdatable = Partial<
  Omit<IClassifications, IClassificationsImmutableFields | ClassificationsRelationKey>
>;

export interface IClassificationsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ClassificationsSortableField = (typeof CLASSIFICATIONS_SORTABLE_FIELDS)[number];

export type ClassificationsSearchableField = (typeof CLASSIFICATIONS_SEARCHABLE_FIELDS)[number];

export type ClassificationsFilterableField = (typeof CLASSIFICATIONS_FILTERABLE_FIELDS)[number];

export type ClassificationsDateRangeField = (typeof CLASSIFICATIONS_DATE_RANGE_FIELDS)[number];

export type ClassificationsSelectableField = (typeof CLASSIFICATIONS_SELECTABLE_FIELDS)[number];

export type ClassificationsDefaultSelectField =
  (typeof CLASSIFICATIONS_DEFAULT_SELECT_FIELDS)[number];

export type ClassificationsEditableField = (typeof CLASSIFICATIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IClassificationsAsOneRelationConfig = Q.IOneRelationConfig<
  "classifications",
  ClassificationsSelectableField
>;

export type IClassificationsAsManyRelationConfig = Q.IManyRelationConfig<
  "classifications",
  ClassificationsSelectableField,
  ClassificationsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IClassificationsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IClassifications,
  ClassificationsSelectableField
>;

export type IClassificationsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IClassifications,
  ClassificationsSelectableField,
  ClassificationsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IClassificationsRelationMap extends Record<ClassificationsRelationKey, unknown> {
  feature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  value: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IClassificationsRelationQueries = Q.IBaseRelationQueries<
  IClassifications,
  ClassificationsRelationKey,
  IClassificationsRelationMap
>;

export type IClassificationsItemQuery = Q.IBaseItemQuery<
  IClassifications,
  ClassificationsRelationKey,
  ClassificationsSelectableField,
  ClassificationsRelationKey,
  ClassificationsSelectableField,
  IClassificationsRelationMap,
  IClassificationsRelationQueries
>;

export type IClassificationsListQuery = Q.IBaseListQuery<
  IClassifications,
  ClassificationsRelationKey,
  ClassificationsSelectableField,
  ClassificationsSortableField,
  ClassificationsRelationKey,
  ClassificationsSelectableField,
  ClassificationsSortableField,
  ClassificationsDateRangeField,
  ClassificationsFilterableField,
  IClassificationsRelationMap,
  IClassificationsRelationQueries,
  IClassificationsItemQuery
>;
