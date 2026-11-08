// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { OccupancyStatus } from '#/types/place/occupancy-status.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as PlaceTypes from '#/modules/place/types/place.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  OCCUPANCY_RELATION_KEYS,
  OCCUPANCY_SORTABLE_FIELDS,
  OCCUPANCY_SEARCHABLE_FIELDS,
  OCCUPANCY_FILTERABLE_FIELDS,
  OCCUPANCY_DATE_RANGE_FIELDS,
  OCCUPANCY_SELECTABLE_FIELDS,
  OCCUPANCY_DEFAULT_SELECT_FIELDS,
  OCCUPANCY_EDITABLE_FIELDS
} from './occupancy.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Occupancy */
export interface IOccupancy extends B.IBase {
  isCurrent: boolean;
  placeId: string;
  roleId: string;
  status: OccupancyStatus;
  subjectId: string;
  subjectKind: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly place?: PlaceTypes.IPlace;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type OccupancyKey = keyof IOccupancy;

export type OccupancyRelationKey = (typeof OCCUPANCY_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IOccupancyReadonlyFields = B.IBaseReadonlyFields;

export type IOccupancyContextualFields = never;

export type IOccupancySensitiveFields = never;

export type IOccupancyTransitionFields = never;

export type IOccupancyImmutableFields =
  | IOccupancyReadonlyFields
  | IOccupancyContextualFields
  | IOccupancySensitiveFields
  | IOccupancyTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IOccupancyCreatable = Omit<IOccupancy, IOccupancyImmutableFields | OccupancyRelationKey>;

export type IOccupancySystemWritable = Omit<IOccupancy, B.IBaseReadonlyFields | OccupancyRelationKey>;

export type IOccupancyUpdatable = Partial<Omit<IOccupancy, IOccupancyImmutableFields | OccupancyRelationKey>>;

export interface IOccupancyTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type OccupancySortableField = (typeof OCCUPANCY_SORTABLE_FIELDS)[number];

export type OccupancySearchableField = (typeof OCCUPANCY_SEARCHABLE_FIELDS)[number];

export type OccupancyFilterableField = (typeof OCCUPANCY_FILTERABLE_FIELDS)[number];

export type OccupancyDateRangeField = (typeof OCCUPANCY_DATE_RANGE_FIELDS)[number];

export type OccupancySelectableField = (typeof OCCUPANCY_SELECTABLE_FIELDS)[number];

export type OccupancyDefaultSelectField = (typeof OCCUPANCY_DEFAULT_SELECT_FIELDS)[number];

export type OccupancyEditableField = (typeof OCCUPANCY_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IOccupancyAsOneRelationConfig = Q.IOneRelationConfig<'occupancy', OccupancySelectableField>;

export type IOccupancyAsManyRelationConfig = Q.IManyRelationConfig<'occupancys', OccupancySelectableField, OccupancySortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IOccupancyAsOneRelationQuery = Q.IAsOneRelationQuery<IOccupancy, OccupancySelectableField>;

export type IOccupancyAsManyRelationQuery = Q.IAsManyRelationQuery<IOccupancy, OccupancySelectableField, OccupancySortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IOccupancyRelationMap extends Record<OccupancyRelationKey, unknown> {
  place: PlaceTypes.IPlaceAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IOccupancyRelationQueries = Q.IBaseRelationQueries<IOccupancy, OccupancyRelationKey, IOccupancyRelationMap>;

export type IOccupancyItemQuery = Q.IBaseItemQuery<
  IOccupancy,
  OccupancyRelationKey,
  OccupancySelectableField,
  OccupancyRelationKey,
  OccupancySelectableField,
  IOccupancyRelationMap,
  IOccupancyRelationQueries
>;

export type IOccupancyListQuery = Q.IBaseListQuery<
  IOccupancy,
  OccupancyRelationKey,
  OccupancySelectableField,
  OccupancySortableField,
  OccupancyRelationKey,
  OccupancySelectableField,
  OccupancySortableField,
  OccupancyDateRangeField,
  OccupancyFilterableField,
  IOccupancyRelationMap,
  IOccupancyRelationQueries,
  IOccupancyItemQuery
>;