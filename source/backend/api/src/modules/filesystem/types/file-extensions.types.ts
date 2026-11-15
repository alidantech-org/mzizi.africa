// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  FILE_EXTENSIONS_RELATION_KEYS,
  FILE_EXTENSIONS_SORTABLE_FIELDS,
  FILE_EXTENSIONS_SEARCHABLE_FIELDS,
  FILE_EXTENSIONS_FILTERABLE_FIELDS,
  FILE_EXTENSIONS_DATE_RANGE_FIELDS,
  FILE_EXTENSIONS_SELECTABLE_FIELDS,
  FILE_EXTENSIONS_DEFAULT_SELECT_FIELDS,
  FILE_EXTENSIONS_EDITABLE_FIELDS
} from './file-extensions.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Technical filename suffix and media-type hint; never a semantic document classification. */
export interface IFileExtensions extends B.IBase {
  code: string;
  contentType: string;
  description: string | null;
  extension: string;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type FileExtensionsKey = keyof IFileExtensions;

export type FileExtensionsRelationKey = (typeof FILE_EXTENSIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IFileExtensionsReadonlyFields = B.IBaseReadonlyFields;

export type IFileExtensionsContextualFields = never;

export type IFileExtensionsSensitiveFields = never;

export type IFileExtensionsTransitionFields = never;

export type IFileExtensionsImmutableFields =
  | IFileExtensionsReadonlyFields
  | IFileExtensionsContextualFields
  | IFileExtensionsSensitiveFields
  | IFileExtensionsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IFileExtensionsCreatable = Omit<IFileExtensions, IFileExtensionsImmutableFields | FileExtensionsRelationKey>;

export type IFileExtensionsSystemWritable = Omit<IFileExtensions, B.IBaseReadonlyFields | FileExtensionsRelationKey>;

export type IFileExtensionsUpdatable = Partial<Omit<IFileExtensions, IFileExtensionsImmutableFields | FileExtensionsRelationKey>>;

export interface IFileExtensionsTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type FileExtensionsSortableField = (typeof FILE_EXTENSIONS_SORTABLE_FIELDS)[number];

export type FileExtensionsSearchableField = (typeof FILE_EXTENSIONS_SEARCHABLE_FIELDS)[number];

export type FileExtensionsFilterableField = (typeof FILE_EXTENSIONS_FILTERABLE_FIELDS)[number];

export type FileExtensionsDateRangeField = (typeof FILE_EXTENSIONS_DATE_RANGE_FIELDS)[number];

export type FileExtensionsSelectableField = (typeof FILE_EXTENSIONS_SELECTABLE_FIELDS)[number];

export type FileExtensionsDefaultSelectField = (typeof FILE_EXTENSIONS_DEFAULT_SELECT_FIELDS)[number];

export type FileExtensionsEditableField = (typeof FILE_EXTENSIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IFileExtensionsAsOneRelationConfig = Q.IOneRelationConfig<'fileExtensions', FileExtensionsSelectableField>;

export type IFileExtensionsAsManyRelationConfig = Q.IManyRelationConfig<'fileExtensionss', FileExtensionsSelectableField, FileExtensionsSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IFileExtensionsAsOneRelationQuery = Q.IAsOneRelationQuery<IFileExtensions, FileExtensionsSelectableField>;

export type IFileExtensionsAsManyRelationQuery = Q.IAsManyRelationQuery<IFileExtensions, FileExtensionsSelectableField, FileExtensionsSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IFileExtensionsRelationMap extends Record<FileExtensionsRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IFileExtensionsRelationQueries = Q.IBaseRelationQueries<IFileExtensions, FileExtensionsRelationKey, IFileExtensionsRelationMap>;

export type IFileExtensionsItemQuery = Q.IBaseItemQuery<
  IFileExtensions,
  FileExtensionsRelationKey,
  FileExtensionsSelectableField,
  FileExtensionsRelationKey,
  FileExtensionsSelectableField,
  IFileExtensionsRelationMap,
  IFileExtensionsRelationQueries
>;

export type IFileExtensionsListQuery = Q.IBaseListQuery<
  IFileExtensions,
  FileExtensionsRelationKey,
  FileExtensionsSelectableField,
  FileExtensionsSortableField,
  FileExtensionsRelationKey,
  FileExtensionsSelectableField,
  FileExtensionsSortableField,
  FileExtensionsDateRangeField,
  FileExtensionsFilterableField,
  IFileExtensionsRelationMap,
  IFileExtensionsRelationQueries,
  IFileExtensionsItemQuery
>;