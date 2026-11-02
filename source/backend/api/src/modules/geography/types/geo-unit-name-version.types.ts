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
  GEO_UNIT_NAME_VERSION_RELATION_KEYS,
  GEO_UNIT_NAME_VERSION_SORTABLE_FIELDS,
  GEO_UNIT_NAME_VERSION_SEARCHABLE_FIELDS,
  GEO_UNIT_NAME_VERSION_FILTERABLE_FIELDS,
  GEO_UNIT_NAME_VERSION_DATE_RANGE_FIELDS,
  GEO_UNIT_NAME_VERSION_SELECTABLE_FIELDS,
  GEO_UNIT_NAME_VERSION_DEFAULT_SELECT_FIELDS,
  GEO_UNIT_NAME_VERSION_EDITABLE_FIELDS
} from './geo-unit-name-version.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Geo Unit Name Version */
export interface IGeoUnitNameVersion extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  confidence: number | null;
  isCurrent: boolean;
  language: string | null;
  licence: string | null;
  method: ProvenanceMethod;
  name: string;
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
  readonly geoUnit?: GeoUnitTypes.IGeoUnit;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type GeoUnitNameVersionKey = keyof IGeoUnitNameVersion;

export type GeoUnitNameVersionRelationKey = (typeof GEO_UNIT_NAME_VERSION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IGeoUnitNameVersionReadonlyFields = B.IBaseReadonlyFields;

export type IGeoUnitNameVersionContextualFields = never;

export type IGeoUnitNameVersionSensitiveFields = never;

export type IGeoUnitNameVersionTransitionFields = never;

export type IGeoUnitNameVersionImmutableFields =
  | IGeoUnitNameVersionReadonlyFields
  | IGeoUnitNameVersionContextualFields
  | IGeoUnitNameVersionSensitiveFields
  | IGeoUnitNameVersionTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IGeoUnitNameVersionCreatable = Omit<IGeoUnitNameVersion, IGeoUnitNameVersionImmutableFields | GeoUnitNameVersionRelationKey>;

export type IGeoUnitNameVersionSystemWritable = Omit<IGeoUnitNameVersion, B.IBaseReadonlyFields | GeoUnitNameVersionRelationKey>;

export type IGeoUnitNameVersionUpdatable = Partial<Omit<IGeoUnitNameVersion, IGeoUnitNameVersionImmutableFields | GeoUnitNameVersionRelationKey>>;

export interface IGeoUnitNameVersionTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type GeoUnitNameVersionSortableField = (typeof GEO_UNIT_NAME_VERSION_SORTABLE_FIELDS)[number];

export type GeoUnitNameVersionSearchableField = (typeof GEO_UNIT_NAME_VERSION_SEARCHABLE_FIELDS)[number];

export type GeoUnitNameVersionFilterableField = (typeof GEO_UNIT_NAME_VERSION_FILTERABLE_FIELDS)[number];

export type GeoUnitNameVersionDateRangeField = (typeof GEO_UNIT_NAME_VERSION_DATE_RANGE_FIELDS)[number];

export type GeoUnitNameVersionSelectableField = (typeof GEO_UNIT_NAME_VERSION_SELECTABLE_FIELDS)[number];

export type GeoUnitNameVersionDefaultSelectField = (typeof GEO_UNIT_NAME_VERSION_DEFAULT_SELECT_FIELDS)[number];

export type GeoUnitNameVersionEditableField = (typeof GEO_UNIT_NAME_VERSION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IGeoUnitNameVersionAsOneRelationConfig = Q.IOneRelationConfig<'geoUnitNameVersion', GeoUnitNameVersionSelectableField>;

export type IGeoUnitNameVersionAsManyRelationConfig = Q.IManyRelationConfig<'geoUnitNameVersions', GeoUnitNameVersionSelectableField, GeoUnitNameVersionSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IGeoUnitNameVersionAsOneRelationQuery = Q.IAsOneRelationQuery<IGeoUnitNameVersion, GeoUnitNameVersionSelectableField>;

export type IGeoUnitNameVersionAsManyRelationQuery = Q.IAsManyRelationQuery<IGeoUnitNameVersion, GeoUnitNameVersionSelectableField, GeoUnitNameVersionSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IGeoUnitNameVersionRelationMap extends Record<GeoUnitNameVersionRelationKey, unknown> {
  geoUnit: GeoUnitTypes.IGeoUnitAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IGeoUnitNameVersionRelationQueries = Q.IBaseRelationQueries<IGeoUnitNameVersion, GeoUnitNameVersionRelationKey, IGeoUnitNameVersionRelationMap>;

export type IGeoUnitNameVersionItemQuery = Q.IBaseItemQuery<
  IGeoUnitNameVersion,
  GeoUnitNameVersionRelationKey,
  GeoUnitNameVersionSelectableField,
  GeoUnitNameVersionRelationKey,
  GeoUnitNameVersionSelectableField,
  IGeoUnitNameVersionRelationMap,
  IGeoUnitNameVersionRelationQueries
>;

export type IGeoUnitNameVersionListQuery = Q.IBaseListQuery<
  IGeoUnitNameVersion,
  GeoUnitNameVersionRelationKey,
  GeoUnitNameVersionSelectableField,
  GeoUnitNameVersionSortableField,
  GeoUnitNameVersionRelationKey,
  GeoUnitNameVersionSelectableField,
  GeoUnitNameVersionSortableField,
  GeoUnitNameVersionDateRangeField,
  GeoUnitNameVersionFilterableField,
  IGeoUnitNameVersionRelationMap,
  IGeoUnitNameVersionRelationQueries,
  IGeoUnitNameVersionItemQuery
>;