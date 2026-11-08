// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IFolder,
  FolderKey,
  FolderRelationKey,
  FolderSortableField,
  FolderFilterableField,
  FolderDateRangeField,
  FolderSelectableField,
  IFolderAsOneRelationConfig,
  IFolderAsManyRelationConfig
} from './folder.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const FOLDER_RELATION_KEYS = [] as const satisfies readonly FolderKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const FOLDER_SORTABLE_FIELDS = ['createdAt', 'depth', 'name', 'updatedAt', 'version', ] as const satisfies readonly FolderKey[];

export const FOLDER_SEARCHABLE_FIELDS = ['name', ] as const satisfies readonly FolderKey[];

export const FOLDER_FILTERABLE_FIELDS = ['depth', 'id', 'name', 'parentId', 'path', 'version', 'visibility', ] as const satisfies readonly FolderKey[];

export const FOLDER_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly FolderKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const FOLDER_SELECTABLE_FIELDS = ['createdAt', 'depth', 'id', 'name', 'parentId', 'path', 'updatedAt', 'visibility', ] as const satisfies readonly FolderKey[];

export const FOLDER_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly FolderSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const FOLDER_EDITABLE_FIELDS = ['depth', 'name', 'parentId', 'path', 'visibility', ] as const satisfies readonly FolderKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const FOLDER_AS_ONE_RELATION_CONFIG = {
  relation: 'folder',
  type: ERelationType.One,
  selectableFields: FOLDER_SELECTABLE_FIELDS,
  defaultSelectFields: FOLDER_DEFAULT_SELECT_FIELDS
} as const satisfies IFolderAsOneRelationConfig;

export const FOLDER_AS_MANY_RELATION_CONFIG = {
  relation: 'folders',
  type: ERelationType.Many,
  selectableFields: FOLDER_SELECTABLE_FIELDS,
  defaultSelectFields: FOLDER_DEFAULT_SELECT_FIELDS,
  sortableFields: FOLDER_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IFolderAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const FOLDER_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const FOLDER_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const FOLDER_QUERY_OPTIONS = {
  searchableFields: FOLDER_SEARCHABLE_FIELDS,
  selectableFields: FOLDER_SELECTABLE_FIELDS,
  defaultSelectFields: FOLDER_DEFAULT_SELECT_FIELDS,
  sortableFields: FOLDER_SORTABLE_FIELDS,
  filterFields: FOLDER_FILTERABLE_FIELDS,
  dateRangeFields: FOLDER_DATE_RANGE_FIELDS,
  oneRelations: FOLDER_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: FOLDER_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IFolder,
  FolderSortableField,
  FolderSelectableField,
  FolderFilterableField,
  FolderDateRangeField,
  FolderRelationKey,
  typeof FOLDER_ONE_RELATION_QUERY_OPTIONS,
  typeof FOLDER_MANY_RELATION_QUERY_OPTIONS
>;