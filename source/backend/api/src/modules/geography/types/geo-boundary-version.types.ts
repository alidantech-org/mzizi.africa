// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as GeoUnitTypes from '#/modules/geography/types/geo-unit.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  GEO_BOUNDARY_VERSION_RELATION_KEYS,
  GEO_BOUNDARY_VERSION_SORTABLE_FIELDS,
  GEO_BOUNDARY_VERSION_SEARCHABLE_FIELDS,
  GEO_BOUNDARY_VERSION_FILTERABLE_FIELDS,
  GEO_BOUNDARY_VERSION_DATE_RANGE_FIELDS,
  GEO_BOUNDARY_VERSION_SELECTABLE_FIELDS,
  GEO_BOUNDARY_VERSION_DEFAULT_SELECT_FIELDS,
  GEO_BOUNDARY_VERSION_EDITABLE_FIELDS
} from './geo-boundary-version.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Geo Boundary Version */
export interface IGeoBoundaryVersion extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  confidence: number | null;
  geometry: string;
  isCurrent: boolean;
  labelPoint: string | null;
  licence: string | null;
  method: ProvenanceMethod;
  referenceYear: number | null;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  toolOrModel: string | null;
  unitId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  versionNumber: number;
  readonly geoUnit?: GeoUnitTypes.IGeoUnit;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type GeoBoundaryVersionKey = keyof IGeoBoundaryVersion;

export type GeoBoundaryVersionRelationKey = (typeof GEO_BOUNDARY_VERSION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IGeoBoundaryVersionReadonlyFields = B.IBaseReadonlyFields;

export type IGeoBoundaryVersionContextualFields = never;

export type IGeoBoundaryVersionSensitiveFields = never;

export type IGeoBoundaryVersionTransitionFields = never;

export type IGeoBoundaryVersionImmutableFields =
  | IGeoBoundaryVersionReadonlyFields
  | IGeoBoundaryVersionContextualFields
  | IGeoBoundaryVersionSensitiveFields
  | IGeoBoundaryVersionTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IGeoBoundaryVersionCreatable = Omit<IGeoBoundaryVersion, IGeoBoundaryVersionImmutableFields | GeoBoundaryVersionRelationKey>;

export type IGeoBoundaryVersionSystemWritable = Omit<IGeoBoundaryVersion, B.IBaseReadonlyFields | GeoBoundaryVersionRelationKey>;

export type IGeoBoundaryVersionUpdatable = Partial<Omit<IGeoBoundaryVersion, IGeoBoundaryVersionImmutableFields | GeoBoundaryVersionRelationKey>>;

export interface IGeoBoundaryVersionTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type GeoBoundaryVersionSortableField = (typeof GEO_BOUNDARY_VERSION_SORTABLE_FIELDS)[number];

export type GeoBoundaryVersionSearchableField = (typeof GEO_BOUNDARY_VERSION_SEARCHABLE_FIELDS)[number];

export type GeoBoundaryVersionFilterableField = (typeof GEO_BOUNDARY_VERSION_FILTERABLE_FIELDS)[number];

export type GeoBoundaryVersionDateRangeField = (typeof GEO_BOUNDARY_VERSION_DATE_RANGE_FIELDS)[number];

export type GeoBoundaryVersionSelectableField = (typeof GEO_BOUNDARY_VERSION_SELECTABLE_FIELDS)[number];

export type GeoBoundaryVersionDefaultSelectField = (typeof GEO_BOUNDARY_VERSION_DEFAULT_SELECT_FIELDS)[number];

export type GeoBoundaryVersionEditableField = (typeof GEO_BOUNDARY_VERSION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IGeoBoundaryVersionAsOneRelationConfig = Q.IOneRelationConfig<'geoBoundaryVersion', GeoBoundaryVersionSelectableField>;

export type IGeoBoundaryVersionAsManyRelationConfig = Q.IManyRelationConfig<'geoBoundaryVersions', GeoBoundaryVersionSelectableField, GeoBoundaryVersionSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IGeoBoundaryVersionAsOneRelationQuery = Q.IAsOneRelationQuery<IGeoBoundaryVersion, GeoBoundaryVersionSelectableField>;

export type IGeoBoundaryVersionAsManyRelationQuery = Q.IAsManyRelationQuery<IGeoBoundaryVersion, GeoBoundaryVersionSelectableField, GeoBoundaryVersionSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IGeoBoundaryVersionRelationMap extends Record<GeoBoundaryVersionRelationKey, unknown> {
  geoUnit: GeoUnitTypes.IGeoUnitAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IGeoBoundaryVersionRelationQueries = Q.IBaseRelationQueries<IGeoBoundaryVersion, GeoBoundaryVersionRelationKey, IGeoBoundaryVersionRelationMap>;

export type IGeoBoundaryVersionItemQuery = Q.IBaseItemQuery<
  IGeoBoundaryVersion,
  GeoBoundaryVersionRelationKey,
  GeoBoundaryVersionSelectableField,
  GeoBoundaryVersionRelationKey,
  GeoBoundaryVersionSelectableField,
  IGeoBoundaryVersionRelationMap,
  IGeoBoundaryVersionRelationQueries
>;

export type IGeoBoundaryVersionListQuery = Q.IBaseListQuery<
  IGeoBoundaryVersion,
  GeoBoundaryVersionRelationKey,
  GeoBoundaryVersionSelectableField,
  GeoBoundaryVersionSortableField,
  GeoBoundaryVersionRelationKey,
  GeoBoundaryVersionSelectableField,
  GeoBoundaryVersionSortableField,
  GeoBoundaryVersionDateRangeField,
  GeoBoundaryVersionFilterableField,
  IGeoBoundaryVersionRelationMap,
  IGeoBoundaryVersionRelationQueries,
  IGeoBoundaryVersionItemQuery
>;