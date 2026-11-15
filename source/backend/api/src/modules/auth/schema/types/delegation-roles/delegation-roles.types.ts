// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as DelegationsTypes from "#/modules/auth/schema/types/delegations/delegations.types";
import type * as RolesTypes from "#/modules/auth/schema/types/roles/roles.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  DELEGATION_ROLES_RELATION_KEYS,
  DELEGATION_ROLES_SORTABLE_FIELDS,
  DELEGATION_ROLES_SEARCHABLE_FIELDS,
  DELEGATION_ROLES_FILTERABLE_FIELDS,
  DELEGATION_ROLES_DATE_RANGE_FIELDS,
  DELEGATION_ROLES_SELECTABLE_FIELDS,
  DELEGATION_ROLES_DEFAULT_SELECT_FIELDS,
  DELEGATION_ROLES_EDITABLE_FIELDS,
} from "./delegation-roles.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Role included in a delegation. */
export interface IDelegationRoles extends B.IBase {
  delegationId: string;
  roleId: string;
  readonly delegation?: DelegationsTypes.IDelegations;
  readonly role?: RolesTypes.IRoles;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type DelegationRolesKey = keyof IDelegationRoles;

export type DelegationRolesRelationKey = (typeof DELEGATION_ROLES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IDelegationRolesReadonlyFields = B.IBaseReadonlyFields;

export type IDelegationRolesContextualFields = never;

export type IDelegationRolesSensitiveFields = never;

export type IDelegationRolesTransitionFields = never;

export type IDelegationRolesImmutableFields =
  | IDelegationRolesReadonlyFields
  | IDelegationRolesContextualFields
  | IDelegationRolesSensitiveFields
  | IDelegationRolesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IDelegationRolesCreatable = Omit<
  IDelegationRoles,
  IDelegationRolesImmutableFields | DelegationRolesRelationKey
>;

export type IDelegationRolesSystemWritable = Omit<
  IDelegationRoles,
  B.IBaseReadonlyFields | DelegationRolesRelationKey
>;

export type IDelegationRolesUpdatable = Partial<
  Omit<IDelegationRoles, IDelegationRolesImmutableFields | DelegationRolesRelationKey>
>;

export interface IDelegationRolesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type DelegationRolesSortableField = (typeof DELEGATION_ROLES_SORTABLE_FIELDS)[number];

export type DelegationRolesSearchableField = (typeof DELEGATION_ROLES_SEARCHABLE_FIELDS)[number];

export type DelegationRolesFilterableField = (typeof DELEGATION_ROLES_FILTERABLE_FIELDS)[number];

export type DelegationRolesDateRangeField = (typeof DELEGATION_ROLES_DATE_RANGE_FIELDS)[number];

export type DelegationRolesSelectableField = (typeof DELEGATION_ROLES_SELECTABLE_FIELDS)[number];

export type DelegationRolesDefaultSelectField =
  (typeof DELEGATION_ROLES_DEFAULT_SELECT_FIELDS)[number];

export type DelegationRolesEditableField = (typeof DELEGATION_ROLES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IDelegationRolesAsOneRelationConfig = Q.IOneRelationConfig<
  "delegationRoles",
  DelegationRolesSelectableField
>;

export type IDelegationRolesAsManyRelationConfig = Q.IManyRelationConfig<
  "delegationRoles",
  DelegationRolesSelectableField,
  DelegationRolesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IDelegationRolesAsOneRelationQuery = Q.IAsOneRelationQuery<
  IDelegationRoles,
  DelegationRolesSelectableField
>;

export type IDelegationRolesAsManyRelationQuery = Q.IAsManyRelationQuery<
  IDelegationRoles,
  DelegationRolesSelectableField,
  DelegationRolesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IDelegationRolesRelationMap extends Record<DelegationRolesRelationKey, unknown> {
  delegation: DelegationsTypes.IDelegationsAsOneRelationQuery;
  role: RolesTypes.IRolesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IDelegationRolesRelationQueries = Q.IBaseRelationQueries<
  IDelegationRoles,
  DelegationRolesRelationKey,
  IDelegationRolesRelationMap
>;

export type IDelegationRolesItemQuery = Q.IBaseItemQuery<
  IDelegationRoles,
  DelegationRolesRelationKey,
  DelegationRolesSelectableField,
  DelegationRolesRelationKey,
  DelegationRolesSelectableField,
  IDelegationRolesRelationMap,
  IDelegationRolesRelationQueries
>;

export type IDelegationRolesListQuery = Q.IBaseListQuery<
  IDelegationRoles,
  DelegationRolesRelationKey,
  DelegationRolesSelectableField,
  DelegationRolesSortableField,
  DelegationRolesRelationKey,
  DelegationRolesSelectableField,
  DelegationRolesSortableField,
  DelegationRolesDateRangeField,
  DelegationRolesFilterableField,
  IDelegationRolesRelationMap,
  IDelegationRolesRelationQueries,
  IDelegationRolesItemQuery
>;
