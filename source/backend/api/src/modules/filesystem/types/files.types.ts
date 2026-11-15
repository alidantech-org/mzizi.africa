// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { Retention } from '#/modules/filesystem/retention.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as FileVersionsTypes from '#/modules/filesystem/types/file-versions.types';
import type * as FoldersTypes from '#/modules/filesystem/types/folders.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  FILES_RELATION_KEYS,
  FILES_SORTABLE_FIELDS,
  FILES_SEARCHABLE_FIELDS,
  FILES_FILTERABLE_FIELDS,
  FILES_DATE_RANGE_FIELDS,
  FILES_SELECTABLE_FIELDS,
  FILES_DEFAULT_SELECT_FIELDS,
  FILES_EDITABLE_FIELDS
} from './files.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Stable logical file identity; equal content hashes may belong to different files. */
export interface IFiles extends B.IBase {
  code: string;
  currentVersionId: string | null;
  folderId: string;
  name: string;
  retention: Retention;
  readonly currentVersion?: FileVersionsTypes.IFileVersions;
  readonly folder?: FoldersTypes.IFolders;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type FilesKey = keyof IFiles;

export type FilesRelationKey = (typeof FILES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IFilesReadonlyFields = B.IBaseReadonlyFields;

export type IFilesContextualFields = never;

export type IFilesSensitiveFields = never;

export type IFilesTransitionFields = never;

export type IFilesImmutableFields =
  | IFilesReadonlyFields
  | IFilesContextualFields
  | IFilesSensitiveFields
  | IFilesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IFilesCreatable = Omit<IFiles, IFilesImmutableFields | FilesRelationKey>;

export type IFilesSystemWritable = Omit<IFiles, B.IBaseReadonlyFields | FilesRelationKey>;

export type IFilesUpdatable = Partial<Omit<IFiles, IFilesImmutableFields | FilesRelationKey>>;

export interface IFilesTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type FilesSortableField = (typeof FILES_SORTABLE_FIELDS)[number];

export type FilesSearchableField = (typeof FILES_SEARCHABLE_FIELDS)[number];

export type FilesFilterableField = (typeof FILES_FILTERABLE_FIELDS)[number];

export type FilesDateRangeField = (typeof FILES_DATE_RANGE_FIELDS)[number];

export type FilesSelectableField = (typeof FILES_SELECTABLE_FIELDS)[number];

export type FilesDefaultSelectField = (typeof FILES_DEFAULT_SELECT_FIELDS)[number];

export type FilesEditableField = (typeof FILES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IFilesAsOneRelationConfig = Q.IOneRelationConfig<'files', FilesSelectableField>;

export type IFilesAsManyRelationConfig = Q.IManyRelationConfig<'filess', FilesSelectableField, FilesSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IFilesAsOneRelationQuery = Q.IAsOneRelationQuery<IFiles, FilesSelectableField>;

export type IFilesAsManyRelationQuery = Q.IAsManyRelationQuery<IFiles, FilesSelectableField, FilesSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IFilesRelationMap extends Record<FilesRelationKey, unknown> {
  currentVersion: FileVersionsTypes.IFileVersionsAsOneRelationQuery;
  folder: FoldersTypes.IFoldersAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IFilesRelationQueries = Q.IBaseRelationQueries<IFiles, FilesRelationKey, IFilesRelationMap>;

export type IFilesItemQuery = Q.IBaseItemQuery<
  IFiles,
  FilesRelationKey,
  FilesSelectableField,
  FilesRelationKey,
  FilesSelectableField,
  IFilesRelationMap,
  IFilesRelationQueries
>;

export type IFilesListQuery = Q.IBaseListQuery<
  IFiles,
  FilesRelationKey,
  FilesSelectableField,
  FilesSortableField,
  FilesRelationKey,
  FilesSelectableField,
  FilesSortableField,
  FilesDateRangeField,
  FilesFilterableField,
  IFilesRelationMap,
  IFilesRelationQueries,
  IFilesItemQuery
>;