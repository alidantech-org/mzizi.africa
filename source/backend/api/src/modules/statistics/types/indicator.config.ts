// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as IndicatorCategoryConfig from '#/modules/statistics/types/indicator-category.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IIndicator,
  IndicatorKey,
  IndicatorRelationKey,
  IndicatorSortableField,
  IndicatorFilterableField,
  IndicatorDateRangeField,
  IndicatorSelectableField,
  IIndicatorAsOneRelationConfig,
  IIndicatorAsManyRelationConfig
} from './indicator.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const INDICATOR_RELATION_KEYS = ['indicatorCategory', ] as const satisfies readonly IndicatorKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const INDICATOR_SORTABLE_FIELDS = ['code', 'createdAt', 'name', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly IndicatorKey[];

export const INDICATOR_SEARCHABLE_FIELDS = ['code', 'name', ] as const satisfies readonly IndicatorKey[];

export const INDICATOR_FILTERABLE_FIELDS = ['categoryId', 'code', 'id', 'isCurrent', 'name', 'parentId', 'version', ] as const satisfies readonly IndicatorKey[];

export const INDICATOR_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly IndicatorKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const INDICATOR_SELECTABLE_FIELDS = ['categoryId', 'code', 'createdAt', 'definition', 'id', 'isCurrent', 'name', 'parentId', 'unitOfMeasure', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly IndicatorKey[];

export const INDICATOR_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly IndicatorSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const INDICATOR_EDITABLE_FIELDS = ['categoryId', 'code', 'definition', 'isCurrent', 'name', 'parentId', 'unitOfMeasure', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly IndicatorKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const INDICATOR_AS_ONE_RELATION_CONFIG = {
  relation: 'indicator',
  type: ERelationType.One,
  selectableFields: INDICATOR_SELECTABLE_FIELDS,
  defaultSelectFields: INDICATOR_DEFAULT_SELECT_FIELDS
} as const satisfies IIndicatorAsOneRelationConfig;

export const INDICATOR_AS_MANY_RELATION_CONFIG = {
  relation: 'indicators',
  type: ERelationType.Many,
  selectableFields: INDICATOR_SELECTABLE_FIELDS,
  defaultSelectFields: INDICATOR_DEFAULT_SELECT_FIELDS,
  sortableFields: INDICATOR_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IIndicatorAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const INDICATOR_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<IndicatorRelationKey>().one(IndicatorCategoryConfig.INDICATOR_CATEGORY_AS_ONE_RELATION_CONFIG, 'indicatorCategory'),
] as const;

export const INDICATOR_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const INDICATOR_QUERY_OPTIONS = {
  searchableFields: INDICATOR_SEARCHABLE_FIELDS,
  selectableFields: INDICATOR_SELECTABLE_FIELDS,
  defaultSelectFields: INDICATOR_DEFAULT_SELECT_FIELDS,
  sortableFields: INDICATOR_SORTABLE_FIELDS,
  filterFields: INDICATOR_FILTERABLE_FIELDS,
  dateRangeFields: INDICATOR_DATE_RANGE_FIELDS,
  oneRelations: INDICATOR_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: INDICATOR_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IIndicator,
  IndicatorSortableField,
  IndicatorSelectableField,
  IndicatorFilterableField,
  IndicatorDateRangeField,
  IndicatorRelationKey,
  typeof INDICATOR_ONE_RELATION_QUERY_OPTIONS,
  typeof INDICATOR_MANY_RELATION_QUERY_OPTIONS
>;