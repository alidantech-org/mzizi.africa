// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as FileTypes from '#/modules/filesystem/types/file.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  FILE_VERSION_RELATION_KEYS,
  FILE_VERSION_SORTABLE_FIELDS,
  FILE_VERSION_SEARCHABLE_FIELDS,
  FILE_VERSION_FILTERABLE_FIELDS,
  FILE_VERSION_DATE_RANGE_FIELDS,
  FILE_VERSION_SELECTABLE_FIELDS,
  FILE_VERSION_DEFAULT_SELECT_FIELDS,
  FILE_VERSION_EDITABLE_FIELDS
} from './file-version.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** File Version */
export interface IFileVersion extends B.IBase {
  fileId: string;
  note: string | null;
  objectId: string;
  uploadedBy: string | null;
  versionNumber: number;
  readonly file?: FileTypes.IFile;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type FileVersionKey = keyof IFileVersion;

export type FileVersionRelationKey = (typeof FILE_VERSION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IFileVersionReadonlyFields = B.IBaseReadonlyFields;

export type IFileVersionContextualFields = never;

export type IFileVersionSensitiveFields = never;

export type IFileVersionTransitionFields = never;

export type IFileVersionImmutableFields =
  | IFileVersionReadonlyFields
  | IFileVersionContextualFields
  | IFileVersionSensitiveFields
  | IFileVersionTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IFileVersionCreatable = Omit<IFileVersion, IFileVersionImmutableFields | FileVersionRelationKey>;

export type IFileVersionSystemWritable = Omit<IFileVersion, B.IBaseReadonlyFields | FileVersionRelationKey>;

export type IFileVersionUpdatable = Partial<Omit<IFileVersion, IFileVersionImmutableFields | FileVersionRelationKey>>;

export interface IFileVersionTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type FileVersionSortableField = (typeof FILE_VERSION_SORTABLE_FIELDS)[number];

export type FileVersionSearchableField = (typeof FILE_VERSION_SEARCHABLE_FIELDS)[number];

export type FileVersionFilterableField = (typeof FILE_VERSION_FILTERABLE_FIELDS)[number];

export type FileVersionDateRangeField = (typeof FILE_VERSION_DATE_RANGE_FIELDS)[number];

export type FileVersionSelectableField = (typeof FILE_VERSION_SELECTABLE_FIELDS)[number];

export type FileVersionDefaultSelectField = (typeof FILE_VERSION_DEFAULT_SELECT_FIELDS)[number];

export type FileVersionEditableField = (typeof FILE_VERSION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IFileVersionAsOneRelationConfig = Q.IOneRelationConfig<'fileVersion', FileVersionSelectableField>;

export type IFileVersionAsManyRelationConfig = Q.IManyRelationConfig<'fileVersions', FileVersionSelectableField, FileVersionSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IFileVersionAsOneRelationQuery = Q.IAsOneRelationQuery<IFileVersion, FileVersionSelectableField>;

export type IFileVersionAsManyRelationQuery = Q.IAsManyRelationQuery<IFileVersion, FileVersionSelectableField, FileVersionSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IFileVersionRelationMap extends Record<FileVersionRelationKey, unknown> {
  file: FileTypes.IFileAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IFileVersionRelationQueries = Q.IBaseRelationQueries<IFileVersion, FileVersionRelationKey, IFileVersionRelationMap>;

export type IFileVersionItemQuery = Q.IBaseItemQuery<
  IFileVersion,
  FileVersionRelationKey,
  FileVersionSelectableField,
  FileVersionRelationKey,
  FileVersionSelectableField,
  IFileVersionRelationMap,
  IFileVersionRelationQueries
>;

export type IFileVersionListQuery = Q.IBaseListQuery<
  IFileVersion,
  FileVersionRelationKey,
  FileVersionSelectableField,
  FileVersionSortableField,
  FileVersionRelationKey,
  FileVersionSelectableField,
  FileVersionSortableField,
  FileVersionDateRangeField,
  FileVersionFilterableField,
  IFileVersionRelationMap,
  IFileVersionRelationQueries,
  IFileVersionItemQuery
>;