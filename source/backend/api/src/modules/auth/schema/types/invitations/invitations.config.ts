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

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IInvitations,
  InvitationsKey,
  InvitationsRelationKey,
  InvitationsSortableField,
  InvitationsFilterableField,
  InvitationsDateRangeField,
  InvitationsSelectableField,
  IInvitationsAsOneRelationConfig,
  IInvitationsAsManyRelationConfig,
} from "./invitations.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const INVITATIONS_RELATION_KEYS = [
  "acceptedAccount",
  "invitedByRelation",
] as const satisfies readonly InvitationsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const INVITATIONS_SORTABLE_FIELDS = [
  "acceptedAccountId",
  "acceptedAt",
  "createdAt",
  "expiresAt",
  "id",
  "institutionRefId",
  "intendedEmail",
  "invitedBy",
  "revokedAt",
  "tokenDigest",
] as const satisfies readonly InvitationsKey[];

export const INVITATIONS_SEARCHABLE_FIELDS = [
  "tokenDigest",
] as const satisfies readonly InvitationsKey[];

export const INVITATIONS_FILTERABLE_FIELDS = [
  "acceptedAccountId",
  "id",
  "institutionRefId",
  "invitedBy",
] as const satisfies readonly InvitationsKey[];

export const INVITATIONS_DATE_RANGE_FIELDS = [
  "acceptedAt",
  "createdAt",
  "expiresAt",
  "revokedAt",
] as const satisfies readonly InvitationsKey[];

export const INVITATIONS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IInvitations> = {
  searchableFields: [...INVITATIONS_SEARCHABLE_FIELDS],
  filterFields: [...INVITATIONS_FILTERABLE_FIELDS],
  dateRangeFields: [...INVITATIONS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const INVITATIONS_SELECTABLE_FIELDS = [
  "acceptedAccountId",
  "acceptedAt",
  "createdAt",
  "expiresAt",
  "id",
  "institutionRefId",
  "intendedEmail",
  "invitedBy",
  "revokedAt",
  "tokenDigest",
] as const satisfies readonly InvitationsKey[];

export const INVITATIONS_DEFAULT_SELECT_FIELDS = [
  "acceptedAccountId",
  "acceptedAt",
  "createdAt",
  "expiresAt",
  "id",
  "institutionRefId",
  "intendedEmail",
  "invitedBy",
  "revokedAt",
  "tokenDigest",
] as const satisfies readonly InvitationsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const INVITATIONS_EDITABLE_FIELDS = [
  "acceptedAccountId",
  "acceptedAt",
  "expiresAt",
  "institutionRefId",
  "intendedEmail",
  "invitedBy",
  "revokedAt",
  "tokenDigest",
] as const satisfies readonly InvitationsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const INVITATIONS_AS_ONE_RELATION_CONFIG = {
  relation: "invitations",
  type: ERelationType.One,
  selectableFields: INVITATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: INVITATIONS_DEFAULT_SELECT_FIELDS,
} as const satisfies IInvitationsAsOneRelationConfig;

export const INVITATIONS_AS_MANY_RELATION_CONFIG = {
  relation: "invitations",
  type: ERelationType.Many,
  selectableFields: INVITATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: INVITATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: INVITATIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IInvitationsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const INVITATIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<InvitationsRelationKey>().one(
    AccountsConfig.ACCOUNTS_AS_ONE_RELATION_CONFIG,
    "acceptedAccount",
  ),
  Q.createRelationKeyMapper<InvitationsRelationKey>().one(
    AccountsConfig.ACCOUNTS_AS_ONE_RELATION_CONFIG,
    "invitedByRelation",
  ),
] as const;

export const INVITATIONS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const INVITATIONS_QUERY_OPTIONS = {
  searchableFields: INVITATIONS_SEARCHABLE_FIELDS,
  selectableFields: INVITATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: INVITATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: INVITATIONS_SORTABLE_FIELDS,
  filterFields: INVITATIONS_FILTERABLE_FIELDS,
  dateRangeFields: INVITATIONS_DATE_RANGE_FIELDS,
  relationKeys: INVITATIONS_RELATION_KEYS,
  editableFields: INVITATIONS_EDITABLE_FIELDS,
  asOne: INVITATIONS_AS_ONE_RELATION_CONFIG,
  asMany: INVITATIONS_AS_MANY_RELATION_CONFIG,
  oneRelations: INVITATIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: INVITATIONS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IInvitations,
  InvitationsSortableField,
  InvitationsSelectableField,
  InvitationsFilterableField,
  InvitationsDateRangeField,
  InvitationsRelationKey,
  typeof INVITATIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof INVITATIONS_MANY_RELATION_QUERY_OPTIONS
>;
