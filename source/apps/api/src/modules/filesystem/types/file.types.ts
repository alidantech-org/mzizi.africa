// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { FileStatus } from '#/types/filesystem/file-status.enum';
import type { Visibility } from '#/types/filesystem/visibility.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as FolderTypes from '#/modules/filesystem/types/folder.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  FILE_RELATION_KEYS,
  FILE_SORTABLE_FIELDS,
  FILE_SEARCHABLE_FIELDS,
  FILE_FILTERABLE_FIELDS,
  FILE_DATE_RANGE_FIELDS,
  FILE_SELECTABLE_FIELDS,
  FILE_DEFAULT_SELECT_FIELDS,
  FILE_EDITABLE_FIELDS
} from './file.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** File */
export interface IFile extends B.IBase {
  currentVersionId: string | null;
  folderId: string;
  isLegalHold: boolean;
  name: string;
  ownerAccountId: string | null;
  status: FileStatus;
  trashedAt: Date | null;
  visibility: Visibility;
  readonly folder?: FolderTypes.IFolder;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type FileKey = keyof IFile;

export type FileRelationKey = (typeof FILE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IFileReadonlyFields = B.IBaseReadonlyFields;

export type IFileContextualFields = never;

export type IFileSensitiveFields = never;

export type IFileTransitionFields = never;

export type IFileImmutableFields =
  | IFileReadonlyFields
  | IFileContextualFields
  | IFileSensitiveFields
  | IFileTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IFileCreatable = Omit<IFile, IFileImmutableFields | FileRelationKey>;

export type IFileSystemWritable = Omit<IFile, B.IBaseReadonlyFields | FileRelationKey>;

export type IFileUpdatable = Partial<Omit<IFile, IFileImmutableFields | FileRelationKey>>;

export interface IFileTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type FileSortableField = (typeof FILE_SORTABLE_FIELDS)[number];

export type FileSearchableField = (typeof FILE_SEARCHABLE_FIELDS)[number];

export type FileFilterableField = (typeof FILE_FILTERABLE_FIELDS)[number];

export type FileDateRangeField = (typeof FILE_DATE_RANGE_FIELDS)[number];

export type FileSelectableField = (typeof FILE_SELECTABLE_FIELDS)[number];

export type FileDefaultSelectField = (typeof FILE_DEFAULT_SELECT_FIELDS)[number];

export type FileEditableField = (typeof FILE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IFileAsOneRelationConfig = Q.IOneRelationConfig<'file', FileSelectableField>;

export type IFileAsManyRelationConfig = Q.IManyRelationConfig<'files', FileSelectableField, FileSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IFileAsOneRelationQuery = Q.IAsOneRelationQuery<IFile, FileSelectableField>;

export type IFileAsManyRelationQuery = Q.IAsManyRelationQuery<IFile, FileSelectableField, FileSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IFileRelationMap extends Record<FileRelationKey, unknown> {
  folder: FolderTypes.IFolderAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IFileRelationQueries = Q.IBaseRelationQueries<IFile, FileRelationKey, IFileRelationMap>;

export type IFileItemQuery = Q.IBaseItemQuery<
  IFile,
  FileRelationKey,
  FileSelectableField,
  FileRelationKey,
  FileSelectableField,
  IFileRelationMap,
  IFileRelationQueries
>;

export type IFileListQuery = Q.IBaseListQuery<
  IFile,
  FileRelationKey,
  FileSelectableField,
  FileSortableField,
  FileRelationKey,
  FileSelectableField,
  FileSortableField,
  FileDateRangeField,
  FileFilterableField,
  IFileRelationMap,
  IFileRelationQueries,
  IFileItemQuery
>;