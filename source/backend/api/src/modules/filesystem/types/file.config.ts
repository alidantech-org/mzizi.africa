// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as FolderConfig from '#/modules/filesystem/types/folder.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IFile,
  FileKey,
  FileRelationKey,
  FileSortableField,
  FileFilterableField,
  FileDateRangeField,
  FileSelectableField,
  IFileAsOneRelationConfig,
  IFileAsManyRelationConfig
} from './file.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const FILE_RELATION_KEYS = ['folder', ] as const satisfies readonly FileKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const FILE_SORTABLE_FIELDS = ['createdAt', 'name', 'updatedAt', 'version', ] as const satisfies readonly FileKey[];

export const FILE_SEARCHABLE_FIELDS = ['name', ] as const satisfies readonly FileKey[];

export const FILE_FILTERABLE_FIELDS = ['currentVersionId', 'folderId', 'id', 'name', 'ownerAccountId', 'status', 'version', 'visibility', ] as const satisfies readonly FileKey[];

export const FILE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly FileKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const FILE_SELECTABLE_FIELDS = ['createdAt', 'currentVersionId', 'folderId', 'id', 'isLegalHold', 'name', 'ownerAccountId', 'status', 'trashedAt', 'updatedAt', 'visibility', ] as const satisfies readonly FileKey[];

export const FILE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly FileSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const FILE_EDITABLE_FIELDS = ['currentVersionId', 'folderId', 'isLegalHold', 'name', 'ownerAccountId', 'status', 'trashedAt', 'visibility', ] as const satisfies readonly FileKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const FILE_AS_ONE_RELATION_CONFIG = {
  relation: 'file',
  type: ERelationType.One,
  selectableFields: FILE_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_DEFAULT_SELECT_FIELDS
} as const satisfies IFileAsOneRelationConfig;

export const FILE_AS_MANY_RELATION_CONFIG = {
  relation: 'files',
  type: ERelationType.Many,
  selectableFields: FILE_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_DEFAULT_SELECT_FIELDS,
  sortableFields: FILE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IFileAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const FILE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<FileRelationKey>().one(FolderConfig.FOLDER_AS_ONE_RELATION_CONFIG, 'folder'),
] as const;

export const FILE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const FILE_QUERY_OPTIONS = {
  searchableFields: FILE_SEARCHABLE_FIELDS,
  selectableFields: FILE_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_DEFAULT_SELECT_FIELDS,
  sortableFields: FILE_SORTABLE_FIELDS,
  filterFields: FILE_FILTERABLE_FIELDS,
  dateRangeFields: FILE_DATE_RANGE_FIELDS,
  oneRelations: FILE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: FILE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IFile,
  FileSortableField,
  FileSelectableField,
  FileFilterableField,
  FileDateRangeField,
  FileRelationKey,
  typeof FILE_ONE_RELATION_QUERY_OPTIONS,
  typeof FILE_MANY_RELATION_QUERY_OPTIONS
>;