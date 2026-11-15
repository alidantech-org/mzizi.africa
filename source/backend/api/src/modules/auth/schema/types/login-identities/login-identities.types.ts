// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import * as B from '#/modules/common/schema/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as AccountsTypes from '#/modules/auth/schema/types/accounts/accounts.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  LOGIN_IDENTITIES_RELATION_KEYS,
  LOGIN_IDENTITIES_SORTABLE_FIELDS,
  LOGIN_IDENTITIES_SEARCHABLE_FIELDS,
  LOGIN_IDENTITIES_FILTERABLE_FIELDS,
  LOGIN_IDENTITIES_DATE_RANGE_FIELDS,
  LOGIN_IDENTITIES_SELECTABLE_FIELDS,
  LOGIN_IDENTITIES_DEFAULT_SELECT_FIELDS,
  LOGIN_IDENTITIES_EDITABLE_FIELDS
} from './login-identities.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** External issuer and subject linked to one account; unlinking is recorded, never deleted. */
export interface ILoginIdentities extends B.IBase {
  accountId: string;
  issuer: string;
  lastAuthenticatedAt: Date | null;
  linkedAt: Date;
  subject: string;
  unlinkedAt: Date | null;
  readonly account?: AccountsTypes.IAccounts;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type LoginIdentitiesKey = keyof ILoginIdentities;

export type LoginIdentitiesRelationKey = (typeof LOGIN_IDENTITIES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ILoginIdentitiesReadonlyFields = B.IBaseReadonlyFields;

export type ILoginIdentitiesContextualFields = never;

export type ILoginIdentitiesSensitiveFields = never;

export type ILoginIdentitiesTransitionFields = never;

export type ILoginIdentitiesImmutableFields =
  | ILoginIdentitiesReadonlyFields
  | ILoginIdentitiesContextualFields
  | ILoginIdentitiesSensitiveFields
  | ILoginIdentitiesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ILoginIdentitiesCreatable = Omit<ILoginIdentities, ILoginIdentitiesImmutableFields | LoginIdentitiesRelationKey>;

export type ILoginIdentitiesSystemWritable = Omit<ILoginIdentities, B.IBaseReadonlyFields | LoginIdentitiesRelationKey>;

export type ILoginIdentitiesUpdatable = Partial<Omit<ILoginIdentities, ILoginIdentitiesImmutableFields | LoginIdentitiesRelationKey>>;

export interface ILoginIdentitiesTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type LoginIdentitiesSortableField = (typeof LOGIN_IDENTITIES_SORTABLE_FIELDS)[number];

export type LoginIdentitiesSearchableField = (typeof LOGIN_IDENTITIES_SEARCHABLE_FIELDS)[number];

export type LoginIdentitiesFilterableField = (typeof LOGIN_IDENTITIES_FILTERABLE_FIELDS)[number];

export type LoginIdentitiesDateRangeField = (typeof LOGIN_IDENTITIES_DATE_RANGE_FIELDS)[number];

export type LoginIdentitiesSelectableField = (typeof LOGIN_IDENTITIES_SELECTABLE_FIELDS)[number];

export type LoginIdentitiesDefaultSelectField = (typeof LOGIN_IDENTITIES_DEFAULT_SELECT_FIELDS)[number];

export type LoginIdentitiesEditableField = (typeof LOGIN_IDENTITIES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ILoginIdentitiesAsOneRelationConfig = Q.IOneRelationConfig<'loginIdentities', LoginIdentitiesSelectableField>;

export type ILoginIdentitiesAsManyRelationConfig = Q.IManyRelationConfig<'loginIdentitiess', LoginIdentitiesSelectableField, LoginIdentitiesSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ILoginIdentitiesAsOneRelationQuery = Q.IAsOneRelationQuery<ILoginIdentities, LoginIdentitiesSelectableField>;

export type ILoginIdentitiesAsManyRelationQuery = Q.IAsManyRelationQuery<ILoginIdentities, LoginIdentitiesSelectableField, LoginIdentitiesSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ILoginIdentitiesRelationMap extends Record<LoginIdentitiesRelationKey, unknown> {
  account: AccountsTypes.IAccountsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ILoginIdentitiesRelationQueries = Q.IBaseRelationQueries<ILoginIdentities, LoginIdentitiesRelationKey, ILoginIdentitiesRelationMap>;

export type ILoginIdentitiesItemQuery = Q.IBaseItemQuery<
  ILoginIdentities,
  LoginIdentitiesRelationKey,
  LoginIdentitiesSelectableField,
  LoginIdentitiesRelationKey,
  LoginIdentitiesSelectableField,
  ILoginIdentitiesRelationMap,
  ILoginIdentitiesRelationQueries
>;

export type ILoginIdentitiesListQuery = Q.IBaseListQuery<
  ILoginIdentities,
  LoginIdentitiesRelationKey,
  LoginIdentitiesSelectableField,
  LoginIdentitiesSortableField,
  LoginIdentitiesRelationKey,
  LoginIdentitiesSelectableField,
  LoginIdentitiesSortableField,
  LoginIdentitiesDateRangeField,
  LoginIdentitiesFilterableField,
  ILoginIdentitiesRelationMap,
  ILoginIdentitiesRelationQueries,
  ILoginIdentitiesItemQuery
>;