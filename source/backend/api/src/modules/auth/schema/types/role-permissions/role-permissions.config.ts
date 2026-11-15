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
import * as PermissionsConfig from "#/modules/auth/schema/types/permissions/permissions.config";
import * as RolesConfig from "#/modules/auth/schema/types/roles/roles.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IRolePermissions,
  RolePermissionsKey,
  RolePermissionsRelationKey,
  RolePermissionsSortableField,
  RolePermissionsFilterableField,
  RolePermissionsDateRangeField,
  RolePermissionsSelectableField,
  IRolePermissionsAsOneRelationConfig,
  IRolePermissionsAsManyRelationConfig,
} from "./role-permissions.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ROLE_PERMISSIONS_RELATION_KEYS = [
  "grantedByRelation",
  "permission",
  "role",
] as const satisfies readonly RolePermissionsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ROLE_PERMISSIONS_SORTABLE_FIELDS = [
  "grantedAt",
  "grantedBy",
  "permissionId",
  "roleId",
] as const satisfies readonly RolePermissionsKey[];

export const ROLE_PERMISSIONS_SEARCHABLE_FIELDS =
  [] as const satisfies readonly RolePermissionsKey[];

export const ROLE_PERMISSIONS_FILTERABLE_FIELDS = [
  "grantedBy",
  "permissionId",
  "roleId",
] as const satisfies readonly RolePermissionsKey[];

export const ROLE_PERMISSIONS_DATE_RANGE_FIELDS = [
  "grantedAt",
] as const satisfies readonly RolePermissionsKey[];

export const ROLE_PERMISSIONS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IRolePermissions> =
  {
    searchableFields: [...ROLE_PERMISSIONS_SEARCHABLE_FIELDS],
    filterFields: [...ROLE_PERMISSIONS_FILTERABLE_FIELDS],
    dateRangeFields: [...ROLE_PERMISSIONS_DATE_RANGE_FIELDS],
  };

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ROLE_PERMISSIONS_SELECTABLE_FIELDS = [
  "grantedAt",
  "grantedBy",
  "permissionId",
  "roleId",
] as const satisfies readonly RolePermissionsKey[];

export const ROLE_PERMISSIONS_DEFAULT_SELECT_FIELDS = [
  "grantedAt",
  "grantedBy",
  "permissionId",
  "roleId",
] as const satisfies readonly RolePermissionsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ROLE_PERMISSIONS_EDITABLE_FIELDS = [
  "grantedAt",
  "grantedBy",
  "permissionId",
  "roleId",
] as const satisfies readonly RolePermissionsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ROLE_PERMISSIONS_AS_ONE_RELATION_CONFIG = {
  relation: "rolePermissions",
  type: ERelationType.One,
  selectableFields: ROLE_PERMISSIONS_SELECTABLE_FIELDS,
  defaultSelectFields: ROLE_PERMISSIONS_DEFAULT_SELECT_FIELDS,
} as const satisfies IRolePermissionsAsOneRelationConfig;

export const ROLE_PERMISSIONS_AS_MANY_RELATION_CONFIG = {
  relation: "rolePermissions",
  type: ERelationType.Many,
  selectableFields: ROLE_PERMISSIONS_SELECTABLE_FIELDS,
  defaultSelectFields: ROLE_PERMISSIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: ROLE_PERMISSIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IRolePermissionsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ROLE_PERMISSIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<RolePermissionsRelationKey>().one(
    AccountsConfig.ACCOUNTS_AS_ONE_RELATION_CONFIG,
    "grantedByRelation",
  ),
  Q.createRelationKeyMapper<RolePermissionsRelationKey>().one(
    PermissionsConfig.PERMISSIONS_AS_ONE_RELATION_CONFIG,
    "permission",
  ),
  Q.createRelationKeyMapper<RolePermissionsRelationKey>().one(
    RolesConfig.ROLES_AS_ONE_RELATION_CONFIG,
    "role",
  ),
] as const;

export const ROLE_PERMISSIONS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ROLE_PERMISSIONS_QUERY_OPTIONS = {
  searchableFields: ROLE_PERMISSIONS_SEARCHABLE_FIELDS,
  selectableFields: ROLE_PERMISSIONS_SELECTABLE_FIELDS,
  defaultSelectFields: ROLE_PERMISSIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: ROLE_PERMISSIONS_SORTABLE_FIELDS,
  filterFields: ROLE_PERMISSIONS_FILTERABLE_FIELDS,
  dateRangeFields: ROLE_PERMISSIONS_DATE_RANGE_FIELDS,
  relationKeys: ROLE_PERMISSIONS_RELATION_KEYS,
  editableFields: ROLE_PERMISSIONS_EDITABLE_FIELDS,
  asOne: ROLE_PERMISSIONS_AS_ONE_RELATION_CONFIG,
  asMany: ROLE_PERMISSIONS_AS_MANY_RELATION_CONFIG,
  oneRelations: ROLE_PERMISSIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ROLE_PERMISSIONS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IRolePermissions,
  RolePermissionsSortableField,
  RolePermissionsSelectableField,
  RolePermissionsFilterableField,
  RolePermissionsDateRangeField,
  RolePermissionsRelationKey,
  typeof ROLE_PERMISSIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof ROLE_PERMISSIONS_MANY_RELATION_QUERY_OPTIONS
>;
