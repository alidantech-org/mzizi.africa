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
  IPersonHandle,
  PersonHandleKey,
  PersonHandleRelationKey,
  PersonHandleSortableField,
  PersonHandleFilterableField,
  PersonHandleDateRangeField,
  PersonHandleSelectableField,
  IPersonHandleAsOneRelationConfig,
  IPersonHandleAsManyRelationConfig
} from './person-handle.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PERSON_HANDLE_RELATION_KEYS = ['person', ] as const satisfies readonly PersonHandleKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PERSON_HANDLE_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly PersonHandleKey[];

export const PERSON_HANDLE_SEARCHABLE_FIELDS = ['handle', ] as const satisfies readonly PersonHandleKey[];

export const PERSON_HANDLE_FILTERABLE_FIELDS = ['exposure', 'handle', 'id', 'isCurrent', 'isVerified', 'personId', 'platformId', 'version', ] as const satisfies readonly PersonHandleKey[];

export const PERSON_HANDLE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly PersonHandleKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PERSON_HANDLE_SELECTABLE_FIELDS = ['createdAt', 'exposure', 'handle', 'id', 'isCurrent', 'isVerified', 'personId', 'platformId', 'updatedAt', 'url', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly PersonHandleKey[];

export const PERSON_HANDLE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly PersonHandleSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PERSON_HANDLE_EDITABLE_FIELDS = ['exposure', 'handle', 'isCurrent', 'isVerified', 'personId', 'platformId', 'url', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly PersonHandleKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PERSON_HANDLE_AS_ONE_RELATION_CONFIG = {
  relation: 'personHandle',
  type: ERelationType.One,
  selectableFields: PERSON_HANDLE_SELECTABLE_FIELDS,
  defaultSelectFields: PERSON_HANDLE_DEFAULT_SELECT_FIELDS
} as const satisfies IPersonHandleAsOneRelationConfig;

export const PERSON_HANDLE_AS_MANY_RELATION_CONFIG = {
  relation: 'personHandles',
  type: ERelationType.Many,
  selectableFields: PERSON_HANDLE_SELECTABLE_FIELDS,
  defaultSelectFields: PERSON_HANDLE_DEFAULT_SELECT_FIELDS,
  sortableFields: PERSON_HANDLE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IPersonHandleAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PERSON_HANDLE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<PersonHandleRelationKey>().one(PersonConfig.PERSON_AS_ONE_RELATION_CONFIG, 'person'),
] as const;

export const PERSON_HANDLE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PERSON_HANDLE_QUERY_OPTIONS = {
  searchableFields: PERSON_HANDLE_SEARCHABLE_FIELDS,
  selectableFields: PERSON_HANDLE_SELECTABLE_FIELDS,
  defaultSelectFields: PERSON_HANDLE_DEFAULT_SELECT_FIELDS,
  sortableFields: PERSON_HANDLE_SORTABLE_FIELDS,
  filterFields: PERSON_HANDLE_FILTERABLE_FIELDS,
  dateRangeFields: PERSON_HANDLE_DATE_RANGE_FIELDS,
  oneRelations: PERSON_HANDLE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PERSON_HANDLE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IPersonHandle,
  PersonHandleSortableField,
  PersonHandleSelectableField,
  PersonHandleFilterableField,
  PersonHandleDateRangeField,
  PersonHandleRelationKey,
  typeof PERSON_HANDLE_ONE_RELATION_QUERY_OPTIONS,
  typeof PERSON_HANDLE_MANY_RELATION_QUERY_OPTIONS
>;