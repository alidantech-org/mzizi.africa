// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IAccount,
  AccountKey,
  AccountRelationKey,
  AccountSortableField,
  AccountFilterableField,
  AccountDateRangeField,
  AccountSelectableField,
  IAccountAsOneRelationConfig,
  IAccountAsManyRelationConfig
} from './account.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ACCOUNT_RELATION_KEYS = [] as const satisfies readonly AccountKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ACCOUNT_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly AccountKey[];

export const ACCOUNT_SEARCHABLE_FIELDS = [] as const satisfies readonly AccountKey[];

export const ACCOUNT_FILTERABLE_FIELDS = ['id', 'issuer', 'personId', 'status', 'subject', 'version', ] as const satisfies readonly AccountKey[];

export const ACCOUNT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly AccountKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ACCOUNT_SELECTABLE_FIELDS = ['createdAt', 'id', 'issuer', 'lastSeenAt', 'personId', 'status', 'subject', 'updatedAt', ] as const satisfies readonly AccountKey[];

export const ACCOUNT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly AccountSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ACCOUNT_EDITABLE_FIELDS = ['issuer', 'lastSeenAt', 'personId', 'status', 'subject', ] as const satisfies readonly AccountKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ACCOUNT_AS_ONE_RELATION_CONFIG = {
  relation: 'account',
  type: ERelationType.One,
  selectableFields: ACCOUNT_SELECTABLE_FIELDS,
  defaultSelectFields: ACCOUNT_DEFAULT_SELECT_FIELDS
} as const satisfies IAccountAsOneRelationConfig;

export const ACCOUNT_AS_MANY_RELATION_CONFIG = {
  relation: 'accounts',
  type: ERelationType.Many,
  selectableFields: ACCOUNT_SELECTABLE_FIELDS,
  defaultSelectFields: ACCOUNT_DEFAULT_SELECT_FIELDS,
  sortableFields: ACCOUNT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IAccountAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ACCOUNT_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const ACCOUNT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ACCOUNT_QUERY_OPTIONS = {
  searchableFields: ACCOUNT_SEARCHABLE_FIELDS,
  selectableFields: ACCOUNT_SELECTABLE_FIELDS,
  defaultSelectFields: ACCOUNT_DEFAULT_SELECT_FIELDS,
  sortableFields: ACCOUNT_SORTABLE_FIELDS,
  filterFields: ACCOUNT_FILTERABLE_FIELDS,
  dateRangeFields: ACCOUNT_DATE_RANGE_FIELDS,
  oneRelations: ACCOUNT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ACCOUNT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IAccount,
  AccountSortableField,
  AccountSelectableField,
  AccountFilterableField,
  AccountDateRangeField,
  AccountRelationKey,
  typeof ACCOUNT_ONE_RELATION_QUERY_OPTIONS,
  typeof ACCOUNT_MANY_RELATION_QUERY_OPTIONS
>;