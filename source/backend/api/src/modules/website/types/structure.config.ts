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
  IStructure,
  StructureKey,
  StructureRelationKey,
  StructureSortableField,
  StructureFilterableField,
  StructureDateRangeField,
  StructureSelectableField,
  IStructureAsOneRelationConfig,
  IStructureAsManyRelationConfig
} from './structure.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const STRUCTURE_RELATION_KEYS = [] as const satisfies readonly StructureKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const STRUCTURE_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly StructureKey[];

export const STRUCTURE_SEARCHABLE_FIELDS = [] as const satisfies readonly StructureKey[];

export const STRUCTURE_FILTERABLE_FIELDS = ['currentVersionId', 'id', 'ownerId', 'ownerKind', 'purpose', 'status', 'version', ] as const satisfies readonly StructureKey[];

export const STRUCTURE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly StructureKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const STRUCTURE_SELECTABLE_FIELDS = ['createdAt', 'currentVersionId', 'id', 'ownerId', 'ownerKind', 'purpose', 'status', 'updatedAt', ] as const satisfies readonly StructureKey[];

export const STRUCTURE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly StructureSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const STRUCTURE_EDITABLE_FIELDS = ['currentVersionId', 'ownerId', 'ownerKind', 'purpose', 'status', ] as const satisfies readonly StructureKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const STRUCTURE_AS_ONE_RELATION_CONFIG = {
  relation: 'structure',
  type: ERelationType.One,
  selectableFields: STRUCTURE_SELECTABLE_FIELDS,
  defaultSelectFields: STRUCTURE_DEFAULT_SELECT_FIELDS
} as const satisfies IStructureAsOneRelationConfig;

export const STRUCTURE_AS_MANY_RELATION_CONFIG = {
  relation: 'structures',
  type: ERelationType.Many,
  selectableFields: STRUCTURE_SELECTABLE_FIELDS,
  defaultSelectFields: STRUCTURE_DEFAULT_SELECT_FIELDS,
  sortableFields: STRUCTURE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IStructureAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const STRUCTURE_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const STRUCTURE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const STRUCTURE_QUERY_OPTIONS = {
  searchableFields: STRUCTURE_SEARCHABLE_FIELDS,
  selectableFields: STRUCTURE_SELECTABLE_FIELDS,
  defaultSelectFields: STRUCTURE_DEFAULT_SELECT_FIELDS,
  sortableFields: STRUCTURE_SORTABLE_FIELDS,
  filterFields: STRUCTURE_FILTERABLE_FIELDS,
  dateRangeFields: STRUCTURE_DATE_RANGE_FIELDS,
  oneRelations: STRUCTURE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: STRUCTURE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IStructure,
  StructureSortableField,
  StructureSelectableField,
  StructureFilterableField,
  StructureDateRangeField,
  StructureRelationKey,
  typeof STRUCTURE_ONE_RELATION_QUERY_OPTIONS,
  typeof STRUCTURE_MANY_RELATION_QUERY_OPTIONS
>;