// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import { ERelationType } from '#/modules/common/schema/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as AccountsConfig from '#/modules/auth/schema/types/accounts/accounts.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ILoginIdentities,
  LoginIdentitiesKey,
  LoginIdentitiesRelationKey,
  LoginIdentitiesSortableField,
  LoginIdentitiesFilterableField,
  LoginIdentitiesDateRangeField,
  LoginIdentitiesSelectableField,
  ILoginIdentitiesAsOneRelationConfig,
  ILoginIdentitiesAsManyRelationConfig
} from './login-identities.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const LOGIN_IDENTITIES_RELATION_KEYS = ['account', ] as const satisfies readonly LoginIdentitiesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const LOGIN_IDENTITIES_SORTABLE_FIELDS = [] as const satisfies readonly LoginIdentitiesKey[];

export const LOGIN_IDENTITIES_SEARCHABLE_FIELDS = [] as const satisfies readonly LoginIdentitiesKey[];

export const LOGIN_IDENTITIES_FILTERABLE_FIELDS = [] as const satisfies readonly LoginIdentitiesKey[];

export const LOGIN_IDENTITIES_DATE_RANGE_FIELDS = [] as const satisfies readonly LoginIdentitiesKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const LOGIN_IDENTITIES_SELECTABLE_FIELDS = ['accountId', 'id', 'issuer', 'lastAuthenticatedAt', 'linkedAt', 'subject', 'unlinkedAt', ] as const satisfies readonly LoginIdentitiesKey[];

export const LOGIN_IDENTITIES_DEFAULT_SELECT_FIELDS = ['accountId', 'id', 'issuer', 'lastAuthenticatedAt', 'linkedAt', 'subject', 'unlinkedAt', ] as const satisfies readonly LoginIdentitiesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const LOGIN_IDENTITIES_EDITABLE_FIELDS = ['accountId', 'issuer', 'lastAuthenticatedAt', 'linkedAt', 'subject', 'unlinkedAt', ] as const satisfies readonly LoginIdentitiesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const LOGIN_IDENTITIES_AS_ONE_RELATION_CONFIG = {
  relation: 'loginIdentities',
  type: ERelationType.One,
  selectableFields: LOGIN_IDENTITIES_SELECTABLE_FIELDS,
  defaultSelectFields: LOGIN_IDENTITIES_DEFAULT_SELECT_FIELDS
} as const satisfies ILoginIdentitiesAsOneRelationConfig;

export const LOGIN_IDENTITIES_AS_MANY_RELATION_CONFIG = {
  relation: 'loginIdentitiess',
  type: ERelationType.Many,
  selectableFields: LOGIN_IDENTITIES_SELECTABLE_FIELDS,
  defaultSelectFields: LOGIN_IDENTITIES_DEFAULT_SELECT_FIELDS,
  sortableFields: LOGIN_IDENTITIES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ILoginIdentitiesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const LOGIN_IDENTITIES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<LoginIdentitiesRelationKey>().one(AccountsConfig.ACCOUNTS_AS_ONE_RELATION_CONFIG, 'account'),
] as const;

export const LOGIN_IDENTITIES_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const LOGIN_IDENTITIES_QUERY_OPTIONS = {
  searchableFields: LOGIN_IDENTITIES_SEARCHABLE_FIELDS,
  selectableFields: LOGIN_IDENTITIES_SELECTABLE_FIELDS,
  defaultSelectFields: LOGIN_IDENTITIES_DEFAULT_SELECT_FIELDS,
  sortableFields: LOGIN_IDENTITIES_SORTABLE_FIELDS,
  filterFields: LOGIN_IDENTITIES_FILTERABLE_FIELDS,
  dateRangeFields: LOGIN_IDENTITIES_DATE_RANGE_FIELDS,
  oneRelations: LOGIN_IDENTITIES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: LOGIN_IDENTITIES_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ILoginIdentities,
  LoginIdentitiesSortableField,
  LoginIdentitiesSelectableField,
  LoginIdentitiesFilterableField,
  LoginIdentitiesDateRangeField,
  LoginIdentitiesRelationKey,
  typeof LOGIN_IDENTITIES_ONE_RELATION_QUERY_OPTIONS,
  typeof LOGIN_IDENTITIES_MANY_RELATION_QUERY_OPTIONS
>;