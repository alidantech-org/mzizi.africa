// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as FeaturesConfig from "#/modules/geography/schema/types/features/features.config";
import * as FileVersionsConfig from "#/modules/filesystem/schema/types/file-versions/file-versions.config";
import * as GeometriesConfig from "#/modules/geography/schema/types/geometries/geometries.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IAssets,
  AssetsKey,
  AssetsRelationKey,
  AssetsSortableField,
  AssetsFilterableField,
  AssetsDateRangeField,
  AssetsSelectableField,
  IAssetsAsOneRelationConfig,
  IAssetsAsManyRelationConfig,
} from "./assets.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ASSETS_RELATION_KEYS = [
  "feature",
  "fileVersion",
  "geometry",
  "kind",
  "purpose",
] as const satisfies readonly AssetsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ASSETS_SORTABLE_FIELDS = [
  "band",
  "code",
  "createdAt",
  "deletedAt",
  "description",
  "featureId",
  "fileVersionId",
  "geometryId",
  "id",
  "kindId",
  "layer",
  "member",
  "purposeId",
  "updatedAt",
  "version",
] as const satisfies readonly AssetsKey[];

export const ASSETS_SEARCHABLE_FIELDS = [
  "code",
  "description",
  "layer",
  "member",
] as const satisfies readonly AssetsKey[];

export const ASSETS_FILTERABLE_FIELDS = [
  "featureId",
  "fileVersionId",
  "geometryId",
  "id",
  "kindId",
  "purposeId",
] as const satisfies readonly AssetsKey[];

export const ASSETS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly AssetsKey[];

export const ASSETS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IAssets> = {
  searchableFields: [...ASSETS_SEARCHABLE_FIELDS],
  filterFields: [...ASSETS_FILTERABLE_FIELDS],
  dateRangeFields: [...ASSETS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ASSETS_SELECTABLE_FIELDS = [
  "band",
  "code",
  "createdAt",
  "deletedAt",
  "description",
  "featureId",
  "fileVersionId",
  "geometryId",
  "id",
  "kindId",
  "layer",
  "member",
  "purposeId",
  "updatedAt",
  "version",
] as const satisfies readonly AssetsKey[];

export const ASSETS_DEFAULT_SELECT_FIELDS = [
  "band",
  "code",
  "createdAt",
  "deletedAt",
  "description",
  "featureId",
  "fileVersionId",
  "geometryId",
  "id",
  "kindId",
  "layer",
  "member",
  "purposeId",
  "updatedAt",
  "version",
] as const satisfies readonly AssetsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ASSETS_EDITABLE_FIELDS = [
  "band",
  "code",
  "description",
  "featureId",
  "fileVersionId",
  "geometryId",
  "kindId",
  "layer",
  "member",
  "purposeId",
] as const satisfies readonly AssetsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ASSETS_AS_ONE_RELATION_CONFIG = {
  relation: "assets",
  type: ERelationType.One,
  selectableFields: ASSETS_SELECTABLE_FIELDS,
  defaultSelectFields: ASSETS_DEFAULT_SELECT_FIELDS,
} as const satisfies IAssetsAsOneRelationConfig;

export const ASSETS_AS_MANY_RELATION_CONFIG = {
  relation: "assets",
  type: ERelationType.Many,
  selectableFields: ASSETS_SELECTABLE_FIELDS,
  defaultSelectFields: ASSETS_DEFAULT_SELECT_FIELDS,
  sortableFields: ASSETS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IAssetsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ASSETS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<AssetsRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "feature",
  ),
  Q.createRelationKeyMapper<AssetsRelationKey>().one(
    () => FileVersionsConfig.FILE_VERSIONS_AS_ONE_RELATION_CONFIG,
    "fileVersion",
  ),
  Q.createRelationKeyMapper<AssetsRelationKey>().one(
    () => GeometriesConfig.GEOMETRIES_AS_ONE_RELATION_CONFIG,
    "geometry",
  ),
  Q.createRelationKeyMapper<AssetsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "kind",
  ),
  Q.createRelationKeyMapper<AssetsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "purpose",
  ),
] as const;

export const ASSETS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ASSETS_QUERY_OPTIONS = {
  searchableFields: ASSETS_SEARCHABLE_FIELDS,
  selectableFields: ASSETS_SELECTABLE_FIELDS,
  defaultSelectFields: ASSETS_DEFAULT_SELECT_FIELDS,
  sortableFields: ASSETS_SORTABLE_FIELDS,
  filterFields: ASSETS_FILTERABLE_FIELDS,
  dateRangeFields: ASSETS_DATE_RANGE_FIELDS,
  relationKeys: ASSETS_RELATION_KEYS,
  editableFields: ASSETS_EDITABLE_FIELDS,
  asOne: ASSETS_AS_ONE_RELATION_CONFIG,
  asMany: ASSETS_AS_MANY_RELATION_CONFIG,
  oneRelations: ASSETS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ASSETS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IAssets,
  AssetsSortableField,
  AssetsSelectableField,
  AssetsFilterableField,
  AssetsDateRangeField,
  AssetsRelationKey,
  typeof ASSETS_ONE_RELATION_QUERY_OPTIONS,
  typeof ASSETS_MANY_RELATION_QUERY_OPTIONS
>;
