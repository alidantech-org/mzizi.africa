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
  ISeat,
  SeatKey,
  SeatRelationKey,
  SeatSortableField,
  SeatFilterableField,
  SeatDateRangeField,
  SeatSelectableField,
  ISeatAsOneRelationConfig,
  ISeatAsManyRelationConfig
} from './seat.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SEAT_RELATION_KEYS = ['election', ] as const satisfies readonly SeatKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SEAT_SORTABLE_FIELDS = ['code', 'createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly SeatKey[];

export const SEAT_SEARCHABLE_FIELDS = ['code', ] as const satisfies readonly SeatKey[];

export const SEAT_FILTERABLE_FIELDS = ['code', 'electionId', 'geoUnitId', 'id', 'isCurrent', 'legalBasisId', 'officeId', 'version', ] as const satisfies readonly SeatKey[];

export const SEAT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly SeatKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SEAT_SELECTABLE_FIELDS = ['code', 'createdAt', 'electionId', 'geoUnitId', 'id', 'isCurrent', 'legalBasisId', 'officeId', 'positions', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly SeatKey[];

export const SEAT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly SeatSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SEAT_EDITABLE_FIELDS = ['code', 'electionId', 'geoUnitId', 'isCurrent', 'legalBasisId', 'officeId', 'positions', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly SeatKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SEAT_AS_ONE_RELATION_CONFIG = {
  relation: 'seat',
  type: ERelationType.One,
  selectableFields: SEAT_SELECTABLE_FIELDS,
  defaultSelectFields: SEAT_DEFAULT_SELECT_FIELDS
} as const satisfies ISeatAsOneRelationConfig;

export const SEAT_AS_MANY_RELATION_CONFIG = {
  relation: 'seats',
  type: ERelationType.Many,
  selectableFields: SEAT_SELECTABLE_FIELDS,
  defaultSelectFields: SEAT_DEFAULT_SELECT_FIELDS,
  sortableFields: SEAT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ISeatAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SEAT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<SeatRelationKey>().one(ElectionConfig.ELECTION_AS_ONE_RELATION_CONFIG, 'election'),
] as const;

export const SEAT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SEAT_QUERY_OPTIONS = {
  searchableFields: SEAT_SEARCHABLE_FIELDS,
  selectableFields: SEAT_SELECTABLE_FIELDS,
  defaultSelectFields: SEAT_DEFAULT_SELECT_FIELDS,
  sortableFields: SEAT_SORTABLE_FIELDS,
  filterFields: SEAT_FILTERABLE_FIELDS,
  dateRangeFields: SEAT_DATE_RANGE_FIELDS,
  oneRelations: SEAT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SEAT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ISeat,
  SeatSortableField,
  SeatSelectableField,
  SeatFilterableField,
  SeatDateRangeField,
  SeatRelationKey,
  typeof SEAT_ONE_RELATION_QUERY_OPTIONS,
  typeof SEAT_MANY_RELATION_QUERY_OPTIONS
>;