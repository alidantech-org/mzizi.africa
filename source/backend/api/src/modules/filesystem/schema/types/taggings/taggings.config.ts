// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as FilesConfig from "#/modules/filesystem/schema/types/files/files.config";
import * as FoldersConfig from "#/modules/filesystem/schema/types/folders/folders.config";
import * as TagsConfig from "#/modules/filesystem/schema/types/tags/tags.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ITaggings,
  TaggingsKey,
  TaggingsRelationKey,
  TaggingsSortableField,
  TaggingsFilterableField,
  TaggingsDateRangeField,
  TaggingsSelectableField,
  ITaggingsAsOneRelationConfig,
  ITaggingsAsManyRelationConfig,
} from "./taggings.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const TAGGINGS_RELATION_KEYS = [
  "file",
  "folder",
  "tag",
] as const satisfies readonly TaggingsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const TAGGINGS_SORTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "fileId",
  "folderId",
  "id",
  "tagId",
  "updatedAt",
  "version",
] as const satisfies readonly TaggingsKey[];

export const TAGGINGS_SEARCHABLE_FIELDS = [] as const satisfies readonly TaggingsKey[];

export const TAGGINGS_FILTERABLE_FIELDS = [
  "fileId",
  "folderId",
  "id",
  "tagId",
] as const satisfies readonly TaggingsKey[];

export const TAGGINGS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly TaggingsKey[];

export const TAGGINGS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<ITaggings> = {
  searchableFields: [...TAGGINGS_SEARCHABLE_FIELDS],
  filterFields: [...TAGGINGS_FILTERABLE_FIELDS],
  dateRangeFields: [...TAGGINGS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const TAGGINGS_SELECTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "fileId",
  "folderId",
  "id",
  "tagId",
  "updatedAt",
  "version",
] as const satisfies readonly TaggingsKey[];

export const TAGGINGS_DEFAULT_SELECT_FIELDS = [
  "createdAt",
  "deletedAt",
  "fileId",
  "folderId",
  "id",
  "tagId",
  "updatedAt",
  "version",
] as const satisfies readonly TaggingsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const TAGGINGS_EDITABLE_FIELDS = [
  "fileId",
  "folderId",
  "tagId",
] as const satisfies readonly TaggingsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const TAGGINGS_AS_ONE_RELATION_CONFIG = {
  relation: "taggings",
  type: ERelationType.One,
  selectableFields: TAGGINGS_SELECTABLE_FIELDS,
  defaultSelectFields: TAGGINGS_DEFAULT_SELECT_FIELDS,
} as const satisfies ITaggingsAsOneRelationConfig;

export const TAGGINGS_AS_MANY_RELATION_CONFIG = {
  relation: "taggings",
  type: ERelationType.Many,
  selectableFields: TAGGINGS_SELECTABLE_FIELDS,
  defaultSelectFields: TAGGINGS_DEFAULT_SELECT_FIELDS,
  sortableFields: TAGGINGS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies ITaggingsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const TAGGINGS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<TaggingsRelationKey>().one(
    () => FilesConfig.FILES_AS_ONE_RELATION_CONFIG,
    "file",
  ),
  Q.createRelationKeyMapper<TaggingsRelationKey>().one(
    () => FoldersConfig.FOLDERS_AS_ONE_RELATION_CONFIG,
    "folder",
  ),
  Q.createRelationKeyMapper<TaggingsRelationKey>().one(
    () => TagsConfig.TAGS_AS_ONE_RELATION_CONFIG,
    "tag",
  ),
] as const;

export const TAGGINGS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const TAGGINGS_QUERY_OPTIONS = {
  searchableFields: TAGGINGS_SEARCHABLE_FIELDS,
  selectableFields: TAGGINGS_SELECTABLE_FIELDS,
  defaultSelectFields: TAGGINGS_DEFAULT_SELECT_FIELDS,
  sortableFields: TAGGINGS_SORTABLE_FIELDS,
  filterFields: TAGGINGS_FILTERABLE_FIELDS,
  dateRangeFields: TAGGINGS_DATE_RANGE_FIELDS,
  relationKeys: TAGGINGS_RELATION_KEYS,
  editableFields: TAGGINGS_EDITABLE_FIELDS,
  asOne: TAGGINGS_AS_ONE_RELATION_CONFIG,
  asMany: TAGGINGS_AS_MANY_RELATION_CONFIG,
  oneRelations: TAGGINGS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: TAGGINGS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  ITaggings,
  TaggingsSortableField,
  TaggingsSelectableField,
  TaggingsFilterableField,
  TaggingsDateRangeField,
  TaggingsRelationKey,
  typeof TAGGINGS_ONE_RELATION_QUERY_OPTIONS,
  typeof TAGGINGS_MANY_RELATION_QUERY_OPTIONS
>;
