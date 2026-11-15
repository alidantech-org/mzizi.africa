// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import * as B from '#/modules/common/schema/types/base';
import type { Access } from '#/modules/filesystem/schema/enum/access.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from '#/modules/reference/schema/types/value/value.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  FOLDERS_RELATION_KEYS,
  FOLDERS_SORTABLE_FIELDS,
  FOLDERS_SEARCHABLE_FIELDS,
  FOLDERS_FILTERABLE_FIELDS,
  FOLDERS_DATE_RANGE_FIELDS,
  FOLDERS_SELECTABLE_FIELDS,
  FOLDERS_DEFAULT_SELECT_FIELDS,
  FOLDERS_EDITABLE_FIELDS
} from './folders.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Logical hierarchy; access escalation requires recorded authorization, independent of object keys. */
export interface IFolders extends B.IBase {
  access: Access;
  authorization: string | null;
  code: string;
  name: string;
  parentId: string | null;
  roleId: string;
  readonly parent?: IFolders;
  readonly role?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type FoldersKey = keyof IFolders;

export type FoldersRelationKey = (typeof FOLDERS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IFoldersReadonlyFields = B.IBaseReadonlyFields;

export type IFoldersContextualFields = never;

export type IFoldersSensitiveFields = never;

export type IFoldersTransitionFields = never;

export type IFoldersImmutableFields =
  | IFoldersReadonlyFields
  | IFoldersContextualFields
  | IFoldersSensitiveFields
  | IFoldersTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IFoldersCreatable = Omit<IFolders, IFoldersImmutableFields | FoldersRelationKey>;

export type IFoldersSystemWritable = Omit<IFolders, B.IBaseReadonlyFields | FoldersRelationKey>;

export type IFoldersUpdatable = Partial<Omit<IFolders, IFoldersImmutableFields | FoldersRelationKey>>;

export interface IFoldersTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type FoldersSortableField = (typeof FOLDERS_SORTABLE_FIELDS)[number];

export type FoldersSearchableField = (typeof FOLDERS_SEARCHABLE_FIELDS)[number];

export type FoldersFilterableField = (typeof FOLDERS_FILTERABLE_FIELDS)[number];

export type FoldersDateRangeField = (typeof FOLDERS_DATE_RANGE_FIELDS)[number];

export type FoldersSelectableField = (typeof FOLDERS_SELECTABLE_FIELDS)[number];

export type FoldersDefaultSelectField = (typeof FOLDERS_DEFAULT_SELECT_FIELDS)[number];

export type FoldersEditableField = (typeof FOLDERS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IFoldersAsOneRelationConfig = Q.IOneRelationConfig<'folders', FoldersSelectableField>;

export type IFoldersAsManyRelationConfig = Q.IManyRelationConfig<'folderss', FoldersSelectableField, FoldersSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IFoldersAsOneRelationQuery = Q.IAsOneRelationQuery<IFolders, FoldersSelectableField>;

export type IFoldersAsManyRelationQuery = Q.IAsManyRelationQuery<IFolders, FoldersSelectableField, FoldersSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IFoldersRelationMap extends Record<FoldersRelationKey, unknown> {
  parent: IFoldersAsOneRelationQuery;
  role: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IFoldersRelationQueries = Q.IBaseRelationQueries<IFolders, FoldersRelationKey, IFoldersRelationMap>;

export type IFoldersItemQuery = Q.IBaseItemQuery<
  IFolders,
  FoldersRelationKey,
  FoldersSelectableField,
  FoldersRelationKey,
  FoldersSelectableField,
  IFoldersRelationMap,
  IFoldersRelationQueries
>;

export type IFoldersListQuery = Q.IBaseListQuery<
  IFolders,
  FoldersRelationKey,
  FoldersSelectableField,
  FoldersSortableField,
  FoldersRelationKey,
  FoldersSelectableField,
  FoldersSortableField,
  FoldersDateRangeField,
  FoldersFilterableField,
  IFoldersRelationMap,
  IFoldersRelationQueries,
  IFoldersItemQuery
>;