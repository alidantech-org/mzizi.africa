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
  IFormat,
  FormatKey,
  FormatRelationKey,
  FormatSortableField,
  FormatFilterableField,
  FormatDateRangeField,
  FormatSelectableField,
  IFormatAsOneRelationConfig,
  IFormatAsManyRelationConfig
} from './format.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const FORMAT_RELATION_KEYS = [] as const satisfies readonly FormatKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const FORMAT_SORTABLE_FIELDS = ['code', 'createdAt', 'name', 'updatedAt', 'version', ] as const satisfies readonly FormatKey[];

export const FORMAT_SEARCHABLE_FIELDS = ['code', 'name', ] as const satisfies readonly FormatKey[];

export const FORMAT_FILTERABLE_FIELDS = ['category', 'code', 'extension', 'id', 'mimeType', 'name', 'version', ] as const satisfies readonly FormatKey[];

export const FORMAT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly FormatKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const FORMAT_SELECTABLE_FIELDS = ['category', 'code', 'createdAt', 'extension', 'id', 'isPreviewable', 'maxSizeBytes', 'mimeType', 'name', 'processingStrategy', 'updatedAt', ] as const satisfies readonly FormatKey[];

export const FORMAT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly FormatSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const FORMAT_EDITABLE_FIELDS = ['category', 'code', 'extension', 'isPreviewable', 'maxSizeBytes', 'mimeType', 'name', 'processingStrategy', ] as const satisfies readonly FormatKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const FORMAT_AS_ONE_RELATION_CONFIG = {
  relation: 'format',
  type: ERelationType.One,
  selectableFields: FORMAT_SELECTABLE_FIELDS,
  defaultSelectFields: FORMAT_DEFAULT_SELECT_FIELDS
} as const satisfies IFormatAsOneRelationConfig;

export const FORMAT_AS_MANY_RELATION_CONFIG = {
  relation: 'formats',
  type: ERelationType.Many,
  selectableFields: FORMAT_SELECTABLE_FIELDS,
  defaultSelectFields: FORMAT_DEFAULT_SELECT_FIELDS,
  sortableFields: FORMAT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IFormatAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const FORMAT_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const FORMAT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const FORMAT_QUERY_OPTIONS = {
  searchableFields: FORMAT_SEARCHABLE_FIELDS,
  selectableFields: FORMAT_SELECTABLE_FIELDS,
  defaultSelectFields: FORMAT_DEFAULT_SELECT_FIELDS,
  sortableFields: FORMAT_SORTABLE_FIELDS,
  filterFields: FORMAT_FILTERABLE_FIELDS,
  dateRangeFields: FORMAT_DATE_RANGE_FIELDS,
  oneRelations: FORMAT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: FORMAT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IFormat,
  FormatSortableField,
  FormatSelectableField,
  FormatFilterableField,
  FormatDateRangeField,
  FormatRelationKey,
  typeof FORMAT_ONE_RELATION_QUERY_OPTIONS,
  typeof FORMAT_MANY_RELATION_QUERY_OPTIONS
>;