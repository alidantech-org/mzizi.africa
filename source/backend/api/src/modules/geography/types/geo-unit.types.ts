// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { UnitKind } from '#/types/geography/unit-kind.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { MediaMarker } from '#/types/shared/media-marker.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  GEO_UNIT_RELATION_KEYS,
  GEO_UNIT_SORTABLE_FIELDS,
  GEO_UNIT_SEARCHABLE_FIELDS,
  GEO_UNIT_FILTERABLE_FIELDS,
  GEO_UNIT_DATE_RANGE_FIELDS,
  GEO_UNIT_SELECTABLE_FIELDS,
  GEO_UNIT_DEFAULT_SELECT_FIELDS,
  GEO_UNIT_EDITABLE_FIELDS
} from './geo-unit.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Geo Unit */
export interface IGeoUnit extends B.IBase {
  code: string;
  emblemMarker: MediaMarker | null;
  flagMarker: MediaMarker | null;
  isActive: boolean;
  isCurrent: boolean;
  jurisdictionId: string;
  kind: UnitKind;
  levelId: string;
  name: string;
  parentId: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  wikidataId: string | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type GeoUnitKey = keyof IGeoUnit;

export type GeoUnitRelationKey = (typeof GEO_UNIT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IGeoUnitReadonlyFields = B.IBaseReadonlyFields;

export type IGeoUnitContextualFields = never;

export type IGeoUnitSensitiveFields = never;

export type IGeoUnitTransitionFields = never;

export type IGeoUnitImmutableFields =
  | IGeoUnitReadonlyFields
  | IGeoUnitContextualFields
  | IGeoUnitSensitiveFields
  | IGeoUnitTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IGeoUnitCreatable = Omit<IGeoUnit, IGeoUnitImmutableFields | GeoUnitRelationKey>;

export type IGeoUnitSystemWritable = Omit<IGeoUnit, B.IBaseReadonlyFields | GeoUnitRelationKey>;

export type IGeoUnitUpdatable = Partial<Omit<IGeoUnit, IGeoUnitImmutableFields | GeoUnitRelationKey>>;

export interface IGeoUnitTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type GeoUnitSortableField = (typeof GEO_UNIT_SORTABLE_FIELDS)[number];

export type GeoUnitSearchableField = (typeof GEO_UNIT_SEARCHABLE_FIELDS)[number];

export type GeoUnitFilterableField = (typeof GEO_UNIT_FILTERABLE_FIELDS)[number];

export type GeoUnitDateRangeField = (typeof GEO_UNIT_DATE_RANGE_FIELDS)[number];

export type GeoUnitSelectableField = (typeof GEO_UNIT_SELECTABLE_FIELDS)[number];

export type GeoUnitDefaultSelectField = (typeof GEO_UNIT_DEFAULT_SELECT_FIELDS)[number];

export type GeoUnitEditableField = (typeof GEO_UNIT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IGeoUnitAsOneRelationConfig = Q.IOneRelationConfig<'geoUnit', GeoUnitSelectableField>;

export type IGeoUnitAsManyRelationConfig = Q.IManyRelationConfig<'geoUnits', GeoUnitSelectableField, GeoUnitSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IGeoUnitAsOneRelationQuery = Q.IAsOneRelationQuery<IGeoUnit, GeoUnitSelectableField>;

export type IGeoUnitAsManyRelationQuery = Q.IAsManyRelationQuery<IGeoUnit, GeoUnitSelectableField, GeoUnitSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IGeoUnitRelationMap extends Record<GeoUnitRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IGeoUnitRelationQueries = Q.IBaseRelationQueries<IGeoUnit, GeoUnitRelationKey, IGeoUnitRelationMap>;

export type IGeoUnitItemQuery = Q.IBaseItemQuery<
  IGeoUnit,
  GeoUnitRelationKey,
  GeoUnitSelectableField,
  GeoUnitRelationKey,
  GeoUnitSelectableField,
  IGeoUnitRelationMap,
  IGeoUnitRelationQueries
>;

export type IGeoUnitListQuery = Q.IBaseListQuery<
  IGeoUnit,
  GeoUnitRelationKey,
  GeoUnitSelectableField,
  GeoUnitSortableField,
  GeoUnitRelationKey,
  GeoUnitSelectableField,
  GeoUnitSortableField,
  GeoUnitDateRangeField,
  GeoUnitFilterableField,
  IGeoUnitRelationMap,
  IGeoUnitRelationQueries,
  IGeoUnitItemQuery
>;