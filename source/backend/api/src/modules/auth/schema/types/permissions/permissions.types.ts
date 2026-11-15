// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { AuthAction } from "#/modules/auth/schema/enum/auth-action.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PERMISSIONS_RELATION_KEYS,
  PERMISSIONS_SORTABLE_FIELDS,
  PERMISSIONS_SEARCHABLE_FIELDS,
  PERMISSIONS_FILTERABLE_FIELDS,
  PERMISSIONS_DATE_RANGE_FIELDS,
  PERMISSIONS_SELECTABLE_FIELDS,
  PERMISSIONS_DEFAULT_SELECT_FIELDS,
  PERMISSIONS_EDITABLE_FIELDS,
} from "./permissions.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Named action on a resource type, optionally narrowed to a field group. */
export interface IPermissions extends B.IBase {
  action: AuthAction;
  code: string;
  description: string | null;
  fieldGroup: string | null;
  isActive: boolean;
  resourceType: string;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PermissionsKey = keyof IPermissions;

export type PermissionsRelationKey = (typeof PERMISSIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPermissionsReadonlyFields = B.IBaseReadonlyFields;

export type IPermissionsContextualFields = never;

export type IPermissionsSensitiveFields = never;

export type IPermissionsTransitionFields = never;

export type IPermissionsImmutableFields =
  | IPermissionsReadonlyFields
  | IPermissionsContextualFields
  | IPermissionsSensitiveFields
  | IPermissionsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPermissionsCreatable = Omit<
  IPermissions,
  IPermissionsImmutableFields | PermissionsRelationKey
>;

export type IPermissionsSystemWritable = Omit<
  IPermissions,
  B.IBaseReadonlyFields | PermissionsRelationKey
>;

export type IPermissionsUpdatable = Partial<
  Omit<IPermissions, IPermissionsImmutableFields | PermissionsRelationKey>
>;

export interface IPermissionsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PermissionsSortableField = (typeof PERMISSIONS_SORTABLE_FIELDS)[number];

export type PermissionsSearchableField = (typeof PERMISSIONS_SEARCHABLE_FIELDS)[number];

export type PermissionsFilterableField = (typeof PERMISSIONS_FILTERABLE_FIELDS)[number];

export type PermissionsDateRangeField = (typeof PERMISSIONS_DATE_RANGE_FIELDS)[number];

export type PermissionsSelectableField = (typeof PERMISSIONS_SELECTABLE_FIELDS)[number];

export type PermissionsDefaultSelectField = (typeof PERMISSIONS_DEFAULT_SELECT_FIELDS)[number];

export type PermissionsEditableField = (typeof PERMISSIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPermissionsAsOneRelationConfig = Q.IOneRelationConfig<
  "permissions",
  PermissionsSelectableField
>;

export type IPermissionsAsManyRelationConfig = Q.IManyRelationConfig<
  "permissions",
  PermissionsSelectableField,
  PermissionsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPermissionsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IPermissions,
  PermissionsSelectableField
>;

export type IPermissionsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IPermissions,
  PermissionsSelectableField,
  PermissionsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPermissionsRelationMap extends Record<PermissionsRelationKey, unknown> {}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPermissionsRelationQueries = Q.IBaseRelationQueries<
  IPermissions,
  PermissionsRelationKey,
  IPermissionsRelationMap
>;

export type IPermissionsItemQuery = Q.IBaseItemQuery<
  IPermissions,
  PermissionsRelationKey,
  PermissionsSelectableField,
  PermissionsRelationKey,
  PermissionsSelectableField,
  IPermissionsRelationMap,
  IPermissionsRelationQueries
>;

export type IPermissionsListQuery = Q.IBaseListQuery<
  IPermissions,
  PermissionsRelationKey,
  PermissionsSelectableField,
  PermissionsSortableField,
  PermissionsRelationKey,
  PermissionsSelectableField,
  PermissionsSortableField,
  PermissionsDateRangeField,
  PermissionsFilterableField,
  IPermissionsRelationMap,
  IPermissionsRelationQueries,
  IPermissionsItemQuery
>;
