// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { PlaceKind } from '#/types/place/place-kind.enum';
import type { PlaceStatus } from '#/types/place/place-status.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PLACE_RELATION_KEYS,
  PLACE_SORTABLE_FIELDS,
  PLACE_SEARCHABLE_FIELDS,
  PLACE_FILTERABLE_FIELDS,
  PLACE_DATE_RANGE_FIELDS,
  PLACE_SELECTABLE_FIELDS,
  PLACE_DEFAULT_SELECT_FIELDS,
  PLACE_EDITABLE_FIELDS
} from './place.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Place */
export interface IPlace extends B.IBase {
  addressText: string | null;
  availableFrom: Date | null;
  buildingTypeId: string | null;
  isCurrent: boolean;
  kind: PlaceKind;
  latitude: number | null;
  locatedInUnitId: string | null;
  longitude: number | null;
  name: string;
  parentId: string | null;
  status: PlaceStatus;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PlaceKey = keyof IPlace;

export type PlaceRelationKey = (typeof PLACE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPlaceReadonlyFields = B.IBaseReadonlyFields;

export type IPlaceContextualFields = never;

export type IPlaceSensitiveFields = never;

export type IPlaceTransitionFields = never;

export type IPlaceImmutableFields =
  | IPlaceReadonlyFields
  | IPlaceContextualFields
  | IPlaceSensitiveFields
  | IPlaceTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPlaceCreatable = Omit<IPlace, IPlaceImmutableFields | PlaceRelationKey>;

export type IPlaceSystemWritable = Omit<IPlace, B.IBaseReadonlyFields | PlaceRelationKey>;

export type IPlaceUpdatable = Partial<Omit<IPlace, IPlaceImmutableFields | PlaceRelationKey>>;

export interface IPlaceTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PlaceSortableField = (typeof PLACE_SORTABLE_FIELDS)[number];

export type PlaceSearchableField = (typeof PLACE_SEARCHABLE_FIELDS)[number];

export type PlaceFilterableField = (typeof PLACE_FILTERABLE_FIELDS)[number];

export type PlaceDateRangeField = (typeof PLACE_DATE_RANGE_FIELDS)[number];

export type PlaceSelectableField = (typeof PLACE_SELECTABLE_FIELDS)[number];

export type PlaceDefaultSelectField = (typeof PLACE_DEFAULT_SELECT_FIELDS)[number];

export type PlaceEditableField = (typeof PLACE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPlaceAsOneRelationConfig = Q.IOneRelationConfig<'place', PlaceSelectableField>;

export type IPlaceAsManyRelationConfig = Q.IManyRelationConfig<'places', PlaceSelectableField, PlaceSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPlaceAsOneRelationQuery = Q.IAsOneRelationQuery<IPlace, PlaceSelectableField>;

export type IPlaceAsManyRelationQuery = Q.IAsManyRelationQuery<IPlace, PlaceSelectableField, PlaceSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPlaceRelationMap extends Record<PlaceRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPlaceRelationQueries = Q.IBaseRelationQueries<IPlace, PlaceRelationKey, IPlaceRelationMap>;

export type IPlaceItemQuery = Q.IBaseItemQuery<
  IPlace,
  PlaceRelationKey,
  PlaceSelectableField,
  PlaceRelationKey,
  PlaceSelectableField,
  IPlaceRelationMap,
  IPlaceRelationQueries
>;

export type IPlaceListQuery = Q.IBaseListQuery<
  IPlace,
  PlaceRelationKey,
  PlaceSelectableField,
  PlaceSortableField,
  PlaceRelationKey,
  PlaceSelectableField,
  PlaceSortableField,
  PlaceDateRangeField,
  PlaceFilterableField,
  IPlaceRelationMap,
  IPlaceRelationQueries,
  IPlaceItemQuery
>;