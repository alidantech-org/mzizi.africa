// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as AccountsConfig from '#/modules/auth/types/accounts/accounts.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IMemberships,
  MembershipsKey,
  MembershipsRelationKey,
  MembershipsSortableField,
  MembershipsFilterableField,
  MembershipsDateRangeField,
  MembershipsSelectableField,
  IMembershipsAsOneRelationConfig,
  IMembershipsAsManyRelationConfig
} from './memberships.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const MEMBERSHIPS_RELATION_KEYS = ['account', 'revokedByRelation', 'verifiedByRelation', ] as const satisfies readonly MembershipsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const MEMBERSHIPS_SORTABLE_FIELDS = [] as const satisfies readonly MembershipsKey[];

export const MEMBERSHIPS_SEARCHABLE_FIELDS = [] as const satisfies readonly MembershipsKey[];

export const MEMBERSHIPS_FILTERABLE_FIELDS = [] as const satisfies readonly MembershipsKey[];

export const MEMBERSHIPS_DATE_RANGE_FIELDS = [] as const satisfies readonly MembershipsKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const MEMBERSHIPS_SELECTABLE_FIELDS = ['accountId', 'endsAt', 'id', 'institutionRefId', 'revokedAt', 'revokedBy', 'startsAt', 'status', 'verifiedAt', 'verifiedBy', ] as const satisfies readonly MembershipsKey[];

export const MEMBERSHIPS_DEFAULT_SELECT_FIELDS = ['accountId', 'endsAt', 'id', 'institutionRefId', 'revokedAt', 'revokedBy', 'startsAt', 'status', 'verifiedAt', 'verifiedBy', ] as const satisfies readonly MembershipsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const MEMBERSHIPS_EDITABLE_FIELDS = ['accountId', 'endsAt', 'institutionRefId', 'revokedAt', 'revokedBy', 'startsAt', 'status', 'verifiedAt', 'verifiedBy', ] as const satisfies readonly MembershipsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const MEMBERSHIPS_AS_ONE_RELATION_CONFIG = {
  relation: 'memberships',
  type: ERelationType.One,
  selectableFields: MEMBERSHIPS_SELECTABLE_FIELDS,
  defaultSelectFields: MEMBERSHIPS_DEFAULT_SELECT_FIELDS
} as const satisfies IMembershipsAsOneRelationConfig;

export const MEMBERSHIPS_AS_MANY_RELATION_CONFIG = {
  relation: 'membershipss',
  type: ERelationType.Many,
  selectableFields: MEMBERSHIPS_SELECTABLE_FIELDS,
  defaultSelectFields: MEMBERSHIPS_DEFAULT_SELECT_FIELDS,
  sortableFields: MEMBERSHIPS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IMembershipsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const MEMBERSHIPS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<MembershipsRelationKey>().one(AccountsConfig.ACCOUNTS_AS_ONE_RELATION_CONFIG, 'account'),
  Q.createRelationKeyMapper<MembershipsRelationKey>().one(AccountsConfig.ACCOUNTS_AS_ONE_RELATION_CONFIG, 'revokedByRelation'),
  Q.createRelationKeyMapper<MembershipsRelationKey>().one(AccountsConfig.ACCOUNTS_AS_ONE_RELATION_CONFIG, 'verifiedByRelation'),
] as const;

export const MEMBERSHIPS_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const MEMBERSHIPS_QUERY_OPTIONS = {
  searchableFields: MEMBERSHIPS_SEARCHABLE_FIELDS,
  selectableFields: MEMBERSHIPS_SELECTABLE_FIELDS,
  defaultSelectFields: MEMBERSHIPS_DEFAULT_SELECT_FIELDS,
  sortableFields: MEMBERSHIPS_SORTABLE_FIELDS,
  filterFields: MEMBERSHIPS_FILTERABLE_FIELDS,
  dateRangeFields: MEMBERSHIPS_DATE_RANGE_FIELDS,
  oneRelations: MEMBERSHIPS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: MEMBERSHIPS_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IMemberships,
  MembershipsSortableField,
  MembershipsSelectableField,
  MembershipsFilterableField,
  MembershipsDateRangeField,
  MembershipsRelationKey,
  typeof MEMBERSHIPS_ONE_RELATION_QUERY_OPTIONS,
  typeof MEMBERSHIPS_MANY_RELATION_QUERY_OPTIONS
>;