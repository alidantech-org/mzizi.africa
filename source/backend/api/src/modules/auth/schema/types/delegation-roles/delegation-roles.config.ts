// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as DelegationsConfig from "#/modules/auth/schema/types/delegations/delegations.config";
import * as RolesConfig from "#/modules/auth/schema/types/roles/roles.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IDelegationRoles,
  DelegationRolesKey,
  DelegationRolesRelationKey,
  DelegationRolesSortableField,
  DelegationRolesFilterableField,
  DelegationRolesDateRangeField,
  DelegationRolesSelectableField,
  IDelegationRolesAsOneRelationConfig,
  IDelegationRolesAsManyRelationConfig,
} from "./delegation-roles.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DELEGATION_ROLES_RELATION_KEYS = [
  "delegation",
  "role",
] as const satisfies readonly DelegationRolesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DELEGATION_ROLES_SORTABLE_FIELDS = [
  "delegationId",
  "roleId",
] as const satisfies readonly DelegationRolesKey[];

export const DELEGATION_ROLES_SEARCHABLE_FIELDS =
  [] as const satisfies readonly DelegationRolesKey[];

export const DELEGATION_ROLES_FILTERABLE_FIELDS = [
  "delegationId",
  "roleId",
] as const satisfies readonly DelegationRolesKey[];

export const DELEGATION_ROLES_DATE_RANGE_FIELDS =
  [] as const satisfies readonly DelegationRolesKey[];

export const DELEGATION_ROLES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IDelegationRoles> =
  {
    searchableFields: [...DELEGATION_ROLES_SEARCHABLE_FIELDS],
    filterFields: [...DELEGATION_ROLES_FILTERABLE_FIELDS],
    dateRangeFields: [...DELEGATION_ROLES_DATE_RANGE_FIELDS],
  };

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DELEGATION_ROLES_SELECTABLE_FIELDS = [
  "delegationId",
  "roleId",
] as const satisfies readonly DelegationRolesKey[];

export const DELEGATION_ROLES_DEFAULT_SELECT_FIELDS = [
  "delegationId",
  "roleId",
] as const satisfies readonly DelegationRolesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DELEGATION_ROLES_EDITABLE_FIELDS = [
  "delegationId",
  "roleId",
] as const satisfies readonly DelegationRolesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DELEGATION_ROLES_AS_ONE_RELATION_CONFIG = {
  relation: "delegationRoles",
  type: ERelationType.One,
  selectableFields: DELEGATION_ROLES_SELECTABLE_FIELDS,
  defaultSelectFields: DELEGATION_ROLES_DEFAULT_SELECT_FIELDS,
} as const satisfies IDelegationRolesAsOneRelationConfig;

export const DELEGATION_ROLES_AS_MANY_RELATION_CONFIG = {
  relation: "delegationRoles",
  type: ERelationType.Many,
  selectableFields: DELEGATION_ROLES_SELECTABLE_FIELDS,
  defaultSelectFields: DELEGATION_ROLES_DEFAULT_SELECT_FIELDS,
  sortableFields: DELEGATION_ROLES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IDelegationRolesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DELEGATION_ROLES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<DelegationRolesRelationKey>().one(
    DelegationsConfig.DELEGATIONS_AS_ONE_RELATION_CONFIG,
    "delegation",
  ),
  Q.createRelationKeyMapper<DelegationRolesRelationKey>().one(
    RolesConfig.ROLES_AS_ONE_RELATION_CONFIG,
    "role",
  ),
] as const;

export const DELEGATION_ROLES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const DELEGATION_ROLES_QUERY_OPTIONS = {
  searchableFields: DELEGATION_ROLES_SEARCHABLE_FIELDS,
  selectableFields: DELEGATION_ROLES_SELECTABLE_FIELDS,
  defaultSelectFields: DELEGATION_ROLES_DEFAULT_SELECT_FIELDS,
  sortableFields: DELEGATION_ROLES_SORTABLE_FIELDS,
  filterFields: DELEGATION_ROLES_FILTERABLE_FIELDS,
  dateRangeFields: DELEGATION_ROLES_DATE_RANGE_FIELDS,
  relationKeys: DELEGATION_ROLES_RELATION_KEYS,
  editableFields: DELEGATION_ROLES_EDITABLE_FIELDS,
  asOne: DELEGATION_ROLES_AS_ONE_RELATION_CONFIG,
  asMany: DELEGATION_ROLES_AS_MANY_RELATION_CONFIG,
  oneRelations: DELEGATION_ROLES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DELEGATION_ROLES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IDelegationRoles,
  DelegationRolesSortableField,
  DelegationRolesSelectableField,
  DelegationRolesFilterableField,
  DelegationRolesDateRangeField,
  DelegationRolesRelationKey,
  typeof DELEGATION_ROLES_ONE_RELATION_QUERY_OPTIONS,
  typeof DELEGATION_ROLES_MANY_RELATION_QUERY_OPTIONS
>;
