// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as FileExtensionsConfig from '#/modules/filesystem/types/file-extensions/file-extensions.config';
import * as FilesConfig from '#/modules/filesystem/types/files/files.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IFileVersions,
  FileVersionsKey,
  FileVersionsRelationKey,
  FileVersionsSortableField,
  FileVersionsFilterableField,
  FileVersionsDateRangeField,
  FileVersionsSelectableField,
  IFileVersionsAsOneRelationConfig,
  IFileVersionsAsManyRelationConfig
} from './file-versions.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const FILE_VERSIONS_RELATION_KEYS = ['fileExtension', 'file', ] as const satisfies readonly FileVersionsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const FILE_VERSIONS_SORTABLE_FIELDS = [] as const satisfies readonly FileVersionsKey[];

export const FILE_VERSIONS_SEARCHABLE_FIELDS = [] as const satisfies readonly FileVersionsKey[];

export const FILE_VERSIONS_FILTERABLE_FIELDS = [] as const satisfies readonly FileVersionsKey[];

export const FILE_VERSIONS_DATE_RANGE_FIELDS = [] as const satisfies readonly FileVersionsKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const FILE_VERSIONS_SELECTABLE_FIELDS = ['access', 'contentType', 'createdAt', 'createdBySnapshot', 'deletedAt', 'fileExtensionId', 'fileId', 'id', 'originalFilename', 'pinned', 'provenance', 'revision', 's3Key', 'sha256', 'sizeBytes', 'updatedAt', 'verifiedAt', 'version', ] as const satisfies readonly FileVersionsKey[];

export const FILE_VERSIONS_DEFAULT_SELECT_FIELDS = ['access', 'contentType', 'createdAt', 'createdBySnapshot', 'deletedAt', 'fileExtensionId', 'fileId', 'id', 'originalFilename', 'pinned', 'provenance', 'revision', 's3Key', 'sha256', 'sizeBytes', 'updatedAt', 'verifiedAt', 'version', ] as const satisfies readonly FileVersionsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const FILE_VERSIONS_EDITABLE_FIELDS = ['access', 'contentType', 'createdBySnapshot', 'fileExtensionId', 'fileId', 'originalFilename', 'pinned', 'provenance', 'revision', 's3Key', 'sha256', 'sizeBytes', 'verifiedAt', ] as const satisfies readonly FileVersionsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const FILE_VERSIONS_AS_ONE_RELATION_CONFIG = {
  relation: 'fileVersions',
  type: ERelationType.One,
  selectableFields: FILE_VERSIONS_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_VERSIONS_DEFAULT_SELECT_FIELDS
} as const satisfies IFileVersionsAsOneRelationConfig;

export const FILE_VERSIONS_AS_MANY_RELATION_CONFIG = {
  relation: 'fileVersionss',
  type: ERelationType.Many,
  selectableFields: FILE_VERSIONS_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_VERSIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: FILE_VERSIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IFileVersionsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const FILE_VERSIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<FileVersionsRelationKey>().one(FileExtensionsConfig.FILE_EXTENSIONS_AS_ONE_RELATION_CONFIG, 'fileExtension'),
  Q.createRelationKeyMapper<FileVersionsRelationKey>().one(FilesConfig.FILES_AS_ONE_RELATION_CONFIG, 'file'),
] as const;

export const FILE_VERSIONS_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const FILE_VERSIONS_QUERY_OPTIONS = {
  searchableFields: FILE_VERSIONS_SEARCHABLE_FIELDS,
  selectableFields: FILE_VERSIONS_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_VERSIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: FILE_VERSIONS_SORTABLE_FIELDS,
  filterFields: FILE_VERSIONS_FILTERABLE_FIELDS,
  dateRangeFields: FILE_VERSIONS_DATE_RANGE_FIELDS,
  oneRelations: FILE_VERSIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: FILE_VERSIONS_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IFileVersions,
  FileVersionsSortableField,
  FileVersionsSelectableField,
  FileVersionsFilterableField,
  FileVersionsDateRangeField,
  FileVersionsRelationKey,
  typeof FILE_VERSIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof FILE_VERSIONS_MANY_RELATION_QUERY_OPTIONS
>;