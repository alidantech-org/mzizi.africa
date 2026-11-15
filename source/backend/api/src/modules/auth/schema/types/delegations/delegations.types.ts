// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as AccountsTypes from "#/modules/auth/schema/types/accounts/accounts.types";
import type * as ScopesTypes from "#/modules/auth/schema/types/scopes/scopes.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  DELEGATIONS_RELATION_KEYS,
  DELEGATIONS_SORTABLE_FIELDS,
  DELEGATIONS_SEARCHABLE_FIELDS,
  DELEGATIONS_FILTERABLE_FIELDS,
  DELEGATIONS_DATE_RANGE_FIELDS,
  DELEGATIONS_SELECTABLE_FIELDS,
  DELEGATIONS_DEFAULT_SELECT_FIELDS,
  DELEGATIONS_EDITABLE_FIELDS,
} from "./delegations.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Time-limited delegation of scoped access from one account to another. */
export interface IDelegations extends B.IBase {
  delegateAccountId: string;
  delegatorAccountId: string;
  expiresAt: Date | null;
  revokedAt: Date | null;
  revokedBy: string | null;
  scopeId: string;
  startsAt: Date | null;
  readonly delegateAccount?: AccountsTypes.IAccounts;
  readonly delegatorAccount?: AccountsTypes.IAccounts;
  readonly revokedByRelation?: AccountsTypes.IAccounts;
  readonly scope?: ScopesTypes.IScopes;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type DelegationsKey = keyof IDelegations;

export type DelegationsRelationKey = (typeof DELEGATIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IDelegationsReadonlyFields = B.IBaseReadonlyFields;

export type IDelegationsContextualFields = never;

export type IDelegationsSensitiveFields = never;

export type IDelegationsTransitionFields = never;

export type IDelegationsImmutableFields =
  | IDelegationsReadonlyFields
  | IDelegationsContextualFields
  | IDelegationsSensitiveFields
  | IDelegationsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IDelegationsCreatable = Omit<
  IDelegations,
  IDelegationsImmutableFields | DelegationsRelationKey
>;

export type IDelegationsSystemWritable = Omit<
  IDelegations,
  B.IBaseReadonlyFields | DelegationsRelationKey
>;

export type IDelegationsUpdatable = Partial<
  Omit<IDelegations, IDelegationsImmutableFields | DelegationsRelationKey>
>;

export interface IDelegationsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type DelegationsSortableField = (typeof DELEGATIONS_SORTABLE_FIELDS)[number];

export type DelegationsSearchableField = (typeof DELEGATIONS_SEARCHABLE_FIELDS)[number];

export type DelegationsFilterableField = (typeof DELEGATIONS_FILTERABLE_FIELDS)[number];

export type DelegationsDateRangeField = (typeof DELEGATIONS_DATE_RANGE_FIELDS)[number];

export type DelegationsSelectableField = (typeof DELEGATIONS_SELECTABLE_FIELDS)[number];

export type DelegationsDefaultSelectField = (typeof DELEGATIONS_DEFAULT_SELECT_FIELDS)[number];

export type DelegationsEditableField = (typeof DELEGATIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IDelegationsAsOneRelationConfig = Q.IOneRelationConfig<
  "delegations",
  DelegationsSelectableField
>;

export type IDelegationsAsManyRelationConfig = Q.IManyRelationConfig<
  "delegations",
  DelegationsSelectableField,
  DelegationsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IDelegationsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IDelegations,
  DelegationsSelectableField
>;

export type IDelegationsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IDelegations,
  DelegationsSelectableField,
  DelegationsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IDelegationsRelationMap extends Record<DelegationsRelationKey, unknown> {
  delegateAccount: AccountsTypes.IAccountsAsOneRelationQuery;
  delegatorAccount: AccountsTypes.IAccountsAsOneRelationQuery;
  revokedByRelation: AccountsTypes.IAccountsAsOneRelationQuery;
  scope: ScopesTypes.IScopesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IDelegationsRelationQueries = Q.IBaseRelationQueries<
  IDelegations,
  DelegationsRelationKey,
  IDelegationsRelationMap
>;

export type IDelegationsItemQuery = Q.IBaseItemQuery<
  IDelegations,
  DelegationsRelationKey,
  DelegationsSelectableField,
  DelegationsRelationKey,
  DelegationsSelectableField,
  IDelegationsRelationMap,
  IDelegationsRelationQueries
>;

export type IDelegationsListQuery = Q.IBaseListQuery<
  IDelegations,
  DelegationsRelationKey,
  DelegationsSelectableField,
  DelegationsSortableField,
  DelegationsRelationKey,
  DelegationsSelectableField,
  DelegationsSortableField,
  DelegationsDateRangeField,
  DelegationsFilterableField,
  IDelegationsRelationMap,
  IDelegationsRelationQueries,
  IDelegationsItemQuery
>;
