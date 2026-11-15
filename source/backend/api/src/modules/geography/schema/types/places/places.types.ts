// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import * as B from '#/modules/common/schema/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as FeaturesTypes from '#/modules/geography/schema/types/features/features.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PLACES_RELATION_KEYS,
  PLACES_SORTABLE_FIELDS,
  PLACES_SEARCHABLE_FIELDS,
  PLACES_FILTERABLE_FIELDS,
  PLACES_DATE_RANGE_FIELDS,
  PLACES_SELECTABLE_FIELDS,
  PLACES_DEFAULT_SELECT_FIELDS,
  PLACES_EDITABLE_FIELDS
} from './places.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Optional physical-place attributes for a feature; does not create a separate identity. */
export interface IPlaces extends B.IBase {
  featureId: string;
  isInhabited: boolean | null;
  readonly feature?: FeaturesTypes.IFeatures;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PlacesKey = keyof IPlaces;

export type PlacesRelationKey = (typeof PLACES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPlacesReadonlyFields = B.IBaseReadonlyFields;

export type IPlacesContextualFields = never;

export type IPlacesSensitiveFields = never;

export type IPlacesTransitionFields = never;

export type IPlacesImmutableFields =
  | IPlacesReadonlyFields
  | IPlacesContextualFields
  | IPlacesSensitiveFields
  | IPlacesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPlacesCreatable = Omit<IPlaces, IPlacesImmutableFields | PlacesRelationKey>;

export type IPlacesSystemWritable = Omit<IPlaces, B.IBaseReadonlyFields | PlacesRelationKey>;

export type IPlacesUpdatable = Partial<Omit<IPlaces, IPlacesImmutableFields | PlacesRelationKey>>;

export interface IPlacesTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PlacesSortableField = (typeof PLACES_SORTABLE_FIELDS)[number];

export type PlacesSearchableField = (typeof PLACES_SEARCHABLE_FIELDS)[number];

export type PlacesFilterableField = (typeof PLACES_FILTERABLE_FIELDS)[number];

export type PlacesDateRangeField = (typeof PLACES_DATE_RANGE_FIELDS)[number];

export type PlacesSelectableField = (typeof PLACES_SELECTABLE_FIELDS)[number];

export type PlacesDefaultSelectField = (typeof PLACES_DEFAULT_SELECT_FIELDS)[number];

export type PlacesEditableField = (typeof PLACES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPlacesAsOneRelationConfig = Q.IOneRelationConfig<'places', PlacesSelectableField>;

export type IPlacesAsManyRelationConfig = Q.IManyRelationConfig<'placess', PlacesSelectableField, PlacesSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPlacesAsOneRelationQuery = Q.IAsOneRelationQuery<IPlaces, PlacesSelectableField>;

export type IPlacesAsManyRelationQuery = Q.IAsManyRelationQuery<IPlaces, PlacesSelectableField, PlacesSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPlacesRelationMap extends Record<PlacesRelationKey, unknown> {
  feature: FeaturesTypes.IFeaturesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPlacesRelationQueries = Q.IBaseRelationQueries<IPlaces, PlacesRelationKey, IPlacesRelationMap>;

export type IPlacesItemQuery = Q.IBaseItemQuery<
  IPlaces,
  PlacesRelationKey,
  PlacesSelectableField,
  PlacesRelationKey,
  PlacesSelectableField,
  IPlacesRelationMap,
  IPlacesRelationQueries
>;

export type IPlacesListQuery = Q.IBaseListQuery<
  IPlaces,
  PlacesRelationKey,
  PlacesSelectableField,
  PlacesSortableField,
  PlacesRelationKey,
  PlacesSelectableField,
  PlacesSortableField,
  PlacesDateRangeField,
  PlacesFilterableField,
  IPlacesRelationMap,
  IPlacesRelationQueries,
  IPlacesItemQuery
>;