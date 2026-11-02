// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';
import type { Granularity } from '#/types/statistics/granularity.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PERIOD_RELATION_KEYS,
  PERIOD_SORTABLE_FIELDS,
  PERIOD_SEARCHABLE_FIELDS,
  PERIOD_FILTERABLE_FIELDS,
  PERIOD_DATE_RANGE_FIELDS,
  PERIOD_SELECTABLE_FIELDS,
  PERIOD_DEFAULT_SELECT_FIELDS,
  PERIOD_EDITABLE_FIELDS
} from './period.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Period */
export interface IPeriod extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  code: string;
  confidence: number | null;
  endsOn: Date;
  granularity: Granularity;
  isCurrent: boolean;
  licence: string | null;
  method: ProvenanceMethod;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  startsOn: Date;
  toolOrModel: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PeriodKey = keyof IPeriod;

export type PeriodRelationKey = (typeof PERIOD_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPeriodReadonlyFields = B.IBaseReadonlyFields;

export type IPeriodContextualFields = never;

export type IPeriodSensitiveFields = never;

export type IPeriodTransitionFields = never;

export type IPeriodImmutableFields =
  | IPeriodReadonlyFields
  | IPeriodContextualFields
  | IPeriodSensitiveFields
  | IPeriodTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPeriodCreatable = Omit<IPeriod, IPeriodImmutableFields | PeriodRelationKey>;

export type IPeriodSystemWritable = Omit<IPeriod, B.IBaseReadonlyFields | PeriodRelationKey>;

export type IPeriodUpdatable = Partial<Omit<IPeriod, IPeriodImmutableFields | PeriodRelationKey>>;

export interface IPeriodTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PeriodSortableField = (typeof PERIOD_SORTABLE_FIELDS)[number];

export type PeriodSearchableField = (typeof PERIOD_SEARCHABLE_FIELDS)[number];

export type PeriodFilterableField = (typeof PERIOD_FILTERABLE_FIELDS)[number];

export type PeriodDateRangeField = (typeof PERIOD_DATE_RANGE_FIELDS)[number];

export type PeriodSelectableField = (typeof PERIOD_SELECTABLE_FIELDS)[number];

export type PeriodDefaultSelectField = (typeof PERIOD_DEFAULT_SELECT_FIELDS)[number];

export type PeriodEditableField = (typeof PERIOD_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPeriodAsOneRelationConfig = Q.IOneRelationConfig<'period', PeriodSelectableField>;

export type IPeriodAsManyRelationConfig = Q.IManyRelationConfig<'periods', PeriodSelectableField, PeriodSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPeriodAsOneRelationQuery = Q.IAsOneRelationQuery<IPeriod, PeriodSelectableField>;

export type IPeriodAsManyRelationQuery = Q.IAsManyRelationQuery<IPeriod, PeriodSelectableField, PeriodSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPeriodRelationMap extends Record<PeriodRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPeriodRelationQueries = Q.IBaseRelationQueries<IPeriod, PeriodRelationKey, IPeriodRelationMap>;

export type IPeriodItemQuery = Q.IBaseItemQuery<
  IPeriod,
  PeriodRelationKey,
  PeriodSelectableField,
  PeriodRelationKey,
  PeriodSelectableField,
  IPeriodRelationMap,
  IPeriodRelationQueries
>;

export type IPeriodListQuery = Q.IBaseListQuery<
  IPeriod,
  PeriodRelationKey,
  PeriodSelectableField,
  PeriodSortableField,
  PeriodRelationKey,
  PeriodSelectableField,
  PeriodSortableField,
  PeriodDateRangeField,
  PeriodFilterableField,
  IPeriodRelationMap,
  IPeriodRelationQueries,
  IPeriodItemQuery
>;