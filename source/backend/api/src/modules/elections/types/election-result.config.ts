// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as CandidateConfig from '#/modules/elections/types/candidate.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IElectionResult,
  ElectionResultKey,
  ElectionResultRelationKey,
  ElectionResultSortableField,
  ElectionResultFilterableField,
  ElectionResultDateRangeField,
  ElectionResultSelectableField,
  IElectionResultAsOneRelationConfig,
  IElectionResultAsManyRelationConfig
} from './election-result.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ELECTION_RESULT_RELATION_KEYS = ['candidate', ] as const satisfies readonly ElectionResultKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ELECTION_RESULT_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', 'votes', ] as const satisfies readonly ElectionResultKey[];

export const ELECTION_RESULT_SEARCHABLE_FIELDS = [] as const satisfies readonly ElectionResultKey[];

export const ELECTION_RESULT_FILTERABLE_FIELDS = ['candidateId', 'declaringInstitutionId', 'geoUnitId', 'id', 'isCurrent', 'isWinner', 'method', 'resultLevelId', 'seatId', 'verificationState', 'version', 'votes', ] as const satisfies readonly ElectionResultKey[];

export const ELECTION_RESULT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly ElectionResultKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ELECTION_RESULT_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'candidateId', 'confidence', 'createdAt', 'declaredAt', 'declaringInstitutionId', 'geoUnitId', 'id', 'isCurrent', 'isWinner', 'licence', 'method', 'rank', 'resultLevelId', 'retrievedAt', 'seatId', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', 'votes', ] as const satisfies readonly ElectionResultKey[];

export const ELECTION_RESULT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ElectionResultSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ELECTION_RESULT_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'candidateId', 'confidence', 'declaredAt', 'declaringInstitutionId', 'geoUnitId', 'isCurrent', 'isWinner', 'licence', 'method', 'rank', 'resultLevelId', 'retrievedAt', 'seatId', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', 'votes', ] as const satisfies readonly ElectionResultKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ELECTION_RESULT_AS_ONE_RELATION_CONFIG = {
  relation: 'electionResult',
  type: ERelationType.One,
  selectableFields: ELECTION_RESULT_SELECTABLE_FIELDS,
  defaultSelectFields: ELECTION_RESULT_DEFAULT_SELECT_FIELDS
} as const satisfies IElectionResultAsOneRelationConfig;

export const ELECTION_RESULT_AS_MANY_RELATION_CONFIG = {
  relation: 'electionResults',
  type: ERelationType.Many,
  selectableFields: ELECTION_RESULT_SELECTABLE_FIELDS,
  defaultSelectFields: ELECTION_RESULT_DEFAULT_SELECT_FIELDS,
  sortableFields: ELECTION_RESULT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IElectionResultAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ELECTION_RESULT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ElectionResultRelationKey>().one(CandidateConfig.CANDIDATE_AS_ONE_RELATION_CONFIG, 'candidate'),
] as const;

export const ELECTION_RESULT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ELECTION_RESULT_QUERY_OPTIONS = {
  searchableFields: ELECTION_RESULT_SEARCHABLE_FIELDS,
  selectableFields: ELECTION_RESULT_SELECTABLE_FIELDS,
  defaultSelectFields: ELECTION_RESULT_DEFAULT_SELECT_FIELDS,
  sortableFields: ELECTION_RESULT_SORTABLE_FIELDS,
  filterFields: ELECTION_RESULT_FILTERABLE_FIELDS,
  dateRangeFields: ELECTION_RESULT_DATE_RANGE_FIELDS,
  oneRelations: ELECTION_RESULT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ELECTION_RESULT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IElectionResult,
  ElectionResultSortableField,
  ElectionResultSelectableField,
  ElectionResultFilterableField,
  ElectionResultDateRangeField,
  ElectionResultRelationKey,
  typeof ELECTION_RESULT_ONE_RELATION_QUERY_OPTIONS,
  typeof ELECTION_RESULT_MANY_RELATION_QUERY_OPTIONS
>;