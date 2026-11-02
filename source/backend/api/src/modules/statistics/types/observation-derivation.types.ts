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
  OBSERVATION_DERIVATION_RELATION_KEYS,
  OBSERVATION_DERIVATION_SORTABLE_FIELDS,
  OBSERVATION_DERIVATION_SEARCHABLE_FIELDS,
  OBSERVATION_DERIVATION_FILTERABLE_FIELDS,
  OBSERVATION_DERIVATION_DATE_RANGE_FIELDS,
  OBSERVATION_DERIVATION_SELECTABLE_FIELDS,
  OBSERVATION_DERIVATION_DEFAULT_SELECT_FIELDS,
  OBSERVATION_DERIVATION_EDITABLE_FIELDS
} from './observation-derivation.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Observation Derivation */
export interface IObservationDerivation extends B.IBase {
  computation: string;
  inputObservationId: string;
  inputRole: string | null;
  isCurrent: boolean;
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

export type ObservationDerivationKey = keyof IObservationDerivation;

export type ObservationDerivationRelationKey = (typeof OBSERVATION_DERIVATION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IObservationDerivationReadonlyFields = B.IBaseReadonlyFields;

export type IObservationDerivationContextualFields = never;

export type IObservationDerivationSensitiveFields = never;

export type IObservationDerivationTransitionFields = never;

export type IObservationDerivationImmutableFields =
  | IObservationDerivationReadonlyFields
  | IObservationDerivationContextualFields
  | IObservationDerivationSensitiveFields
  | IObservationDerivationTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IObservationDerivationCreatable = Omit<IObservationDerivation, IObservationDerivationImmutableFields | ObservationDerivationRelationKey>;

export type IObservationDerivationSystemWritable = Omit<IObservationDerivation, B.IBaseReadonlyFields | ObservationDerivationRelationKey>;

export type IObservationDerivationUpdatable = Partial<Omit<IObservationDerivation, IObservationDerivationImmutableFields | ObservationDerivationRelationKey>>;

export interface IObservationDerivationTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ObservationDerivationSortableField = (typeof OBSERVATION_DERIVATION_SORTABLE_FIELDS)[number];

export type ObservationDerivationSearchableField = (typeof OBSERVATION_DERIVATION_SEARCHABLE_FIELDS)[number];

export type ObservationDerivationFilterableField = (typeof OBSERVATION_DERIVATION_FILTERABLE_FIELDS)[number];

export type ObservationDerivationDateRangeField = (typeof OBSERVATION_DERIVATION_DATE_RANGE_FIELDS)[number];

export type ObservationDerivationSelectableField = (typeof OBSERVATION_DERIVATION_SELECTABLE_FIELDS)[number];

export type ObservationDerivationDefaultSelectField = (typeof OBSERVATION_DERIVATION_DEFAULT_SELECT_FIELDS)[number];

export type ObservationDerivationEditableField = (typeof OBSERVATION_DERIVATION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IObservationDerivationAsOneRelationConfig = Q.IOneRelationConfig<'observationDerivation', ObservationDerivationSelectableField>;

export type IObservationDerivationAsManyRelationConfig = Q.IManyRelationConfig<'observationDerivations', ObservationDerivationSelectableField, ObservationDerivationSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IObservationDerivationAsOneRelationQuery = Q.IAsOneRelationQuery<IObservationDerivation, ObservationDerivationSelectableField>;

export type IObservationDerivationAsManyRelationQuery = Q.IAsManyRelationQuery<IObservationDerivation, ObservationDerivationSelectableField, ObservationDerivationSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IObservationDerivationRelationMap extends Record<ObservationDerivationRelationKey, unknown> {
  observation: ObservationTypes.IObservationAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IObservationDerivationRelationQueries = Q.IBaseRelationQueries<IObservationDerivation, ObservationDerivationRelationKey, IObservationDerivationRelationMap>;

export type IObservationDerivationItemQuery = Q.IBaseItemQuery<
  IObservationDerivation,
  ObservationDerivationRelationKey,
  ObservationDerivationSelectableField,
  ObservationDerivationRelationKey,
  ObservationDerivationSelectableField,
  IObservationDerivationRelationMap,
  IObservationDerivationRelationQueries
>;

export type IObservationDerivationListQuery = Q.IBaseListQuery<
  IObservationDerivation,
  ObservationDerivationRelationKey,
  ObservationDerivationSelectableField,
  ObservationDerivationSortableField,
  ObservationDerivationRelationKey,
  ObservationDerivationSelectableField,
  ObservationDerivationSortableField,
  ObservationDerivationDateRangeField,
  ObservationDerivationFilterableField,
  IObservationDerivationRelationMap,
  IObservationDerivationRelationQueries,
  IObservationDerivationItemQuery
>;