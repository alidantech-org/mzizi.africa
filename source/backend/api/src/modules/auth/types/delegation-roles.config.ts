// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as DelegationsConfig from '#/modules/auth/types/delegations.config';
import * as RolesConfig from '#/modules/auth/types/roles.config';

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
  IDelegationRolesAsManyRelationConfig
} from './delegation-roles.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DELEGATION_ROLES_RELATION_KEYS = ['delegation', 'role', ] as const satisfies readonly DelegationRolesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DELEGATION_ROLES_SORTABLE_FIELDS = [] as const satisfies readonly DelegationRolesKey[];

export const DELEGATION_ROLES_SEARCHABLE_FIELDS = [] as const satisfies readonly DelegationRolesKey[];

export const DELEGATION_ROLES_FILTERABLE_FIELDS = [] as const satisfies readonly DelegationRolesKey[];

export const DELEGATION_ROLES_DATE_RANGE_FIELDS = [] as const satisfies readonly DelegationRolesKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DELEGATION_ROLES_SELECTABLE_FIELDS = ['delegationId', 'roleId', ] as const satisfies readonly DelegationRolesKey[];

export const DELEGATION_ROLES_DEFAULT_SELECT_FIELDS = ['delegationId', 'roleId', ] as const satisfies readonly DelegationRolesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DELEGATION_ROLES_EDITABLE_FIELDS = ['delegationId', 'roleId', ] as const satisfies readonly DelegationRolesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DELEGATION_ROLES_AS_ONE_RELATION_CONFIG = {
  relation: 'delegationRoles',
  type: ERelationType.One,
  selectableFields: DELEGATION_ROLES_SELECTABLE_FIELDS,
  defaultSelectFields: DELEGATION_ROLES_DEFAULT_SELECT_FIELDS
} as const satisfies IDelegationRolesAsOneRelationConfig;

export const DELEGATION_ROLES_AS_MANY_RELATION_CONFIG = {
  relation: 'delegationRoless',
  type: ERelationType.Many,
  selectableFields: DELEGATION_ROLES_SELECTABLE_FIELDS,
  defaultSelectFields: DELEGATION_ROLES_DEFAULT_SELECT_FIELDS,
  sortableFields: DELEGATION_ROLES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IDelegationRolesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DELEGATION_ROLES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<DelegationRolesRelationKey>().one(DelegationsConfig.DELEGATIONS_AS_ONE_RELATION_CONFIG, 'delegation'),
  Q.createRelationKeyMapper<DelegationRolesRelationKey>().one(RolesConfig.ROLES_AS_ONE_RELATION_CONFIG, 'role'),
] as const;

export const DELEGATION_ROLES_MANY_RELATION_QUERY_OPTIONS = [
] as const;

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
  oneRelations: DELEGATION_ROLES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DELEGATION_ROLES_MANY_RELATION_QUERY_OPTIONS
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