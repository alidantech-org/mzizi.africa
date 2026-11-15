// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import { ERelationType } from '#/modules/common/schema/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IPermissions,
  PermissionsKey,
  PermissionsRelationKey,
  PermissionsSortableField,
  PermissionsFilterableField,
  PermissionsDateRangeField,
  PermissionsSelectableField,
  IPermissionsAsOneRelationConfig,
  IPermissionsAsManyRelationConfig
} from './permissions.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PERMISSIONS_RELATION_KEYS = [] as const satisfies readonly PermissionsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PERMISSIONS_SORTABLE_FIELDS = [] as const satisfies readonly PermissionsKey[];

export const PERMISSIONS_SEARCHABLE_FIELDS = [] as const satisfies readonly PermissionsKey[];

export const PERMISSIONS_FILTERABLE_FIELDS = [] as const satisfies readonly PermissionsKey[];

export const PERMISSIONS_DATE_RANGE_FIELDS = [] as const satisfies readonly PermissionsKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PERMISSIONS_SELECTABLE_FIELDS = ['action', 'code', 'description', 'fieldGroup', 'id', 'isActive', 'resourceType', ] as const satisfies readonly PermissionsKey[];

export const PERMISSIONS_DEFAULT_SELECT_FIELDS = ['action', 'code', 'description', 'fieldGroup', 'id', 'isActive', 'resourceType', ] as const satisfies readonly PermissionsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PERMISSIONS_EDITABLE_FIELDS = ['action', 'code', 'description', 'fieldGroup', 'isActive', 'resourceType', ] as const satisfies readonly PermissionsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PERMISSIONS_AS_ONE_RELATION_CONFIG = {
  relation: 'permissions',
  type: ERelationType.One,
  selectableFields: PERMISSIONS_SELECTABLE_FIELDS,
  defaultSelectFields: PERMISSIONS_DEFAULT_SELECT_FIELDS
} as const satisfies IPermissionsAsOneRelationConfig;

export const PERMISSIONS_AS_MANY_RELATION_CONFIG = {
  relation: 'permissionss',
  type: ERelationType.Many,
  selectableFields: PERMISSIONS_SELECTABLE_FIELDS,
  defaultSelectFields: PERMISSIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: PERMISSIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IPermissionsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PERMISSIONS_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const PERMISSIONS_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PERMISSIONS_QUERY_OPTIONS = {
  searchableFields: PERMISSIONS_SEARCHABLE_FIELDS,
  selectableFields: PERMISSIONS_SELECTABLE_FIELDS,
  defaultSelectFields: PERMISSIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: PERMISSIONS_SORTABLE_FIELDS,
  filterFields: PERMISSIONS_FILTERABLE_FIELDS,
  dateRangeFields: PERMISSIONS_DATE_RANGE_FIELDS,
  oneRelations: PERMISSIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PERMISSIONS_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IPermissions,
  PermissionsSortableField,
  PermissionsSelectableField,
  PermissionsFilterableField,
  PermissionsDateRangeField,
  PermissionsRelationKey,
  typeof PERMISSIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof PERMISSIONS_MANY_RELATION_QUERY_OPTIONS
>;