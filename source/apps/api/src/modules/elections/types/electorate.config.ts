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
  IElectorate,
  ElectorateKey,
  ElectorateRelationKey,
  ElectorateSortableField,
  ElectorateFilterableField,
  ElectorateDateRangeField,
  ElectorateSelectableField,
  IElectorateAsOneRelationConfig,
  IElectorateAsManyRelationConfig
} from './electorate.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ELECTORATE_RELATION_KEYS = ['election', ] as const satisfies readonly ElectorateKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ELECTORATE_SORTABLE_FIELDS = ['createdAt', 'registeredVoters', 'updatedAt', 'validFrom', 'validTo', 'version', 'votesCast', ] as const satisfies readonly ElectorateKey[];

export const ELECTORATE_SEARCHABLE_FIELDS = [] as const satisfies readonly ElectorateKey[];

export const ELECTORATE_FILTERABLE_FIELDS = ['declaringInstitutionId', 'electionId', 'geoUnitId', 'id', 'isCurrent', 'registeredVoters', 'resultLevelId', 'resultStatus', 'seatId', 'version', 'votesCast', ] as const satisfies readonly ElectorateKey[];

export const ELECTORATE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly ElectorateKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ELECTORATE_SELECTABLE_FIELDS = ['createdAt', 'declaredAt', 'declaringInstitutionId', 'electionId', 'evidenceForm', 'geoUnitId', 'id', 'isCurrent', 'registerVersion', 'registeredVoters', 'rejectedVotes', 'resultLevelId', 'resultStatus', 'seatId', 'spoiltVotes', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'validVotes', 'votesCast', ] as const satisfies readonly ElectorateKey[];

export const ELECTORATE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ElectorateSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ELECTORATE_EDITABLE_FIELDS = ['declaredAt', 'declaringInstitutionId', 'electionId', 'evidenceForm', 'geoUnitId', 'isCurrent', 'registerVersion', 'registeredVoters', 'rejectedVotes', 'resultLevelId', 'resultStatus', 'seatId', 'spoiltVotes', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'validVotes', 'votesCast', ] as const satisfies readonly ElectorateKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ELECTORATE_AS_ONE_RELATION_CONFIG = {
  relation: 'electorate',
  type: ERelationType.One,
  selectableFields: ELECTORATE_SELECTABLE_FIELDS,
  defaultSelectFields: ELECTORATE_DEFAULT_SELECT_FIELDS
} as const satisfies IElectorateAsOneRelationConfig;

export const ELECTORATE_AS_MANY_RELATION_CONFIG = {
  relation: 'electorates',
  type: ERelationType.Many,
  selectableFields: ELECTORATE_SELECTABLE_FIELDS,
  defaultSelectFields: ELECTORATE_DEFAULT_SELECT_FIELDS,
  sortableFields: ELECTORATE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IElectorateAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ELECTORATE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ElectorateRelationKey>().one(ElectionConfig.ELECTION_AS_ONE_RELATION_CONFIG, 'election'),
] as const;

export const ELECTORATE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ELECTORATE_QUERY_OPTIONS = {
  searchableFields: ELECTORATE_SEARCHABLE_FIELDS,
  selectableFields: ELECTORATE_SELECTABLE_FIELDS,
  defaultSelectFields: ELECTORATE_DEFAULT_SELECT_FIELDS,
  sortableFields: ELECTORATE_SORTABLE_FIELDS,
  filterFields: ELECTORATE_FILTERABLE_FIELDS,
  dateRangeFields: ELECTORATE_DATE_RANGE_FIELDS,
  oneRelations: ELECTORATE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ELECTORATE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IElectorate,
  ElectorateSortableField,
  ElectorateSelectableField,
  ElectorateFilterableField,
  ElectorateDateRangeField,
  ElectorateRelationKey,
  typeof ELECTORATE_ONE_RELATION_QUERY_OPTIONS,
  typeof ELECTORATE_MANY_RELATION_QUERY_OPTIONS
>;