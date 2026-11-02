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
  IIndicatorCategory,
  IndicatorCategoryKey,
  IndicatorCategoryRelationKey,
  IndicatorCategorySortableField,
  IndicatorCategoryFilterableField,
  IndicatorCategoryDateRangeField,
  IndicatorCategorySelectableField,
  IIndicatorCategoryAsOneRelationConfig,
  IIndicatorCategoryAsManyRelationConfig
} from './indicator-category.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const INDICATOR_CATEGORY_RELATION_KEYS = [] as const satisfies readonly IndicatorCategoryKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const INDICATOR_CATEGORY_SORTABLE_FIELDS = ['code', 'createdAt', 'label', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly IndicatorCategoryKey[];

export const INDICATOR_CATEGORY_SEARCHABLE_FIELDS = ['code', 'label', ] as const satisfies readonly IndicatorCategoryKey[];

export const INDICATOR_CATEGORY_FILTERABLE_FIELDS = ['code', 'id', 'isCurrent', 'label', 'method', 'parentId', 'verificationState', 'version', ] as const satisfies readonly IndicatorCategoryKey[];

export const INDICATOR_CATEGORY_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly IndicatorCategoryKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const INDICATOR_CATEGORY_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'code', 'confidence', 'createdAt', 'id', 'isCurrent', 'label', 'licence', 'method', 'parentId', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly IndicatorCategoryKey[];

export const INDICATOR_CATEGORY_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly IndicatorCategorySelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const INDICATOR_CATEGORY_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'code', 'confidence', 'isCurrent', 'label', 'licence', 'method', 'parentId', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly IndicatorCategoryKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const INDICATOR_CATEGORY_AS_ONE_RELATION_CONFIG = {
  relation: 'indicatorCategory',
  type: ERelationType.One,
  selectableFields: INDICATOR_CATEGORY_SELECTABLE_FIELDS,
  defaultSelectFields: INDICATOR_CATEGORY_DEFAULT_SELECT_FIELDS
} as const satisfies IIndicatorCategoryAsOneRelationConfig;

export const INDICATOR_CATEGORY_AS_MANY_RELATION_CONFIG = {
  relation: 'indicatorCategorys',
  type: ERelationType.Many,
  selectableFields: INDICATOR_CATEGORY_SELECTABLE_FIELDS,
  defaultSelectFields: INDICATOR_CATEGORY_DEFAULT_SELECT_FIELDS,
  sortableFields: INDICATOR_CATEGORY_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IIndicatorCategoryAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const INDICATOR_CATEGORY_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const INDICATOR_CATEGORY_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const INDICATOR_CATEGORY_QUERY_OPTIONS = {
  searchableFields: INDICATOR_CATEGORY_SEARCHABLE_FIELDS,
  selectableFields: INDICATOR_CATEGORY_SELECTABLE_FIELDS,
  defaultSelectFields: INDICATOR_CATEGORY_DEFAULT_SELECT_FIELDS,
  sortableFields: INDICATOR_CATEGORY_SORTABLE_FIELDS,
  filterFields: INDICATOR_CATEGORY_FILTERABLE_FIELDS,
  dateRangeFields: INDICATOR_CATEGORY_DATE_RANGE_FIELDS,
  oneRelations: INDICATOR_CATEGORY_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: INDICATOR_CATEGORY_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IIndicatorCategory,
  IndicatorCategorySortableField,
  IndicatorCategorySelectableField,
  IndicatorCategoryFilterableField,
  IndicatorCategoryDateRangeField,
  IndicatorCategoryRelationKey,
  typeof INDICATOR_CATEGORY_ONE_RELATION_QUERY_OPTIONS,
  typeof INDICATOR_CATEGORY_MANY_RELATION_QUERY_OPTIONS
>;