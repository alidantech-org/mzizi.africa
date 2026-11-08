// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as FileConfig from '#/modules/filesystem/types/file.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IFileVersion,
  FileVersionKey,
  FileVersionRelationKey,
  FileVersionSortableField,
  FileVersionFilterableField,
  FileVersionDateRangeField,
  FileVersionSelectableField,
  IFileVersionAsOneRelationConfig,
  IFileVersionAsManyRelationConfig
} from './file-version.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const FILE_VERSION_RELATION_KEYS = ['file', ] as const satisfies readonly FileVersionKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const FILE_VERSION_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', 'versionNumber', ] as const satisfies readonly FileVersionKey[];

export const FILE_VERSION_SEARCHABLE_FIELDS = [] as const satisfies readonly FileVersionKey[];

export const FILE_VERSION_FILTERABLE_FIELDS = ['fileId', 'id', 'objectId', 'uploadedBy', 'version', 'versionNumber', ] as const satisfies readonly FileVersionKey[];

export const FILE_VERSION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly FileVersionKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const FILE_VERSION_SELECTABLE_FIELDS = ['createdAt', 'fileId', 'id', 'note', 'objectId', 'updatedAt', 'uploadedBy', 'versionNumber', ] as const satisfies readonly FileVersionKey[];

export const FILE_VERSION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly FileVersionSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const FILE_VERSION_EDITABLE_FIELDS = ['fileId', 'note', 'objectId', 'uploadedBy', 'versionNumber', ] as const satisfies readonly FileVersionKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const FILE_VERSION_AS_ONE_RELATION_CONFIG = {
  relation: 'fileVersion',
  type: ERelationType.One,
  selectableFields: FILE_VERSION_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_VERSION_DEFAULT_SELECT_FIELDS
} as const satisfies IFileVersionAsOneRelationConfig;

export const FILE_VERSION_AS_MANY_RELATION_CONFIG = {
  relation: 'fileVersions',
  type: ERelationType.Many,
  selectableFields: FILE_VERSION_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_VERSION_DEFAULT_SELECT_FIELDS,
  sortableFields: FILE_VERSION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IFileVersionAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const FILE_VERSION_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<FileVersionRelationKey>().one(FileConfig.FILE_AS_ONE_RELATION_CONFIG, 'file'),
] as const;

export const FILE_VERSION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const FILE_VERSION_QUERY_OPTIONS = {
  searchableFields: FILE_VERSION_SEARCHABLE_FIELDS,
  selectableFields: FILE_VERSION_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_VERSION_DEFAULT_SELECT_FIELDS,
  sortableFields: FILE_VERSION_SORTABLE_FIELDS,
  filterFields: FILE_VERSION_FILTERABLE_FIELDS,
  dateRangeFields: FILE_VERSION_DATE_RANGE_FIELDS,
  oneRelations: FILE_VERSION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: FILE_VERSION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IFileVersion,
  FileVersionSortableField,
  FileVersionSelectableField,
  FileVersionFilterableField,
  FileVersionDateRangeField,
  FileVersionRelationKey,
  typeof FILE_VERSION_ONE_RELATION_QUERY_OPTIONS,
  typeof FILE_VERSION_MANY_RELATION_QUERY_OPTIONS
>;