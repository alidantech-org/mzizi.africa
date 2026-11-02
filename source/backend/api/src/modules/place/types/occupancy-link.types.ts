// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { OccupancyLinkKind } from '#/types/place/occupancy-link-kind.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as OccupancyTypes from '#/modules/place/types/occupancy.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  OCCUPANCY_LINK_RELATION_KEYS,
  OCCUPANCY_LINK_SORTABLE_FIELDS,
  OCCUPANCY_LINK_SEARCHABLE_FIELDS,
  OCCUPANCY_LINK_FILTERABLE_FIELDS,
  OCCUPANCY_LINK_DATE_RANGE_FIELDS,
  OCCUPANCY_LINK_SELECTABLE_FIELDS,
  OCCUPANCY_LINK_DEFAULT_SELECT_FIELDS,
  OCCUPANCY_LINK_EDITABLE_FIELDS
} from './occupancy-link.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Occupancy Link */
export interface IOccupancyLink extends B.IBase {
  isCurrent: boolean;
  kind: OccupancyLinkKind;
  predecessorId: string;
  successorId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly occupancy?: OccupancyTypes.IOccupancy;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type OccupancyLinkKey = keyof IOccupancyLink;

export type OccupancyLinkRelationKey = (typeof OCCUPANCY_LINK_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IOccupancyLinkReadonlyFields = B.IBaseReadonlyFields;

export type IOccupancyLinkContextualFields = never;

export type IOccupancyLinkSensitiveFields = never;

export type IOccupancyLinkTransitionFields = never;

export type IOccupancyLinkImmutableFields =
  | IOccupancyLinkReadonlyFields
  | IOccupancyLinkContextualFields
  | IOccupancyLinkSensitiveFields
  | IOccupancyLinkTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IOccupancyLinkCreatable = Omit<IOccupancyLink, IOccupancyLinkImmutableFields | OccupancyLinkRelationKey>;

export type IOccupancyLinkSystemWritable = Omit<IOccupancyLink, B.IBaseReadonlyFields | OccupancyLinkRelationKey>;

export type IOccupancyLinkUpdatable = Partial<Omit<IOccupancyLink, IOccupancyLinkImmutableFields | OccupancyLinkRelationKey>>;

export interface IOccupancyLinkTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type OccupancyLinkSortableField = (typeof OCCUPANCY_LINK_SORTABLE_FIELDS)[number];

export type OccupancyLinkSearchableField = (typeof OCCUPANCY_LINK_SEARCHABLE_FIELDS)[number];

export type OccupancyLinkFilterableField = (typeof OCCUPANCY_LINK_FILTERABLE_FIELDS)[number];

export type OccupancyLinkDateRangeField = (typeof OCCUPANCY_LINK_DATE_RANGE_FIELDS)[number];

export type OccupancyLinkSelectableField = (typeof OCCUPANCY_LINK_SELECTABLE_FIELDS)[number];

export type OccupancyLinkDefaultSelectField = (typeof OCCUPANCY_LINK_DEFAULT_SELECT_FIELDS)[number];

export type OccupancyLinkEditableField = (typeof OCCUPANCY_LINK_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IOccupancyLinkAsOneRelationConfig = Q.IOneRelationConfig<'occupancyLink', OccupancyLinkSelectableField>;

export type IOccupancyLinkAsManyRelationConfig = Q.IManyRelationConfig<'occupancyLinks', OccupancyLinkSelectableField, OccupancyLinkSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IOccupancyLinkAsOneRelationQuery = Q.IAsOneRelationQuery<IOccupancyLink, OccupancyLinkSelectableField>;

export type IOccupancyLinkAsManyRelationQuery = Q.IAsManyRelationQuery<IOccupancyLink, OccupancyLinkSelectableField, OccupancyLinkSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IOccupancyLinkRelationMap extends Record<OccupancyLinkRelationKey, unknown> {
  occupancy: OccupancyTypes.IOccupancyAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IOccupancyLinkRelationQueries = Q.IBaseRelationQueries<IOccupancyLink, OccupancyLinkRelationKey, IOccupancyLinkRelationMap>;

export type IOccupancyLinkItemQuery = Q.IBaseItemQuery<
  IOccupancyLink,
  OccupancyLinkRelationKey,
  OccupancyLinkSelectableField,
  OccupancyLinkRelationKey,
  OccupancyLinkSelectableField,
  IOccupancyLinkRelationMap,
  IOccupancyLinkRelationQueries
>;

export type IOccupancyLinkListQuery = Q.IBaseListQuery<
  IOccupancyLink,
  OccupancyLinkRelationKey,
  OccupancyLinkSelectableField,
  OccupancyLinkSortableField,
  OccupancyLinkRelationKey,
  OccupancyLinkSelectableField,
  OccupancyLinkSortableField,
  OccupancyLinkDateRangeField,
  OccupancyLinkFilterableField,
  IOccupancyLinkRelationMap,
  IOccupancyLinkRelationQueries,
  IOccupancyLinkItemQuery
>;