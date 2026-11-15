// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as FeaturesTypes from '#/modules/geography/types/features/features.types';
import type * as ValueTypes from '#/modules/reference/types/value/value.types';

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
  GEOMETRIES_EDITABLE_FIELDS
} from './geometries.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A dated spatial representation version for a feature. The geometry field remains an unsupported Dryv placeholder and is excluded from generation. */
export interface IGeometries extends B.IBase {
  featureId: string;
  fileVersionRefId: string | null;
  geometry: unknown;
  geometryRoleId: string;
  observedAt: Date | null;
  sourceRefId: string | null;
  srid: number;
  validFrom: Date | null;
  validUntil: Date | null;
  readonly feature?: FeaturesTypes.IFeatures;
  readonly geometryRole?: ValueTypes.IValue;
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

export type IGeometriesCreatable = Omit<IGeometries, IGeometriesImmutableFields | GeometriesRelationKey>;

export type IGeometriesSystemWritable = Omit<IGeometries, B.IBaseReadonlyFields | GeometriesRelationKey>;

export type IGeometriesUpdatable = Partial<Omit<IGeometries, IGeometriesImmutableFields | GeometriesRelationKey>>;

export interface IGeometriesTransitionPayload {
}

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

export type IGeometriesAsOneRelationConfig = Q.IOneRelationConfig<'geometries', GeometriesSelectableField>;

export type IGeometriesAsManyRelationConfig = Q.IManyRelationConfig<'geometriess', GeometriesSelectableField, GeometriesSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IGeometriesAsOneRelationQuery = Q.IAsOneRelationQuery<IGeometries, GeometriesSelectableField>;

export type IGeometriesAsManyRelationQuery = Q.IAsManyRelationQuery<IGeometries, GeometriesSelectableField, GeometriesSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IGeometriesRelationMap extends Record<GeometriesRelationKey, unknown> {
  feature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  geometryRole: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IGeometriesRelationQueries = Q.IBaseRelationQueries<IGeometries, GeometriesRelationKey, IGeometriesRelationMap>;

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