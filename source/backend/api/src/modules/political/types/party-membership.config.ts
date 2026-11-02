// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as PartyConfig from '#/modules/political/types/party.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IPartyMembership,
  PartyMembershipKey,
  PartyMembershipRelationKey,
  PartyMembershipSortableField,
  PartyMembershipFilterableField,
  PartyMembershipDateRangeField,
  PartyMembershipSelectableField,
  IPartyMembershipAsOneRelationConfig,
  IPartyMembershipAsManyRelationConfig
} from './party-membership.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PARTY_MEMBERSHIP_RELATION_KEYS = ['party', ] as const satisfies readonly PartyMembershipKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PARTY_MEMBERSHIP_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly PartyMembershipKey[];

export const PARTY_MEMBERSHIP_SEARCHABLE_FIELDS = [] as const satisfies readonly PartyMembershipKey[];

export const PARTY_MEMBERSHIP_FILTERABLE_FIELDS = ['id', 'isCurrent', 'method', 'partyId', 'personId', 'verificationState', 'version', ] as const satisfies readonly PartyMembershipKey[];

export const PARTY_MEMBERSHIP_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly PartyMembershipKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PARTY_MEMBERSHIP_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'confidence', 'createdAt', 'id', 'isCurrent', 'licence', 'method', 'partyId', 'personId', 'retrievedAt', 'roleTitle', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly PartyMembershipKey[];

export const PARTY_MEMBERSHIP_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly PartyMembershipSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PARTY_MEMBERSHIP_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'confidence', 'isCurrent', 'licence', 'method', 'partyId', 'personId', 'retrievedAt', 'roleTitle', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly PartyMembershipKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PARTY_MEMBERSHIP_AS_ONE_RELATION_CONFIG = {
  relation: 'partyMembership',
  type: ERelationType.One,
  selectableFields: PARTY_MEMBERSHIP_SELECTABLE_FIELDS,
  defaultSelectFields: PARTY_MEMBERSHIP_DEFAULT_SELECT_FIELDS
} as const satisfies IPartyMembershipAsOneRelationConfig;

export const PARTY_MEMBERSHIP_AS_MANY_RELATION_CONFIG = {
  relation: 'partyMemberships',
  type: ERelationType.Many,
  selectableFields: PARTY_MEMBERSHIP_SELECTABLE_FIELDS,
  defaultSelectFields: PARTY_MEMBERSHIP_DEFAULT_SELECT_FIELDS,
  sortableFields: PARTY_MEMBERSHIP_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IPartyMembershipAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PARTY_MEMBERSHIP_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<PartyMembershipRelationKey>().one(PartyConfig.PARTY_AS_ONE_RELATION_CONFIG, 'party'),
] as const;

export const PARTY_MEMBERSHIP_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PARTY_MEMBERSHIP_QUERY_OPTIONS = {
  searchableFields: PARTY_MEMBERSHIP_SEARCHABLE_FIELDS,
  selectableFields: PARTY_MEMBERSHIP_SELECTABLE_FIELDS,
  defaultSelectFields: PARTY_MEMBERSHIP_DEFAULT_SELECT_FIELDS,
  sortableFields: PARTY_MEMBERSHIP_SORTABLE_FIELDS,
  filterFields: PARTY_MEMBERSHIP_FILTERABLE_FIELDS,
  dateRangeFields: PARTY_MEMBERSHIP_DATE_RANGE_FIELDS,
  oneRelations: PARTY_MEMBERSHIP_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PARTY_MEMBERSHIP_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IPartyMembership,
  PartyMembershipSortableField,
  PartyMembershipSelectableField,
  PartyMembershipFilterableField,
  PartyMembershipDateRangeField,
  PartyMembershipRelationKey,
  typeof PARTY_MEMBERSHIP_ONE_RELATION_QUERY_OPTIONS,
  typeof PARTY_MEMBERSHIP_MANY_RELATION_QUERY_OPTIONS
>;