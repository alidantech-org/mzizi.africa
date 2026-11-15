// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import { ERelationType } from '#/modules/common/schema/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as FileVersionsConfig from '#/modules/filesystem/schema/types/file-versions/file-versions.config';
import * as FoldersConfig from '#/modules/filesystem/schema/types/folders/folders.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IFiles,
  FilesKey,
  FilesRelationKey,
  FilesSortableField,
  FilesFilterableField,
  FilesDateRangeField,
  FilesSelectableField,
  IFilesAsOneRelationConfig,
  IFilesAsManyRelationConfig
} from './files.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const FILES_RELATION_KEYS = ['currentVersion', 'folder', ] as const satisfies readonly FilesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const FILES_SORTABLE_FIELDS = [] as const satisfies readonly FilesKey[];

export const FILES_SEARCHABLE_FIELDS = [] as const satisfies readonly FilesKey[];

export const FILES_FILTERABLE_FIELDS = [] as const satisfies readonly FilesKey[];

export const FILES_DATE_RANGE_FIELDS = [] as const satisfies readonly FilesKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const FILES_SELECTABLE_FIELDS = ['code', 'createdAt', 'currentVersionId', 'deletedAt', 'folderId', 'id', 'name', 'retention', 'updatedAt', 'version', ] as const satisfies readonly FilesKey[];

export const FILES_DEFAULT_SELECT_FIELDS = ['code', 'createdAt', 'currentVersionId', 'deletedAt', 'folderId', 'id', 'name', 'retention', 'updatedAt', 'version', ] as const satisfies readonly FilesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const FILES_EDITABLE_FIELDS = ['code', 'currentVersionId', 'folderId', 'name', 'retention', ] as const satisfies readonly FilesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const FILES_AS_ONE_RELATION_CONFIG = {
  relation: 'files',
  type: ERelationType.One,
  selectableFields: FILES_SELECTABLE_FIELDS,
  defaultSelectFields: FILES_DEFAULT_SELECT_FIELDS
} as const satisfies IFilesAsOneRelationConfig;

export const FILES_AS_MANY_RELATION_CONFIG = {
  relation: 'filess',
  type: ERelationType.Many,
  selectableFields: FILES_SELECTABLE_FIELDS,
  defaultSelectFields: FILES_DEFAULT_SELECT_FIELDS,
  sortableFields: FILES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IFilesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const FILES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<FilesRelationKey>().one(FileVersionsConfig.FILE_VERSIONS_AS_ONE_RELATION_CONFIG, 'currentVersion'),
  Q.createRelationKeyMapper<FilesRelationKey>().one(FoldersConfig.FOLDERS_AS_ONE_RELATION_CONFIG, 'folder'),
] as const;

export const FILES_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const FILES_QUERY_OPTIONS = {
  searchableFields: FILES_SEARCHABLE_FIELDS,
  selectableFields: FILES_SELECTABLE_FIELDS,
  defaultSelectFields: FILES_DEFAULT_SELECT_FIELDS,
  sortableFields: FILES_SORTABLE_FIELDS,
  filterFields: FILES_FILTERABLE_FIELDS,
  dateRangeFields: FILES_DATE_RANGE_FIELDS,
  oneRelations: FILES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: FILES_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IFiles,
  FilesSortableField,
  FilesSelectableField,
  FilesFilterableField,
  FilesDateRangeField,
  FilesRelationKey,
  typeof FILES_ONE_RELATION_QUERY_OPTIONS,
  typeof FILES_MANY_RELATION_QUERY_OPTIONS
>;