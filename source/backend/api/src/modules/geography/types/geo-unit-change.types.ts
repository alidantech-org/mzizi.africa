// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { ChangeKind } from '#/types/geography/change-kind.enum';
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
  GEO_UNIT_CHANGE_RELATION_KEYS,
  GEO_UNIT_CHANGE_SORTABLE_FIELDS,
  GEO_UNIT_CHANGE_SEARCHABLE_FIELDS,
  GEO_UNIT_CHANGE_FILTERABLE_FIELDS,
  GEO_UNIT_CHANGE_DATE_RANGE_FIELDS,
  GEO_UNIT_CHANGE_SELECTABLE_FIELDS,
  GEO_UNIT_CHANGE_DEFAULT_SELECT_FIELDS,
  GEO_UNIT_CHANGE_EDITABLE_FIELDS
} from './geo-unit-change.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Geo Unit Change */
export interface IGeoUnitChange extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  confidence: number | null;
  isCurrent: boolean;
  kind: ChangeKind;
  licence: string | null;
  method: ProvenanceMethod;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUnitId: string;
  sourceUrl: string | null;
  targetUnitId: string;
  toolOrModel: string | null;
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

export type GeoUnitChangeKey = keyof IGeoUnitChange;

export type GeoUnitChangeRelationKey = (typeof GEO_UNIT_CHANGE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IGeoUnitChangeReadonlyFields = B.IBaseReadonlyFields;

export type IGeoUnitChangeContextualFields = never;

export type IGeoUnitChangeSensitiveFields = never;

export type IGeoUnitChangeTransitionFields = never;

export type IGeoUnitChangeImmutableFields =
  | IGeoUnitChangeReadonlyFields
  | IGeoUnitChangeContextualFields
  | IGeoUnitChangeSensitiveFields
  | IGeoUnitChangeTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IGeoUnitChangeCreatable = Omit<IGeoUnitChange, IGeoUnitChangeImmutableFields | GeoUnitChangeRelationKey>;

export type IGeoUnitChangeSystemWritable = Omit<IGeoUnitChange, B.IBaseReadonlyFields | GeoUnitChangeRelationKey>;

export type IGeoUnitChangeUpdatable = Partial<Omit<IGeoUnitChange, IGeoUnitChangeImmutableFields | GeoUnitChangeRelationKey>>;

export interface IGeoUnitChangeTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type GeoUnitChangeSortableField = (typeof GEO_UNIT_CHANGE_SORTABLE_FIELDS)[number];

export type GeoUnitChangeSearchableField = (typeof GEO_UNIT_CHANGE_SEARCHABLE_FIELDS)[number];

export type GeoUnitChangeFilterableField = (typeof GEO_UNIT_CHANGE_FILTERABLE_FIELDS)[number];

export type GeoUnitChangeDateRangeField = (typeof GEO_UNIT_CHANGE_DATE_RANGE_FIELDS)[number];

export type GeoUnitChangeSelectableField = (typeof GEO_UNIT_CHANGE_SELECTABLE_FIELDS)[number];

export type GeoUnitChangeDefaultSelectField = (typeof GEO_UNIT_CHANGE_DEFAULT_SELECT_FIELDS)[number];

export type GeoUnitChangeEditableField = (typeof GEO_UNIT_CHANGE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IGeoUnitChangeAsOneRelationConfig = Q.IOneRelationConfig<'geoUnitChange', GeoUnitChangeSelectableField>;

export type IGeoUnitChangeAsManyRelationConfig = Q.IManyRelationConfig<'geoUnitChanges', GeoUnitChangeSelectableField, GeoUnitChangeSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IGeoUnitChangeAsOneRelationQuery = Q.IAsOneRelationQuery<IGeoUnitChange, GeoUnitChangeSelectableField>;

export type IGeoUnitChangeAsManyRelationQuery = Q.IAsManyRelationQuery<IGeoUnitChange, GeoUnitChangeSelectableField, GeoUnitChangeSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IGeoUnitChangeRelationMap extends Record<GeoUnitChangeRelationKey, unknown> {
  geoUnit: GeoUnitTypes.IGeoUnitAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IGeoUnitChangeRelationQueries = Q.IBaseRelationQueries<IGeoUnitChange, GeoUnitChangeRelationKey, IGeoUnitChangeRelationMap>;

export type IGeoUnitChangeItemQuery = Q.IBaseItemQuery<
  IGeoUnitChange,
  GeoUnitChangeRelationKey,
  GeoUnitChangeSelectableField,
  GeoUnitChangeRelationKey,
  GeoUnitChangeSelectableField,
  IGeoUnitChangeRelationMap,
  IGeoUnitChangeRelationQueries
>;

export type IGeoUnitChangeListQuery = Q.IBaseListQuery<
  IGeoUnitChange,
  GeoUnitChangeRelationKey,
  GeoUnitChangeSelectableField,
  GeoUnitChangeSortableField,
  GeoUnitChangeRelationKey,
  GeoUnitChangeSelectableField,
  GeoUnitChangeSortableField,
  GeoUnitChangeDateRangeField,
  GeoUnitChangeFilterableField,
  IGeoUnitChangeRelationMap,
  IGeoUnitChangeRelationQueries,
  IGeoUnitChangeItemQuery
>;