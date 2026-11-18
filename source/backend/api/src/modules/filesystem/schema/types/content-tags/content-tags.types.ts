// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ContentsTypes from "#/modules/filesystem/schema/types/contents/contents.types";
import type * as TagsTypes from "#/modules/filesystem/schema/types/tags/tags.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  CONTENT_TAGS_RELATION_KEYS,
  CONTENT_TAGS_SORTABLE_FIELDS,
  CONTENT_TAGS_SEARCHABLE_FIELDS,
  CONTENT_TAGS_FILTERABLE_FIELDS,
  CONTENT_TAGS_DATE_RANGE_FIELDS,
  CONTENT_TAGS_SELECTABLE_FIELDS,
  CONTENT_TAGS_DEFAULT_SELECT_FIELDS,
  CONTENT_TAGS_EDITABLE_FIELDS,
} from "./content-tags.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Tags a content text; a text may have several. */
export interface IContentTags extends B.IBase {
  contentId: string;
  tagId: string;
  readonly content?: ContentsTypes.IContents;
  readonly tag?: TagsTypes.ITags;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ContentTagsKey = keyof IContentTags;

export type ContentTagsRelationKey = (typeof CONTENT_TAGS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IContentTagsReadonlyFields = B.IBaseReadonlyFields;

export type IContentTagsContextualFields = never;

export type IContentTagsSensitiveFields = never;

export type IContentTagsTransitionFields = never;

export type IContentTagsImmutableFields =
  | IContentTagsReadonlyFields
  | IContentTagsContextualFields
  | IContentTagsSensitiveFields
  | IContentTagsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IContentTagsCreatable = Omit<
  IContentTags,
  IContentTagsImmutableFields | ContentTagsRelationKey
>;

export type IContentTagsSystemWritable = Omit<
  IContentTags,
  B.IBaseReadonlyFields | ContentTagsRelationKey
>;

export type IContentTagsUpdatable = Partial<
  Omit<IContentTags, IContentTagsImmutableFields | ContentTagsRelationKey>
>;

export interface IContentTagsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ContentTagsSortableField = (typeof CONTENT_TAGS_SORTABLE_FIELDS)[number];

export type ContentTagsSearchableField = (typeof CONTENT_TAGS_SEARCHABLE_FIELDS)[number];

export type ContentTagsFilterableField = (typeof CONTENT_TAGS_FILTERABLE_FIELDS)[number];

export type ContentTagsDateRangeField = (typeof CONTENT_TAGS_DATE_RANGE_FIELDS)[number];

export type ContentTagsSelectableField = (typeof CONTENT_TAGS_SELECTABLE_FIELDS)[number];

export type ContentTagsDefaultSelectField = (typeof CONTENT_TAGS_DEFAULT_SELECT_FIELDS)[number];

export type ContentTagsEditableField = (typeof CONTENT_TAGS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IContentTagsAsOneRelationConfig = Q.IOneRelationConfig<
  "contentTags",
  ContentTagsSelectableField
>;

export type IContentTagsAsManyRelationConfig = Q.IManyRelationConfig<
  "contentTags",
  ContentTagsSelectableField,
  ContentTagsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IContentTagsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IContentTags,
  ContentTagsSelectableField
>;

export type IContentTagsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IContentTags,
  ContentTagsSelectableField,
  ContentTagsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IContentTagsRelationMap extends Record<ContentTagsRelationKey, unknown> {
  content: ContentsTypes.IContentsAsOneRelationQuery;
  tag: TagsTypes.ITagsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IContentTagsRelationQueries = Q.IBaseRelationQueries<
  IContentTags,
  ContentTagsRelationKey,
  IContentTagsRelationMap
>;

export type IContentTagsItemQuery = Q.IBaseItemQuery<
  IContentTags,
  ContentTagsRelationKey,
  ContentTagsSelectableField,
  ContentTagsRelationKey,
  ContentTagsSelectableField,
  IContentTagsRelationMap,
  IContentTagsRelationQueries
>;

export type IContentTagsListQuery = Q.IBaseListQuery<
  IContentTags,
  ContentTagsRelationKey,
  ContentTagsSelectableField,
  ContentTagsSortableField,
  ContentTagsRelationKey,
  ContentTagsSelectableField,
  ContentTagsSortableField,
  ContentTagsDateRangeField,
  ContentTagsFilterableField,
  IContentTagsRelationMap,
  IContentTagsRelationQueries,
  IContentTagsItemQuery
>;
