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
  ITopic,
  TopicKey,
  TopicRelationKey,
  TopicSortableField,
  TopicFilterableField,
  TopicDateRangeField,
  TopicSelectableField,
  ITopicAsOneRelationConfig,
  ITopicAsManyRelationConfig
} from './topic.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const TOPIC_RELATION_KEYS = ['parent', ] as const satisfies readonly TopicKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const TOPIC_SORTABLE_FIELDS = [] as const satisfies readonly TopicKey[];

export const TOPIC_SEARCHABLE_FIELDS = [] as const satisfies readonly TopicKey[];

export const TOPIC_FILTERABLE_FIELDS = [] as const satisfies readonly TopicKey[];

export const TOPIC_DATE_RANGE_FIELDS = [] as const satisfies readonly TopicKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const TOPIC_SELECTABLE_FIELDS = ['code', 'createdAt', 'deletedAt', 'id', 'label', 'parentId', 'updatedAt', 'version', ] as const satisfies readonly TopicKey[];

export const TOPIC_DEFAULT_SELECT_FIELDS = ['code', 'createdAt', 'deletedAt', 'id', 'label', 'parentId', 'updatedAt', 'version', ] as const satisfies readonly TopicSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const TOPIC_EDITABLE_FIELDS = ['code', 'label', 'parentId', ] as const satisfies readonly TopicKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const TOPIC_AS_ONE_RELATION_CONFIG = {
  relation: 'topic',
  type: ERelationType.One,
  selectableFields: TOPIC_SELECTABLE_FIELDS,
  defaultSelectFields: TOPIC_DEFAULT_SELECT_FIELDS
} as const satisfies ITopicAsOneRelationConfig;

export const TOPIC_AS_MANY_RELATION_CONFIG = {
  relation: 'topics',
  type: ERelationType.Many,
  selectableFields: TOPIC_SELECTABLE_FIELDS,
  defaultSelectFields: TOPIC_DEFAULT_SELECT_FIELDS,
  sortableFields: TOPIC_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ITopicAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const TOPIC_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const TOPIC_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const TOPIC_QUERY_OPTIONS = {
  searchableFields: TOPIC_SEARCHABLE_FIELDS,
  selectableFields: TOPIC_SELECTABLE_FIELDS,
  defaultSelectFields: TOPIC_DEFAULT_SELECT_FIELDS,
  sortableFields: TOPIC_SORTABLE_FIELDS,
  filterFields: TOPIC_FILTERABLE_FIELDS,
  dateRangeFields: TOPIC_DATE_RANGE_FIELDS,
  oneRelations: TOPIC_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: TOPIC_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ITopic,
  TopicSortableField,
  TopicSelectableField,
  TopicFilterableField,
  TopicDateRangeField,
  TopicRelationKey,
  typeof TOPIC_ONE_RELATION_QUERY_OPTIONS,
  typeof TOPIC_MANY_RELATION_QUERY_OPTIONS
>;