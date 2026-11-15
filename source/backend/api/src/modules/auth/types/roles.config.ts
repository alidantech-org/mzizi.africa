// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IRoles,
  RolesKey,
  RolesRelationKey,
  RolesSortableField,
  RolesFilterableField,
  RolesDateRangeField,
  RolesSelectableField,
  IRolesAsOneRelationConfig,
  IRolesAsManyRelationConfig
} from './roles.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ROLES_RELATION_KEYS = [] as const satisfies readonly RolesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ROLES_SORTABLE_FIELDS = [] as const satisfies readonly RolesKey[];

export const ROLES_SEARCHABLE_FIELDS = [] as const satisfies readonly RolesKey[];

export const ROLES_FILTERABLE_FIELDS = [] as const satisfies readonly RolesKey[];

export const ROLES_DATE_RANGE_FIELDS = [] as const satisfies readonly RolesKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ROLES_SELECTABLE_FIELDS = ['code', 'createdAt', 'description', 'id', 'managingInstitutionRefId', 'policyVersion', 'protected', 'retiredAt', 'title', ] as const satisfies readonly RolesKey[];

export const ROLES_DEFAULT_SELECT_FIELDS = ['code', 'createdAt', 'description', 'id', 'managingInstitutionRefId', 'policyVersion', 'protected', 'retiredAt', 'title', ] as const satisfies readonly RolesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ROLES_EDITABLE_FIELDS = ['code', 'description', 'managingInstitutionRefId', 'policyVersion', 'protected', 'retiredAt', 'title', ] as const satisfies readonly RolesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ROLES_AS_ONE_RELATION_CONFIG = {
  relation: 'roles',
  type: ERelationType.One,
  selectableFields: ROLES_SELECTABLE_FIELDS,
  defaultSelectFields: ROLES_DEFAULT_SELECT_FIELDS
} as const satisfies IRolesAsOneRelationConfig;

export const ROLES_AS_MANY_RELATION_CONFIG = {
  relation: 'roless',
  type: ERelationType.Many,
  selectableFields: ROLES_SELECTABLE_FIELDS,
  defaultSelectFields: ROLES_DEFAULT_SELECT_FIELDS,
  sortableFields: ROLES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IRolesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ROLES_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const ROLES_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ROLES_QUERY_OPTIONS = {
  searchableFields: ROLES_SEARCHABLE_FIELDS,
  selectableFields: ROLES_SELECTABLE_FIELDS,
  defaultSelectFields: ROLES_DEFAULT_SELECT_FIELDS,
  sortableFields: ROLES_SORTABLE_FIELDS,
  filterFields: ROLES_FILTERABLE_FIELDS,
  dateRangeFields: ROLES_DATE_RANGE_FIELDS,
  oneRelations: ROLES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ROLES_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IRoles,
  RolesSortableField,
  RolesSelectableField,
  RolesFilterableField,
  RolesDateRangeField,
  RolesRelationKey,
  typeof ROLES_ONE_RELATION_QUERY_OPTIONS,
  typeof ROLES_MANY_RELATION_QUERY_OPTIONS
>;