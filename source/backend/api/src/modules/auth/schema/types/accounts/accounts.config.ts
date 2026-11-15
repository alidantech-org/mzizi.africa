// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import { ERelationType } from '#/modules/common/schema/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IAccounts,
  AccountsKey,
  AccountsRelationKey,
  AccountsSortableField,
  AccountsFilterableField,
  AccountsDateRangeField,
  AccountsSelectableField,
  IAccountsAsOneRelationConfig,
  IAccountsAsManyRelationConfig
} from './accounts.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ACCOUNTS_RELATION_KEYS = [] as const satisfies readonly AccountsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ACCOUNTS_SORTABLE_FIELDS = [] as const satisfies readonly AccountsKey[];

export const ACCOUNTS_SEARCHABLE_FIELDS = [] as const satisfies readonly AccountsKey[];

export const ACCOUNTS_FILTERABLE_FIELDS = [] as const satisfies readonly AccountsKey[];

export const ACCOUNTS_DATE_RANGE_FIELDS = [] as const satisfies readonly AccountsKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ACCOUNTS_SELECTABLE_FIELDS = ['actorKind', 'createdAt', 'disabledAt', 'displayName', 'id', 'lastAuthenticatedAt', 'personRefId', 'status', ] as const satisfies readonly AccountsKey[];

export const ACCOUNTS_DEFAULT_SELECT_FIELDS = ['actorKind', 'createdAt', 'disabledAt', 'displayName', 'id', 'lastAuthenticatedAt', 'personRefId', 'status', ] as const satisfies readonly AccountsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ACCOUNTS_EDITABLE_FIELDS = ['actorKind', 'disabledAt', 'displayName', 'lastAuthenticatedAt', 'personRefId', 'status', ] as const satisfies readonly AccountsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ACCOUNTS_AS_ONE_RELATION_CONFIG = {
  relation: 'accounts',
  type: ERelationType.One,
  selectableFields: ACCOUNTS_SELECTABLE_FIELDS,
  defaultSelectFields: ACCOUNTS_DEFAULT_SELECT_FIELDS
} as const satisfies IAccountsAsOneRelationConfig;

export const ACCOUNTS_AS_MANY_RELATION_CONFIG = {
  relation: 'accountss',
  type: ERelationType.Many,
  selectableFields: ACCOUNTS_SELECTABLE_FIELDS,
  defaultSelectFields: ACCOUNTS_DEFAULT_SELECT_FIELDS,
  sortableFields: ACCOUNTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IAccountsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ACCOUNTS_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const ACCOUNTS_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ACCOUNTS_QUERY_OPTIONS = {
  searchableFields: ACCOUNTS_SEARCHABLE_FIELDS,
  selectableFields: ACCOUNTS_SELECTABLE_FIELDS,
  defaultSelectFields: ACCOUNTS_DEFAULT_SELECT_FIELDS,
  sortableFields: ACCOUNTS_SORTABLE_FIELDS,
  filterFields: ACCOUNTS_FILTERABLE_FIELDS,
  dateRangeFields: ACCOUNTS_DATE_RANGE_FIELDS,
  oneRelations: ACCOUNTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ACCOUNTS_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IAccounts,
  AccountsSortableField,
  AccountsSelectableField,
  AccountsFilterableField,
  AccountsDateRangeField,
  AccountsRelationKey,
  typeof ACCOUNTS_ONE_RELATION_QUERY_OPTIONS,
  typeof ACCOUNTS_MANY_RELATION_QUERY_OPTIONS
>;