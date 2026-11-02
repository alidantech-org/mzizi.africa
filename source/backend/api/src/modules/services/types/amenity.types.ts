// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  AMENITY_RELATION_KEYS,
  AMENITY_SORTABLE_FIELDS,
  AMENITY_SEARCHABLE_FIELDS,
  AMENITY_FILTERABLE_FIELDS,
  AMENITY_DATE_RANGE_FIELDS,
  AMENITY_SELECTABLE_FIELDS,
  AMENITY_DEFAULT_SELECT_FIELDS,
  AMENITY_EDITABLE_FIELDS
} from './amenity.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Amenity */
export interface IAmenity extends B.IBase {
  code: string;
  isActive: boolean;
  isCurrent: boolean;
  jurisdictionId: string;
  name: string;
  sectorId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type AmenityKey = keyof IAmenity;

export type AmenityRelationKey = (typeof AMENITY_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IAmenityReadonlyFields = B.IBaseReadonlyFields;

export type IAmenityContextualFields = never;

export type IAmenitySensitiveFields = never;

export type IAmenityTransitionFields = never;

export type IAmenityImmutableFields =
  | IAmenityReadonlyFields
  | IAmenityContextualFields
  | IAmenitySensitiveFields
  | IAmenityTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IAmenityCreatable = Omit<IAmenity, IAmenityImmutableFields | AmenityRelationKey>;

export type IAmenitySystemWritable = Omit<IAmenity, B.IBaseReadonlyFields | AmenityRelationKey>;

export type IAmenityUpdatable = Partial<Omit<IAmenity, IAmenityImmutableFields | AmenityRelationKey>>;

export interface IAmenityTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type AmenitySortableField = (typeof AMENITY_SORTABLE_FIELDS)[number];

export type AmenitySearchableField = (typeof AMENITY_SEARCHABLE_FIELDS)[number];

export type AmenityFilterableField = (typeof AMENITY_FILTERABLE_FIELDS)[number];

export type AmenityDateRangeField = (typeof AMENITY_DATE_RANGE_FIELDS)[number];

export type AmenitySelectableField = (typeof AMENITY_SELECTABLE_FIELDS)[number];

export type AmenityDefaultSelectField = (typeof AMENITY_DEFAULT_SELECT_FIELDS)[number];

export type AmenityEditableField = (typeof AMENITY_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IAmenityAsOneRelationConfig = Q.IOneRelationConfig<'amenity', AmenitySelectableField>;

export type IAmenityAsManyRelationConfig = Q.IManyRelationConfig<'amenitys', AmenitySelectableField, AmenitySortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IAmenityAsOneRelationQuery = Q.IAsOneRelationQuery<IAmenity, AmenitySelectableField>;

export type IAmenityAsManyRelationQuery = Q.IAsManyRelationQuery<IAmenity, AmenitySelectableField, AmenitySortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IAmenityRelationMap extends Record<AmenityRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IAmenityRelationQueries = Q.IBaseRelationQueries<IAmenity, AmenityRelationKey, IAmenityRelationMap>;

export type IAmenityItemQuery = Q.IBaseItemQuery<
  IAmenity,
  AmenityRelationKey,
  AmenitySelectableField,
  AmenityRelationKey,
  AmenitySelectableField,
  IAmenityRelationMap,
  IAmenityRelationQueries
>;

export type IAmenityListQuery = Q.IBaseListQuery<
  IAmenity,
  AmenityRelationKey,
  AmenitySelectableField,
  AmenitySortableField,
  AmenityRelationKey,
  AmenitySelectableField,
  AmenitySortableField,
  AmenityDateRangeField,
  AmenityFilterableField,
  IAmenityRelationMap,
  IAmenityRelationQueries,
  IAmenityItemQuery
>;