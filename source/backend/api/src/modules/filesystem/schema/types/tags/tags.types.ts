// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  TAGS_RELATION_KEYS,
  TAGS_SORTABLE_FIELDS,
  TAGS_SEARCHABLE_FIELDS,
  TAGS_FILTERABLE_FIELDS,
  TAGS_DATE_RANGE_FIELDS,
  TAGS_SELECTABLE_FIELDS,
  TAGS_DEFAULT_SELECT_FIELDS,
  TAGS_EDITABLE_FIELDS,
} from "./tags.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One shared tag catalogue for files and folders. */
export interface ITags extends B.IBase {
  code: string;
  description: string | null;
  title: string;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type TagsKey = keyof ITags;

export type TagsRelationKey = (typeof TAGS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ITagsReadonlyFields = B.IBaseReadonlyFields;

export type ITagsContextualFields = never;

export type ITagsSensitiveFields = never;

export type ITagsTransitionFields = never;

export type ITagsImmutableFields =
  ITagsReadonlyFields | ITagsContextualFields | ITagsSensitiveFields | ITagsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ITagsCreatable = Omit<ITags, ITagsImmutableFields | TagsRelationKey>;

export type ITagsSystemWritable = Omit<ITags, B.IBaseReadonlyFields | TagsRelationKey>;

export type ITagsUpdatable = Partial<Omit<ITags, ITagsImmutableFields | TagsRelationKey>>;

export interface ITagsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type TagsSortableField = (typeof TAGS_SORTABLE_FIELDS)[number];

export type TagsSearchableField = (typeof TAGS_SEARCHABLE_FIELDS)[number];

export type TagsFilterableField = (typeof TAGS_FILTERABLE_FIELDS)[number];

export type TagsDateRangeField = (typeof TAGS_DATE_RANGE_FIELDS)[number];

export type TagsSelectableField = (typeof TAGS_SELECTABLE_FIELDS)[number];

export type TagsDefaultSelectField = (typeof TAGS_DEFAULT_SELECT_FIELDS)[number];

export type TagsEditableField = (typeof TAGS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ITagsAsOneRelationConfig = Q.IOneRelationConfig<"tags", TagsSelectableField>;

export type ITagsAsManyRelationConfig = Q.IManyRelationConfig<
  "tags",
  TagsSelectableField,
  TagsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ITagsAsOneRelationQuery = Q.IAsOneRelationQuery<ITags, TagsSelectableField>;

export type ITagsAsManyRelationQuery = Q.IAsManyRelationQuery<
  ITags,
  TagsSelectableField,
  TagsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ITagsRelationMap extends Record<TagsRelationKey, unknown> {}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ITagsRelationQueries = Q.IBaseRelationQueries<ITags, TagsRelationKey, ITagsRelationMap>;

export type ITagsItemQuery = Q.IBaseItemQuery<
  ITags,
  TagsRelationKey,
  TagsSelectableField,
  TagsRelationKey,
  TagsSelectableField,
  ITagsRelationMap,
  ITagsRelationQueries
>;

export type ITagsListQuery = Q.IBaseListQuery<
  ITags,
  TagsRelationKey,
  TagsSelectableField,
  TagsSortableField,
  TagsRelationKey,
  TagsSelectableField,
  TagsSortableField,
  TagsDateRangeField,
  TagsFilterableField,
  ITagsRelationMap,
  ITagsRelationQueries,
  ITagsItemQuery
>;
