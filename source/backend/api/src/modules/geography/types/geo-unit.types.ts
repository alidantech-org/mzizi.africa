// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { UnitKind } from '#/types/geography/unit-kind.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as JurisdictionTypes from '#/modules/reference/types/jurisdiction.types';
import type * as ClassificationRecordTypes from '#/modules/reference/types/classification-record.types';

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
  artifactChecksum: string | null;
  artifactId: string | null;
  code: string;
  confidence: number | null;
  isActive: boolean;
  isCurrent: boolean;
  jurisdictionId: string;
  kind: UnitKind;
  levelId: string;
  licence: string | null;
  method: ProvenanceMethod;
  name: string;
  parentId: string | null;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  toolOrModel: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly jurisdiction?: JurisdictionTypes.IJurisdiction;
  readonly classificationRecord?: ClassificationRecordTypes.IClassificationRecord;
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
  jurisdiction: JurisdictionTypes.IJurisdictionAsOneRelationQuery;
  classificationRecord: ClassificationRecordTypes.IClassificationRecordAsOneRelationQuery;
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