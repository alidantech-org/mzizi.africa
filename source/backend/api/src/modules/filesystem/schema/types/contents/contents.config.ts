// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as FileVersionsConfig from "#/modules/filesystem/schema/types/file-versions/file-versions.config";
import * as LanguageConfig from "#/modules/reference/schema/types/language/language.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IContents,
  ContentsKey,
  ContentsRelationKey,
  ContentsSortableField,
  ContentsFilterableField,
  ContentsDateRangeField,
  ContentsSelectableField,
  IContentsAsOneRelationConfig,
  IContentsAsManyRelationConfig,
} from "./contents.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const CONTENTS_RELATION_KEYS = [
  "category",
  "classification",
  "fileVersion",
  "language",
] as const satisfies readonly ContentsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const CONTENTS_SORTABLE_FIELDS = [
  "body",
  "categoryId",
  "classificationId",
  "code",
  "createdAt",
  "deletedAt",
  "fileVersionId",
  "id",
  "isDevelopmentText",
  "languageId",
  "slug",
  "subjectId",
  "subjectTable",
  "summary",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly ContentsKey[];

export const CONTENTS_SEARCHABLE_FIELDS = [
  "body",
  "code",
  "slug",
  "summary",
  "title",
] as const satisfies readonly ContentsKey[];

export const CONTENTS_FILTERABLE_FIELDS = [
  "categoryId",
  "classificationId",
  "fileVersionId",
  "id",
  "isDevelopmentText",
  "languageId",
  "subjectId",
  "subjectTable",
] as const satisfies readonly ContentsKey[];

export const CONTENTS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly ContentsKey[];

export const CONTENTS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IContents> = {
  searchableFields: [...CONTENTS_SEARCHABLE_FIELDS],
  filterFields: [...CONTENTS_FILTERABLE_FIELDS],
  dateRangeFields: [...CONTENTS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const CONTENTS_SELECTABLE_FIELDS = [
  "body",
  "categoryId",
  "classificationId",
  "code",
  "createdAt",
  "deletedAt",
  "fileVersionId",
  "id",
  "isDevelopmentText",
  "languageId",
  "slug",
  "subjectId",
  "subjectTable",
  "summary",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly ContentsKey[];

export const CONTENTS_DEFAULT_SELECT_FIELDS = [
  "body",
  "categoryId",
  "classificationId",
  "code",
  "createdAt",
  "deletedAt",
  "fileVersionId",
  "id",
  "isDevelopmentText",
  "languageId",
  "slug",
  "subjectId",
  "subjectTable",
  "summary",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly ContentsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const CONTENTS_EDITABLE_FIELDS = [
  "body",
  "categoryId",
  "classificationId",
  "code",
  "fileVersionId",
  "isDevelopmentText",
  "languageId",
  "slug",
  "subjectId",
  "subjectTable",
  "summary",
  "title",
] as const satisfies readonly ContentsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const CONTENTS_AS_ONE_RELATION_CONFIG = {
  relation: "contents",
  type: ERelationType.One,
  selectableFields: CONTENTS_SELECTABLE_FIELDS,
  defaultSelectFields: CONTENTS_DEFAULT_SELECT_FIELDS,
} as const satisfies IContentsAsOneRelationConfig;

export const CONTENTS_AS_MANY_RELATION_CONFIG = {
  relation: "contents",
  type: ERelationType.Many,
  selectableFields: CONTENTS_SELECTABLE_FIELDS,
  defaultSelectFields: CONTENTS_DEFAULT_SELECT_FIELDS,
  sortableFields: CONTENTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IContentsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const CONTENTS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ContentsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "category",
  ),
  Q.createRelationKeyMapper<ContentsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "classification",
  ),
  Q.createRelationKeyMapper<ContentsRelationKey>().one(
    () => FileVersionsConfig.FILE_VERSIONS_AS_ONE_RELATION_CONFIG,
    "fileVersion",
  ),
  Q.createRelationKeyMapper<ContentsRelationKey>().one(
    () => LanguageConfig.LANGUAGE_AS_ONE_RELATION_CONFIG,
    "language",
  ),
] as const;

export const CONTENTS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const CONTENTS_QUERY_OPTIONS = {
  searchableFields: CONTENTS_SEARCHABLE_FIELDS,
  selectableFields: CONTENTS_SELECTABLE_FIELDS,
  defaultSelectFields: CONTENTS_DEFAULT_SELECT_FIELDS,
  sortableFields: CONTENTS_SORTABLE_FIELDS,
  filterFields: CONTENTS_FILTERABLE_FIELDS,
  dateRangeFields: CONTENTS_DATE_RANGE_FIELDS,
  relationKeys: CONTENTS_RELATION_KEYS,
  editableFields: CONTENTS_EDITABLE_FIELDS,
  asOne: CONTENTS_AS_ONE_RELATION_CONFIG,
  asMany: CONTENTS_AS_MANY_RELATION_CONFIG,
  oneRelations: CONTENTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: CONTENTS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IContents,
  ContentsSortableField,
  ContentsSelectableField,
  ContentsFilterableField,
  ContentsDateRangeField,
  ContentsRelationKey,
  typeof CONTENTS_ONE_RELATION_QUERY_OPTIONS,
  typeof CONTENTS_MANY_RELATION_QUERY_OPTIONS
>;
