// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as StructureConfig from '#/modules/website/types/structure.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IStructureVersion,
  StructureVersionKey,
  StructureVersionRelationKey,
  StructureVersionSortableField,
  StructureVersionFilterableField,
  StructureVersionDateRangeField,
  StructureVersionSelectableField,
  IStructureVersionAsOneRelationConfig,
  IStructureVersionAsManyRelationConfig
} from './structure-version.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const STRUCTURE_VERSION_RELATION_KEYS = ['structure', ] as const satisfies readonly StructureVersionKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const STRUCTURE_VERSION_SORTABLE_FIELDS = ['createdAt', 'number', 'updatedAt', 'version', ] as const satisfies readonly StructureVersionKey[];

export const STRUCTURE_VERSION_SEARCHABLE_FIELDS = [] as const satisfies readonly StructureVersionKey[];

export const STRUCTURE_VERSION_FILTERABLE_FIELDS = ['createdBy', 'folderId', 'id', 'methodId', 'number', 'status', 'structureId', 'supersedesId', 'version', ] as const satisfies readonly StructureVersionKey[];

export const STRUCTURE_VERSION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly StructureVersionKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const STRUCTURE_VERSION_SELECTABLE_FIELDS = ['createdAt', 'createdBy', 'folderId', 'id', 'manifestHash', 'methodId', 'notesSummary', 'number', 'schemaVersion', 'status', 'structureId', 'supersedesId', 'updatedAt', 'validationReport', ] as const satisfies readonly StructureVersionKey[];

export const STRUCTURE_VERSION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly StructureVersionSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const STRUCTURE_VERSION_EDITABLE_FIELDS = ['createdBy', 'folderId', 'manifestHash', 'methodId', 'notesSummary', 'number', 'schemaVersion', 'status', 'structureId', 'supersedesId', 'validationReport', ] as const satisfies readonly StructureVersionKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const STRUCTURE_VERSION_AS_ONE_RELATION_CONFIG = {
  relation: 'structureVersion',
  type: ERelationType.One,
  selectableFields: STRUCTURE_VERSION_SELECTABLE_FIELDS,
  defaultSelectFields: STRUCTURE_VERSION_DEFAULT_SELECT_FIELDS
} as const satisfies IStructureVersionAsOneRelationConfig;

export const STRUCTURE_VERSION_AS_MANY_RELATION_CONFIG = {
  relation: 'structureVersions',
  type: ERelationType.Many,
  selectableFields: STRUCTURE_VERSION_SELECTABLE_FIELDS,
  defaultSelectFields: STRUCTURE_VERSION_DEFAULT_SELECT_FIELDS,
  sortableFields: STRUCTURE_VERSION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IStructureVersionAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const STRUCTURE_VERSION_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<StructureVersionRelationKey>().one(StructureConfig.STRUCTURE_AS_ONE_RELATION_CONFIG, 'structure'),
] as const;

export const STRUCTURE_VERSION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const STRUCTURE_VERSION_QUERY_OPTIONS = {
  searchableFields: STRUCTURE_VERSION_SEARCHABLE_FIELDS,
  selectableFields: STRUCTURE_VERSION_SELECTABLE_FIELDS,
  defaultSelectFields: STRUCTURE_VERSION_DEFAULT_SELECT_FIELDS,
  sortableFields: STRUCTURE_VERSION_SORTABLE_FIELDS,
  filterFields: STRUCTURE_VERSION_FILTERABLE_FIELDS,
  dateRangeFields: STRUCTURE_VERSION_DATE_RANGE_FIELDS,
  oneRelations: STRUCTURE_VERSION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: STRUCTURE_VERSION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IStructureVersion,
  StructureVersionSortableField,
  StructureVersionSelectableField,
  StructureVersionFilterableField,
  StructureVersionDateRangeField,
  StructureVersionRelationKey,
  typeof STRUCTURE_VERSION_ONE_RELATION_QUERY_OPTIONS,
  typeof STRUCTURE_VERSION_MANY_RELATION_QUERY_OPTIONS
>;