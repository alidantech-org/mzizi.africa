// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ElectionConfig from '#/modules/elections/types/election.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ISeatAllocation,
  SeatAllocationKey,
  SeatAllocationRelationKey,
  SeatAllocationSortableField,
  SeatAllocationFilterableField,
  SeatAllocationDateRangeField,
  SeatAllocationSelectableField,
  ISeatAllocationAsOneRelationConfig,
  ISeatAllocationAsManyRelationConfig
} from './seat-allocation.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SEAT_ALLOCATION_RELATION_KEYS = ['election', ] as const satisfies readonly SeatAllocationKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SEAT_ALLOCATION_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly SeatAllocationKey[];

export const SEAT_ALLOCATION_SEARCHABLE_FIELDS = [] as const satisfies readonly SeatAllocationKey[];

export const SEAT_ALLOCATION_FILTERABLE_FIELDS = ['declaringInstitutionId', 'electionId', 'geoUnitId', 'id', 'isCurrent', 'kind', 'partyId', 'personId', 'seatId', 'version', ] as const satisfies readonly SeatAllocationKey[];

export const SEAT_ALLOCATION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly SeatAllocationKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SEAT_ALLOCATION_SELECTABLE_FIELDS = ['allocatedOn', 'createdAt', 'declaringInstitutionId', 'electionId', 'geoUnitId', 'id', 'isCurrent', 'kind', 'listPosition', 'partyId', 'personId', 'seatId', 'seatsEntitled', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly SeatAllocationKey[];

export const SEAT_ALLOCATION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly SeatAllocationSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SEAT_ALLOCATION_EDITABLE_FIELDS = ['allocatedOn', 'declaringInstitutionId', 'electionId', 'geoUnitId', 'isCurrent', 'kind', 'listPosition', 'partyId', 'personId', 'seatId', 'seatsEntitled', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly SeatAllocationKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SEAT_ALLOCATION_AS_ONE_RELATION_CONFIG = {
  relation: 'seatAllocation',
  type: ERelationType.One,
  selectableFields: SEAT_ALLOCATION_SELECTABLE_FIELDS,
  defaultSelectFields: SEAT_ALLOCATION_DEFAULT_SELECT_FIELDS
} as const satisfies ISeatAllocationAsOneRelationConfig;

export const SEAT_ALLOCATION_AS_MANY_RELATION_CONFIG = {
  relation: 'seatAllocations',
  type: ERelationType.Many,
  selectableFields: SEAT_ALLOCATION_SELECTABLE_FIELDS,
  defaultSelectFields: SEAT_ALLOCATION_DEFAULT_SELECT_FIELDS,
  sortableFields: SEAT_ALLOCATION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ISeatAllocationAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SEAT_ALLOCATION_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<SeatAllocationRelationKey>().one(ElectionConfig.ELECTION_AS_ONE_RELATION_CONFIG, 'election'),
] as const;

export const SEAT_ALLOCATION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SEAT_ALLOCATION_QUERY_OPTIONS = {
  searchableFields: SEAT_ALLOCATION_SEARCHABLE_FIELDS,
  selectableFields: SEAT_ALLOCATION_SELECTABLE_FIELDS,
  defaultSelectFields: SEAT_ALLOCATION_DEFAULT_SELECT_FIELDS,
  sortableFields: SEAT_ALLOCATION_SORTABLE_FIELDS,
  filterFields: SEAT_ALLOCATION_FILTERABLE_FIELDS,
  dateRangeFields: SEAT_ALLOCATION_DATE_RANGE_FIELDS,
  oneRelations: SEAT_ALLOCATION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SEAT_ALLOCATION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ISeatAllocation,
  SeatAllocationSortableField,
  SeatAllocationSelectableField,
  SeatAllocationFilterableField,
  SeatAllocationDateRangeField,
  SeatAllocationRelationKey,
  typeof SEAT_ALLOCATION_ONE_RELATION_QUERY_OPTIONS,
  typeof SEAT_ALLOCATION_MANY_RELATION_QUERY_OPTIONS
>;