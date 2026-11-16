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
import * as FeaturesConfig from "#/modules/geography/schema/types/features/features.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IGeometries,
  GeometriesKey,
  GeometriesRelationKey,
  GeometriesSortableField,
  GeometriesFilterableField,
  GeometriesDateRangeField,
  GeometriesSelectableField,
  IGeometriesAsOneRelationConfig,
  IGeometriesAsManyRelationConfig,
} from "./geometries.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const GEOMETRIES_RELATION_KEYS = [
  "basis",
  "feature",
  "geometryRole",
  "supersedes",
] as const satisfies readonly GeometriesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const GEOMETRIES_SORTABLE_FIELDS = [
  "area",
  "basisId",
  "confidence",
  "createdAt",
  "deletedAt",
  "featureId",
  "fileVersionRefId",
  "geometryRoleId",
  "id",
  "maxZoom",
  "minZoom",
  "observedAt",
  "revision",
  "srid",
  "supersedesId",
  "updatedAt",
  "validFrom",
  "validFromEarliest",
  "validFromLatest",
  "validUntil",
  "validUntilEarliest",
  "validUntilLatest",
  "version",
] as const satisfies readonly GeometriesKey[];

export const GEOMETRIES_SEARCHABLE_FIELDS = [] as const satisfies readonly GeometriesKey[];

export const GEOMETRIES_FILTERABLE_FIELDS = [
  "basisId",
  "featureId",
  "fileVersionRefId",
  "geometryRoleId",
  "id",
  "supersedesId",
] as const satisfies readonly GeometriesKey[];

export const GEOMETRIES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "observedAt",
  "updatedAt",
  "validFrom",
  "validFromEarliest",
  "validFromLatest",
  "validUntil",
  "validUntilEarliest",
  "validUntilLatest",
] as const satisfies readonly GeometriesKey[];

export const GEOMETRIES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IGeometries> = {
  searchableFields: [...GEOMETRIES_SEARCHABLE_FIELDS],
  filterFields: [...GEOMETRIES_FILTERABLE_FIELDS],
  dateRangeFields: [...GEOMETRIES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const GEOMETRIES_SELECTABLE_FIELDS = [
  "area",
  "basisId",
  "centroid",
  "confidence",
  "createdAt",
  "deletedAt",
  "envelope",
  "featureId",
  "fileVersionRefId",
  "geometry",
  "geometryRoleId",
  "id",
  "maxZoom",
  "minZoom",
  "observedAt",
  "revision",
  "srid",
  "supersedesId",
  "updatedAt",
  "validFrom",
  "validFromEarliest",
  "validFromLatest",
  "validUntil",
  "validUntilEarliest",
  "validUntilLatest",
  "version",
] as const satisfies readonly GeometriesKey[];

export const GEOMETRIES_DEFAULT_SELECT_FIELDS = [
  "area",
  "basisId",
  "centroid",
  "confidence",
  "createdAt",
  "deletedAt",
  "envelope",
  "featureId",
  "fileVersionRefId",
  "geometry",
  "geometryRoleId",
  "id",
  "maxZoom",
  "minZoom",
  "observedAt",
  "revision",
  "srid",
  "supersedesId",
  "updatedAt",
  "validFrom",
  "validFromEarliest",
  "validFromLatest",
  "validUntil",
  "validUntilEarliest",
  "validUntilLatest",
  "version",
] as const satisfies readonly GeometriesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const GEOMETRIES_EDITABLE_FIELDS = [
  "area",
  "basisId",
  "centroid",
  "confidence",
  "envelope",
  "featureId",
  "fileVersionRefId",
  "geometry",
  "geometryRoleId",
  "maxZoom",
  "minZoom",
  "observedAt",
  "revision",
  "srid",
  "supersedesId",
  "validFrom",
  "validFromEarliest",
  "validFromLatest",
  "validUntil",
  "validUntilEarliest",
  "validUntilLatest",
] as const satisfies readonly GeometriesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const GEOMETRIES_AS_ONE_RELATION_CONFIG = {
  relation: "geometries",
  type: ERelationType.One,
  selectableFields: GEOMETRIES_SELECTABLE_FIELDS,
  defaultSelectFields: GEOMETRIES_DEFAULT_SELECT_FIELDS,
} as const satisfies IGeometriesAsOneRelationConfig;

export const GEOMETRIES_AS_MANY_RELATION_CONFIG = {
  relation: "geometries",
  type: ERelationType.Many,
  selectableFields: GEOMETRIES_SELECTABLE_FIELDS,
  defaultSelectFields: GEOMETRIES_DEFAULT_SELECT_FIELDS,
  sortableFields: GEOMETRIES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IGeometriesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const GEOMETRIES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<GeometriesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "basis",
  ),
  Q.createRelationKeyMapper<GeometriesRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "feature",
  ),
  Q.createRelationKeyMapper<GeometriesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "geometryRole",
  ),
] as const;

export const GEOMETRIES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const GEOMETRIES_QUERY_OPTIONS = {
  searchableFields: GEOMETRIES_SEARCHABLE_FIELDS,
  selectableFields: GEOMETRIES_SELECTABLE_FIELDS,
  defaultSelectFields: GEOMETRIES_DEFAULT_SELECT_FIELDS,
  sortableFields: GEOMETRIES_SORTABLE_FIELDS,
  filterFields: GEOMETRIES_FILTERABLE_FIELDS,
  dateRangeFields: GEOMETRIES_DATE_RANGE_FIELDS,
  relationKeys: GEOMETRIES_RELATION_KEYS,
  editableFields: GEOMETRIES_EDITABLE_FIELDS,
  asOne: GEOMETRIES_AS_ONE_RELATION_CONFIG,
  asMany: GEOMETRIES_AS_MANY_RELATION_CONFIG,
  oneRelations: GEOMETRIES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: GEOMETRIES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IGeometries,
  GeometriesSortableField,
  GeometriesSelectableField,
  GeometriesFilterableField,
  GeometriesDateRangeField,
  GeometriesRelationKey,
  typeof GEOMETRIES_ONE_RELATION_QUERY_OPTIONS,
  typeof GEOMETRIES_MANY_RELATION_QUERY_OPTIONS
>;
