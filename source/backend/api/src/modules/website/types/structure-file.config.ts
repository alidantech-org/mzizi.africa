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
  IStructureFile,
  StructureFileKey,
  StructureFileRelationKey,
  StructureFileSortableField,
  StructureFileFilterableField,
  StructureFileDateRangeField,
  StructureFileSelectableField,
  IStructureFileAsOneRelationConfig,
  IStructureFileAsManyRelationConfig
} from './structure-file.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const STRUCTURE_FILE_RELATION_KEYS = [] as const satisfies readonly StructureFileKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const STRUCTURE_FILE_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly StructureFileKey[];

export const STRUCTURE_FILE_SEARCHABLE_FIELDS = [] as const satisfies readonly StructureFileKey[];

export const STRUCTURE_FILE_FILTERABLE_FIELDS = ['fileVersionId', 'id', 'path', 'role', 'version', 'versionId', ] as const satisfies readonly StructureFileKey[];

export const STRUCTURE_FILE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly StructureFileKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const STRUCTURE_FILE_SELECTABLE_FIELDS = ['createdAt', 'fileVersionId', 'id', 'path', 'role', 'updatedAt', 'versionId', ] as const satisfies readonly StructureFileKey[];

export const STRUCTURE_FILE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly StructureFileSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const STRUCTURE_FILE_EDITABLE_FIELDS = ['fileVersionId', 'path', 'role', 'versionId', ] as const satisfies readonly StructureFileKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const STRUCTURE_FILE_AS_ONE_RELATION_CONFIG = {
  relation: 'structureFile',
  type: ERelationType.One,
  selectableFields: STRUCTURE_FILE_SELECTABLE_FIELDS,
  defaultSelectFields: STRUCTURE_FILE_DEFAULT_SELECT_FIELDS
} as const satisfies IStructureFileAsOneRelationConfig;

export const STRUCTURE_FILE_AS_MANY_RELATION_CONFIG = {
  relation: 'structureFiles',
  type: ERelationType.Many,
  selectableFields: STRUCTURE_FILE_SELECTABLE_FIELDS,
  defaultSelectFields: STRUCTURE_FILE_DEFAULT_SELECT_FIELDS,
  sortableFields: STRUCTURE_FILE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IStructureFileAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const STRUCTURE_FILE_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const STRUCTURE_FILE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const STRUCTURE_FILE_QUERY_OPTIONS = {
  searchableFields: STRUCTURE_FILE_SEARCHABLE_FIELDS,
  selectableFields: STRUCTURE_FILE_SELECTABLE_FIELDS,
  defaultSelectFields: STRUCTURE_FILE_DEFAULT_SELECT_FIELDS,
  sortableFields: STRUCTURE_FILE_SORTABLE_FIELDS,
  filterFields: STRUCTURE_FILE_FILTERABLE_FIELDS,
  dateRangeFields: STRUCTURE_FILE_DATE_RANGE_FIELDS,
  oneRelations: STRUCTURE_FILE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: STRUCTURE_FILE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IStructureFile,
  StructureFileSortableField,
  StructureFileSelectableField,
  StructureFileFilterableField,
  StructureFileDateRangeField,
  StructureFileRelationKey,
  typeof STRUCTURE_FILE_ONE_RELATION_QUERY_OPTIONS,
  typeof STRUCTURE_FILE_MANY_RELATION_QUERY_OPTIONS
>;