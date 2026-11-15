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
  ITags,
  TagsKey,
  TagsRelationKey,
  TagsSortableField,
  TagsFilterableField,
  TagsDateRangeField,
  TagsSelectableField,
  ITagsAsOneRelationConfig,
  ITagsAsManyRelationConfig
} from './tags.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const TAGS_RELATION_KEYS = [] as const satisfies readonly TagsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const TAGS_SORTABLE_FIELDS = [] as const satisfies readonly TagsKey[];

export const TAGS_SEARCHABLE_FIELDS = [] as const satisfies readonly TagsKey[];

export const TAGS_FILTERABLE_FIELDS = [] as const satisfies readonly TagsKey[];

export const TAGS_DATE_RANGE_FIELDS = [] as const satisfies readonly TagsKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const TAGS_SELECTABLE_FIELDS = ['code', 'createdAt', 'deletedAt', 'description', 'id', 'title', 'updatedAt', 'version', ] as const satisfies readonly TagsKey[];

export const TAGS_DEFAULT_SELECT_FIELDS = ['code', 'createdAt', 'deletedAt', 'description', 'id', 'title', 'updatedAt', 'version', ] as const satisfies readonly TagsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const TAGS_EDITABLE_FIELDS = ['code', 'description', 'title', ] as const satisfies readonly TagsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const TAGS_AS_ONE_RELATION_CONFIG = {
  relation: 'tags',
  type: ERelationType.One,
  selectableFields: TAGS_SELECTABLE_FIELDS,
  defaultSelectFields: TAGS_DEFAULT_SELECT_FIELDS
} as const satisfies ITagsAsOneRelationConfig;

export const TAGS_AS_MANY_RELATION_CONFIG = {
  relation: 'tagss',
  type: ERelationType.Many,
  selectableFields: TAGS_SELECTABLE_FIELDS,
  defaultSelectFields: TAGS_DEFAULT_SELECT_FIELDS,
  sortableFields: TAGS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ITagsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const TAGS_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const TAGS_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const TAGS_QUERY_OPTIONS = {
  searchableFields: TAGS_SEARCHABLE_FIELDS,
  selectableFields: TAGS_SELECTABLE_FIELDS,
  defaultSelectFields: TAGS_DEFAULT_SELECT_FIELDS,
  sortableFields: TAGS_SORTABLE_FIELDS,
  filterFields: TAGS_FILTERABLE_FIELDS,
  dateRangeFields: TAGS_DATE_RANGE_FIELDS,
  oneRelations: TAGS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: TAGS_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ITags,
  TagsSortableField,
  TagsSelectableField,
  TagsFilterableField,
  TagsDateRangeField,
  TagsRelationKey,
  typeof TAGS_ONE_RELATION_QUERY_OPTIONS,
  typeof TAGS_MANY_RELATION_QUERY_OPTIONS
>;