// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import * as B from '#/modules/common/schema/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  TOPIC_RELATION_KEYS,
  TOPIC_SORTABLE_FIELDS,
  TOPIC_SEARCHABLE_FIELDS,
  TOPIC_FILTERABLE_FIELDS,
  TOPIC_DATE_RANGE_FIELDS,
  TOPIC_SELECTABLE_FIELDS,
  TOPIC_DEFAULT_SELECT_FIELDS,
  TOPIC_EDITABLE_FIELDS
} from './topic.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Cross-domain discovery topic hierarchy; topics do not own domain records. */
export interface ITopic extends B.IBase {
  code: string;
  label: string;
  parentId: string | null;
  readonly parent?: ITopic;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type TopicKey = keyof ITopic;

export type TopicRelationKey = (typeof TOPIC_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ITopicReadonlyFields = B.IBaseReadonlyFields;

export type ITopicContextualFields = never;

export type ITopicSensitiveFields = never;

export type ITopicTransitionFields = never;

export type ITopicImmutableFields =
  | ITopicReadonlyFields
  | ITopicContextualFields
  | ITopicSensitiveFields
  | ITopicTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ITopicCreatable = Omit<ITopic, ITopicImmutableFields | TopicRelationKey>;

export type ITopicSystemWritable = Omit<ITopic, B.IBaseReadonlyFields | TopicRelationKey>;

export type ITopicUpdatable = Partial<Omit<ITopic, ITopicImmutableFields | TopicRelationKey>>;

export interface ITopicTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type TopicSortableField = (typeof TOPIC_SORTABLE_FIELDS)[number];

export type TopicSearchableField = (typeof TOPIC_SEARCHABLE_FIELDS)[number];

export type TopicFilterableField = (typeof TOPIC_FILTERABLE_FIELDS)[number];

export type TopicDateRangeField = (typeof TOPIC_DATE_RANGE_FIELDS)[number];

export type TopicSelectableField = (typeof TOPIC_SELECTABLE_FIELDS)[number];

export type TopicDefaultSelectField = (typeof TOPIC_DEFAULT_SELECT_FIELDS)[number];

export type TopicEditableField = (typeof TOPIC_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ITopicAsOneRelationConfig = Q.IOneRelationConfig<'topic', TopicSelectableField>;

export type ITopicAsManyRelationConfig = Q.IManyRelationConfig<'topics', TopicSelectableField, TopicSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ITopicAsOneRelationQuery = Q.IAsOneRelationQuery<ITopic, TopicSelectableField>;

export type ITopicAsManyRelationQuery = Q.IAsManyRelationQuery<ITopic, TopicSelectableField, TopicSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ITopicRelationMap extends Record<TopicRelationKey, unknown> {
  parent: ITopicAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ITopicRelationQueries = Q.IBaseRelationQueries<ITopic, TopicRelationKey, ITopicRelationMap>;

export type ITopicItemQuery = Q.IBaseItemQuery<
  ITopic,
  TopicRelationKey,
  TopicSelectableField,
  TopicRelationKey,
  TopicSelectableField,
  ITopicRelationMap,
  ITopicRelationQueries
>;

export type ITopicListQuery = Q.IBaseListQuery<
  ITopic,
  TopicRelationKey,
  TopicSelectableField,
  TopicSortableField,
  TopicRelationKey,
  TopicSelectableField,
  TopicSortableField,
  TopicDateRangeField,
  TopicFilterableField,
  ITopicRelationMap,
  ITopicRelationQueries,
  ITopicItemQuery
>;