// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";
import type * as FileVersionsTypes from "#/modules/filesystem/schema/types/file-versions/file-versions.types";
import type * as GeometriesTypes from "#/modules/geography/schema/types/geometries/geometries.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ASSETS_RELATION_KEYS,
  ASSETS_SORTABLE_FIELDS,
  ASSETS_SEARCHABLE_FIELDS,
  ASSETS_FILTERABLE_FIELDS,
  ASSETS_DATE_RANGE_FIELDS,
  ASSETS_SELECTABLE_FIELDS,
  ASSETS_DEFAULT_SELECT_FIELDS,
  ASSETS_EDITABLE_FIELDS,
} from "./assets.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A stored GIS file used for a feature or for one of its geometries. One file can serve many features and a feature can have many files. Photographs and video are filesystem media; acquisition and provenance belong to Source. */
export interface IAssets extends B.IBase {
  band: number | null;
  code: string;
  description: string | null;
  featureId: string;
  fileVersionId: string;
  geometryId: string | null;
  kindId: string;
  layer: string | null;
  member: string | null;
  purposeId: string;
  readonly feature?: FeaturesTypes.IFeatures;
  readonly fileVersion?: FileVersionsTypes.IFileVersions;
  readonly geometry?: GeometriesTypes.IGeometries;
  readonly kind?: ValueTypes.IValue;
  readonly purpose?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type AssetsKey = keyof IAssets;

export type AssetsRelationKey = (typeof ASSETS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IAssetsReadonlyFields = B.IBaseReadonlyFields;

export type IAssetsContextualFields = never;

export type IAssetsSensitiveFields = never;

export type IAssetsTransitionFields = never;

export type IAssetsImmutableFields =
  | IAssetsReadonlyFields
  | IAssetsContextualFields
  | IAssetsSensitiveFields
  | IAssetsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IAssetsCreatable = Omit<IAssets, IAssetsImmutableFields | AssetsRelationKey>;

export type IAssetsSystemWritable = Omit<IAssets, B.IBaseReadonlyFields | AssetsRelationKey>;

export type IAssetsUpdatable = Partial<Omit<IAssets, IAssetsImmutableFields | AssetsRelationKey>>;

export interface IAssetsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type AssetsSortableField = (typeof ASSETS_SORTABLE_FIELDS)[number];

export type AssetsSearchableField = (typeof ASSETS_SEARCHABLE_FIELDS)[number];

export type AssetsFilterableField = (typeof ASSETS_FILTERABLE_FIELDS)[number];

export type AssetsDateRangeField = (typeof ASSETS_DATE_RANGE_FIELDS)[number];

export type AssetsSelectableField = (typeof ASSETS_SELECTABLE_FIELDS)[number];

export type AssetsDefaultSelectField = (typeof ASSETS_DEFAULT_SELECT_FIELDS)[number];

export type AssetsEditableField = (typeof ASSETS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IAssetsAsOneRelationConfig = Q.IOneRelationConfig<"assets", AssetsSelectableField>;

export type IAssetsAsManyRelationConfig = Q.IManyRelationConfig<
  "assets",
  AssetsSelectableField,
  AssetsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IAssetsAsOneRelationQuery = Q.IAsOneRelationQuery<IAssets, AssetsSelectableField>;

export type IAssetsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IAssets,
  AssetsSelectableField,
  AssetsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IAssetsRelationMap extends Record<AssetsRelationKey, unknown> {
  feature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  fileVersion: FileVersionsTypes.IFileVersionsAsOneRelationQuery;
  geometry: GeometriesTypes.IGeometriesAsOneRelationQuery;
  kind: ValueTypes.IValueAsOneRelationQuery;
  purpose: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IAssetsRelationQueries = Q.IBaseRelationQueries<
  IAssets,
  AssetsRelationKey,
  IAssetsRelationMap
>;

export type IAssetsItemQuery = Q.IBaseItemQuery<
  IAssets,
  AssetsRelationKey,
  AssetsSelectableField,
  AssetsRelationKey,
  AssetsSelectableField,
  IAssetsRelationMap,
  IAssetsRelationQueries
>;

export type IAssetsListQuery = Q.IBaseListQuery<
  IAssets,
  AssetsRelationKey,
  AssetsSelectableField,
  AssetsSortableField,
  AssetsRelationKey,
  AssetsSelectableField,
  AssetsSortableField,
  AssetsDateRangeField,
  AssetsFilterableField,
  IAssetsRelationMap,
  IAssetsRelationQueries,
  IAssetsItemQuery
>;
