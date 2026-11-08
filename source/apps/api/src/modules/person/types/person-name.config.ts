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
  IPersonName,
  PersonNameKey,
  PersonNameRelationKey,
  PersonNameSortableField,
  PersonNameFilterableField,
  PersonNameDateRangeField,
  PersonNameSelectableField,
  IPersonNameAsOneRelationConfig,
  IPersonNameAsManyRelationConfig
} from './person-name.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PERSON_NAME_RELATION_KEYS = ['person', ] as const satisfies readonly PersonNameKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PERSON_NAME_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly PersonNameKey[];

export const PERSON_NAME_SEARCHABLE_FIELDS = ['name', ] as const satisfies readonly PersonNameKey[];

export const PERSON_NAME_FILTERABLE_FIELDS = ['id', 'isCurrent', 'kind', 'name', 'personId', 'version', ] as const satisfies readonly PersonNameKey[];

export const PERSON_NAME_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly PersonNameKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PERSON_NAME_SELECTABLE_FIELDS = ['createdAt', 'id', 'isCurrent', 'kind', 'language', 'name', 'personId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly PersonNameKey[];

export const PERSON_NAME_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly PersonNameSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PERSON_NAME_EDITABLE_FIELDS = ['isCurrent', 'kind', 'language', 'name', 'personId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly PersonNameKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PERSON_NAME_AS_ONE_RELATION_CONFIG = {
  relation: 'personName',
  type: ERelationType.One,
  selectableFields: PERSON_NAME_SELECTABLE_FIELDS,
  defaultSelectFields: PERSON_NAME_DEFAULT_SELECT_FIELDS
} as const satisfies IPersonNameAsOneRelationConfig;

export const PERSON_NAME_AS_MANY_RELATION_CONFIG = {
  relation: 'personNames',
  type: ERelationType.Many,
  selectableFields: PERSON_NAME_SELECTABLE_FIELDS,
  defaultSelectFields: PERSON_NAME_DEFAULT_SELECT_FIELDS,
  sortableFields: PERSON_NAME_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IPersonNameAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PERSON_NAME_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<PersonNameRelationKey>().one(PersonConfig.PERSON_AS_ONE_RELATION_CONFIG, 'person'),
] as const;

export const PERSON_NAME_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PERSON_NAME_QUERY_OPTIONS = {
  searchableFields: PERSON_NAME_SEARCHABLE_FIELDS,
  selectableFields: PERSON_NAME_SELECTABLE_FIELDS,
  defaultSelectFields: PERSON_NAME_DEFAULT_SELECT_FIELDS,
  sortableFields: PERSON_NAME_SORTABLE_FIELDS,
  filterFields: PERSON_NAME_FILTERABLE_FIELDS,
  dateRangeFields: PERSON_NAME_DATE_RANGE_FIELDS,
  oneRelations: PERSON_NAME_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PERSON_NAME_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IPersonName,
  PersonNameSortableField,
  PersonNameSelectableField,
  PersonNameFilterableField,
  PersonNameDateRangeField,
  PersonNameRelationKey,
  typeof PERSON_NAME_ONE_RELATION_QUERY_OPTIONS,
  typeof PERSON_NAME_MANY_RELATION_QUERY_OPTIONS
>;