// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as ProcurementsTypes from "#/modules/civic/schema/types/procurements/procurements.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  BIDS_RELATION_KEYS,
  BIDS_SORTABLE_FIELDS,
  BIDS_SEARCHABLE_FIELDS,
  BIDS_FILTERABLE_FIELDS,
  BIDS_DATE_RANGE_FIELDS,
  BIDS_SELECTABLE_FIELDS,
  BIDS_DEFAULT_SELECT_FIELDS,
  BIDS_EDITABLE_FIELDS,
} from "./bids.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One supplier submission to one procurement process, with the reported amount and outcome where known. */
export interface IBids extends B.IBase {
  amountMinorUnits: number | null;
  bidderEntityId: string;
  code: string;
  currencyId: string | null;
  outcomeId: string;
  procurementId: string;
  sourceCitationId: string | null;
  submittedOn: Date | null;
  readonly bidderEntity?: EntitiesTypes.IEntities;
  readonly currency?: ValueTypes.IValue;
  readonly outcome?: ValueTypes.IValue;
  readonly procurement?: ProcurementsTypes.IProcurements;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type BidsKey = keyof IBids;

export type BidsRelationKey = (typeof BIDS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IBidsReadonlyFields = B.IBaseReadonlyFields;

export type IBidsContextualFields = never;

export type IBidsSensitiveFields = never;

export type IBidsTransitionFields = never;

export type IBidsImmutableFields =
  IBidsReadonlyFields | IBidsContextualFields | IBidsSensitiveFields | IBidsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IBidsCreatable = Omit<IBids, IBidsImmutableFields | BidsRelationKey>;

export type IBidsSystemWritable = Omit<IBids, B.IBaseReadonlyFields | BidsRelationKey>;

export type IBidsUpdatable = Partial<Omit<IBids, IBidsImmutableFields | BidsRelationKey>>;

export interface IBidsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type BidsSortableField = (typeof BIDS_SORTABLE_FIELDS)[number];

export type BidsSearchableField = (typeof BIDS_SEARCHABLE_FIELDS)[number];

export type BidsFilterableField = (typeof BIDS_FILTERABLE_FIELDS)[number];

export type BidsDateRangeField = (typeof BIDS_DATE_RANGE_FIELDS)[number];

export type BidsSelectableField = (typeof BIDS_SELECTABLE_FIELDS)[number];

export type BidsDefaultSelectField = (typeof BIDS_DEFAULT_SELECT_FIELDS)[number];

export type BidsEditableField = (typeof BIDS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IBidsAsOneRelationConfig = Q.IOneRelationConfig<"bids", BidsSelectableField>;

export type IBidsAsManyRelationConfig = Q.IManyRelationConfig<
  "bids",
  BidsSelectableField,
  BidsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IBidsAsOneRelationQuery = Q.IAsOneRelationQuery<IBids, BidsSelectableField>;

export type IBidsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IBids,
  BidsSelectableField,
  BidsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IBidsRelationMap extends Record<BidsRelationKey, unknown> {
  bidderEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  currency: ValueTypes.IValueAsOneRelationQuery;
  outcome: ValueTypes.IValueAsOneRelationQuery;
  procurement: ProcurementsTypes.IProcurementsAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IBidsRelationQueries = Q.IBaseRelationQueries<IBids, BidsRelationKey, IBidsRelationMap>;

export type IBidsItemQuery = Q.IBaseItemQuery<
  IBids,
  BidsRelationKey,
  BidsSelectableField,
  BidsRelationKey,
  BidsSelectableField,
  IBidsRelationMap,
  IBidsRelationQueries
>;

export type IBidsListQuery = Q.IBaseListQuery<
  IBids,
  BidsRelationKey,
  BidsSelectableField,
  BidsSortableField,
  BidsRelationKey,
  BidsSelectableField,
  BidsSortableField,
  BidsDateRangeField,
  BidsFilterableField,
  IBidsRelationMap,
  IBidsRelationQueries,
  IBidsItemQuery
>;
