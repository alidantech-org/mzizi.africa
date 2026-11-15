// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { MembershipStatus } from '#/modules/auth/enum/membership-status.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as AccountsTypes from '#/modules/auth/types/accounts.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  MEMBERSHIPS_RELATION_KEYS,
  MEMBERSHIPS_SORTABLE_FIELDS,
  MEMBERSHIPS_SEARCHABLE_FIELDS,
  MEMBERSHIPS_FILTERABLE_FIELDS,
  MEMBERSHIPS_DATE_RANGE_FIELDS,
  MEMBERSHIPS_SELECTABLE_FIELDS,
  MEMBERSHIPS_DEFAULT_SELECT_FIELDS,
  MEMBERSHIPS_EDITABLE_FIELDS
} from './memberships.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Account membership of an institution, verified and revocable with attribution. */
export interface IMemberships extends B.IBase {
  accountId: string;
  endsAt: Date | null;
  institutionRefId: string;
  revokedAt: Date | null;
  revokedBy: string | null;
  startsAt: Date | null;
  status: MembershipStatus;
  verifiedAt: Date | null;
  verifiedBy: string | null;
  readonly account?: AccountsTypes.IAccounts;
  readonly revokedByRelation?: AccountsTypes.IAccounts;
  readonly verifiedByRelation?: AccountsTypes.IAccounts;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type MembershipsKey = keyof IMemberships;

export type MembershipsRelationKey = (typeof MEMBERSHIPS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IMembershipsReadonlyFields = B.IBaseReadonlyFields;

export type IMembershipsContextualFields = never;

export type IMembershipsSensitiveFields = never;

export type IMembershipsTransitionFields = never;

export type IMembershipsImmutableFields =
  | IMembershipsReadonlyFields
  | IMembershipsContextualFields
  | IMembershipsSensitiveFields
  | IMembershipsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IMembershipsCreatable = Omit<IMemberships, IMembershipsImmutableFields | MembershipsRelationKey>;

export type IMembershipsSystemWritable = Omit<IMemberships, B.IBaseReadonlyFields | MembershipsRelationKey>;

export type IMembershipsUpdatable = Partial<Omit<IMemberships, IMembershipsImmutableFields | MembershipsRelationKey>>;

export interface IMembershipsTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type MembershipsSortableField = (typeof MEMBERSHIPS_SORTABLE_FIELDS)[number];

export type MembershipsSearchableField = (typeof MEMBERSHIPS_SEARCHABLE_FIELDS)[number];

export type MembershipsFilterableField = (typeof MEMBERSHIPS_FILTERABLE_FIELDS)[number];

export type MembershipsDateRangeField = (typeof MEMBERSHIPS_DATE_RANGE_FIELDS)[number];

export type MembershipsSelectableField = (typeof MEMBERSHIPS_SELECTABLE_FIELDS)[number];

export type MembershipsDefaultSelectField = (typeof MEMBERSHIPS_DEFAULT_SELECT_FIELDS)[number];

export type MembershipsEditableField = (typeof MEMBERSHIPS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IMembershipsAsOneRelationConfig = Q.IOneRelationConfig<'memberships', MembershipsSelectableField>;

export type IMembershipsAsManyRelationConfig = Q.IManyRelationConfig<'membershipss', MembershipsSelectableField, MembershipsSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IMembershipsAsOneRelationQuery = Q.IAsOneRelationQuery<IMemberships, MembershipsSelectableField>;

export type IMembershipsAsManyRelationQuery = Q.IAsManyRelationQuery<IMemberships, MembershipsSelectableField, MembershipsSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IMembershipsRelationMap extends Record<MembershipsRelationKey, unknown> {
  account: AccountsTypes.IAccountsAsOneRelationQuery;
  revokedByRelation: AccountsTypes.IAccountsAsOneRelationQuery;
  verifiedByRelation: AccountsTypes.IAccountsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IMembershipsRelationQueries = Q.IBaseRelationQueries<IMemberships, MembershipsRelationKey, IMembershipsRelationMap>;

export type IMembershipsItemQuery = Q.IBaseItemQuery<
  IMemberships,
  MembershipsRelationKey,
  MembershipsSelectableField,
  MembershipsRelationKey,
  MembershipsSelectableField,
  IMembershipsRelationMap,
  IMembershipsRelationQueries
>;

export type IMembershipsListQuery = Q.IBaseListQuery<
  IMemberships,
  MembershipsRelationKey,
  MembershipsSelectableField,
  MembershipsSortableField,
  MembershipsRelationKey,
  MembershipsSelectableField,
  MembershipsSortableField,
  MembershipsDateRangeField,
  MembershipsFilterableField,
  IMembershipsRelationMap,
  IMembershipsRelationQueries,
  IMembershipsItemQuery
>;