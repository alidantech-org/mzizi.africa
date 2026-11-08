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
  IPerson,
  PersonKey,
  PersonRelationKey,
  PersonSortableField,
  PersonFilterableField,
  PersonDateRangeField,
  PersonSelectableField,
  IPersonAsOneRelationConfig,
  IPersonAsManyRelationConfig
} from './person.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PERSON_RELATION_KEYS = [] as const satisfies readonly PersonKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PERSON_SORTABLE_FIELDS = ['code', 'createdAt', 'displayName', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly PersonKey[];

export const PERSON_SEARCHABLE_FIELDS = ['code', 'displayName', ] as const satisfies readonly PersonKey[];

export const PERSON_FILTERABLE_FIELDS = ['birthPlaceId', 'code', 'displayName', 'id', 'isCurrent', 'lifeStatus', 'portraitMarker', 'version', 'wikidataId', ] as const satisfies readonly PersonKey[];

export const PERSON_DATE_RANGE_FIELDS = ['birthDate', 'createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly PersonKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PERSON_SELECTABLE_FIELDS = ['birthDate', 'birthDatePrecision', 'birthPlaceId', 'code', 'createdAt', 'deathDate', 'deathDatePrecision', 'displayName', 'familyName', 'givenName', 'id', 'isCurrent', 'lifeStatus', 'portraitMarker', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'wikidataId', ] as const satisfies readonly PersonKey[];

export const PERSON_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly PersonSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PERSON_EDITABLE_FIELDS = ['birthDate', 'birthDatePrecision', 'birthPlaceId', 'code', 'deathDate', 'deathDatePrecision', 'displayName', 'familyName', 'givenName', 'isCurrent', 'lifeStatus', 'portraitMarker', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'wikidataId', ] as const satisfies readonly PersonKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PERSON_AS_ONE_RELATION_CONFIG = {
  relation: 'person',
  type: ERelationType.One,
  selectableFields: PERSON_SELECTABLE_FIELDS,
  defaultSelectFields: PERSON_DEFAULT_SELECT_FIELDS
} as const satisfies IPersonAsOneRelationConfig;

export const PERSON_AS_MANY_RELATION_CONFIG = {
  relation: 'persons',
  type: ERelationType.Many,
  selectableFields: PERSON_SELECTABLE_FIELDS,
  defaultSelectFields: PERSON_DEFAULT_SELECT_FIELDS,
  sortableFields: PERSON_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IPersonAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PERSON_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const PERSON_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PERSON_QUERY_OPTIONS = {
  searchableFields: PERSON_SEARCHABLE_FIELDS,
  selectableFields: PERSON_SELECTABLE_FIELDS,
  defaultSelectFields: PERSON_DEFAULT_SELECT_FIELDS,
  sortableFields: PERSON_SORTABLE_FIELDS,
  filterFields: PERSON_FILTERABLE_FIELDS,
  dateRangeFields: PERSON_DATE_RANGE_FIELDS,
  oneRelations: PERSON_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PERSON_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IPerson,
  PersonSortableField,
  PersonSelectableField,
  PersonFilterableField,
  PersonDateRangeField,
  PersonRelationKey,
  typeof PERSON_ONE_RELATION_QUERY_OPTIONS,
  typeof PERSON_MANY_RELATION_QUERY_OPTIONS
>;