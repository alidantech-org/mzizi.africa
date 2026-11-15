// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import { ERelationType } from '#/modules/common/schema/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IFileExtensions,
  FileExtensionsKey,
  FileExtensionsRelationKey,
  FileExtensionsSortableField,
  FileExtensionsFilterableField,
  FileExtensionsDateRangeField,
  FileExtensionsSelectableField,
  IFileExtensionsAsOneRelationConfig,
  IFileExtensionsAsManyRelationConfig
} from './file-extensions.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const FILE_EXTENSIONS_RELATION_KEYS = [] as const satisfies readonly FileExtensionsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const FILE_EXTENSIONS_SORTABLE_FIELDS = [] as const satisfies readonly FileExtensionsKey[];

export const FILE_EXTENSIONS_SEARCHABLE_FIELDS = [] as const satisfies readonly FileExtensionsKey[];

export const FILE_EXTENSIONS_FILTERABLE_FIELDS = [] as const satisfies readonly FileExtensionsKey[];

export const FILE_EXTENSIONS_DATE_RANGE_FIELDS = [] as const satisfies readonly FileExtensionsKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const FILE_EXTENSIONS_SELECTABLE_FIELDS = ['code', 'contentType', 'createdAt', 'deletedAt', 'description', 'extension', 'id', 'updatedAt', 'version', ] as const satisfies readonly FileExtensionsKey[];

export const FILE_EXTENSIONS_DEFAULT_SELECT_FIELDS = ['code', 'contentType', 'createdAt', 'deletedAt', 'description', 'extension', 'id', 'updatedAt', 'version', ] as const satisfies readonly FileExtensionsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const FILE_EXTENSIONS_EDITABLE_FIELDS = ['code', 'contentType', 'description', 'extension', ] as const satisfies readonly FileExtensionsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const FILE_EXTENSIONS_AS_ONE_RELATION_CONFIG = {
  relation: 'fileExtensions',
  type: ERelationType.One,
  selectableFields: FILE_EXTENSIONS_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_EXTENSIONS_DEFAULT_SELECT_FIELDS
} as const satisfies IFileExtensionsAsOneRelationConfig;

export const FILE_EXTENSIONS_AS_MANY_RELATION_CONFIG = {
  relation: 'fileExtensionss',
  type: ERelationType.Many,
  selectableFields: FILE_EXTENSIONS_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_EXTENSIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: FILE_EXTENSIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IFileExtensionsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const FILE_EXTENSIONS_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const FILE_EXTENSIONS_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const FILE_EXTENSIONS_QUERY_OPTIONS = {
  searchableFields: FILE_EXTENSIONS_SEARCHABLE_FIELDS,
  selectableFields: FILE_EXTENSIONS_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_EXTENSIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: FILE_EXTENSIONS_SORTABLE_FIELDS,
  filterFields: FILE_EXTENSIONS_FILTERABLE_FIELDS,
  dateRangeFields: FILE_EXTENSIONS_DATE_RANGE_FIELDS,
  oneRelations: FILE_EXTENSIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: FILE_EXTENSIONS_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IFileExtensions,
  FileExtensionsSortableField,
  FileExtensionsSelectableField,
  FileExtensionsFilterableField,
  FileExtensionsDateRangeField,
  FileExtensionsRelationKey,
  typeof FILE_EXTENSIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof FILE_EXTENSIONS_MANY_RELATION_QUERY_OPTIONS
>;