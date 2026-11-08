// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as PersonConfig from '#/modules/person/types/person.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IPersonProfile,
  PersonProfileKey,
  PersonProfileRelationKey,
  PersonProfileSortableField,
  PersonProfileFilterableField,
  PersonProfileDateRangeField,
  PersonProfileSelectableField,
  IPersonProfileAsOneRelationConfig,
  IPersonProfileAsManyRelationConfig
} from './person-profile.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PERSON_PROFILE_RELATION_KEYS = ['person', ] as const satisfies readonly PersonProfileKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PERSON_PROFILE_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly PersonProfileKey[];

export const PERSON_PROFILE_SEARCHABLE_FIELDS = ['occupation', ] as const satisfies readonly PersonProfileKey[];

export const PERSON_PROFILE_FILTERABLE_FIELDS = ['id', 'isCurrent', 'nationalityId', 'occupation', 'personId', 'version', ] as const satisfies readonly PersonProfileKey[];

export const PERSON_PROFILE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly PersonProfileKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PERSON_PROFILE_SELECTABLE_FIELDS = ['biography', 'createdAt', 'id', 'isCurrent', 'language', 'nationalityId', 'occupation', 'personId', 'summary', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly PersonProfileKey[];

export const PERSON_PROFILE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly PersonProfileSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PERSON_PROFILE_EDITABLE_FIELDS = ['biography', 'isCurrent', 'language', 'nationalityId', 'occupation', 'personId', 'summary', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly PersonProfileKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PERSON_PROFILE_AS_ONE_RELATION_CONFIG = {
  relation: 'personProfile',
  type: ERelationType.One,
  selectableFields: PERSON_PROFILE_SELECTABLE_FIELDS,
  defaultSelectFields: PERSON_PROFILE_DEFAULT_SELECT_FIELDS
} as const satisfies IPersonProfileAsOneRelationConfig;

export const PERSON_PROFILE_AS_MANY_RELATION_CONFIG = {
  relation: 'personProfiles',
  type: ERelationType.Many,
  selectableFields: PERSON_PROFILE_SELECTABLE_FIELDS,
  defaultSelectFields: PERSON_PROFILE_DEFAULT_SELECT_FIELDS,
  sortableFields: PERSON_PROFILE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IPersonProfileAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PERSON_PROFILE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<PersonProfileRelationKey>().one(PersonConfig.PERSON_AS_ONE_RELATION_CONFIG, 'person'),
] as const;

export const PERSON_PROFILE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PERSON_PROFILE_QUERY_OPTIONS = {
  searchableFields: PERSON_PROFILE_SEARCHABLE_FIELDS,
  selectableFields: PERSON_PROFILE_SELECTABLE_FIELDS,
  defaultSelectFields: PERSON_PROFILE_DEFAULT_SELECT_FIELDS,
  sortableFields: PERSON_PROFILE_SORTABLE_FIELDS,
  filterFields: PERSON_PROFILE_FILTERABLE_FIELDS,
  dateRangeFields: PERSON_PROFILE_DATE_RANGE_FIELDS,
  oneRelations: PERSON_PROFILE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PERSON_PROFILE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IPersonProfile,
  PersonProfileSortableField,
  PersonProfileSelectableField,
  PersonProfileFilterableField,
  PersonProfileDateRangeField,
  PersonProfileRelationKey,
  typeof PERSON_PROFILE_ONE_RELATION_QUERY_OPTIONS,
  typeof PERSON_PROFILE_MANY_RELATION_QUERY_OPTIONS
>;