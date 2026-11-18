// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as HoldersTypes from "#/modules/governance/schema/types/holders/holders.types";
import type * as MotionsTypes from "#/modules/governance/schema/types/motions/motions.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  VOTES_RELATION_KEYS,
  VOTES_SORTABLE_FIELDS,
  VOTES_SEARCHABLE_FIELDS,
  VOTES_FILTERABLE_FIELDS,
  VOTES_DATE_RANGE_FIELDS,
  VOTES_SELECTABLE_FIELDS,
  VOTES_DEFAULT_SELECT_FIELDS,
  VOTES_EDITABLE_FIELDS,
} from "./votes.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One office holder's recorded position on one motion (a division), including being absent. */
export interface IVotes extends B.IBase {
  holderId: string;
  motionId: string;
  positionId: string;
  sourceCitationId: string | null;
  readonly holder?: HoldersTypes.IHolders;
  readonly motion?: MotionsTypes.IMotions;
  readonly position?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type VotesKey = keyof IVotes;

export type VotesRelationKey = (typeof VOTES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IVotesReadonlyFields = B.IBaseReadonlyFields;

export type IVotesContextualFields = never;

export type IVotesSensitiveFields = never;

export type IVotesTransitionFields = never;

export type IVotesImmutableFields =
  IVotesReadonlyFields | IVotesContextualFields | IVotesSensitiveFields | IVotesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IVotesCreatable = Omit<IVotes, IVotesImmutableFields | VotesRelationKey>;

export type IVotesSystemWritable = Omit<IVotes, B.IBaseReadonlyFields | VotesRelationKey>;

export type IVotesUpdatable = Partial<Omit<IVotes, IVotesImmutableFields | VotesRelationKey>>;

export interface IVotesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type VotesSortableField = (typeof VOTES_SORTABLE_FIELDS)[number];

export type VotesSearchableField = (typeof VOTES_SEARCHABLE_FIELDS)[number];

export type VotesFilterableField = (typeof VOTES_FILTERABLE_FIELDS)[number];

export type VotesDateRangeField = (typeof VOTES_DATE_RANGE_FIELDS)[number];

export type VotesSelectableField = (typeof VOTES_SELECTABLE_FIELDS)[number];

export type VotesDefaultSelectField = (typeof VOTES_DEFAULT_SELECT_FIELDS)[number];

export type VotesEditableField = (typeof VOTES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IVotesAsOneRelationConfig = Q.IOneRelationConfig<"votes", VotesSelectableField>;

export type IVotesAsManyRelationConfig = Q.IManyRelationConfig<
  "votes",
  VotesSelectableField,
  VotesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IVotesAsOneRelationQuery = Q.IAsOneRelationQuery<IVotes, VotesSelectableField>;

export type IVotesAsManyRelationQuery = Q.IAsManyRelationQuery<
  IVotes,
  VotesSelectableField,
  VotesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IVotesRelationMap extends Record<VotesRelationKey, unknown> {
  holder: HoldersTypes.IHoldersAsOneRelationQuery;
  motion: MotionsTypes.IMotionsAsOneRelationQuery;
  position: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IVotesRelationQueries = Q.IBaseRelationQueries<
  IVotes,
  VotesRelationKey,
  IVotesRelationMap
>;

export type IVotesItemQuery = Q.IBaseItemQuery<
  IVotes,
  VotesRelationKey,
  VotesSelectableField,
  VotesRelationKey,
  VotesSelectableField,
  IVotesRelationMap,
  IVotesRelationQueries
>;

export type IVotesListQuery = Q.IBaseListQuery<
  IVotes,
  VotesRelationKey,
  VotesSelectableField,
  VotesSortableField,
  VotesRelationKey,
  VotesSelectableField,
  VotesSortableField,
  VotesDateRangeField,
  VotesFilterableField,
  IVotesRelationMap,
  IVotesRelationQueries,
  IVotesItemQuery
>;
