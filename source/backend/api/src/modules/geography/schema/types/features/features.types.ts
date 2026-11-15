// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import * as B from '#/modules/common/schema/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from '#/modules/reference/schema/types/value/value.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  FEATURES_RELATION_KEYS,
  FEATURES_SORTABLE_FIELDS,
  FEATURES_SEARCHABLE_FIELDS,
  FEATURES_FILTERABLE_FIELDS,
  FEATURES_DATE_RANGE_FIELDS,
  FEATURES_SELECTABLE_FIELDS,
  FEATURES_DEFAULT_SELECT_FIELDS,
  FEATURES_EDITABLE_FIELDS
} from './features.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** The sole canonical identity for each geographic entity, independent of type, country or geometry. */
export interface IFeatures extends B.IBase {
  code: string;
  featureTypeId: string;
  readonly featureType?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type FeaturesKey = keyof IFeatures;

export type FeaturesRelationKey = (typeof FEATURES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IFeaturesReadonlyFields = B.IBaseReadonlyFields;

export type IFeaturesContextualFields = never;

export type IFeaturesSensitiveFields = never;

export type IFeaturesTransitionFields = never;

export type IFeaturesImmutableFields =
  | IFeaturesReadonlyFields
  | IFeaturesContextualFields
  | IFeaturesSensitiveFields
  | IFeaturesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IFeaturesCreatable = Omit<IFeatures, IFeaturesImmutableFields | FeaturesRelationKey>;

export type IFeaturesSystemWritable = Omit<IFeatures, B.IBaseReadonlyFields | FeaturesRelationKey>;

export type IFeaturesUpdatable = Partial<Omit<IFeatures, IFeaturesImmutableFields | FeaturesRelationKey>>;

export interface IFeaturesTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type FeaturesSortableField = (typeof FEATURES_SORTABLE_FIELDS)[number];

export type FeaturesSearchableField = (typeof FEATURES_SEARCHABLE_FIELDS)[number];

export type FeaturesFilterableField = (typeof FEATURES_FILTERABLE_FIELDS)[number];

export type FeaturesDateRangeField = (typeof FEATURES_DATE_RANGE_FIELDS)[number];

export type FeaturesSelectableField = (typeof FEATURES_SELECTABLE_FIELDS)[number];

export type FeaturesDefaultSelectField = (typeof FEATURES_DEFAULT_SELECT_FIELDS)[number];

export type FeaturesEditableField = (typeof FEATURES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IFeaturesAsOneRelationConfig = Q.IOneRelationConfig<'features', FeaturesSelectableField>;

export type IFeaturesAsManyRelationConfig = Q.IManyRelationConfig<'featuress', FeaturesSelectableField, FeaturesSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IFeaturesAsOneRelationQuery = Q.IAsOneRelationQuery<IFeatures, FeaturesSelectableField>;

export type IFeaturesAsManyRelationQuery = Q.IAsManyRelationQuery<IFeatures, FeaturesSelectableField, FeaturesSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IFeaturesRelationMap extends Record<FeaturesRelationKey, unknown> {
  featureType: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IFeaturesRelationQueries = Q.IBaseRelationQueries<IFeatures, FeaturesRelationKey, IFeaturesRelationMap>;

export type IFeaturesItemQuery = Q.IBaseItemQuery<
  IFeatures,
  FeaturesRelationKey,
  FeaturesSelectableField,
  FeaturesRelationKey,
  FeaturesSelectableField,
  IFeaturesRelationMap,
  IFeaturesRelationQueries
>;

export type IFeaturesListQuery = Q.IBaseListQuery<
  IFeatures,
  FeaturesRelationKey,
  FeaturesSelectableField,
  FeaturesSortableField,
  FeaturesRelationKey,
  FeaturesSelectableField,
  FeaturesSortableField,
  FeaturesDateRangeField,
  FeaturesFilterableField,
  IFeaturesRelationMap,
  IFeaturesRelationQueries,
  IFeaturesItemQuery
>;