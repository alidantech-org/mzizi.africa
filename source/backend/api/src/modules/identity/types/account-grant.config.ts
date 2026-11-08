// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as AccountConfig from '#/modules/identity/types/account.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IAccountGrant,
  AccountGrantKey,
  AccountGrantRelationKey,
  AccountGrantSortableField,
  AccountGrantFilterableField,
  AccountGrantDateRangeField,
  AccountGrantSelectableField,
  IAccountGrantAsOneRelationConfig,
  IAccountGrantAsManyRelationConfig
} from './account-grant.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ACCOUNT_GRANT_RELATION_KEYS = ['account', ] as const satisfies readonly AccountGrantKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ACCOUNT_GRANT_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly AccountGrantKey[];

export const ACCOUNT_GRANT_SEARCHABLE_FIELDS = [] as const satisfies readonly AccountGrantKey[];

export const ACCOUNT_GRANT_FILTERABLE_FIELDS = ['accountId', 'grantedBy', 'id', 'isCurrent', 'jurisdictionId', 'role', 'version', ] as const satisfies readonly AccountGrantKey[];

export const ACCOUNT_GRANT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly AccountGrantKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ACCOUNT_GRANT_SELECTABLE_FIELDS = ['accountId', 'createdAt', 'grantedBy', 'id', 'isCurrent', 'jurisdictionId', 'role', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly AccountGrantKey[];

export const ACCOUNT_GRANT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly AccountGrantSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ACCOUNT_GRANT_EDITABLE_FIELDS = ['accountId', 'grantedBy', 'isCurrent', 'jurisdictionId', 'role', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly AccountGrantKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ACCOUNT_GRANT_AS_ONE_RELATION_CONFIG = {
  relation: 'accountGrant',
  type: ERelationType.One,
  selectableFields: ACCOUNT_GRANT_SELECTABLE_FIELDS,
  defaultSelectFields: ACCOUNT_GRANT_DEFAULT_SELECT_FIELDS
} as const satisfies IAccountGrantAsOneRelationConfig;

export const ACCOUNT_GRANT_AS_MANY_RELATION_CONFIG = {
  relation: 'accountGrants',
  type: ERelationType.Many,
  selectableFields: ACCOUNT_GRANT_SELECTABLE_FIELDS,
  defaultSelectFields: ACCOUNT_GRANT_DEFAULT_SELECT_FIELDS,
  sortableFields: ACCOUNT_GRANT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IAccountGrantAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ACCOUNT_GRANT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<AccountGrantRelationKey>().one(AccountConfig.ACCOUNT_AS_ONE_RELATION_CONFIG, 'account'),
] as const;

export const ACCOUNT_GRANT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ACCOUNT_GRANT_QUERY_OPTIONS = {
  searchableFields: ACCOUNT_GRANT_SEARCHABLE_FIELDS,
  selectableFields: ACCOUNT_GRANT_SELECTABLE_FIELDS,
  defaultSelectFields: ACCOUNT_GRANT_DEFAULT_SELECT_FIELDS,
  sortableFields: ACCOUNT_GRANT_SORTABLE_FIELDS,
  filterFields: ACCOUNT_GRANT_FILTERABLE_FIELDS,
  dateRangeFields: ACCOUNT_GRANT_DATE_RANGE_FIELDS,
  oneRelations: ACCOUNT_GRANT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ACCOUNT_GRANT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IAccountGrant,
  AccountGrantSortableField,
  AccountGrantSelectableField,
  AccountGrantFilterableField,
  AccountGrantDateRangeField,
  AccountGrantRelationKey,
  typeof ACCOUNT_GRANT_ONE_RELATION_QUERY_OPTIONS,
  typeof ACCOUNT_GRANT_MANY_RELATION_QUERY_OPTIONS
>;