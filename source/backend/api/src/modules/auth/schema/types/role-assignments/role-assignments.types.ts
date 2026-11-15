// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import * as B from '#/modules/common/schema/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as AccountsTypes from '#/modules/auth/schema/types/accounts/accounts.types';
import type * as DelegationsTypes from '#/modules/auth/schema/types/delegations/delegations.types';
import type * as MembershipsTypes from '#/modules/auth/schema/types/memberships/memberships.types';
import type * as RolesTypes from '#/modules/auth/schema/types/roles/roles.types';
import type * as ScopesTypes from '#/modules/auth/schema/types/scopes/scopes.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ROLE_ASSIGNMENTS_RELATION_KEYS,
  ROLE_ASSIGNMENTS_SORTABLE_FIELDS,
  ROLE_ASSIGNMENTS_SEARCHABLE_FIELDS,
  ROLE_ASSIGNMENTS_FILTERABLE_FIELDS,
  ROLE_ASSIGNMENTS_DATE_RANGE_FIELDS,
  ROLE_ASSIGNMENTS_SELECTABLE_FIELDS,
  ROLE_ASSIGNMENTS_DEFAULT_SELECT_FIELDS,
  ROLE_ASSIGNMENTS_EDITABLE_FIELDS
} from './role-assignments.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Scoped role grant to an account, optionally through a membership or delegation, with revocation history. */
export interface IRoleAssignments extends B.IBase {
  accountId: string;
  delegationId: string | null;
  expiresAt: Date | null;
  grantedBy: string;
  membershipId: string | null;
  revocationReason: string | null;
  revokedAt: Date | null;
  revokedBy: string | null;
  roleId: string;
  scopeId: string;
  startsAt: Date | null;
  readonly account?: AccountsTypes.IAccounts;
  readonly delegation?: DelegationsTypes.IDelegations;
  readonly grantedByRelation?: AccountsTypes.IAccounts;
  readonly membership?: MembershipsTypes.IMemberships;
  readonly revokedByRelation?: AccountsTypes.IAccounts;
  readonly role?: RolesTypes.IRoles;
  readonly scope?: ScopesTypes.IScopes;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type RoleAssignmentsKey = keyof IRoleAssignments;

export type RoleAssignmentsRelationKey = (typeof ROLE_ASSIGNMENTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IRoleAssignmentsReadonlyFields = B.IBaseReadonlyFields;

export type IRoleAssignmentsContextualFields = never;

export type IRoleAssignmentsSensitiveFields = never;

export type IRoleAssignmentsTransitionFields = never;

export type IRoleAssignmentsImmutableFields =
  | IRoleAssignmentsReadonlyFields
  | IRoleAssignmentsContextualFields
  | IRoleAssignmentsSensitiveFields
  | IRoleAssignmentsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IRoleAssignmentsCreatable = Omit<IRoleAssignments, IRoleAssignmentsImmutableFields | RoleAssignmentsRelationKey>;

export type IRoleAssignmentsSystemWritable = Omit<IRoleAssignments, B.IBaseReadonlyFields | RoleAssignmentsRelationKey>;

export type IRoleAssignmentsUpdatable = Partial<Omit<IRoleAssignments, IRoleAssignmentsImmutableFields | RoleAssignmentsRelationKey>>;

export interface IRoleAssignmentsTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type RoleAssignmentsSortableField = (typeof ROLE_ASSIGNMENTS_SORTABLE_FIELDS)[number];

export type RoleAssignmentsSearchableField = (typeof ROLE_ASSIGNMENTS_SEARCHABLE_FIELDS)[number];

export type RoleAssignmentsFilterableField = (typeof ROLE_ASSIGNMENTS_FILTERABLE_FIELDS)[number];

export type RoleAssignmentsDateRangeField = (typeof ROLE_ASSIGNMENTS_DATE_RANGE_FIELDS)[number];

export type RoleAssignmentsSelectableField = (typeof ROLE_ASSIGNMENTS_SELECTABLE_FIELDS)[number];

export type RoleAssignmentsDefaultSelectField = (typeof ROLE_ASSIGNMENTS_DEFAULT_SELECT_FIELDS)[number];

export type RoleAssignmentsEditableField = (typeof ROLE_ASSIGNMENTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IRoleAssignmentsAsOneRelationConfig = Q.IOneRelationConfig<'roleAssignments', RoleAssignmentsSelectableField>;

export type IRoleAssignmentsAsManyRelationConfig = Q.IManyRelationConfig<'roleAssignmentss', RoleAssignmentsSelectableField, RoleAssignmentsSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IRoleAssignmentsAsOneRelationQuery = Q.IAsOneRelationQuery<IRoleAssignments, RoleAssignmentsSelectableField>;

export type IRoleAssignmentsAsManyRelationQuery = Q.IAsManyRelationQuery<IRoleAssignments, RoleAssignmentsSelectableField, RoleAssignmentsSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IRoleAssignmentsRelationMap extends Record<RoleAssignmentsRelationKey, unknown> {
  account: AccountsTypes.IAccountsAsOneRelationQuery;
  delegation: DelegationsTypes.IDelegationsAsOneRelationQuery;
  grantedByRelation: AccountsTypes.IAccountsAsOneRelationQuery;
  membership: MembershipsTypes.IMembershipsAsOneRelationQuery;
  revokedByRelation: AccountsTypes.IAccountsAsOneRelationQuery;
  role: RolesTypes.IRolesAsOneRelationQuery;
  scope: ScopesTypes.IScopesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IRoleAssignmentsRelationQueries = Q.IBaseRelationQueries<IRoleAssignments, RoleAssignmentsRelationKey, IRoleAssignmentsRelationMap>;

export type IRoleAssignmentsItemQuery = Q.IBaseItemQuery<
  IRoleAssignments,
  RoleAssignmentsRelationKey,
  RoleAssignmentsSelectableField,
  RoleAssignmentsRelationKey,
  RoleAssignmentsSelectableField,
  IRoleAssignmentsRelationMap,
  IRoleAssignmentsRelationQueries
>;

export type IRoleAssignmentsListQuery = Q.IBaseListQuery<
  IRoleAssignments,
  RoleAssignmentsRelationKey,
  RoleAssignmentsSelectableField,
  RoleAssignmentsSortableField,
  RoleAssignmentsRelationKey,
  RoleAssignmentsSelectableField,
  RoleAssignmentsSortableField,
  RoleAssignmentsDateRangeField,
  RoleAssignmentsFilterableField,
  IRoleAssignmentsRelationMap,
  IRoleAssignmentsRelationQueries,
  IRoleAssignmentsItemQuery
>;