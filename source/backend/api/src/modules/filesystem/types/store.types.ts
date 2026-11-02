// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { StorageTier } from '#/types/filesystem/storage-tier.enum';
import type { StoreKind } from '#/types/filesystem/store-kind.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  STORE_RELATION_KEYS,
  STORE_SORTABLE_FIELDS,
  STORE_SEARCHABLE_FIELDS,
  STORE_FILTERABLE_FIELDS,
  STORE_DATE_RANGE_FIELDS,
  STORE_SELECTABLE_FIELDS,
  STORE_DEFAULT_SELECT_FIELDS,
  STORE_EDITABLE_FIELDS
} from './store.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Store */
export interface IStore extends B.IBase {
  code: string;
  configurationName: string;
  isActive: boolean;
  kind: StoreKind;
  region: string | null;
  tier: StorageTier;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type StoreKey = keyof IStore;

export type StoreRelationKey = (typeof STORE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IStoreReadonlyFields = B.IBaseReadonlyFields;

export type IStoreContextualFields = never;

export type IStoreSensitiveFields = never;

export type IStoreTransitionFields = never;

export type IStoreImmutableFields =
  | IStoreReadonlyFields
  | IStoreContextualFields
  | IStoreSensitiveFields
  | IStoreTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IStoreCreatable = Omit<IStore, IStoreImmutableFields | StoreRelationKey>;

export type IStoreSystemWritable = Omit<IStore, B.IBaseReadonlyFields | StoreRelationKey>;

export type IStoreUpdatable = Partial<Omit<IStore, IStoreImmutableFields | StoreRelationKey>>;

export interface IStoreTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type StoreSortableField = (typeof STORE_SORTABLE_FIELDS)[number];

export type StoreSearchableField = (typeof STORE_SEARCHABLE_FIELDS)[number];

export type StoreFilterableField = (typeof STORE_FILTERABLE_FIELDS)[number];

export type StoreDateRangeField = (typeof STORE_DATE_RANGE_FIELDS)[number];

export type StoreSelectableField = (typeof STORE_SELECTABLE_FIELDS)[number];

export type StoreDefaultSelectField = (typeof STORE_DEFAULT_SELECT_FIELDS)[number];

export type StoreEditableField = (typeof STORE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IStoreAsOneRelationConfig = Q.IOneRelationConfig<'store', StoreSelectableField>;

export type IStoreAsManyRelationConfig = Q.IManyRelationConfig<'stores', StoreSelectableField, StoreSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IStoreAsOneRelationQuery = Q.IAsOneRelationQuery<IStore, StoreSelectableField>;

export type IStoreAsManyRelationQuery = Q.IAsManyRelationQuery<IStore, StoreSelectableField, StoreSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IStoreRelationMap extends Record<StoreRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IStoreRelationQueries = Q.IBaseRelationQueries<IStore, StoreRelationKey, IStoreRelationMap>;

export type IStoreItemQuery = Q.IBaseItemQuery<
  IStore,
  StoreRelationKey,
  StoreSelectableField,
  StoreRelationKey,
  StoreSelectableField,
  IStoreRelationMap,
  IStoreRelationQueries
>;

export type IStoreListQuery = Q.IBaseListQuery<
  IStore,
  StoreRelationKey,
  StoreSelectableField,
  StoreSortableField,
  StoreRelationKey,
  StoreSelectableField,
  StoreSortableField,
  StoreDateRangeField,
  StoreFilterableField,
  IStoreRelationMap,
  IStoreRelationQueries,
  IStoreItemQuery
>;