// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { BidStatus } from '#/types/procurement/bid-status.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as TenderTypes from '#/modules/procurement/types/tender.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  BID_RELATION_KEYS,
  BID_SORTABLE_FIELDS,
  BID_SEARCHABLE_FIELDS,
  BID_FILTERABLE_FIELDS,
  BID_DATE_RANGE_FIELDS,
  BID_SELECTABLE_FIELDS,
  BID_DEFAULT_SELECT_FIELDS,
  BID_EDITABLE_FIELDS
} from './bid.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Bid */
export interface IBid extends B.IBase {
  amount: number;
  bidderEntityId: string;
  currencyCode: string;
  evaluationNote: string | null;
  isCompliant: boolean | null;
  isCurrent: boolean;
  status: BidStatus;
  submittedOn: Date;
  tenderId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly tender?: TenderTypes.ITender;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type BidKey = keyof IBid;

export type BidRelationKey = (typeof BID_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IBidReadonlyFields = B.IBaseReadonlyFields;

export type IBidContextualFields = never;

export type IBidSensitiveFields = never;

export type IBidTransitionFields = never;

export type IBidImmutableFields =
  | IBidReadonlyFields
  | IBidContextualFields
  | IBidSensitiveFields
  | IBidTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IBidCreatable = Omit<IBid, IBidImmutableFields | BidRelationKey>;

export type IBidSystemWritable = Omit<IBid, B.IBaseReadonlyFields | BidRelationKey>;

export type IBidUpdatable = Partial<Omit<IBid, IBidImmutableFields | BidRelationKey>>;

export interface IBidTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type BidSortableField = (typeof BID_SORTABLE_FIELDS)[number];

export type BidSearchableField = (typeof BID_SEARCHABLE_FIELDS)[number];

export type BidFilterableField = (typeof BID_FILTERABLE_FIELDS)[number];

export type BidDateRangeField = (typeof BID_DATE_RANGE_FIELDS)[number];

export type BidSelectableField = (typeof BID_SELECTABLE_FIELDS)[number];

export type BidDefaultSelectField = (typeof BID_DEFAULT_SELECT_FIELDS)[number];

export type BidEditableField = (typeof BID_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IBidAsOneRelationConfig = Q.IOneRelationConfig<'bid', BidSelectableField>;

export type IBidAsManyRelationConfig = Q.IManyRelationConfig<'bids', BidSelectableField, BidSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IBidAsOneRelationQuery = Q.IAsOneRelationQuery<IBid, BidSelectableField>;

export type IBidAsManyRelationQuery = Q.IAsManyRelationQuery<IBid, BidSelectableField, BidSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IBidRelationMap extends Record<BidRelationKey, unknown> {
  tender: TenderTypes.ITenderAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IBidRelationQueries = Q.IBaseRelationQueries<IBid, BidRelationKey, IBidRelationMap>;

export type IBidItemQuery = Q.IBaseItemQuery<
  IBid,
  BidRelationKey,
  BidSelectableField,
  BidRelationKey,
  BidSelectableField,
  IBidRelationMap,
  IBidRelationQueries
>;

export type IBidListQuery = Q.IBaseListQuery<
  IBid,
  BidRelationKey,
  BidSelectableField,
  BidSortableField,
  BidRelationKey,
  BidSelectableField,
  BidSortableField,
  BidDateRangeField,
  BidFilterableField,
  IBidRelationMap,
  IBidRelationQueries,
  IBidItemQuery
>;