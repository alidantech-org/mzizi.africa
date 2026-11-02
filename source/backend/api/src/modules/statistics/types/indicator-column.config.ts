// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as IndicatorConfig from '#/modules/statistics/types/indicator.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IIndicatorColumn,
  IndicatorColumnKey,
  IndicatorColumnRelationKey,
  IndicatorColumnSortableField,
  IndicatorColumnFilterableField,
  IndicatorColumnDateRangeField,
  IndicatorColumnSelectableField,
  IIndicatorColumnAsOneRelationConfig,
  IIndicatorColumnAsManyRelationConfig
} from './indicator-column.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const INDICATOR_COLUMN_RELATION_KEYS = ['indicator', ] as const satisfies readonly IndicatorColumnKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const INDICATOR_COLUMN_SORTABLE_FIELDS = ['code', 'createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly IndicatorColumnKey[];

export const INDICATOR_COLUMN_SEARCHABLE_FIELDS = ['code', ] as const satisfies readonly IndicatorColumnKey[];

export const INDICATOR_COLUMN_FILTERABLE_FIELDS = ['code', 'id', 'indicatorId', 'isCurrent', 'version', ] as const satisfies readonly IndicatorColumnKey[];

export const INDICATOR_COLUMN_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly IndicatorColumnKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const INDICATOR_COLUMN_SELECTABLE_FIELDS = ['code', 'createdAt', 'dataType', 'id', 'indicatorId', 'isCurrent', 'label', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly IndicatorColumnKey[];

export const INDICATOR_COLUMN_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly IndicatorColumnSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const INDICATOR_COLUMN_EDITABLE_FIELDS = ['code', 'dataType', 'indicatorId', 'isCurrent', 'label', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly IndicatorColumnKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const INDICATOR_COLUMN_AS_ONE_RELATION_CONFIG = {
  relation: 'indicatorColumn',
  type: ERelationType.One,
  selectableFields: INDICATOR_COLUMN_SELECTABLE_FIELDS,
  defaultSelectFields: INDICATOR_COLUMN_DEFAULT_SELECT_FIELDS
} as const satisfies IIndicatorColumnAsOneRelationConfig;

export const INDICATOR_COLUMN_AS_MANY_RELATION_CONFIG = {
  relation: 'indicatorColumns',
  type: ERelationType.Many,
  selectableFields: INDICATOR_COLUMN_SELECTABLE_FIELDS,
  defaultSelectFields: INDICATOR_COLUMN_DEFAULT_SELECT_FIELDS,
  sortableFields: INDICATOR_COLUMN_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IIndicatorColumnAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const INDICATOR_COLUMN_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<IndicatorColumnRelationKey>().one(IndicatorConfig.INDICATOR_AS_ONE_RELATION_CONFIG, 'indicator'),
] as const;

export const INDICATOR_COLUMN_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const INDICATOR_COLUMN_QUERY_OPTIONS = {
  searchableFields: INDICATOR_COLUMN_SEARCHABLE_FIELDS,
  selectableFields: INDICATOR_COLUMN_SELECTABLE_FIELDS,
  defaultSelectFields: INDICATOR_COLUMN_DEFAULT_SELECT_FIELDS,
  sortableFields: INDICATOR_COLUMN_SORTABLE_FIELDS,
  filterFields: INDICATOR_COLUMN_FILTERABLE_FIELDS,
  dateRangeFields: INDICATOR_COLUMN_DATE_RANGE_FIELDS,
  oneRelations: INDICATOR_COLUMN_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: INDICATOR_COLUMN_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IIndicatorColumn,
  IndicatorColumnSortableField,
  IndicatorColumnSelectableField,
  IndicatorColumnFilterableField,
  IndicatorColumnDateRangeField,
  IndicatorColumnRelationKey,
  typeof INDICATOR_COLUMN_ONE_RELATION_QUERY_OPTIONS,
  typeof INDICATOR_COLUMN_MANY_RELATION_QUERY_OPTIONS
>;