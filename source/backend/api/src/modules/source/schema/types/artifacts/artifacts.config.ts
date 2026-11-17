// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as EditionsConfig from "#/modules/source/schema/types/editions/editions.config";
import * as FileVersionsConfig from "#/modules/filesystem/schema/types/file-versions/file-versions.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IArtifacts,
  ArtifactsKey,
  ArtifactsRelationKey,
  ArtifactsSortableField,
  ArtifactsFilterableField,
  ArtifactsDateRangeField,
  ArtifactsSelectableField,
  IArtifactsAsOneRelationConfig,
  IArtifactsAsManyRelationConfig,
} from "./artifacts.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ARTIFACTS_RELATION_KEYS = [
  "edition",
  "fileVersion",
  "parent",
] as const satisfies readonly ArtifactsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ARTIFACTS_SORTABLE_FIELDS = [
  "code",
  "contentType",
  "createdAt",
  "deletedAt",
  "description",
  "editionId",
  "fileVersionId",
  "format",
  "id",
  "location",
  "parentId",
  "sha256",
  "sizeBytes",
  "updatedAt",
  "version",
] as const satisfies readonly ArtifactsKey[];

export const ARTIFACTS_SEARCHABLE_FIELDS = [
  "code",
  "contentType",
  "description",
  "format",
  "location",
  "sha256",
] as const satisfies readonly ArtifactsKey[];

export const ARTIFACTS_FILTERABLE_FIELDS = [
  "editionId",
  "fileVersionId",
  "id",
  "parentId",
] as const satisfies readonly ArtifactsKey[];

export const ARTIFACTS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly ArtifactsKey[];

export const ARTIFACTS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IArtifacts> = {
  searchableFields: [...ARTIFACTS_SEARCHABLE_FIELDS],
  filterFields: [...ARTIFACTS_FILTERABLE_FIELDS],
  dateRangeFields: [...ARTIFACTS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ARTIFACTS_SELECTABLE_FIELDS = [
  "code",
  "contentType",
  "createdAt",
  "deletedAt",
  "description",
  "editionId",
  "fileVersionId",
  "format",
  "id",
  "location",
  "parentId",
  "sha256",
  "sizeBytes",
  "updatedAt",
  "version",
] as const satisfies readonly ArtifactsKey[];

export const ARTIFACTS_DEFAULT_SELECT_FIELDS = [
  "code",
  "contentType",
  "createdAt",
  "deletedAt",
  "description",
  "editionId",
  "fileVersionId",
  "format",
  "id",
  "location",
  "parentId",
  "sha256",
  "sizeBytes",
  "updatedAt",
  "version",
] as const satisfies readonly ArtifactsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ARTIFACTS_EDITABLE_FIELDS = [
  "code",
  "contentType",
  "description",
  "editionId",
  "fileVersionId",
  "format",
  "location",
  "parentId",
  "sha256",
  "sizeBytes",
] as const satisfies readonly ArtifactsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ARTIFACTS_AS_ONE_RELATION_CONFIG = {
  relation: "artifacts",
  type: ERelationType.One,
  selectableFields: ARTIFACTS_SELECTABLE_FIELDS,
  defaultSelectFields: ARTIFACTS_DEFAULT_SELECT_FIELDS,
} as const satisfies IArtifactsAsOneRelationConfig;

export const ARTIFACTS_AS_MANY_RELATION_CONFIG = {
  relation: "artifacts",
  type: ERelationType.Many,
  selectableFields: ARTIFACTS_SELECTABLE_FIELDS,
  defaultSelectFields: ARTIFACTS_DEFAULT_SELECT_FIELDS,
  sortableFields: ARTIFACTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IArtifactsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ARTIFACTS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ArtifactsRelationKey>().one(
    () => EditionsConfig.EDITIONS_AS_ONE_RELATION_CONFIG,
    "edition",
  ),
  Q.createRelationKeyMapper<ArtifactsRelationKey>().one(
    () => FileVersionsConfig.FILE_VERSIONS_AS_ONE_RELATION_CONFIG,
    "fileVersion",
  ),
] as const;

export const ARTIFACTS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ARTIFACTS_QUERY_OPTIONS = {
  searchableFields: ARTIFACTS_SEARCHABLE_FIELDS,
  selectableFields: ARTIFACTS_SELECTABLE_FIELDS,
  defaultSelectFields: ARTIFACTS_DEFAULT_SELECT_FIELDS,
  sortableFields: ARTIFACTS_SORTABLE_FIELDS,
  filterFields: ARTIFACTS_FILTERABLE_FIELDS,
  dateRangeFields: ARTIFACTS_DATE_RANGE_FIELDS,
  relationKeys: ARTIFACTS_RELATION_KEYS,
  editableFields: ARTIFACTS_EDITABLE_FIELDS,
  asOne: ARTIFACTS_AS_ONE_RELATION_CONFIG,
  asMany: ARTIFACTS_AS_MANY_RELATION_CONFIG,
  oneRelations: ARTIFACTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ARTIFACTS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IArtifacts,
  ArtifactsSortableField,
  ArtifactsSelectableField,
  ArtifactsFilterableField,
  ArtifactsDateRangeField,
  ArtifactsRelationKey,
  typeof ARTIFACTS_ONE_RELATION_QUERY_OPTIONS,
  typeof ARTIFACTS_MANY_RELATION_QUERY_OPTIONS
>;
