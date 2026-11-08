// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { StructureFileRole } from '#/types/website/structure-file-role.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  STRUCTURE_FILE_RELATION_KEYS,
  STRUCTURE_FILE_SORTABLE_FIELDS,
  STRUCTURE_FILE_SEARCHABLE_FIELDS,
  STRUCTURE_FILE_FILTERABLE_FIELDS,
  STRUCTURE_FILE_DATE_RANGE_FIELDS,
  STRUCTURE_FILE_SELECTABLE_FIELDS,
  STRUCTURE_FILE_DEFAULT_SELECT_FIELDS,
  STRUCTURE_FILE_EDITABLE_FIELDS
} from './structure-file.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Structure File */
export interface IStructureFile extends B.IBase {
  fileVersionId: string;
  path: string;
  role: StructureFileRole;
  versionId: string;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type StructureFileKey = keyof IStructureFile;

export type StructureFileRelationKey = (typeof STRUCTURE_FILE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IStructureFileReadonlyFields = B.IBaseReadonlyFields;

export type IStructureFileContextualFields = never;

export type IStructureFileSensitiveFields = never;

export type IStructureFileTransitionFields = never;

export type IStructureFileImmutableFields =
  | IStructureFileReadonlyFields
  | IStructureFileContextualFields
  | IStructureFileSensitiveFields
  | IStructureFileTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IStructureFileCreatable = Omit<IStructureFile, IStructureFileImmutableFields | StructureFileRelationKey>;

export type IStructureFileSystemWritable = Omit<IStructureFile, B.IBaseReadonlyFields | StructureFileRelationKey>;

export type IStructureFileUpdatable = Partial<Omit<IStructureFile, IStructureFileImmutableFields | StructureFileRelationKey>>;

export interface IStructureFileTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type StructureFileSortableField = (typeof STRUCTURE_FILE_SORTABLE_FIELDS)[number];

export type StructureFileSearchableField = (typeof STRUCTURE_FILE_SEARCHABLE_FIELDS)[number];

export type StructureFileFilterableField = (typeof STRUCTURE_FILE_FILTERABLE_FIELDS)[number];

export type StructureFileDateRangeField = (typeof STRUCTURE_FILE_DATE_RANGE_FIELDS)[number];

export type StructureFileSelectableField = (typeof STRUCTURE_FILE_SELECTABLE_FIELDS)[number];

export type StructureFileDefaultSelectField = (typeof STRUCTURE_FILE_DEFAULT_SELECT_FIELDS)[number];

export type StructureFileEditableField = (typeof STRUCTURE_FILE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IStructureFileAsOneRelationConfig = Q.IOneRelationConfig<'structureFile', StructureFileSelectableField>;

export type IStructureFileAsManyRelationConfig = Q.IManyRelationConfig<'structureFiles', StructureFileSelectableField, StructureFileSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IStructureFileAsOneRelationQuery = Q.IAsOneRelationQuery<IStructureFile, StructureFileSelectableField>;

export type IStructureFileAsManyRelationQuery = Q.IAsManyRelationQuery<IStructureFile, StructureFileSelectableField, StructureFileSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IStructureFileRelationMap extends Record<StructureFileRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IStructureFileRelationQueries = Q.IBaseRelationQueries<IStructureFile, StructureFileRelationKey, IStructureFileRelationMap>;

export type IStructureFileItemQuery = Q.IBaseItemQuery<
  IStructureFile,
  StructureFileRelationKey,
  StructureFileSelectableField,
  StructureFileRelationKey,
  StructureFileSelectableField,
  IStructureFileRelationMap,
  IStructureFileRelationQueries
>;

export type IStructureFileListQuery = Q.IBaseListQuery<
  IStructureFile,
  StructureFileRelationKey,
  StructureFileSelectableField,
  StructureFileSortableField,
  StructureFileRelationKey,
  StructureFileSelectableField,
  StructureFileSortableField,
  StructureFileDateRangeField,
  StructureFileFilterableField,
  IStructureFileRelationMap,
  IStructureFileRelationQueries,
  IStructureFileItemQuery
>;