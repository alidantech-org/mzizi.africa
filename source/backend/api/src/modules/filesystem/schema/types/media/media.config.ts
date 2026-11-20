// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as FileVersionsConfig from "#/modules/filesystem/schema/types/file-versions/file-versions.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IMedia,
  MediaKey,
  MediaRelationKey,
  MediaSortableField,
  MediaFilterableField,
  MediaDateRangeField,
  MediaSelectableField,
  IMediaAsOneRelationConfig,
  IMediaAsManyRelationConfig,
} from "./media.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const MEDIA_RELATION_KEYS = [
  "fileVersion",
  "kind",
  "platform",
] as const satisfies readonly MediaKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const MEDIA_SORTABLE_FIELDS = [
  "altText",
  "code",
  "createdAt",
  "deletedAt",
  "description",
  "endSecond",
  "externalUrl",
  "fileVersionId",
  "id",
  "kindId",
  "metadata",
  "platformId",
  "position",
  "purpose",
  "startSecond",
  "subjectId",
  "subjectTable",
  "thumbnailUrl",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly MediaKey[];

export const MEDIA_SEARCHABLE_FIELDS = [
  "altText",
  "code",
  "description",
  "purpose",
  "title",
] as const satisfies readonly MediaKey[];

export const MEDIA_FILTERABLE_FIELDS = [
  "fileVersionId",
  "id",
  "kindId",
  "platformId",
  "subjectId",
  "subjectTable",
] as const satisfies readonly MediaKey[];

export const MEDIA_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly MediaKey[];

export const MEDIA_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IMedia> = {
  searchableFields: [...MEDIA_SEARCHABLE_FIELDS],
  filterFields: [...MEDIA_FILTERABLE_FIELDS],
  dateRangeFields: [...MEDIA_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const MEDIA_SELECTABLE_FIELDS = [
  "altText",
  "code",
  "createdAt",
  "deletedAt",
  "description",
  "endSecond",
  "externalUrl",
  "fileVersionId",
  "id",
  "kindId",
  "metadata",
  "platformId",
  "position",
  "purpose",
  "startSecond",
  "subjectId",
  "subjectTable",
  "thumbnailUrl",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly MediaKey[];

export const MEDIA_DEFAULT_SELECT_FIELDS = [
  "altText",
  "code",
  "createdAt",
  "deletedAt",
  "description",
  "endSecond",
  "externalUrl",
  "fileVersionId",
  "id",
  "kindId",
  "metadata",
  "platformId",
  "position",
  "purpose",
  "startSecond",
  "subjectId",
  "subjectTable",
  "thumbnailUrl",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly MediaSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const MEDIA_EDITABLE_FIELDS = [
  "altText",
  "code",
  "description",
  "endSecond",
  "externalUrl",
  "fileVersionId",
  "kindId",
  "metadata",
  "platformId",
  "position",
  "purpose",
  "startSecond",
  "subjectId",
  "subjectTable",
  "thumbnailUrl",
  "title",
] as const satisfies readonly MediaKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const MEDIA_AS_ONE_RELATION_CONFIG = {
  relation: "media",
  type: ERelationType.One,
  selectableFields: MEDIA_SELECTABLE_FIELDS,
  defaultSelectFields: MEDIA_DEFAULT_SELECT_FIELDS,
} as const satisfies IMediaAsOneRelationConfig;

export const MEDIA_AS_MANY_RELATION_CONFIG = {
  relation: "medias",
  type: ERelationType.Many,
  selectableFields: MEDIA_SELECTABLE_FIELDS,
  defaultSelectFields: MEDIA_DEFAULT_SELECT_FIELDS,
  sortableFields: MEDIA_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IMediaAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const MEDIA_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<MediaRelationKey>().one(
    () => FileVersionsConfig.FILE_VERSIONS_AS_ONE_RELATION_CONFIG,
    "fileVersion",
  ),
  Q.createRelationKeyMapper<MediaRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "kind",
  ),
  Q.createRelationKeyMapper<MediaRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "platform",
  ),
] as const;

export const MEDIA_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const MEDIA_QUERY_OPTIONS = {
  searchableFields: MEDIA_SEARCHABLE_FIELDS,
  selectableFields: MEDIA_SELECTABLE_FIELDS,
  defaultSelectFields: MEDIA_DEFAULT_SELECT_FIELDS,
  sortableFields: MEDIA_SORTABLE_FIELDS,
  filterFields: MEDIA_FILTERABLE_FIELDS,
  dateRangeFields: MEDIA_DATE_RANGE_FIELDS,
  relationKeys: MEDIA_RELATION_KEYS,
  editableFields: MEDIA_EDITABLE_FIELDS,
  asOne: MEDIA_AS_ONE_RELATION_CONFIG,
  asMany: MEDIA_AS_MANY_RELATION_CONFIG,
  oneRelations: MEDIA_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: MEDIA_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IMedia,
  MediaSortableField,
  MediaSelectableField,
  MediaFilterableField,
  MediaDateRangeField,
  MediaRelationKey,
  typeof MEDIA_ONE_RELATION_QUERY_OPTIONS,
  typeof MEDIA_MANY_RELATION_QUERY_OPTIONS
>;
