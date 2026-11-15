// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PUBLICATION_RECEIPTS_RELATION_KEYS,
  PUBLICATION_RECEIPTS_SORTABLE_FIELDS,
  PUBLICATION_RECEIPTS_SEARCHABLE_FIELDS,
  PUBLICATION_RECEIPTS_FILTERABLE_FIELDS,
  PUBLICATION_RECEIPTS_DATE_RANGE_FIELDS,
  PUBLICATION_RECEIPTS_SELECTABLE_FIELDS,
  PUBLICATION_RECEIPTS_DEFAULT_SELECT_FIELDS,
  PUBLICATION_RECEIPTS_EDITABLE_FIELDS,
} from "./publication-receipts.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Immutable Main acknowledgement committed atomically with accepted records and provenance. Same-key different-hash retries must conflict. */
export interface IPublicationReceipts extends B.IBase {
  actorSnapshot: string;
  contractVersion: string;
  idempotencyKey: string;
  payloadHash: string;
  publicationRefId: string;
  publishedAt: Date;
  requestHash: string;
  resultManifest: string;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PublicationReceiptsKey = keyof IPublicationReceipts;

export type PublicationReceiptsRelationKey = (typeof PUBLICATION_RECEIPTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPublicationReceiptsReadonlyFields = B.IBaseReadonlyFields;

export type IPublicationReceiptsContextualFields = never;

export type IPublicationReceiptsSensitiveFields = never;

export type IPublicationReceiptsTransitionFields = never;

export type IPublicationReceiptsImmutableFields =
  | IPublicationReceiptsReadonlyFields
  | IPublicationReceiptsContextualFields
  | IPublicationReceiptsSensitiveFields
  | IPublicationReceiptsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPublicationReceiptsCreatable = Omit<
  IPublicationReceipts,
  IPublicationReceiptsImmutableFields | PublicationReceiptsRelationKey
>;

export type IPublicationReceiptsSystemWritable = Omit<
  IPublicationReceipts,
  B.IBaseReadonlyFields | PublicationReceiptsRelationKey
>;

export type IPublicationReceiptsUpdatable = Partial<
  Omit<IPublicationReceipts, IPublicationReceiptsImmutableFields | PublicationReceiptsRelationKey>
>;

export interface IPublicationReceiptsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PublicationReceiptsSortableField =
  (typeof PUBLICATION_RECEIPTS_SORTABLE_FIELDS)[number];

export type PublicationReceiptsSearchableField =
  (typeof PUBLICATION_RECEIPTS_SEARCHABLE_FIELDS)[number];

export type PublicationReceiptsFilterableField =
  (typeof PUBLICATION_RECEIPTS_FILTERABLE_FIELDS)[number];

export type PublicationReceiptsDateRangeField =
  (typeof PUBLICATION_RECEIPTS_DATE_RANGE_FIELDS)[number];

export type PublicationReceiptsSelectableField =
  (typeof PUBLICATION_RECEIPTS_SELECTABLE_FIELDS)[number];

export type PublicationReceiptsDefaultSelectField =
  (typeof PUBLICATION_RECEIPTS_DEFAULT_SELECT_FIELDS)[number];

export type PublicationReceiptsEditableField =
  (typeof PUBLICATION_RECEIPTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPublicationReceiptsAsOneRelationConfig = Q.IOneRelationConfig<
  "publicationReceipts",
  PublicationReceiptsSelectableField
>;

export type IPublicationReceiptsAsManyRelationConfig = Q.IManyRelationConfig<
  "publicationReceipts",
  PublicationReceiptsSelectableField,
  PublicationReceiptsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPublicationReceiptsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IPublicationReceipts,
  PublicationReceiptsSelectableField
>;

export type IPublicationReceiptsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IPublicationReceipts,
  PublicationReceiptsSelectableField,
  PublicationReceiptsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPublicationReceiptsRelationMap extends Record<
  PublicationReceiptsRelationKey,
  unknown
> {}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPublicationReceiptsRelationQueries = Q.IBaseRelationQueries<
  IPublicationReceipts,
  PublicationReceiptsRelationKey,
  IPublicationReceiptsRelationMap
>;

export type IPublicationReceiptsItemQuery = Q.IBaseItemQuery<
  IPublicationReceipts,
  PublicationReceiptsRelationKey,
  PublicationReceiptsSelectableField,
  PublicationReceiptsRelationKey,
  PublicationReceiptsSelectableField,
  IPublicationReceiptsRelationMap,
  IPublicationReceiptsRelationQueries
>;

export type IPublicationReceiptsListQuery = Q.IBaseListQuery<
  IPublicationReceipts,
  PublicationReceiptsRelationKey,
  PublicationReceiptsSelectableField,
  PublicationReceiptsSortableField,
  PublicationReceiptsRelationKey,
  PublicationReceiptsSelectableField,
  PublicationReceiptsSortableField,
  PublicationReceiptsDateRangeField,
  PublicationReceiptsFilterableField,
  IPublicationReceiptsRelationMap,
  IPublicationReceiptsRelationQueries,
  IPublicationReceiptsItemQuery
>;
