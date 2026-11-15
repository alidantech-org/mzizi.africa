// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as AccountsTypes from '#/modules/auth/types/accounts/accounts.types';
import type * as PermissionsTypes from '#/modules/auth/types/permissions/permissions.types';
import type * as RolesTypes from '#/modules/auth/types/roles/roles.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ROLE_PERMISSIONS_RELATION_KEYS,
  ROLE_PERMISSIONS_SORTABLE_FIELDS,
  ROLE_PERMISSIONS_SEARCHABLE_FIELDS,
  ROLE_PERMISSIONS_FILTERABLE_FIELDS,
  ROLE_PERMISSIONS_DATE_RANGE_FIELDS,
  ROLE_PERMISSIONS_SELECTABLE_FIELDS,
  ROLE_PERMISSIONS_DEFAULT_SELECT_FIELDS,
  ROLE_PERMISSIONS_EDITABLE_FIELDS
} from './role-permissions.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Permission granted to a role, with who granted it and when. */
export interface IRolePermissions extends B.IBase {
  grantedAt: Date;
  grantedBy: string;
  permissionId: string;
  roleId: string;
  readonly grantedByRelation?: AccountsTypes.IAccounts;
  readonly permission?: PermissionsTypes.IPermissions;
  readonly role?: RolesTypes.IRoles;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type RolePermissionsKey = keyof IRolePermissions;

export type RolePermissionsRelationKey = (typeof ROLE_PERMISSIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IRolePermissionsReadonlyFields = B.IBaseReadonlyFields;

export type IRolePermissionsContextualFields = never;

export type IRolePermissionsSensitiveFields = never;

export type IRolePermissionsTransitionFields = never;

export type IRolePermissionsImmutableFields =
  | IRolePermissionsReadonlyFields
  | IRolePermissionsContextualFields
  | IRolePermissionsSensitiveFields
  | IRolePermissionsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IRolePermissionsCreatable = Omit<IRolePermissions, IRolePermissionsImmutableFields | RolePermissionsRelationKey>;

export type IRolePermissionsSystemWritable = Omit<IRolePermissions, B.IBaseReadonlyFields | RolePermissionsRelationKey>;

export type IRolePermissionsUpdatable = Partial<Omit<IRolePermissions, IRolePermissionsImmutableFields | RolePermissionsRelationKey>>;

export interface IRolePermissionsTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type RolePermissionsSortableField = (typeof ROLE_PERMISSIONS_SORTABLE_FIELDS)[number];

export type RolePermissionsSearchableField = (typeof ROLE_PERMISSIONS_SEARCHABLE_FIELDS)[number];

export type RolePermissionsFilterableField = (typeof ROLE_PERMISSIONS_FILTERABLE_FIELDS)[number];

export type RolePermissionsDateRangeField = (typeof ROLE_PERMISSIONS_DATE_RANGE_FIELDS)[number];

export type RolePermissionsSelectableField = (typeof ROLE_PERMISSIONS_SELECTABLE_FIELDS)[number];

export type RolePermissionsDefaultSelectField = (typeof ROLE_PERMISSIONS_DEFAULT_SELECT_FIELDS)[number];

export type RolePermissionsEditableField = (typeof ROLE_PERMISSIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IRolePermissionsAsOneRelationConfig = Q.IOneRelationConfig<'rolePermissions', RolePermissionsSelectableField>;

export type IRolePermissionsAsManyRelationConfig = Q.IManyRelationConfig<'rolePermissionss', RolePermissionsSelectableField, RolePermissionsSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IRolePermissionsAsOneRelationQuery = Q.IAsOneRelationQuery<IRolePermissions, RolePermissionsSelectableField>;

export type IRolePermissionsAsManyRelationQuery = Q.IAsManyRelationQuery<IRolePermissions, RolePermissionsSelectableField, RolePermissionsSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IRolePermissionsRelationMap extends Record<RolePermissionsRelationKey, unknown> {
  grantedByRelation: AccountsTypes.IAccountsAsOneRelationQuery;
  permission: PermissionsTypes.IPermissionsAsOneRelationQuery;
  role: RolesTypes.IRolesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IRolePermissionsRelationQueries = Q.IBaseRelationQueries<IRolePermissions, RolePermissionsRelationKey, IRolePermissionsRelationMap>;

export type IRolePermissionsItemQuery = Q.IBaseItemQuery<
  IRolePermissions,
  RolePermissionsRelationKey,
  RolePermissionsSelectableField,
  RolePermissionsRelationKey,
  RolePermissionsSelectableField,
  IRolePermissionsRelationMap,
  IRolePermissionsRelationQueries
>;

export type IRolePermissionsListQuery = Q.IBaseListQuery<
  IRolePermissions,
  RolePermissionsRelationKey,
  RolePermissionsSelectableField,
  RolePermissionsSortableField,
  RolePermissionsRelationKey,
  RolePermissionsSelectableField,
  RolePermissionsSortableField,
  RolePermissionsDateRangeField,
  RolePermissionsFilterableField,
  IRolePermissionsRelationMap,
  IRolePermissionsRelationQueries,
  IRolePermissionsItemQuery
>;