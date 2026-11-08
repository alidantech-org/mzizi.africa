// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { ScanStatus } from '#/types/filesystem/scan-status.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as StoreTypes from '#/modules/filesystem/types/store.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  STORED_OBJECT_RELATION_KEYS,
  STORED_OBJECT_SORTABLE_FIELDS,
  STORED_OBJECT_SEARCHABLE_FIELDS,
  STORED_OBJECT_FILTERABLE_FIELDS,
  STORED_OBJECT_DATE_RANGE_FIELDS,
  STORED_OBJECT_SELECTABLE_FIELDS,
  STORED_OBJECT_DEFAULT_SELECT_FIELDS,
  STORED_OBJECT_EDITABLE_FIELDS
} from './stored-object.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Stored Object */
export interface IStoredObject extends B.IBase {
  contentHash: string;
  durationSeconds: number | null;
  formatId: string | null;
  mediaHeight: number | null;
  mediaWidth: number | null;
  objectKey: string;
  pageCount: number | null;
  scanStatus: ScanStatus;
  sizeBytes: number;
  storeId: string;
  readonly store?: StoreTypes.IStore;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type StoredObjectKey = keyof IStoredObject;

export type StoredObjectRelationKey = (typeof STORED_OBJECT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IStoredObjectReadonlyFields = B.IBaseReadonlyFields;

export type IStoredObjectContextualFields = never;

export type IStoredObjectSensitiveFields = never;

export type IStoredObjectTransitionFields = never;

export type IStoredObjectImmutableFields =
  | IStoredObjectReadonlyFields
  | IStoredObjectContextualFields
  | IStoredObjectSensitiveFields
  | IStoredObjectTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IStoredObjectCreatable = Omit<IStoredObject, IStoredObjectImmutableFields | StoredObjectRelationKey>;

export type IStoredObjectSystemWritable = Omit<IStoredObject, B.IBaseReadonlyFields | StoredObjectRelationKey>;

export type IStoredObjectUpdatable = Partial<Omit<IStoredObject, IStoredObjectImmutableFields | StoredObjectRelationKey>>;

export interface IStoredObjectTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type StoredObjectSortableField = (typeof STORED_OBJECT_SORTABLE_FIELDS)[number];

export type StoredObjectSearchableField = (typeof STORED_OBJECT_SEARCHABLE_FIELDS)[number];

export type StoredObjectFilterableField = (typeof STORED_OBJECT_FILTERABLE_FIELDS)[number];

export type StoredObjectDateRangeField = (typeof STORED_OBJECT_DATE_RANGE_FIELDS)[number];

export type StoredObjectSelectableField = (typeof STORED_OBJECT_SELECTABLE_FIELDS)[number];

export type StoredObjectDefaultSelectField = (typeof STORED_OBJECT_DEFAULT_SELECT_FIELDS)[number];

export type StoredObjectEditableField = (typeof STORED_OBJECT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IStoredObjectAsOneRelationConfig = Q.IOneRelationConfig<'storedObject', StoredObjectSelectableField>;

export type IStoredObjectAsManyRelationConfig = Q.IManyRelationConfig<'storedObjects', StoredObjectSelectableField, StoredObjectSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IStoredObjectAsOneRelationQuery = Q.IAsOneRelationQuery<IStoredObject, StoredObjectSelectableField>;

export type IStoredObjectAsManyRelationQuery = Q.IAsManyRelationQuery<IStoredObject, StoredObjectSelectableField, StoredObjectSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IStoredObjectRelationMap extends Record<StoredObjectRelationKey, unknown> {
  store: StoreTypes.IStoreAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IStoredObjectRelationQueries = Q.IBaseRelationQueries<IStoredObject, StoredObjectRelationKey, IStoredObjectRelationMap>;

export type IStoredObjectItemQuery = Q.IBaseItemQuery<
  IStoredObject,
  StoredObjectRelationKey,
  StoredObjectSelectableField,
  StoredObjectRelationKey,
  StoredObjectSelectableField,
  IStoredObjectRelationMap,
  IStoredObjectRelationQueries
>;

export type IStoredObjectListQuery = Q.IBaseListQuery<
  IStoredObject,
  StoredObjectRelationKey,
  StoredObjectSelectableField,
  StoredObjectSortableField,
  StoredObjectRelationKey,
  StoredObjectSelectableField,
  StoredObjectSortableField,
  StoredObjectDateRangeField,
  StoredObjectFilterableField,
  IStoredObjectRelationMap,
  IStoredObjectRelationQueries,
  IStoredObjectItemQuery
>;