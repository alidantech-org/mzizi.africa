// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  GEOMETRIES_RELATION_KEYS,
  GEOMETRIES_SORTABLE_FIELDS,
  GEOMETRIES_SEARCHABLE_FIELDS,
  GEOMETRIES_FILTERABLE_FIELDS,
  GEOMETRIES_DATE_RANGE_FIELDS,
  GEOMETRIES_SELECTABLE_FIELDS,
  GEOMETRIES_DEFAULT_SELECT_FIELDS,
  GEOMETRIES_EDITABLE_FIELDS,
} from "./geometries.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One drawing of a feature: a revision with a role, a basis, a confidence, a zoom range, a validity period and the stored file it came from. A feature has many; the current one has no end date. */
export interface IGeometries extends B.IBase {
  area: number;
  basisId: string;
  centroid: unknown;
  confidence: number | null;
  envelope: unknown;
  featureId: string;
  geometry: unknown;
  geometryRoleId: string;
  maxZoom: number | null;
  minZoom: number | null;
  observedAt: Date | null;
  revision: number;
  srid: number;
  supersedesId: string | null;
  validFrom: Date | null;
  validFromEarliest: Date | null;
  validFromLatest: Date | null;
  validUntil: Date | null;
  validUntilEarliest: Date | null;
  validUntilLatest: Date | null;
  readonly basis?: ValueTypes.IValue;
  readonly feature?: FeaturesTypes.IFeatures;
  readonly geometryRole?: ValueTypes.IValue;
  readonly supersedes?: IGeometries;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type GeometriesKey = keyof IGeometries;

export type GeometriesRelationKey = (typeof GEOMETRIES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IGeometriesReadonlyFields = B.IBaseReadonlyFields;

export type IGeometriesContextualFields = never;

export type IGeometriesSensitiveFields = never;

export type IGeometriesTransitionFields = never;

export type IGeometriesImmutableFields =
  | IGeometriesReadonlyFields
  | IGeometriesContextualFields
  | IGeometriesSensitiveFields
  | IGeometriesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IGeometriesCreatable = Omit<
  IGeometries,
  IGeometriesImmutableFields | GeometriesRelationKey
>;

export type IGeometriesSystemWritable = Omit<
  IGeometries,
  B.IBaseReadonlyFields | GeometriesRelationKey
>;

export type IGeometriesUpdatable = Partial<
  Omit<IGeometries, IGeometriesImmutableFields | GeometriesRelationKey>
>;

export interface IGeometriesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type GeometriesSortableField = (typeof GEOMETRIES_SORTABLE_FIELDS)[number];

export type GeometriesSearchableField = (typeof GEOMETRIES_SEARCHABLE_FIELDS)[number];

export type GeometriesFilterableField = (typeof GEOMETRIES_FILTERABLE_FIELDS)[number];

export type GeometriesDateRangeField = (typeof GEOMETRIES_DATE_RANGE_FIELDS)[number];

export type GeometriesSelectableField = (typeof GEOMETRIES_SELECTABLE_FIELDS)[number];

export type GeometriesDefaultSelectField = (typeof GEOMETRIES_DEFAULT_SELECT_FIELDS)[number];

export type GeometriesEditableField = (typeof GEOMETRIES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IGeometriesAsOneRelationConfig = Q.IOneRelationConfig<
  "geometries",
  GeometriesSelectableField
>;

export type IGeometriesAsManyRelationConfig = Q.IManyRelationConfig<
  "geometries",
  GeometriesSelectableField,
  GeometriesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IGeometriesAsOneRelationQuery = Q.IAsOneRelationQuery<
  IGeometries,
  GeometriesSelectableField
>;

export type IGeometriesAsManyRelationQuery = Q.IAsManyRelationQuery<
  IGeometries,
  GeometriesSelectableField,
  GeometriesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IGeometriesRelationMap extends Record<GeometriesRelationKey, unknown> {
  basis: ValueTypes.IValueAsOneRelationQuery;
  feature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  geometryRole: ValueTypes.IValueAsOneRelationQuery;
  supersedes: IGeometriesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IGeometriesRelationQueries = Q.IBaseRelationQueries<
  IGeometries,
  GeometriesRelationKey,
  IGeometriesRelationMap
>;

export type IGeometriesItemQuery = Q.IBaseItemQuery<
  IGeometries,
  GeometriesRelationKey,
  GeometriesSelectableField,
  GeometriesRelationKey,
  GeometriesSelectableField,
  IGeometriesRelationMap,
  IGeometriesRelationQueries
>;

export type IGeometriesListQuery = Q.IBaseListQuery<
  IGeometries,
  GeometriesRelationKey,
  GeometriesSelectableField,
  GeometriesSortableField,
  GeometriesRelationKey,
  GeometriesSelectableField,
  GeometriesSortableField,
  GeometriesDateRangeField,
  GeometriesFilterableField,
  IGeometriesRelationMap,
  IGeometriesRelationQueries,
  IGeometriesItemQuery
>;
