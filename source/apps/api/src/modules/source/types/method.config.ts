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
  IMethod,
  MethodKey,
  MethodRelationKey,
  MethodSortableField,
  MethodFilterableField,
  MethodDateRangeField,
  MethodSelectableField,
  IMethodAsOneRelationConfig,
  IMethodAsManyRelationConfig
} from './method.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const METHOD_RELATION_KEYS = [] as const satisfies readonly MethodKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const METHOD_SORTABLE_FIELDS = ['createdAt', 'name', 'updatedAt', 'version', ] as const satisfies readonly MethodKey[];

export const METHOD_SEARCHABLE_FIELDS = ['name', ] as const satisfies readonly MethodKey[];

export const METHOD_FILTERABLE_FIELDS = ['id', 'kind', 'name', 'version', ] as const satisfies readonly MethodKey[];

export const METHOD_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly MethodKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const METHOD_SELECTABLE_FIELDS = ['createdAt', 'description', 'id', 'kind', 'model', 'name', 'tool', 'toolVersion', 'updatedAt', ] as const satisfies readonly MethodKey[];

export const METHOD_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly MethodSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const METHOD_EDITABLE_FIELDS = ['description', 'kind', 'model', 'name', 'tool', 'toolVersion', ] as const satisfies readonly MethodKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const METHOD_AS_ONE_RELATION_CONFIG = {
  relation: 'method',
  type: ERelationType.One,
  selectableFields: METHOD_SELECTABLE_FIELDS,
  defaultSelectFields: METHOD_DEFAULT_SELECT_FIELDS
} as const satisfies IMethodAsOneRelationConfig;

export const METHOD_AS_MANY_RELATION_CONFIG = {
  relation: 'methods',
  type: ERelationType.Many,
  selectableFields: METHOD_SELECTABLE_FIELDS,
  defaultSelectFields: METHOD_DEFAULT_SELECT_FIELDS,
  sortableFields: METHOD_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IMethodAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const METHOD_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const METHOD_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const METHOD_QUERY_OPTIONS = {
  searchableFields: METHOD_SEARCHABLE_FIELDS,
  selectableFields: METHOD_SELECTABLE_FIELDS,
  defaultSelectFields: METHOD_DEFAULT_SELECT_FIELDS,
  sortableFields: METHOD_SORTABLE_FIELDS,
  filterFields: METHOD_FILTERABLE_FIELDS,
  dateRangeFields: METHOD_DATE_RANGE_FIELDS,
  oneRelations: METHOD_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: METHOD_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IMethod,
  MethodSortableField,
  MethodSelectableField,
  MethodFilterableField,
  MethodDateRangeField,
  MethodRelationKey,
  typeof METHOD_ONE_RELATION_QUERY_OPTIONS,
  typeof METHOD_MANY_RELATION_QUERY_OPTIONS
>;