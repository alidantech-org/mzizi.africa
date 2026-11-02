// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as StoreConfig from '#/modules/filesystem/types/store.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IStoredObject,
  StoredObjectKey,
  StoredObjectRelationKey,
  StoredObjectSortableField,
  StoredObjectFilterableField,
  StoredObjectDateRangeField,
  StoredObjectSelectableField,
  IStoredObjectAsOneRelationConfig,
  IStoredObjectAsManyRelationConfig
} from './stored-object.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const STORED_OBJECT_RELATION_KEYS = ['store', ] as const satisfies readonly StoredObjectKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const STORED_OBJECT_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly StoredObjectKey[];

export const STORED_OBJECT_SEARCHABLE_FIELDS = [] as const satisfies readonly StoredObjectKey[];

export const STORED_OBJECT_FILTERABLE_FIELDS = ['contentHash', 'formatId', 'id', 'storeId', 'version', ] as const satisfies readonly StoredObjectKey[];

export const STORED_OBJECT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly StoredObjectKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const STORED_OBJECT_SELECTABLE_FIELDS = ['contentHash', 'createdAt', 'durationSeconds', 'formatId', 'id', 'mediaHeight', 'mediaWidth', 'objectKey', 'pageCount', 'scanStatus', 'sizeBytes', 'storeId', 'updatedAt', ] as const satisfies readonly StoredObjectKey[];

export const STORED_OBJECT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly StoredObjectSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const STORED_OBJECT_EDITABLE_FIELDS = ['contentHash', 'durationSeconds', 'formatId', 'mediaHeight', 'mediaWidth', 'objectKey', 'pageCount', 'scanStatus', 'sizeBytes', 'storeId', ] as const satisfies readonly StoredObjectKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const STORED_OBJECT_AS_ONE_RELATION_CONFIG = {
  relation: 'storedObject',
  type: ERelationType.One,
  selectableFields: STORED_OBJECT_SELECTABLE_FIELDS,
  defaultSelectFields: STORED_OBJECT_DEFAULT_SELECT_FIELDS
} as const satisfies IStoredObjectAsOneRelationConfig;

export const STORED_OBJECT_AS_MANY_RELATION_CONFIG = {
  relation: 'storedObjects',
  type: ERelationType.Many,
  selectableFields: STORED_OBJECT_SELECTABLE_FIELDS,
  defaultSelectFields: STORED_OBJECT_DEFAULT_SELECT_FIELDS,
  sortableFields: STORED_OBJECT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IStoredObjectAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const STORED_OBJECT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<StoredObjectRelationKey>().one(StoreConfig.STORE_AS_ONE_RELATION_CONFIG, 'store'),
] as const;

export const STORED_OBJECT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const STORED_OBJECT_QUERY_OPTIONS = {
  searchableFields: STORED_OBJECT_SEARCHABLE_FIELDS,
  selectableFields: STORED_OBJECT_SELECTABLE_FIELDS,
  defaultSelectFields: STORED_OBJECT_DEFAULT_SELECT_FIELDS,
  sortableFields: STORED_OBJECT_SORTABLE_FIELDS,
  filterFields: STORED_OBJECT_FILTERABLE_FIELDS,
  dateRangeFields: STORED_OBJECT_DATE_RANGE_FIELDS,
  oneRelations: STORED_OBJECT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: STORED_OBJECT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IStoredObject,
  StoredObjectSortableField,
  StoredObjectSelectableField,
  StoredObjectFilterableField,
  StoredObjectDateRangeField,
  StoredObjectRelationKey,
  typeof STORED_OBJECT_ONE_RELATION_QUERY_OPTIONS,
  typeof STORED_OBJECT_MANY_RELATION_QUERY_OPTIONS
>;