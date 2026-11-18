// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ContentsConfig from "#/modules/filesystem/schema/types/contents/contents.config";
import * as TagsConfig from "#/modules/filesystem/schema/types/tags/tags.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IContentTags,
  ContentTagsKey,
  ContentTagsRelationKey,
  ContentTagsSortableField,
  ContentTagsFilterableField,
  ContentTagsDateRangeField,
  ContentTagsSelectableField,
  IContentTagsAsOneRelationConfig,
  IContentTagsAsManyRelationConfig,
} from "./content-tags.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const CONTENT_TAGS_RELATION_KEYS = [
  "content",
  "tag",
] as const satisfies readonly ContentTagsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const CONTENT_TAGS_SORTABLE_FIELDS = [
  "contentId",
  "createdAt",
  "deletedAt",
  "id",
  "tagId",
  "updatedAt",
  "version",
] as const satisfies readonly ContentTagsKey[];

export const CONTENT_TAGS_SEARCHABLE_FIELDS = [] as const satisfies readonly ContentTagsKey[];

export const CONTENT_TAGS_FILTERABLE_FIELDS = [
  "contentId",
  "id",
  "tagId",
] as const satisfies readonly ContentTagsKey[];

export const CONTENT_TAGS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly ContentTagsKey[];

export const CONTENT_TAGS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IContentTags> = {
  searchableFields: [...CONTENT_TAGS_SEARCHABLE_FIELDS],
  filterFields: [...CONTENT_TAGS_FILTERABLE_FIELDS],
  dateRangeFields: [...CONTENT_TAGS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const CONTENT_TAGS_SELECTABLE_FIELDS = [
  "contentId",
  "createdAt",
  "deletedAt",
  "id",
  "tagId",
  "updatedAt",
  "version",
] as const satisfies readonly ContentTagsKey[];

export const CONTENT_TAGS_DEFAULT_SELECT_FIELDS = [
  "contentId",
  "createdAt",
  "deletedAt",
  "id",
  "tagId",
  "updatedAt",
  "version",
] as const satisfies readonly ContentTagsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const CONTENT_TAGS_EDITABLE_FIELDS = [
  "contentId",
  "tagId",
] as const satisfies readonly ContentTagsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const CONTENT_TAGS_AS_ONE_RELATION_CONFIG = {
  relation: "contentTags",
  type: ERelationType.One,
  selectableFields: CONTENT_TAGS_SELECTABLE_FIELDS,
  defaultSelectFields: CONTENT_TAGS_DEFAULT_SELECT_FIELDS,
} as const satisfies IContentTagsAsOneRelationConfig;

export const CONTENT_TAGS_AS_MANY_RELATION_CONFIG = {
  relation: "contentTags",
  type: ERelationType.Many,
  selectableFields: CONTENT_TAGS_SELECTABLE_FIELDS,
  defaultSelectFields: CONTENT_TAGS_DEFAULT_SELECT_FIELDS,
  sortableFields: CONTENT_TAGS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IContentTagsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const CONTENT_TAGS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ContentTagsRelationKey>().one(
    () => ContentsConfig.CONTENTS_AS_ONE_RELATION_CONFIG,
    "content",
  ),
  Q.createRelationKeyMapper<ContentTagsRelationKey>().one(
    () => TagsConfig.TAGS_AS_ONE_RELATION_CONFIG,
    "tag",
  ),
] as const;

export const CONTENT_TAGS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const CONTENT_TAGS_QUERY_OPTIONS = {
  searchableFields: CONTENT_TAGS_SEARCHABLE_FIELDS,
  selectableFields: CONTENT_TAGS_SELECTABLE_FIELDS,
  defaultSelectFields: CONTENT_TAGS_DEFAULT_SELECT_FIELDS,
  sortableFields: CONTENT_TAGS_SORTABLE_FIELDS,
  filterFields: CONTENT_TAGS_FILTERABLE_FIELDS,
  dateRangeFields: CONTENT_TAGS_DATE_RANGE_FIELDS,
  relationKeys: CONTENT_TAGS_RELATION_KEYS,
  editableFields: CONTENT_TAGS_EDITABLE_FIELDS,
  asOne: CONTENT_TAGS_AS_ONE_RELATION_CONFIG,
  asMany: CONTENT_TAGS_AS_MANY_RELATION_CONFIG,
  oneRelations: CONTENT_TAGS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: CONTENT_TAGS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IContentTags,
  ContentTagsSortableField,
  ContentTagsSelectableField,
  ContentTagsFilterableField,
  ContentTagsDateRangeField,
  ContentTagsRelationKey,
  typeof CONTENT_TAGS_ONE_RELATION_QUERY_OPTIONS,
  typeof CONTENT_TAGS_MANY_RELATION_QUERY_OPTIONS
>;
