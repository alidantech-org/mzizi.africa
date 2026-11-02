// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as SeatConfig from '#/modules/elections/types/seat.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ICandidate,
  CandidateKey,
  CandidateRelationKey,
  CandidateSortableField,
  CandidateFilterableField,
  CandidateDateRangeField,
  CandidateSelectableField,
  ICandidateAsOneRelationConfig,
  ICandidateAsManyRelationConfig
} from './candidate.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const CANDIDATE_RELATION_KEYS = ['seat', ] as const satisfies readonly CandidateKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const CANDIDATE_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly CandidateKey[];

export const CANDIDATE_SEARCHABLE_FIELDS = [] as const satisfies readonly CandidateKey[];

export const CANDIDATE_FILTERABLE_FIELDS = ['id', 'isCurrent', 'isIndependent', 'method', 'nominationStatus', 'partyId', 'personId', 'seatId', 'verificationState', 'version', ] as const satisfies readonly CandidateKey[];

export const CANDIDATE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly CandidateKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const CANDIDATE_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'confidence', 'createdAt', 'id', 'isCurrent', 'isIndependent', 'licence', 'method', 'nominationStatus', 'partyId', 'personId', 'retrievedAt', 'seatId', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly CandidateKey[];

export const CANDIDATE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly CandidateSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const CANDIDATE_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'confidence', 'isCurrent', 'isIndependent', 'licence', 'method', 'nominationStatus', 'partyId', 'personId', 'retrievedAt', 'seatId', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly CandidateKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const CANDIDATE_AS_ONE_RELATION_CONFIG = {
  relation: 'candidate',
  type: ERelationType.One,
  selectableFields: CANDIDATE_SELECTABLE_FIELDS,
  defaultSelectFields: CANDIDATE_DEFAULT_SELECT_FIELDS
} as const satisfies ICandidateAsOneRelationConfig;

export const CANDIDATE_AS_MANY_RELATION_CONFIG = {
  relation: 'candidates',
  type: ERelationType.Many,
  selectableFields: CANDIDATE_SELECTABLE_FIELDS,
  defaultSelectFields: CANDIDATE_DEFAULT_SELECT_FIELDS,
  sortableFields: CANDIDATE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ICandidateAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const CANDIDATE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<CandidateRelationKey>().one(SeatConfig.SEAT_AS_ONE_RELATION_CONFIG, 'seat'),
] as const;

export const CANDIDATE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const CANDIDATE_QUERY_OPTIONS = {
  searchableFields: CANDIDATE_SEARCHABLE_FIELDS,
  selectableFields: CANDIDATE_SELECTABLE_FIELDS,
  defaultSelectFields: CANDIDATE_DEFAULT_SELECT_FIELDS,
  sortableFields: CANDIDATE_SORTABLE_FIELDS,
  filterFields: CANDIDATE_FILTERABLE_FIELDS,
  dateRangeFields: CANDIDATE_DATE_RANGE_FIELDS,
  oneRelations: CANDIDATE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: CANDIDATE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ICandidate,
  CandidateSortableField,
  CandidateSelectableField,
  CandidateFilterableField,
  CandidateDateRangeField,
  CandidateRelationKey,
  typeof CANDIDATE_ONE_RELATION_QUERY_OPTIONS,
  typeof CANDIDATE_MANY_RELATION_QUERY_OPTIONS
>;