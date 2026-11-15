// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as AccountsConfig from "#/modules/auth/schema/types/accounts/accounts.config";
import * as DelegationsConfig from "#/modules/auth/schema/types/delegations/delegations.config";
import * as MembershipsConfig from "#/modules/auth/schema/types/memberships/memberships.config";
import * as RolesConfig from "#/modules/auth/schema/types/roles/roles.config";
import * as ScopesConfig from "#/modules/auth/schema/types/scopes/scopes.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IRoleAssignments,
  RoleAssignmentsKey,
  RoleAssignmentsRelationKey,
  RoleAssignmentsSortableField,
  RoleAssignmentsFilterableField,
  RoleAssignmentsDateRangeField,
  RoleAssignmentsSelectableField,
  IRoleAssignmentsAsOneRelationConfig,
  IRoleAssignmentsAsManyRelationConfig,
} from "./role-assignments.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ROLE_ASSIGNMENTS_RELATION_KEYS = [
  "account",
  "delegation",
  "grantedByRelation",
  "membership",
  "revokedByRelation",
  "role",
  "scope",
] as const satisfies readonly RoleAssignmentsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ROLE_ASSIGNMENTS_SORTABLE_FIELDS = [
  "accountId",
  "createdAt",
  "delegationId",
  "expiresAt",
  "grantedBy",
  "id",
  "membershipId",
  "revocationReason",
  "revokedAt",
  "revokedBy",
  "roleId",
  "scopeId",
  "startsAt",
] as const satisfies readonly RoleAssignmentsKey[];

export const ROLE_ASSIGNMENTS_SEARCHABLE_FIELDS = [
  "revocationReason",
] as const satisfies readonly RoleAssignmentsKey[];

export const ROLE_ASSIGNMENTS_FILTERABLE_FIELDS = [
  "accountId",
  "delegationId",
  "grantedBy",
  "id",
  "membershipId",
  "revokedBy",
  "roleId",
  "scopeId",
] as const satisfies readonly RoleAssignmentsKey[];

export const ROLE_ASSIGNMENTS_DATE_RANGE_FIELDS = [
  "createdAt",
  "expiresAt",
  "revokedAt",
  "startsAt",
] as const satisfies readonly RoleAssignmentsKey[];

export const ROLE_ASSIGNMENTS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IRoleAssignments> =
  {
    searchableFields: [...ROLE_ASSIGNMENTS_SEARCHABLE_FIELDS],
    filterFields: [...ROLE_ASSIGNMENTS_FILTERABLE_FIELDS],
    dateRangeFields: [...ROLE_ASSIGNMENTS_DATE_RANGE_FIELDS],
  };

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ROLE_ASSIGNMENTS_SELECTABLE_FIELDS = [
  "accountId",
  "createdAt",
  "delegationId",
  "expiresAt",
  "grantedBy",
  "id",
  "membershipId",
  "revocationReason",
  "revokedAt",
  "revokedBy",
  "roleId",
  "scopeId",
  "startsAt",
] as const satisfies readonly RoleAssignmentsKey[];

export const ROLE_ASSIGNMENTS_DEFAULT_SELECT_FIELDS = [
  "accountId",
  "createdAt",
  "delegationId",
  "expiresAt",
  "grantedBy",
  "id",
  "membershipId",
  "revocationReason",
  "revokedAt",
  "revokedBy",
  "roleId",
  "scopeId",
  "startsAt",
] as const satisfies readonly RoleAssignmentsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ROLE_ASSIGNMENTS_EDITABLE_FIELDS = [
  "accountId",
  "delegationId",
  "expiresAt",
  "grantedBy",
  "membershipId",
  "revocationReason",
  "revokedAt",
  "revokedBy",
  "roleId",
  "scopeId",
  "startsAt",
] as const satisfies readonly RoleAssignmentsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ROLE_ASSIGNMENTS_AS_ONE_RELATION_CONFIG = {
  relation: "roleAssignments",
  type: ERelationType.One,
  selectableFields: ROLE_ASSIGNMENTS_SELECTABLE_FIELDS,
  defaultSelectFields: ROLE_ASSIGNMENTS_DEFAULT_SELECT_FIELDS,
} as const satisfies IRoleAssignmentsAsOneRelationConfig;

export const ROLE_ASSIGNMENTS_AS_MANY_RELATION_CONFIG = {
  relation: "roleAssignments",
  type: ERelationType.Many,
  selectableFields: ROLE_ASSIGNMENTS_SELECTABLE_FIELDS,
  defaultSelectFields: ROLE_ASSIGNMENTS_DEFAULT_SELECT_FIELDS,
  sortableFields: ROLE_ASSIGNMENTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IRoleAssignmentsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ROLE_ASSIGNMENTS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<RoleAssignmentsRelationKey>().one(
    AccountsConfig.ACCOUNTS_AS_ONE_RELATION_CONFIG,
    "account",
  ),
  Q.createRelationKeyMapper<RoleAssignmentsRelationKey>().one(
    DelegationsConfig.DELEGATIONS_AS_ONE_RELATION_CONFIG,
    "delegation",
  ),
  Q.createRelationKeyMapper<RoleAssignmentsRelationKey>().one(
    AccountsConfig.ACCOUNTS_AS_ONE_RELATION_CONFIG,
    "grantedByRelation",
  ),
  Q.createRelationKeyMapper<RoleAssignmentsRelationKey>().one(
    MembershipsConfig.MEMBERSHIPS_AS_ONE_RELATION_CONFIG,
    "membership",
  ),
  Q.createRelationKeyMapper<RoleAssignmentsRelationKey>().one(
    AccountsConfig.ACCOUNTS_AS_ONE_RELATION_CONFIG,
    "revokedByRelation",
  ),
  Q.createRelationKeyMapper<RoleAssignmentsRelationKey>().one(
    RolesConfig.ROLES_AS_ONE_RELATION_CONFIG,
    "role",
  ),
  Q.createRelationKeyMapper<RoleAssignmentsRelationKey>().one(
    ScopesConfig.SCOPES_AS_ONE_RELATION_CONFIG,
    "scope",
  ),
] as const;

export const ROLE_ASSIGNMENTS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ROLE_ASSIGNMENTS_QUERY_OPTIONS = {
  searchableFields: ROLE_ASSIGNMENTS_SEARCHABLE_FIELDS,
  selectableFields: ROLE_ASSIGNMENTS_SELECTABLE_FIELDS,
  defaultSelectFields: ROLE_ASSIGNMENTS_DEFAULT_SELECT_FIELDS,
  sortableFields: ROLE_ASSIGNMENTS_SORTABLE_FIELDS,
  filterFields: ROLE_ASSIGNMENTS_FILTERABLE_FIELDS,
  dateRangeFields: ROLE_ASSIGNMENTS_DATE_RANGE_FIELDS,
  relationKeys: ROLE_ASSIGNMENTS_RELATION_KEYS,
  editableFields: ROLE_ASSIGNMENTS_EDITABLE_FIELDS,
  asOne: ROLE_ASSIGNMENTS_AS_ONE_RELATION_CONFIG,
  asMany: ROLE_ASSIGNMENTS_AS_MANY_RELATION_CONFIG,
  oneRelations: ROLE_ASSIGNMENTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ROLE_ASSIGNMENTS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IRoleAssignments,
  RoleAssignmentsSortableField,
  RoleAssignmentsSelectableField,
  RoleAssignmentsFilterableField,
  RoleAssignmentsDateRangeField,
  RoleAssignmentsRelationKey,
  typeof ROLE_ASSIGNMENTS_ONE_RELATION_QUERY_OPTIONS,
  typeof ROLE_ASSIGNMENTS_MANY_RELATION_QUERY_OPTIONS
>;
