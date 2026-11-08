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
  IDimension,
  DimensionKey,
  DimensionRelationKey,
  DimensionSortableField,
  DimensionFilterableField,
  DimensionDateRangeField,
  DimensionSelectableField,
  IDimensionAsOneRelationConfig,
  IDimensionAsManyRelationConfig
} from './dimension.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DIMENSION_RELATION_KEYS = [] as const satisfies readonly DimensionKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DIMENSION_SORTABLE_FIELDS = ['code', 'createdAt', 'name', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly DimensionKey[];

export const DIMENSION_SEARCHABLE_FIELDS = ['code', 'name', ] as const satisfies readonly DimensionKey[];

export const DIMENSION_FILTERABLE_FIELDS = ['code', 'id', 'isCurrent', 'name', 'version', ] as const satisfies readonly DimensionKey[];

export const DIMENSION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly DimensionKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DIMENSION_SELECTABLE_FIELDS = ['code', 'createdAt', 'description', 'id', 'isCurrent', 'name', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly DimensionKey[];

export const DIMENSION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly DimensionSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DIMENSION_EDITABLE_FIELDS = ['code', 'description', 'isCurrent', 'name', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly DimensionKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DIMENSION_AS_ONE_RELATION_CONFIG = {
  relation: 'dimension',
  type: ERelationType.One,
  selectableFields: DIMENSION_SELECTABLE_FIELDS,
  defaultSelectFields: DIMENSION_DEFAULT_SELECT_FIELDS
} as const satisfies IDimensionAsOneRelationConfig;

export const DIMENSION_AS_MANY_RELATION_CONFIG = {
  relation: 'dimensions',
  type: ERelationType.Many,
  selectableFields: DIMENSION_SELECTABLE_FIELDS,
  defaultSelectFields: DIMENSION_DEFAULT_SELECT_FIELDS,
  sortableFields: DIMENSION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IDimensionAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DIMENSION_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const DIMENSION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const DIMENSION_QUERY_OPTIONS = {
  searchableFields: DIMENSION_SEARCHABLE_FIELDS,
  selectableFields: DIMENSION_SELECTABLE_FIELDS,
  defaultSelectFields: DIMENSION_DEFAULT_SELECT_FIELDS,
  sortableFields: DIMENSION_SORTABLE_FIELDS,
  filterFields: DIMENSION_FILTERABLE_FIELDS,
  dateRangeFields: DIMENSION_DATE_RANGE_FIELDS,
  oneRelations: DIMENSION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DIMENSION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IDimension,
  DimensionSortableField,
  DimensionSelectableField,
  DimensionFilterableField,
  DimensionDateRangeField,
  DimensionRelationKey,
  typeof DIMENSION_ONE_RELATION_QUERY_OPTIONS,
  typeof DIMENSION_MANY_RELATION_QUERY_OPTIONS
>;