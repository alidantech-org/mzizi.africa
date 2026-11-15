// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import { ERelationType } from '#/modules/common/schema/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as FileVersionsConfig from '#/modules/filesystem/schema/types/file-versions/file-versions.config';
import * as ValueConfig from '#/modules/reference/schema/types/value/value.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IFileRelations,
  FileRelationsKey,
  FileRelationsRelationKey,
  FileRelationsSortableField,
  FileRelationsFilterableField,
  FileRelationsDateRangeField,
  FileRelationsSelectableField,
  IFileRelationsAsOneRelationConfig,
  IFileRelationsAsManyRelationConfig
} from './file-relations.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const FILE_RELATIONS_RELATION_KEYS = ['derivedVersion', 'kind', 'sourceVersion', ] as const satisfies readonly FileRelationsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const FILE_RELATIONS_SORTABLE_FIELDS = [] as const satisfies readonly FileRelationsKey[];

export const FILE_RELATIONS_SEARCHABLE_FIELDS = [] as const satisfies readonly FileRelationsKey[];

export const FILE_RELATIONS_FILTERABLE_FIELDS = [] as const satisfies readonly FileRelationsKey[];

export const FILE_RELATIONS_DATE_RANGE_FIELDS = [] as const satisfies readonly FileRelationsKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const FILE_RELATIONS_SELECTABLE_FIELDS = ['createdAt', 'deletedAt', 'derivedVersionId', 'id', 'kindId', 'processingProvenance', 'sourceVersionId', 'updatedAt', 'version', ] as const satisfies readonly FileRelationsKey[];

export const FILE_RELATIONS_DEFAULT_SELECT_FIELDS = ['createdAt', 'deletedAt', 'derivedVersionId', 'id', 'kindId', 'processingProvenance', 'sourceVersionId', 'updatedAt', 'version', ] as const satisfies readonly FileRelationsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const FILE_RELATIONS_EDITABLE_FIELDS = ['derivedVersionId', 'kindId', 'processingProvenance', 'sourceVersionId', ] as const satisfies readonly FileRelationsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const FILE_RELATIONS_AS_ONE_RELATION_CONFIG = {
  relation: 'fileRelations',
  type: ERelationType.One,
  selectableFields: FILE_RELATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_RELATIONS_DEFAULT_SELECT_FIELDS
} as const satisfies IFileRelationsAsOneRelationConfig;

export const FILE_RELATIONS_AS_MANY_RELATION_CONFIG = {
  relation: 'fileRelationss',
  type: ERelationType.Many,
  selectableFields: FILE_RELATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_RELATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: FILE_RELATIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IFileRelationsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const FILE_RELATIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<FileRelationsRelationKey>().one(FileVersionsConfig.FILE_VERSIONS_AS_ONE_RELATION_CONFIG, 'derivedVersion'),
  Q.createRelationKeyMapper<FileRelationsRelationKey>().one(ValueConfig.VALUE_AS_ONE_RELATION_CONFIG, 'kind'),
  Q.createRelationKeyMapper<FileRelationsRelationKey>().one(FileVersionsConfig.FILE_VERSIONS_AS_ONE_RELATION_CONFIG, 'sourceVersion'),
] as const;

export const FILE_RELATIONS_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const FILE_RELATIONS_QUERY_OPTIONS = {
  searchableFields: FILE_RELATIONS_SEARCHABLE_FIELDS,
  selectableFields: FILE_RELATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_RELATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: FILE_RELATIONS_SORTABLE_FIELDS,
  filterFields: FILE_RELATIONS_FILTERABLE_FIELDS,
  dateRangeFields: FILE_RELATIONS_DATE_RANGE_FIELDS,
  oneRelations: FILE_RELATIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: FILE_RELATIONS_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IFileRelations,
  FileRelationsSortableField,
  FileRelationsSelectableField,
  FileRelationsFilterableField,
  FileRelationsDateRangeField,
  FileRelationsRelationKey,
  typeof FILE_RELATIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof FILE_RELATIONS_MANY_RELATION_QUERY_OPTIONS
>;