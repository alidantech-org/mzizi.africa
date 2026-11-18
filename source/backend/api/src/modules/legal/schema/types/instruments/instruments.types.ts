// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  INSTRUMENTS_RELATION_KEYS,
  INSTRUMENTS_SORTABLE_FIELDS,
  INSTRUMENTS_SEARCHABLE_FIELDS,
  INSTRUMENTS_FILTERABLE_FIELDS,
  INSTRUMENTS_DATE_RANGE_FIELDS,
  INSTRUMENTS_SELECTABLE_FIELDS,
  INSTRUMENTS_DEFAULT_SELECT_FIELDS,
  INSTRUMENTS_EDITABLE_FIELDS,
} from "./instruments.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Stable instrument identity, independent of its names, editions, downloads and languages. */
export interface IInstruments extends B.IBase {
  code: string;
  enactedOn: Date | null;
  issuingEntityId: string | null;
  issuingUnitId: string | null;
  kindId: string;
  publishedOn: Date | null;
  statusId: string | null;
  readonly issuingEntity?: EntitiesTypes.IEntities;
  readonly issuingUnit?: FeaturesTypes.IFeatures;
  readonly kind?: ValueTypes.IValue;
  readonly status?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type InstrumentsKey = keyof IInstruments;

export type InstrumentsRelationKey = (typeof INSTRUMENTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IInstrumentsReadonlyFields = B.IBaseReadonlyFields;

export type IInstrumentsContextualFields = never;

export type IInstrumentsSensitiveFields = never;

export type IInstrumentsTransitionFields = never;

export type IInstrumentsImmutableFields =
  | IInstrumentsReadonlyFields
  | IInstrumentsContextualFields
  | IInstrumentsSensitiveFields
  | IInstrumentsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IInstrumentsCreatable = Omit<
  IInstruments,
  IInstrumentsImmutableFields | InstrumentsRelationKey
>;

export type IInstrumentsSystemWritable = Omit<
  IInstruments,
  B.IBaseReadonlyFields | InstrumentsRelationKey
>;

export type IInstrumentsUpdatable = Partial<
  Omit<IInstruments, IInstrumentsImmutableFields | InstrumentsRelationKey>
>;

export interface IInstrumentsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type InstrumentsSortableField = (typeof INSTRUMENTS_SORTABLE_FIELDS)[number];

export type InstrumentsSearchableField = (typeof INSTRUMENTS_SEARCHABLE_FIELDS)[number];

export type InstrumentsFilterableField = (typeof INSTRUMENTS_FILTERABLE_FIELDS)[number];

export type InstrumentsDateRangeField = (typeof INSTRUMENTS_DATE_RANGE_FIELDS)[number];

export type InstrumentsSelectableField = (typeof INSTRUMENTS_SELECTABLE_FIELDS)[number];

export type InstrumentsDefaultSelectField = (typeof INSTRUMENTS_DEFAULT_SELECT_FIELDS)[number];

export type InstrumentsEditableField = (typeof INSTRUMENTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IInstrumentsAsOneRelationConfig = Q.IOneRelationConfig<
  "instruments",
  InstrumentsSelectableField
>;

export type IInstrumentsAsManyRelationConfig = Q.IManyRelationConfig<
  "instruments",
  InstrumentsSelectableField,
  InstrumentsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IInstrumentsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IInstruments,
  InstrumentsSelectableField
>;

export type IInstrumentsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IInstruments,
  InstrumentsSelectableField,
  InstrumentsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IInstrumentsRelationMap extends Record<InstrumentsRelationKey, unknown> {
  issuingEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  issuingUnit: FeaturesTypes.IFeaturesAsOneRelationQuery;
  kind: ValueTypes.IValueAsOneRelationQuery;
  status: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IInstrumentsRelationQueries = Q.IBaseRelationQueries<
  IInstruments,
  InstrumentsRelationKey,
  IInstrumentsRelationMap
>;

export type IInstrumentsItemQuery = Q.IBaseItemQuery<
  IInstruments,
  InstrumentsRelationKey,
  InstrumentsSelectableField,
  InstrumentsRelationKey,
  InstrumentsSelectableField,
  IInstrumentsRelationMap,
  IInstrumentsRelationQueries
>;

export type IInstrumentsListQuery = Q.IBaseListQuery<
  IInstruments,
  InstrumentsRelationKey,
  InstrumentsSelectableField,
  InstrumentsSortableField,
  InstrumentsRelationKey,
  InstrumentsSelectableField,
  InstrumentsSortableField,
  InstrumentsDateRangeField,
  InstrumentsFilterableField,
  IInstrumentsRelationMap,
  IInstrumentsRelationQueries,
  IInstrumentsItemQuery
>;
