// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { AccountStatus } from '#/types/identity/account-status.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ACCOUNT_RELATION_KEYS,
  ACCOUNT_SORTABLE_FIELDS,
  ACCOUNT_SEARCHABLE_FIELDS,
  ACCOUNT_FILTERABLE_FIELDS,
  ACCOUNT_DATE_RANGE_FIELDS,
  ACCOUNT_SELECTABLE_FIELDS,
  ACCOUNT_DEFAULT_SELECT_FIELDS,
  ACCOUNT_EDITABLE_FIELDS
} from './account.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Account */
export interface IAccount extends B.IBase {
  issuer: string;
  lastSeenAt: Date | null;
  personId: string | null;
  status: AccountStatus;
  subject: string;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type AccountKey = keyof IAccount;

export type AccountRelationKey = (typeof ACCOUNT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IAccountReadonlyFields = B.IBaseReadonlyFields;

export type IAccountContextualFields = never;

export type IAccountSensitiveFields = never;

export type IAccountTransitionFields = never;

export type IAccountImmutableFields =
  | IAccountReadonlyFields
  | IAccountContextualFields
  | IAccountSensitiveFields
  | IAccountTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IAccountCreatable = Omit<IAccount, IAccountImmutableFields | AccountRelationKey>;

export type IAccountSystemWritable = Omit<IAccount, B.IBaseReadonlyFields | AccountRelationKey>;

export type IAccountUpdatable = Partial<Omit<IAccount, IAccountImmutableFields | AccountRelationKey>>;

export interface IAccountTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type AccountSortableField = (typeof ACCOUNT_SORTABLE_FIELDS)[number];

export type AccountSearchableField = (typeof ACCOUNT_SEARCHABLE_FIELDS)[number];

export type AccountFilterableField = (typeof ACCOUNT_FILTERABLE_FIELDS)[number];

export type AccountDateRangeField = (typeof ACCOUNT_DATE_RANGE_FIELDS)[number];

export type AccountSelectableField = (typeof ACCOUNT_SELECTABLE_FIELDS)[number];

export type AccountDefaultSelectField = (typeof ACCOUNT_DEFAULT_SELECT_FIELDS)[number];

export type AccountEditableField = (typeof ACCOUNT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IAccountAsOneRelationConfig = Q.IOneRelationConfig<'account', AccountSelectableField>;

export type IAccountAsManyRelationConfig = Q.IManyRelationConfig<'accounts', AccountSelectableField, AccountSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IAccountAsOneRelationQuery = Q.IAsOneRelationQuery<IAccount, AccountSelectableField>;

export type IAccountAsManyRelationQuery = Q.IAsManyRelationQuery<IAccount, AccountSelectableField, AccountSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IAccountRelationMap extends Record<AccountRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IAccountRelationQueries = Q.IBaseRelationQueries<IAccount, AccountRelationKey, IAccountRelationMap>;

export type IAccountItemQuery = Q.IBaseItemQuery<
  IAccount,
  AccountRelationKey,
  AccountSelectableField,
  AccountRelationKey,
  AccountSelectableField,
  IAccountRelationMap,
  IAccountRelationQueries
>;

export type IAccountListQuery = Q.IBaseListQuery<
  IAccount,
  AccountRelationKey,
  AccountSelectableField,
  AccountSortableField,
  AccountRelationKey,
  AccountSelectableField,
  AccountSortableField,
  AccountDateRangeField,
  AccountFilterableField,
  IAccountRelationMap,
  IAccountRelationQueries,
  IAccountItemQuery
>;