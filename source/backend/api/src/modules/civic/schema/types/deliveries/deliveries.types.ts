// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ContractsTypes from "#/modules/civic/schema/types/contracts/contracts.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  DELIVERIES_RELATION_KEYS,
  DELIVERIES_SORTABLE_FIELDS,
  DELIVERIES_SEARCHABLE_FIELDS,
  DELIVERIES_FILTERABLE_FIELDS,
  DELIVERIES_DATE_RANGE_FIELDS,
  DELIVERIES_SELECTABLE_FIELDS,
  DELIVERIES_DEFAULT_SELECT_FIELDS,
  DELIVERIES_EDITABLE_FIELDS,
} from "./deliveries.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One dated deliverable or milestone under a contract, optionally scoped to a geographic unit. */
export interface IDeliveries extends B.IBase {
  amountMinorUnits: number | null;
  code: string;
  contractId: string;
  currencyId: string | null;
  deliveredOn: Date | null;
  deliveryKindId: string;
  sourceCitationId: string | null;
  unitFeatureId: string | null;
  readonly contract?: ContractsTypes.IContracts;
  readonly currency?: ValueTypes.IValue;
  readonly deliveryKind?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly unitFeature?: FeaturesTypes.IFeatures;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type DeliveriesKey = keyof IDeliveries;

export type DeliveriesRelationKey = (typeof DELIVERIES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IDeliveriesReadonlyFields = B.IBaseReadonlyFields;

export type IDeliveriesContextualFields = never;

export type IDeliveriesSensitiveFields = never;

export type IDeliveriesTransitionFields = never;

export type IDeliveriesImmutableFields =
  | IDeliveriesReadonlyFields
  | IDeliveriesContextualFields
  | IDeliveriesSensitiveFields
  | IDeliveriesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IDeliveriesCreatable = Omit<
  IDeliveries,
  IDeliveriesImmutableFields | DeliveriesRelationKey
>;

export type IDeliveriesSystemWritable = Omit<
  IDeliveries,
  B.IBaseReadonlyFields | DeliveriesRelationKey
>;

export type IDeliveriesUpdatable = Partial<
  Omit<IDeliveries, IDeliveriesImmutableFields | DeliveriesRelationKey>
>;

export interface IDeliveriesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type DeliveriesSortableField = (typeof DELIVERIES_SORTABLE_FIELDS)[number];

export type DeliveriesSearchableField = (typeof DELIVERIES_SEARCHABLE_FIELDS)[number];

export type DeliveriesFilterableField = (typeof DELIVERIES_FILTERABLE_FIELDS)[number];

export type DeliveriesDateRangeField = (typeof DELIVERIES_DATE_RANGE_FIELDS)[number];

export type DeliveriesSelectableField = (typeof DELIVERIES_SELECTABLE_FIELDS)[number];

export type DeliveriesDefaultSelectField = (typeof DELIVERIES_DEFAULT_SELECT_FIELDS)[number];

export type DeliveriesEditableField = (typeof DELIVERIES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IDeliveriesAsOneRelationConfig = Q.IOneRelationConfig<
  "deliveries",
  DeliveriesSelectableField
>;

export type IDeliveriesAsManyRelationConfig = Q.IManyRelationConfig<
  "deliveries",
  DeliveriesSelectableField,
  DeliveriesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IDeliveriesAsOneRelationQuery = Q.IAsOneRelationQuery<
  IDeliveries,
  DeliveriesSelectableField
>;

export type IDeliveriesAsManyRelationQuery = Q.IAsManyRelationQuery<
  IDeliveries,
  DeliveriesSelectableField,
  DeliveriesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IDeliveriesRelationMap extends Record<DeliveriesRelationKey, unknown> {
  contract: ContractsTypes.IContractsAsOneRelationQuery;
  currency: ValueTypes.IValueAsOneRelationQuery;
  deliveryKind: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  unitFeature: FeaturesTypes.IFeaturesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IDeliveriesRelationQueries = Q.IBaseRelationQueries<
  IDeliveries,
  DeliveriesRelationKey,
  IDeliveriesRelationMap
>;

export type IDeliveriesItemQuery = Q.IBaseItemQuery<
  IDeliveries,
  DeliveriesRelationKey,
  DeliveriesSelectableField,
  DeliveriesRelationKey,
  DeliveriesSelectableField,
  IDeliveriesRelationMap,
  IDeliveriesRelationQueries
>;

export type IDeliveriesListQuery = Q.IBaseListQuery<
  IDeliveries,
  DeliveriesRelationKey,
  DeliveriesSelectableField,
  DeliveriesSortableField,
  DeliveriesRelationKey,
  DeliveriesSelectableField,
  DeliveriesSortableField,
  DeliveriesDateRangeField,
  DeliveriesFilterableField,
  IDeliveriesRelationMap,
  IDeliveriesRelationQueries,
  IDeliveriesItemQuery
>;
