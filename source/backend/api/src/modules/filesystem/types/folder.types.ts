// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { Visibility } from '#/types/filesystem/visibility.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  FOLDER_RELATION_KEYS,
  FOLDER_SORTABLE_FIELDS,
  FOLDER_SEARCHABLE_FIELDS,
  FOLDER_FILTERABLE_FIELDS,
  FOLDER_DATE_RANGE_FIELDS,
  FOLDER_SELECTABLE_FIELDS,
  FOLDER_DEFAULT_SELECT_FIELDS,
  FOLDER_EDITABLE_FIELDS
} from './folder.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Folder */
export interface IFolder extends B.IBase {
  depth: number;
  name: string;
  parentId: string | null;
  path: string;
  visibility: Visibility;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type FolderKey = keyof IFolder;

export type FolderRelationKey = (typeof FOLDER_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IFolderReadonlyFields = B.IBaseReadonlyFields;

export type IFolderContextualFields = never;

export type IFolderSensitiveFields = never;

export type IFolderTransitionFields = never;

export type IFolderImmutableFields =
  | IFolderReadonlyFields
  | IFolderContextualFields
  | IFolderSensitiveFields
  | IFolderTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IFolderCreatable = Omit<IFolder, IFolderImmutableFields | FolderRelationKey>;

export type IFolderSystemWritable = Omit<IFolder, B.IBaseReadonlyFields | FolderRelationKey>;

export type IFolderUpdatable = Partial<Omit<IFolder, IFolderImmutableFields | FolderRelationKey>>;

export interface IFolderTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type FolderSortableField = (typeof FOLDER_SORTABLE_FIELDS)[number];

export type FolderSearchableField = (typeof FOLDER_SEARCHABLE_FIELDS)[number];

export type FolderFilterableField = (typeof FOLDER_FILTERABLE_FIELDS)[number];

export type FolderDateRangeField = (typeof FOLDER_DATE_RANGE_FIELDS)[number];

export type FolderSelectableField = (typeof FOLDER_SELECTABLE_FIELDS)[number];

export type FolderDefaultSelectField = (typeof FOLDER_DEFAULT_SELECT_FIELDS)[number];

export type FolderEditableField = (typeof FOLDER_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IFolderAsOneRelationConfig = Q.IOneRelationConfig<'folder', FolderSelectableField>;

export type IFolderAsManyRelationConfig = Q.IManyRelationConfig<'folders', FolderSelectableField, FolderSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IFolderAsOneRelationQuery = Q.IAsOneRelationQuery<IFolder, FolderSelectableField>;

export type IFolderAsManyRelationQuery = Q.IAsManyRelationQuery<IFolder, FolderSelectableField, FolderSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IFolderRelationMap extends Record<FolderRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IFolderRelationQueries = Q.IBaseRelationQueries<IFolder, FolderRelationKey, IFolderRelationMap>;

export type IFolderItemQuery = Q.IBaseItemQuery<
  IFolder,
  FolderRelationKey,
  FolderSelectableField,
  FolderRelationKey,
  FolderSelectableField,
  IFolderRelationMap,
  IFolderRelationQueries
>;

export type IFolderListQuery = Q.IBaseListQuery<
  IFolder,
  FolderRelationKey,
  FolderSelectableField,
  FolderSortableField,
  FolderRelationKey,
  FolderSelectableField,
  FolderSortableField,
  FolderDateRangeField,
  FolderFilterableField,
  IFolderRelationMap,
  IFolderRelationQueries,
  IFolderItemQuery
>;