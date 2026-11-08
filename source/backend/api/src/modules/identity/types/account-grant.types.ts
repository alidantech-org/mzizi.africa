// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { ActorRole } from '#/types/shared/actor-role.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as AccountTypes from '#/modules/identity/types/account.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ACCOUNT_GRANT_RELATION_KEYS,
  ACCOUNT_GRANT_SORTABLE_FIELDS,
  ACCOUNT_GRANT_SEARCHABLE_FIELDS,
  ACCOUNT_GRANT_FILTERABLE_FIELDS,
  ACCOUNT_GRANT_DATE_RANGE_FIELDS,
  ACCOUNT_GRANT_SELECTABLE_FIELDS,
  ACCOUNT_GRANT_DEFAULT_SELECT_FIELDS,
  ACCOUNT_GRANT_EDITABLE_FIELDS
} from './account-grant.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Account Grant */
export interface IAccountGrant extends B.IBase {
  accountId: string;
  grantedBy: string | null;
  isCurrent: boolean;
  jurisdictionId: string | null;
  role: ActorRole;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly account?: AccountTypes.IAccount;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type AccountGrantKey = keyof IAccountGrant;

export type AccountGrantRelationKey = (typeof ACCOUNT_GRANT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IAccountGrantReadonlyFields = B.IBaseReadonlyFields;

export type IAccountGrantContextualFields = never;

export type IAccountGrantSensitiveFields = never;

export type IAccountGrantTransitionFields = never;

export type IAccountGrantImmutableFields =
  | IAccountGrantReadonlyFields
  | IAccountGrantContextualFields
  | IAccountGrantSensitiveFields
  | IAccountGrantTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IAccountGrantCreatable = Omit<IAccountGrant, IAccountGrantImmutableFields | AccountGrantRelationKey>;

export type IAccountGrantSystemWritable = Omit<IAccountGrant, B.IBaseReadonlyFields | AccountGrantRelationKey>;

export type IAccountGrantUpdatable = Partial<Omit<IAccountGrant, IAccountGrantImmutableFields | AccountGrantRelationKey>>;

export interface IAccountGrantTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type AccountGrantSortableField = (typeof ACCOUNT_GRANT_SORTABLE_FIELDS)[number];

export type AccountGrantSearchableField = (typeof ACCOUNT_GRANT_SEARCHABLE_FIELDS)[number];

export type AccountGrantFilterableField = (typeof ACCOUNT_GRANT_FILTERABLE_FIELDS)[number];

export type AccountGrantDateRangeField = (typeof ACCOUNT_GRANT_DATE_RANGE_FIELDS)[number];

export type AccountGrantSelectableField = (typeof ACCOUNT_GRANT_SELECTABLE_FIELDS)[number];

export type AccountGrantDefaultSelectField = (typeof ACCOUNT_GRANT_DEFAULT_SELECT_FIELDS)[number];

export type AccountGrantEditableField = (typeof ACCOUNT_GRANT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IAccountGrantAsOneRelationConfig = Q.IOneRelationConfig<'accountGrant', AccountGrantSelectableField>;

export type IAccountGrantAsManyRelationConfig = Q.IManyRelationConfig<'accountGrants', AccountGrantSelectableField, AccountGrantSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IAccountGrantAsOneRelationQuery = Q.IAsOneRelationQuery<IAccountGrant, AccountGrantSelectableField>;

export type IAccountGrantAsManyRelationQuery = Q.IAsManyRelationQuery<IAccountGrant, AccountGrantSelectableField, AccountGrantSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IAccountGrantRelationMap extends Record<AccountGrantRelationKey, unknown> {
  account: AccountTypes.IAccountAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IAccountGrantRelationQueries = Q.IBaseRelationQueries<IAccountGrant, AccountGrantRelationKey, IAccountGrantRelationMap>;

export type IAccountGrantItemQuery = Q.IBaseItemQuery<
  IAccountGrant,
  AccountGrantRelationKey,
  AccountGrantSelectableField,
  AccountGrantRelationKey,
  AccountGrantSelectableField,
  IAccountGrantRelationMap,
  IAccountGrantRelationQueries
>;

export type IAccountGrantListQuery = Q.IBaseListQuery<
  IAccountGrant,
  AccountGrantRelationKey,
  AccountGrantSelectableField,
  AccountGrantSortableField,
  AccountGrantRelationKey,
  AccountGrantSelectableField,
  AccountGrantSortableField,
  AccountGrantDateRangeField,
  AccountGrantFilterableField,
  IAccountGrantRelationMap,
  IAccountGrantRelationQueries,
  IAccountGrantItemQuery
>;