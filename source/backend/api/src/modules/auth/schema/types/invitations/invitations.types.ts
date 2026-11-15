// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as AccountsTypes from "#/modules/auth/schema/types/accounts/accounts.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  INVITATIONS_RELATION_KEYS,
  INVITATIONS_SORTABLE_FIELDS,
  INVITATIONS_SEARCHABLE_FIELDS,
  INVITATIONS_FILTERABLE_FIELDS,
  INVITATIONS_DATE_RANGE_FIELDS,
  INVITATIONS_SELECTABLE_FIELDS,
  INVITATIONS_DEFAULT_SELECT_FIELDS,
  INVITATIONS_EDITABLE_FIELDS,
} from "./invitations.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Single-use invitation to an institution; only a digest of the token is stored. */
export interface IInvitations extends B.IBase {
  acceptedAccountId: string | null;
  acceptedAt: Date | null;
  expiresAt: Date | null;
  institutionRefId: string;
  intendedEmail: string;
  invitedBy: string;
  revokedAt: Date | null;
  tokenDigest: string;
  readonly acceptedAccount?: AccountsTypes.IAccounts;
  readonly invitedByRelation?: AccountsTypes.IAccounts;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type InvitationsKey = keyof IInvitations;

export type InvitationsRelationKey = (typeof INVITATIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IInvitationsReadonlyFields = B.IBaseReadonlyFields;

export type IInvitationsContextualFields = never;

export type IInvitationsSensitiveFields = never;

export type IInvitationsTransitionFields = never;

export type IInvitationsImmutableFields =
  | IInvitationsReadonlyFields
  | IInvitationsContextualFields
  | IInvitationsSensitiveFields
  | IInvitationsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IInvitationsCreatable = Omit<
  IInvitations,
  IInvitationsImmutableFields | InvitationsRelationKey
>;

export type IInvitationsSystemWritable = Omit<
  IInvitations,
  B.IBaseReadonlyFields | InvitationsRelationKey
>;

export type IInvitationsUpdatable = Partial<
  Omit<IInvitations, IInvitationsImmutableFields | InvitationsRelationKey>
>;

export interface IInvitationsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type InvitationsSortableField = (typeof INVITATIONS_SORTABLE_FIELDS)[number];

export type InvitationsSearchableField = (typeof INVITATIONS_SEARCHABLE_FIELDS)[number];

export type InvitationsFilterableField = (typeof INVITATIONS_FILTERABLE_FIELDS)[number];

export type InvitationsDateRangeField = (typeof INVITATIONS_DATE_RANGE_FIELDS)[number];

export type InvitationsSelectableField = (typeof INVITATIONS_SELECTABLE_FIELDS)[number];

export type InvitationsDefaultSelectField = (typeof INVITATIONS_DEFAULT_SELECT_FIELDS)[number];

export type InvitationsEditableField = (typeof INVITATIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IInvitationsAsOneRelationConfig = Q.IOneRelationConfig<
  "invitations",
  InvitationsSelectableField
>;

export type IInvitationsAsManyRelationConfig = Q.IManyRelationConfig<
  "invitations",
  InvitationsSelectableField,
  InvitationsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IInvitationsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IInvitations,
  InvitationsSelectableField
>;

export type IInvitationsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IInvitations,
  InvitationsSelectableField,
  InvitationsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IInvitationsRelationMap extends Record<InvitationsRelationKey, unknown> {
  acceptedAccount: AccountsTypes.IAccountsAsOneRelationQuery;
  invitedByRelation: AccountsTypes.IAccountsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IInvitationsRelationQueries = Q.IBaseRelationQueries<
  IInvitations,
  InvitationsRelationKey,
  IInvitationsRelationMap
>;

export type IInvitationsItemQuery = Q.IBaseItemQuery<
  IInvitations,
  InvitationsRelationKey,
  InvitationsSelectableField,
  InvitationsRelationKey,
  InvitationsSelectableField,
  IInvitationsRelationMap,
  IInvitationsRelationQueries
>;

export type IInvitationsListQuery = Q.IBaseListQuery<
  IInvitations,
  InvitationsRelationKey,
  InvitationsSelectableField,
  InvitationsSortableField,
  InvitationsRelationKey,
  InvitationsSelectableField,
  InvitationsSortableField,
  InvitationsDateRangeField,
  InvitationsFilterableField,
  IInvitationsRelationMap,
  IInvitationsRelationQueries,
  IInvitationsItemQuery
>;
