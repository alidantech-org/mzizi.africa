// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { Access } from '#/modules/filesystem/access.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as FileExtensionsTypes from '#/modules/filesystem/types/file-extensions.types';
import type * as FilesTypes from '#/modules/filesystem/types/files.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  FILE_VERSIONS_RELATION_KEYS,
  FILE_VERSIONS_SORTABLE_FIELDS,
  FILE_VERSIONS_SEARCHABLE_FIELDS,
  FILE_VERSIONS_FILTERABLE_FIELDS,
  FILE_VERSIONS_DATE_RANGE_FIELDS,
  FILE_VERSIONS_SELECTABLE_FIELDS,
  FILE_VERSIONS_DEFAULT_SELECT_FIELDS,
  FILE_VERSIONS_EDITABLE_FIELDS
} from './file-versions.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Immutable exact bytes in the mzizi bucket; verify object hash, size and access before acceptance. */
export interface IFileVersions extends B.IBase {
  access: Access;
  contentType: string;
  createdBySnapshot: string;
  fileExtensionId: string | null;
  fileId: string;
  originalFilename: string | null;
  pinned: boolean;
  provenance: string;
  revision: number;
  s3Key: string;
  sha256: string;
  sizeBytes: number;
  verifiedAt: Date;
  readonly fileExtension?: FileExtensionsTypes.IFileExtensions;
  readonly file?: FilesTypes.IFiles;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type FileVersionsKey = keyof IFileVersions;

export type FileVersionsRelationKey = (typeof FILE_VERSIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IFileVersionsReadonlyFields = B.IBaseReadonlyFields;

export type IFileVersionsContextualFields = never;

export type IFileVersionsSensitiveFields = never;

export type IFileVersionsTransitionFields = never;

export type IFileVersionsImmutableFields =
  | IFileVersionsReadonlyFields
  | IFileVersionsContextualFields
  | IFileVersionsSensitiveFields
  | IFileVersionsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IFileVersionsCreatable = Omit<IFileVersions, IFileVersionsImmutableFields | FileVersionsRelationKey>;

export type IFileVersionsSystemWritable = Omit<IFileVersions, B.IBaseReadonlyFields | FileVersionsRelationKey>;

export type IFileVersionsUpdatable = Partial<Omit<IFileVersions, IFileVersionsImmutableFields | FileVersionsRelationKey>>;

export interface IFileVersionsTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type FileVersionsSortableField = (typeof FILE_VERSIONS_SORTABLE_FIELDS)[number];

export type FileVersionsSearchableField = (typeof FILE_VERSIONS_SEARCHABLE_FIELDS)[number];

export type FileVersionsFilterableField = (typeof FILE_VERSIONS_FILTERABLE_FIELDS)[number];

export type FileVersionsDateRangeField = (typeof FILE_VERSIONS_DATE_RANGE_FIELDS)[number];

export type FileVersionsSelectableField = (typeof FILE_VERSIONS_SELECTABLE_FIELDS)[number];

export type FileVersionsDefaultSelectField = (typeof FILE_VERSIONS_DEFAULT_SELECT_FIELDS)[number];

export type FileVersionsEditableField = (typeof FILE_VERSIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IFileVersionsAsOneRelationConfig = Q.IOneRelationConfig<'fileVersions', FileVersionsSelectableField>;

export type IFileVersionsAsManyRelationConfig = Q.IManyRelationConfig<'fileVersionss', FileVersionsSelectableField, FileVersionsSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IFileVersionsAsOneRelationQuery = Q.IAsOneRelationQuery<IFileVersions, FileVersionsSelectableField>;

export type IFileVersionsAsManyRelationQuery = Q.IAsManyRelationQuery<IFileVersions, FileVersionsSelectableField, FileVersionsSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IFileVersionsRelationMap extends Record<FileVersionsRelationKey, unknown> {
  fileExtension: FileExtensionsTypes.IFileExtensionsAsOneRelationQuery;
  file: FilesTypes.IFilesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IFileVersionsRelationQueries = Q.IBaseRelationQueries<IFileVersions, FileVersionsRelationKey, IFileVersionsRelationMap>;

export type IFileVersionsItemQuery = Q.IBaseItemQuery<
  IFileVersions,
  FileVersionsRelationKey,
  FileVersionsSelectableField,
  FileVersionsRelationKey,
  FileVersionsSelectableField,
  IFileVersionsRelationMap,
  IFileVersionsRelationQueries
>;

export type IFileVersionsListQuery = Q.IBaseListQuery<
  IFileVersions,
  FileVersionsRelationKey,
  FileVersionsSelectableField,
  FileVersionsSortableField,
  FileVersionsRelationKey,
  FileVersionsSelectableField,
  FileVersionsSortableField,
  FileVersionsDateRangeField,
  FileVersionsFilterableField,
  IFileVersionsRelationMap,
  IFileVersionsRelationQueries,
  IFileVersionsItemQuery
>;