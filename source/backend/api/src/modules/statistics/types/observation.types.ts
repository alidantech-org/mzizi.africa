// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ConfidenceLevel } from '#/types/statistics/confidence-level.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as StatisticsTableTypes from '#/modules/statistics/types/statistics-table.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  OBSERVATION_RELATION_KEYS,
  OBSERVATION_SORTABLE_FIELDS,
  OBSERVATION_SEARCHABLE_FIELDS,
  OBSERVATION_FILTERABLE_FIELDS,
  OBSERVATION_DATE_RANGE_FIELDS,
  OBSERVATION_SELECTABLE_FIELDS,
  OBSERVATION_DEFAULT_SELECT_FIELDS,
  OBSERVATION_EDITABLE_FIELDS
} from './observation.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Observation */
export interface IObservation extends B.IBase {
  columnId: string | null;
  confidenceLevel: ConfidenceLevel;
  geoUnitId: string | null;
  indicatorId: string;
  isCurrent: boolean;
  numericValue: number | null;
  periodId: string;
  tableId: string;
  textValue: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly statisticsTable?: StatisticsTableTypes.IStatisticsTable;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ObservationKey = keyof IObservation;

export type ObservationRelationKey = (typeof OBSERVATION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IObservationReadonlyFields = B.IBaseReadonlyFields;

export type IObservationContextualFields = never;

export type IObservationSensitiveFields = never;

export type IObservationTransitionFields = never;

export type IObservationImmutableFields =
  | IObservationReadonlyFields
  | IObservationContextualFields
  | IObservationSensitiveFields
  | IObservationTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IObservationCreatable = Omit<IObservation, IObservationImmutableFields | ObservationRelationKey>;

export type IObservationSystemWritable = Omit<IObservation, B.IBaseReadonlyFields | ObservationRelationKey>;

export type IObservationUpdatable = Partial<Omit<IObservation, IObservationImmutableFields | ObservationRelationKey>>;

export interface IObservationTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ObservationSortableField = (typeof OBSERVATION_SORTABLE_FIELDS)[number];

export type ObservationSearchableField = (typeof OBSERVATION_SEARCHABLE_FIELDS)[number];

export type ObservationFilterableField = (typeof OBSERVATION_FILTERABLE_FIELDS)[number];

export type ObservationDateRangeField = (typeof OBSERVATION_DATE_RANGE_FIELDS)[number];

export type ObservationSelectableField = (typeof OBSERVATION_SELECTABLE_FIELDS)[number];

export type ObservationDefaultSelectField = (typeof OBSERVATION_DEFAULT_SELECT_FIELDS)[number];

export type ObservationEditableField = (typeof OBSERVATION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IObservationAsOneRelationConfig = Q.IOneRelationConfig<'observation', ObservationSelectableField>;

export type IObservationAsManyRelationConfig = Q.IManyRelationConfig<'observations', ObservationSelectableField, ObservationSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IObservationAsOneRelationQuery = Q.IAsOneRelationQuery<IObservation, ObservationSelectableField>;

export type IObservationAsManyRelationQuery = Q.IAsManyRelationQuery<IObservation, ObservationSelectableField, ObservationSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IObservationRelationMap extends Record<ObservationRelationKey, unknown> {
  statisticsTable: StatisticsTableTypes.IStatisticsTableAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IObservationRelationQueries = Q.IBaseRelationQueries<IObservation, ObservationRelationKey, IObservationRelationMap>;

export type IObservationItemQuery = Q.IBaseItemQuery<
  IObservation,
  ObservationRelationKey,
  ObservationSelectableField,
  ObservationRelationKey,
  ObservationSelectableField,
  IObservationRelationMap,
  IObservationRelationQueries
>;

export type IObservationListQuery = Q.IBaseListQuery<
  IObservation,
  ObservationRelationKey,
  ObservationSelectableField,
  ObservationSortableField,
  ObservationRelationKey,
  ObservationSelectableField,
  ObservationSortableField,
  ObservationDateRangeField,
  ObservationFilterableField,
  IObservationRelationMap,
  IObservationRelationQueries,
  IObservationItemQuery
>;