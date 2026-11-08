// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IElection,
  ElectionKey,
  ElectionRelationKey,
  ElectionSortableField,
  ElectionFilterableField,
  ElectionDateRangeField,
  ElectionSelectableField,
  IElectionAsOneRelationConfig,
  IElectionAsManyRelationConfig
} from './election.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ELECTION_RELATION_KEYS = [] as const satisfies readonly ElectionKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ELECTION_SORTABLE_FIELDS = ['code', 'createdAt', 'heldDate', 'name', 'scheduledDate', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly ElectionKey[];

export const ELECTION_SEARCHABLE_FIELDS = ['code', 'name', ] as const satisfies readonly ElectionKey[];

export const ELECTION_FILTERABLE_FIELDS = ['administeringInstitutionId', 'code', 'geoUnitId', 'id', 'isCurrent', 'jurisdictionId', 'legalBasisId', 'name', 'status', 'typeId', 'version', ] as const satisfies readonly ElectionKey[];

export const ELECTION_DATE_RANGE_FIELDS = ['createdAt', 'heldDate', 'scheduledDate', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly ElectionKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ELECTION_SELECTABLE_FIELDS = ['administeringInstitutionId', 'code', 'createdAt', 'geoUnitId', 'heldDate', 'id', 'isCurrent', 'jurisdictionId', 'legalBasisId', 'name', 'scheduledDate', 'status', 'typeId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly ElectionKey[];

export const ELECTION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ElectionSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ELECTION_EDITABLE_FIELDS = ['administeringInstitutionId', 'code', 'geoUnitId', 'heldDate', 'isCurrent', 'jurisdictionId', 'legalBasisId', 'name', 'scheduledDate', 'status', 'typeId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly ElectionKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ELECTION_AS_ONE_RELATION_CONFIG = {
  relation: 'election',
  type: ERelationType.One,
  selectableFields: ELECTION_SELECTABLE_FIELDS,
  defaultSelectFields: ELECTION_DEFAULT_SELECT_FIELDS
} as const satisfies IElectionAsOneRelationConfig;

export const ELECTION_AS_MANY_RELATION_CONFIG = {
  relation: 'elections',
  type: ERelationType.Many,
  selectableFields: ELECTION_SELECTABLE_FIELDS,
  defaultSelectFields: ELECTION_DEFAULT_SELECT_FIELDS,
  sortableFields: ELECTION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IElectionAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ELECTION_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const ELECTION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ELECTION_QUERY_OPTIONS = {
  searchableFields: ELECTION_SEARCHABLE_FIELDS,
  selectableFields: ELECTION_SELECTABLE_FIELDS,
  defaultSelectFields: ELECTION_DEFAULT_SELECT_FIELDS,
  sortableFields: ELECTION_SORTABLE_FIELDS,
  filterFields: ELECTION_FILTERABLE_FIELDS,
  dateRangeFields: ELECTION_DATE_RANGE_FIELDS,
  oneRelations: ELECTION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ELECTION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IElection,
  ElectionSortableField,
  ElectionSelectableField,
  ElectionFilterableField,
  ElectionDateRangeField,
  ElectionRelationKey,
  typeof ELECTION_ONE_RELATION_QUERY_OPTIONS,
  typeof ELECTION_MANY_RELATION_QUERY_OPTIONS
>;