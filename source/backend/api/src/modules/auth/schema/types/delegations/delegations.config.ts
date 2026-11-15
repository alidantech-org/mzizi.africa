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
import * as ScopesConfig from "#/modules/auth/schema/types/scopes/scopes.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IDelegations,
  DelegationsKey,
  DelegationsRelationKey,
  DelegationsSortableField,
  DelegationsFilterableField,
  DelegationsDateRangeField,
  DelegationsSelectableField,
  IDelegationsAsOneRelationConfig,
  IDelegationsAsManyRelationConfig,
} from "./delegations.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DELEGATIONS_RELATION_KEYS = [
  "delegateAccount",
  "delegatorAccount",
  "revokedByRelation",
  "scope",
] as const satisfies readonly DelegationsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DELEGATIONS_SORTABLE_FIELDS = [
  "createdAt",
  "delegateAccountId",
  "delegatorAccountId",
  "expiresAt",
  "id",
  "revokedAt",
  "revokedBy",
  "scopeId",
  "startsAt",
] as const satisfies readonly DelegationsKey[];

export const DELEGATIONS_SEARCHABLE_FIELDS = [] as const satisfies readonly DelegationsKey[];

export const DELEGATIONS_FILTERABLE_FIELDS = [
  "delegateAccountId",
  "delegatorAccountId",
  "id",
  "revokedBy",
  "scopeId",
] as const satisfies readonly DelegationsKey[];

export const DELEGATIONS_DATE_RANGE_FIELDS = [
  "createdAt",
  "expiresAt",
  "revokedAt",
  "startsAt",
] as const satisfies readonly DelegationsKey[];

export const DELEGATIONS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IDelegations> = {
  searchableFields: [...DELEGATIONS_SEARCHABLE_FIELDS],
  filterFields: [...DELEGATIONS_FILTERABLE_FIELDS],
  dateRangeFields: [...DELEGATIONS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DELEGATIONS_SELECTABLE_FIELDS = [
  "createdAt",
  "delegateAccountId",
  "delegatorAccountId",
  "expiresAt",
  "id",
  "revokedAt",
  "revokedBy",
  "scopeId",
  "startsAt",
] as const satisfies readonly DelegationsKey[];

export const DELEGATIONS_DEFAULT_SELECT_FIELDS = [
  "createdAt",
  "delegateAccountId",
  "delegatorAccountId",
  "expiresAt",
  "id",
  "revokedAt",
  "revokedBy",
  "scopeId",
  "startsAt",
] as const satisfies readonly DelegationsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DELEGATIONS_EDITABLE_FIELDS = [
  "delegateAccountId",
  "delegatorAccountId",
  "expiresAt",
  "revokedAt",
  "revokedBy",
  "scopeId",
  "startsAt",
] as const satisfies readonly DelegationsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DELEGATIONS_AS_ONE_RELATION_CONFIG = {
  relation: "delegations",
  type: ERelationType.One,
  selectableFields: DELEGATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: DELEGATIONS_DEFAULT_SELECT_FIELDS,
} as const satisfies IDelegationsAsOneRelationConfig;

export const DELEGATIONS_AS_MANY_RELATION_CONFIG = {
  relation: "delegations",
  type: ERelationType.Many,
  selectableFields: DELEGATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: DELEGATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: DELEGATIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IDelegationsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DELEGATIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<DelegationsRelationKey>().one(
    AccountsConfig.ACCOUNTS_AS_ONE_RELATION_CONFIG,
    "delegateAccount",
  ),
  Q.createRelationKeyMapper<DelegationsRelationKey>().one(
    AccountsConfig.ACCOUNTS_AS_ONE_RELATION_CONFIG,
    "delegatorAccount",
  ),
  Q.createRelationKeyMapper<DelegationsRelationKey>().one(
    AccountsConfig.ACCOUNTS_AS_ONE_RELATION_CONFIG,
    "revokedByRelation",
  ),
  Q.createRelationKeyMapper<DelegationsRelationKey>().one(
    ScopesConfig.SCOPES_AS_ONE_RELATION_CONFIG,
    "scope",
  ),
] as const;

export const DELEGATIONS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const DELEGATIONS_QUERY_OPTIONS = {
  searchableFields: DELEGATIONS_SEARCHABLE_FIELDS,
  selectableFields: DELEGATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: DELEGATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: DELEGATIONS_SORTABLE_FIELDS,
  filterFields: DELEGATIONS_FILTERABLE_FIELDS,
  dateRangeFields: DELEGATIONS_DATE_RANGE_FIELDS,
  relationKeys: DELEGATIONS_RELATION_KEYS,
  editableFields: DELEGATIONS_EDITABLE_FIELDS,
  asOne: DELEGATIONS_AS_ONE_RELATION_CONFIG,
  asMany: DELEGATIONS_AS_MANY_RELATION_CONFIG,
  oneRelations: DELEGATIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DELEGATIONS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IDelegations,
  DelegationsSortableField,
  DelegationsSelectableField,
  DelegationsFilterableField,
  DelegationsDateRangeField,
  DelegationsRelationKey,
  typeof DELEGATIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof DELEGATIONS_MANY_RELATION_QUERY_OPTIONS
>;
