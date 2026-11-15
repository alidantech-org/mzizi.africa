// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ROLES_RELATION_KEYS,
  ROLES_SORTABLE_FIELDS,
  ROLES_SEARCHABLE_FIELDS,
  ROLES_FILTERABLE_FIELDS,
  ROLES_DATE_RANGE_FIELDS,
  ROLES_SELECTABLE_FIELDS,
  ROLES_DEFAULT_SELECT_FIELDS,
  ROLES_EDITABLE_FIELDS
} from './roles.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Named permission bundle with a policy version; protected roles cannot be edited away. */
export interface IRoles extends B.IBase {
  code: string;
  description: string | null;
  managingInstitutionRefId: string | null;
  policyVersion: string;
  protected: boolean;
  retiredAt: Date | null;
  title: string;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type RolesKey = keyof IRoles;

export type RolesRelationKey = (typeof ROLES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IRolesReadonlyFields = B.IBaseReadonlyFields;

export type IRolesContextualFields = never;

export type IRolesSensitiveFields = never;

export type IRolesTransitionFields = never;

export type IRolesImmutableFields =
  | IRolesReadonlyFields
  | IRolesContextualFields
  | IRolesSensitiveFields
  | IRolesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IRolesCreatable = Omit<IRoles, IRolesImmutableFields | RolesRelationKey>;

export type IRolesSystemWritable = Omit<IRoles, B.IBaseReadonlyFields | RolesRelationKey>;

export type IRolesUpdatable = Partial<Omit<IRoles, IRolesImmutableFields | RolesRelationKey>>;

export interface IRolesTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type RolesSortableField = (typeof ROLES_SORTABLE_FIELDS)[number];

export type RolesSearchableField = (typeof ROLES_SEARCHABLE_FIELDS)[number];

export type RolesFilterableField = (typeof ROLES_FILTERABLE_FIELDS)[number];

export type RolesDateRangeField = (typeof ROLES_DATE_RANGE_FIELDS)[number];

export type RolesSelectableField = (typeof ROLES_SELECTABLE_FIELDS)[number];

export type RolesDefaultSelectField = (typeof ROLES_DEFAULT_SELECT_FIELDS)[number];

export type RolesEditableField = (typeof ROLES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IRolesAsOneRelationConfig = Q.IOneRelationConfig<'roles', RolesSelectableField>;

export type IRolesAsManyRelationConfig = Q.IManyRelationConfig<'roless', RolesSelectableField, RolesSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IRolesAsOneRelationQuery = Q.IAsOneRelationQuery<IRoles, RolesSelectableField>;

export type IRolesAsManyRelationQuery = Q.IAsManyRelationQuery<IRoles, RolesSelectableField, RolesSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IRolesRelationMap extends Record<RolesRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IRolesRelationQueries = Q.IBaseRelationQueries<IRoles, RolesRelationKey, IRolesRelationMap>;

export type IRolesItemQuery = Q.IBaseItemQuery<
  IRoles,
  RolesRelationKey,
  RolesSelectableField,
  RolesRelationKey,
  RolesSelectableField,
  IRolesRelationMap,
  IRolesRelationQueries
>;

export type IRolesListQuery = Q.IBaseListQuery<
  IRoles,
  RolesRelationKey,
  RolesSelectableField,
  RolesSortableField,
  RolesRelationKey,
  RolesSelectableField,
  RolesSortableField,
  RolesDateRangeField,
  RolesFilterableField,
  IRolesRelationMap,
  IRolesRelationQueries,
  IRolesItemQuery
>;