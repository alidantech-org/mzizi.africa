// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ObservationTypes from '#/modules/statistics/types/observation.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  OBSERVATION_DIMENSION_RELATION_KEYS,
  OBSERVATION_DIMENSION_SORTABLE_FIELDS,
  OBSERVATION_DIMENSION_SEARCHABLE_FIELDS,
  OBSERVATION_DIMENSION_FILTERABLE_FIELDS,
  OBSERVATION_DIMENSION_DATE_RANGE_FIELDS,
  OBSERVATION_DIMENSION_SELECTABLE_FIELDS,
  OBSERVATION_DIMENSION_DEFAULT_SELECT_FIELDS,
  OBSERVATION_DIMENSION_EDITABLE_FIELDS
} from './observation-dimension.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Observation Dimension */
export interface IObservationDimension extends B.IBase {
  dimensionId: string;
  isCurrent: boolean;
  memberId: string;
  observationId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly observation?: ObservationTypes.IObservation;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ObservationDimensionKey = keyof IObservationDimension;

export type ObservationDimensionRelationKey = (typeof OBSERVATION_DIMENSION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IObservationDimensionReadonlyFields = B.IBaseReadonlyFields;

export type IObservationDimensionContextualFields = never;

export type IObservationDimensionSensitiveFields = never;

export type IObservationDimensionTransitionFields = never;

export type IObservationDimensionImmutableFields =
  | IObservationDimensionReadonlyFields
  | IObservationDimensionContextualFields
  | IObservationDimensionSensitiveFields
  | IObservationDimensionTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IObservationDimensionCreatable = Omit<IObservationDimension, IObservationDimensionImmutableFields | ObservationDimensionRelationKey>;

export type IObservationDimensionSystemWritable = Omit<IObservationDimension, B.IBaseReadonlyFields | ObservationDimensionRelationKey>;

export type IObservationDimensionUpdatable = Partial<Omit<IObservationDimension, IObservationDimensionImmutableFields | ObservationDimensionRelationKey>>;

export interface IObservationDimensionTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ObservationDimensionSortableField = (typeof OBSERVATION_DIMENSION_SORTABLE_FIELDS)[number];

export type ObservationDimensionSearchableField = (typeof OBSERVATION_DIMENSION_SEARCHABLE_FIELDS)[number];

export type ObservationDimensionFilterableField = (typeof OBSERVATION_DIMENSION_FILTERABLE_FIELDS)[number];

export type ObservationDimensionDateRangeField = (typeof OBSERVATION_DIMENSION_DATE_RANGE_FIELDS)[number];

export type ObservationDimensionSelectableField = (typeof OBSERVATION_DIMENSION_SELECTABLE_FIELDS)[number];

export type ObservationDimensionDefaultSelectField = (typeof OBSERVATION_DIMENSION_DEFAULT_SELECT_FIELDS)[number];

export type ObservationDimensionEditableField = (typeof OBSERVATION_DIMENSION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IObservationDimensionAsOneRelationConfig = Q.IOneRelationConfig<'observationDimension', ObservationDimensionSelectableField>;

export type IObservationDimensionAsManyRelationConfig = Q.IManyRelationConfig<'observationDimensions', ObservationDimensionSelectableField, ObservationDimensionSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IObservationDimensionAsOneRelationQuery = Q.IAsOneRelationQuery<IObservationDimension, ObservationDimensionSelectableField>;

export type IObservationDimensionAsManyRelationQuery = Q.IAsManyRelationQuery<IObservationDimension, ObservationDimensionSelectableField, ObservationDimensionSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IObservationDimensionRelationMap extends Record<ObservationDimensionRelationKey, unknown> {
  observation: ObservationTypes.IObservationAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IObservationDimensionRelationQueries = Q.IBaseRelationQueries<IObservationDimension, ObservationDimensionRelationKey, IObservationDimensionRelationMap>;

export type IObservationDimensionItemQuery = Q.IBaseItemQuery<
  IObservationDimension,
  ObservationDimensionRelationKey,
  ObservationDimensionSelectableField,
  ObservationDimensionRelationKey,
  ObservationDimensionSelectableField,
  IObservationDimensionRelationMap,
  IObservationDimensionRelationQueries
>;

export type IObservationDimensionListQuery = Q.IBaseListQuery<
  IObservationDimension,
  ObservationDimensionRelationKey,
  ObservationDimensionSelectableField,
  ObservationDimensionSortableField,
  ObservationDimensionRelationKey,
  ObservationDimensionSelectableField,
  ObservationDimensionSortableField,
  ObservationDimensionDateRangeField,
  ObservationDimensionFilterableField,
  IObservationDimensionRelationMap,
  IObservationDimensionRelationQueries,
  IObservationDimensionItemQuery
>;