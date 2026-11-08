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
  IStore,
  StoreKey,
  StoreRelationKey,
  StoreSortableField,
  StoreFilterableField,
  StoreDateRangeField,
  StoreSelectableField,
  IStoreAsOneRelationConfig,
  IStoreAsManyRelationConfig
} from './store.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const STORE_RELATION_KEYS = [] as const satisfies readonly StoreKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const STORE_SORTABLE_FIELDS = ['code', 'createdAt', 'updatedAt', 'version', ] as const satisfies readonly StoreKey[];

export const STORE_SEARCHABLE_FIELDS = ['code', ] as const satisfies readonly StoreKey[];

export const STORE_FILTERABLE_FIELDS = ['code', 'id', 'version', ] as const satisfies readonly StoreKey[];

export const STORE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly StoreKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const STORE_SELECTABLE_FIELDS = ['code', 'configurationName', 'createdAt', 'id', 'isActive', 'kind', 'region', 'tier', 'updatedAt', ] as const satisfies readonly StoreKey[];

export const STORE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly StoreSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const STORE_EDITABLE_FIELDS = ['code', 'configurationName', 'isActive', 'kind', 'region', 'tier', ] as const satisfies readonly StoreKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const STORE_AS_ONE_RELATION_CONFIG = {
  relation: 'store',
  type: ERelationType.One,
  selectableFields: STORE_SELECTABLE_FIELDS,
  defaultSelectFields: STORE_DEFAULT_SELECT_FIELDS
} as const satisfies IStoreAsOneRelationConfig;

export const STORE_AS_MANY_RELATION_CONFIG = {
  relation: 'stores',
  type: ERelationType.Many,
  selectableFields: STORE_SELECTABLE_FIELDS,
  defaultSelectFields: STORE_DEFAULT_SELECT_FIELDS,
  sortableFields: STORE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IStoreAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const STORE_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const STORE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const STORE_QUERY_OPTIONS = {
  searchableFields: STORE_SEARCHABLE_FIELDS,
  selectableFields: STORE_SELECTABLE_FIELDS,
  defaultSelectFields: STORE_DEFAULT_SELECT_FIELDS,
  sortableFields: STORE_SORTABLE_FIELDS,
  filterFields: STORE_FILTERABLE_FIELDS,
  dateRangeFields: STORE_DATE_RANGE_FIELDS,
  oneRelations: STORE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: STORE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IStore,
  StoreSortableField,
  StoreSelectableField,
  StoreFilterableField,
  StoreDateRangeField,
  StoreRelationKey,
  typeof STORE_ONE_RELATION_QUERY_OPTIONS,
  typeof STORE_MANY_RELATION_QUERY_OPTIONS
>;