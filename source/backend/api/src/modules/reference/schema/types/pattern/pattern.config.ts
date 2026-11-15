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
  IPattern,
  PatternKey,
  PatternRelationKey,
  PatternSortableField,
  PatternFilterableField,
  PatternDateRangeField,
  PatternSelectableField,
  IPatternAsOneRelationConfig,
  IPatternAsManyRelationConfig
} from './pattern.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PATTERN_RELATION_KEYS = [] as const satisfies readonly PatternKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PATTERN_SORTABLE_FIELDS = [] as const satisfies readonly PatternKey[];

export const PATTERN_SEARCHABLE_FIELDS = [] as const satisfies readonly PatternKey[];

export const PATTERN_FILTERABLE_FIELDS = [] as const satisfies readonly PatternKey[];

export const PATTERN_DATE_RANGE_FIELDS = [] as const satisfies readonly PatternKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PATTERN_SELECTABLE_FIELDS = ['code', 'createdAt', 'deletedAt', 'id', 'title', 'updatedAt', 'version', ] as const satisfies readonly PatternKey[];

export const PATTERN_DEFAULT_SELECT_FIELDS = ['code', 'createdAt', 'deletedAt', 'id', 'title', 'updatedAt', 'version', ] as const satisfies readonly PatternSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PATTERN_EDITABLE_FIELDS = ['code', 'title', ] as const satisfies readonly PatternKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PATTERN_AS_ONE_RELATION_CONFIG = {
  relation: 'pattern',
  type: ERelationType.One,
  selectableFields: PATTERN_SELECTABLE_FIELDS,
  defaultSelectFields: PATTERN_DEFAULT_SELECT_FIELDS
} as const satisfies IPatternAsOneRelationConfig;

export const PATTERN_AS_MANY_RELATION_CONFIG = {
  relation: 'patterns',
  type: ERelationType.Many,
  selectableFields: PATTERN_SELECTABLE_FIELDS,
  defaultSelectFields: PATTERN_DEFAULT_SELECT_FIELDS,
  sortableFields: PATTERN_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IPatternAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PATTERN_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const PATTERN_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PATTERN_QUERY_OPTIONS = {
  searchableFields: PATTERN_SEARCHABLE_FIELDS,
  selectableFields: PATTERN_SELECTABLE_FIELDS,
  defaultSelectFields: PATTERN_DEFAULT_SELECT_FIELDS,
  sortableFields: PATTERN_SORTABLE_FIELDS,
  filterFields: PATTERN_FILTERABLE_FIELDS,
  dateRangeFields: PATTERN_DATE_RANGE_FIELDS,
  oneRelations: PATTERN_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PATTERN_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IPattern,
  PatternSortableField,
  PatternSelectableField,
  PatternFilterableField,
  PatternDateRangeField,
  PatternRelationKey,
  typeof PATTERN_ONE_RELATION_QUERY_OPTIONS,
  typeof PATTERN_MANY_RELATION_QUERY_OPTIONS
>;