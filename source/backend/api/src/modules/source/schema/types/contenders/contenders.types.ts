// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";
import type * as DisputesTypes from "#/modules/source/schema/types/disputes/disputes.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  CONTENDERS_RELATION_KEYS,
  CONTENDERS_SORTABLE_FIELDS,
  CONTENDERS_SEARCHABLE_FIELDS,
  CONTENDERS_FILTERABLE_FIELDS,
  CONTENDERS_DATE_RANGE_FIELDS,
  CONTENDERS_SELECTABLE_FIELDS,
  CONTENDERS_DEFAULT_SELECT_FIELDS,
  CONTENDERS_EDITABLE_FIELDS,
} from "./contenders.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One side of a dispute: a citation and the claim it supports. */
export interface IContenders extends B.IBase {
  citationId: string;
  claim: string;
  disputeId: string;
  isPreferred: boolean;
  position: number | null;
  readonly citation?: CitationsTypes.ICitations;
  readonly dispute?: DisputesTypes.IDisputes;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ContendersKey = keyof IContenders;

export type ContendersRelationKey = (typeof CONTENDERS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IContendersReadonlyFields = B.IBaseReadonlyFields;

export type IContendersContextualFields = never;

export type IContendersSensitiveFields = never;

export type IContendersTransitionFields = never;

export type IContendersImmutableFields =
  | IContendersReadonlyFields
  | IContendersContextualFields
  | IContendersSensitiveFields
  | IContendersTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IContendersCreatable = Omit<
  IContenders,
  IContendersImmutableFields | ContendersRelationKey
>;

export type IContendersSystemWritable = Omit<
  IContenders,
  B.IBaseReadonlyFields | ContendersRelationKey
>;

export type IContendersUpdatable = Partial<
  Omit<IContenders, IContendersImmutableFields | ContendersRelationKey>
>;

export interface IContendersTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ContendersSortableField = (typeof CONTENDERS_SORTABLE_FIELDS)[number];

export type ContendersSearchableField = (typeof CONTENDERS_SEARCHABLE_FIELDS)[number];

export type ContendersFilterableField = (typeof CONTENDERS_FILTERABLE_FIELDS)[number];

export type ContendersDateRangeField = (typeof CONTENDERS_DATE_RANGE_FIELDS)[number];

export type ContendersSelectableField = (typeof CONTENDERS_SELECTABLE_FIELDS)[number];

export type ContendersDefaultSelectField = (typeof CONTENDERS_DEFAULT_SELECT_FIELDS)[number];

export type ContendersEditableField = (typeof CONTENDERS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IContendersAsOneRelationConfig = Q.IOneRelationConfig<
  "contenders",
  ContendersSelectableField
>;

export type IContendersAsManyRelationConfig = Q.IManyRelationConfig<
  "contenders",
  ContendersSelectableField,
  ContendersSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IContendersAsOneRelationQuery = Q.IAsOneRelationQuery<
  IContenders,
  ContendersSelectableField
>;

export type IContendersAsManyRelationQuery = Q.IAsManyRelationQuery<
  IContenders,
  ContendersSelectableField,
  ContendersSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IContendersRelationMap extends Record<ContendersRelationKey, unknown> {
  citation: CitationsTypes.ICitationsAsOneRelationQuery;
  dispute: DisputesTypes.IDisputesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IContendersRelationQueries = Q.IBaseRelationQueries<
  IContenders,
  ContendersRelationKey,
  IContendersRelationMap
>;

export type IContendersItemQuery = Q.IBaseItemQuery<
  IContenders,
  ContendersRelationKey,
  ContendersSelectableField,
  ContendersRelationKey,
  ContendersSelectableField,
  IContendersRelationMap,
  IContendersRelationQueries
>;

export type IContendersListQuery = Q.IBaseListQuery<
  IContenders,
  ContendersRelationKey,
  ContendersSelectableField,
  ContendersSortableField,
  ContendersRelationKey,
  ContendersSelectableField,
  ContendersSortableField,
  ContendersDateRangeField,
  ContendersFilterableField,
  IContendersRelationMap,
  IContendersRelationQueries,
  IContendersItemQuery
>;
