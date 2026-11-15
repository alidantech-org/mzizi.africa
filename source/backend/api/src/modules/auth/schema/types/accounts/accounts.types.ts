// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { AccountStatus } from "#/modules/auth/schema/enum/account-status.enum";
import type { AuthActorKind } from "#/modules/auth/schema/enum/auth-actor-kind.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ACCOUNTS_RELATION_KEYS,
  ACCOUNTS_SORTABLE_FIELDS,
  ACCOUNTS_SEARCHABLE_FIELDS,
  ACCOUNTS_FILTERABLE_FIELDS,
  ACCOUNTS_DATE_RANGE_FIELDS,
  ACCOUNTS_SELECTABLE_FIELDS,
  ACCOUNTS_DEFAULT_SELECT_FIELDS,
  ACCOUNTS_EDITABLE_FIELDS,
} from "./accounts.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Login principal for a person or service; identity is separate from the people and institutions it refers to. */
export interface IAccounts extends B.IBase {
  actorKind: AuthActorKind;
  disabledAt: Date | null;
  displayName: string;
  lastAuthenticatedAt: Date | null;
  personRefId: string;
  status: AccountStatus;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type AccountsKey = keyof IAccounts;

export type AccountsRelationKey = (typeof ACCOUNTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IAccountsReadonlyFields = B.IBaseReadonlyFields;

export type IAccountsContextualFields = never;

export type IAccountsSensitiveFields = never;

export type IAccountsTransitionFields = never;

export type IAccountsImmutableFields =
  | IAccountsReadonlyFields
  | IAccountsContextualFields
  | IAccountsSensitiveFields
  | IAccountsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IAccountsCreatable = Omit<IAccounts, IAccountsImmutableFields | AccountsRelationKey>;

export type IAccountsSystemWritable = Omit<IAccounts, B.IBaseReadonlyFields | AccountsRelationKey>;

export type IAccountsUpdatable = Partial<
  Omit<IAccounts, IAccountsImmutableFields | AccountsRelationKey>
>;

export interface IAccountsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type AccountsSortableField = (typeof ACCOUNTS_SORTABLE_FIELDS)[number];

export type AccountsSearchableField = (typeof ACCOUNTS_SEARCHABLE_FIELDS)[number];

export type AccountsFilterableField = (typeof ACCOUNTS_FILTERABLE_FIELDS)[number];

export type AccountsDateRangeField = (typeof ACCOUNTS_DATE_RANGE_FIELDS)[number];

export type AccountsSelectableField = (typeof ACCOUNTS_SELECTABLE_FIELDS)[number];

export type AccountsDefaultSelectField = (typeof ACCOUNTS_DEFAULT_SELECT_FIELDS)[number];

export type AccountsEditableField = (typeof ACCOUNTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IAccountsAsOneRelationConfig = Q.IOneRelationConfig<
  "accounts",
  AccountsSelectableField
>;

export type IAccountsAsManyRelationConfig = Q.IManyRelationConfig<
  "accounts",
  AccountsSelectableField,
  AccountsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IAccountsAsOneRelationQuery = Q.IAsOneRelationQuery<IAccounts, AccountsSelectableField>;

export type IAccountsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IAccounts,
  AccountsSelectableField,
  AccountsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IAccountsRelationMap extends Record<AccountsRelationKey, unknown> {}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IAccountsRelationQueries = Q.IBaseRelationQueries<
  IAccounts,
  AccountsRelationKey,
  IAccountsRelationMap
>;

export type IAccountsItemQuery = Q.IBaseItemQuery<
  IAccounts,
  AccountsRelationKey,
  AccountsSelectableField,
  AccountsRelationKey,
  AccountsSelectableField,
  IAccountsRelationMap,
  IAccountsRelationQueries
>;

export type IAccountsListQuery = Q.IBaseListQuery<
  IAccounts,
  AccountsRelationKey,
  AccountsSelectableField,
  AccountsSortableField,
  AccountsRelationKey,
  AccountsSelectableField,
  AccountsSortableField,
  AccountsDateRangeField,
  AccountsFilterableField,
  IAccountsRelationMap,
  IAccountsRelationQueries,
  IAccountsItemQuery
>;
