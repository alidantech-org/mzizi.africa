// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { AllocationKind } from '#/types/elections/allocation-kind.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ElectionTypes from '#/modules/elections/types/election.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SEAT_ALLOCATION_RELATION_KEYS,
  SEAT_ALLOCATION_SORTABLE_FIELDS,
  SEAT_ALLOCATION_SEARCHABLE_FIELDS,
  SEAT_ALLOCATION_FILTERABLE_FIELDS,
  SEAT_ALLOCATION_DATE_RANGE_FIELDS,
  SEAT_ALLOCATION_SELECTABLE_FIELDS,
  SEAT_ALLOCATION_DEFAULT_SELECT_FIELDS,
  SEAT_ALLOCATION_EDITABLE_FIELDS
} from './seat-allocation.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Seat Allocation */
export interface ISeatAllocation extends B.IBase {
  allocatedOn: Date | null;
  declaringInstitutionId: string | null;
  electionId: string;
  geoUnitId: string | null;
  isCurrent: boolean;
  kind: AllocationKind;
  listPosition: number | null;
  partyId: string;
  personId: string | null;
  seatId: string | null;
  seatsEntitled: number | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly election?: ElectionTypes.IElection;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SeatAllocationKey = keyof ISeatAllocation;

export type SeatAllocationRelationKey = (typeof SEAT_ALLOCATION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISeatAllocationReadonlyFields = B.IBaseReadonlyFields;

export type ISeatAllocationContextualFields = never;

export type ISeatAllocationSensitiveFields = never;

export type ISeatAllocationTransitionFields = never;

export type ISeatAllocationImmutableFields =
  | ISeatAllocationReadonlyFields
  | ISeatAllocationContextualFields
  | ISeatAllocationSensitiveFields
  | ISeatAllocationTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISeatAllocationCreatable = Omit<ISeatAllocation, ISeatAllocationImmutableFields | SeatAllocationRelationKey>;

export type ISeatAllocationSystemWritable = Omit<ISeatAllocation, B.IBaseReadonlyFields | SeatAllocationRelationKey>;

export type ISeatAllocationUpdatable = Partial<Omit<ISeatAllocation, ISeatAllocationImmutableFields | SeatAllocationRelationKey>>;

export interface ISeatAllocationTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SeatAllocationSortableField = (typeof SEAT_ALLOCATION_SORTABLE_FIELDS)[number];

export type SeatAllocationSearchableField = (typeof SEAT_ALLOCATION_SEARCHABLE_FIELDS)[number];

export type SeatAllocationFilterableField = (typeof SEAT_ALLOCATION_FILTERABLE_FIELDS)[number];

export type SeatAllocationDateRangeField = (typeof SEAT_ALLOCATION_DATE_RANGE_FIELDS)[number];

export type SeatAllocationSelectableField = (typeof SEAT_ALLOCATION_SELECTABLE_FIELDS)[number];

export type SeatAllocationDefaultSelectField = (typeof SEAT_ALLOCATION_DEFAULT_SELECT_FIELDS)[number];

export type SeatAllocationEditableField = (typeof SEAT_ALLOCATION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISeatAllocationAsOneRelationConfig = Q.IOneRelationConfig<'seatAllocation', SeatAllocationSelectableField>;

export type ISeatAllocationAsManyRelationConfig = Q.IManyRelationConfig<'seatAllocations', SeatAllocationSelectableField, SeatAllocationSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISeatAllocationAsOneRelationQuery = Q.IAsOneRelationQuery<ISeatAllocation, SeatAllocationSelectableField>;

export type ISeatAllocationAsManyRelationQuery = Q.IAsManyRelationQuery<ISeatAllocation, SeatAllocationSelectableField, SeatAllocationSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISeatAllocationRelationMap extends Record<SeatAllocationRelationKey, unknown> {
  election: ElectionTypes.IElectionAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISeatAllocationRelationQueries = Q.IBaseRelationQueries<ISeatAllocation, SeatAllocationRelationKey, ISeatAllocationRelationMap>;

export type ISeatAllocationItemQuery = Q.IBaseItemQuery<
  ISeatAllocation,
  SeatAllocationRelationKey,
  SeatAllocationSelectableField,
  SeatAllocationRelationKey,
  SeatAllocationSelectableField,
  ISeatAllocationRelationMap,
  ISeatAllocationRelationQueries
>;

export type ISeatAllocationListQuery = Q.IBaseListQuery<
  ISeatAllocation,
  SeatAllocationRelationKey,
  SeatAllocationSelectableField,
  SeatAllocationSortableField,
  SeatAllocationRelationKey,
  SeatAllocationSelectableField,
  SeatAllocationSortableField,
  SeatAllocationDateRangeField,
  SeatAllocationFilterableField,
  ISeatAllocationRelationMap,
  ISeatAllocationRelationQueries,
  ISeatAllocationItemQuery
>;