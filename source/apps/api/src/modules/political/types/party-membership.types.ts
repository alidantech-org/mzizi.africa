// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as PartyTypes from '#/modules/political/types/party.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PARTY_MEMBERSHIP_RELATION_KEYS,
  PARTY_MEMBERSHIP_SORTABLE_FIELDS,
  PARTY_MEMBERSHIP_SEARCHABLE_FIELDS,
  PARTY_MEMBERSHIP_FILTERABLE_FIELDS,
  PARTY_MEMBERSHIP_DATE_RANGE_FIELDS,
  PARTY_MEMBERSHIP_SELECTABLE_FIELDS,
  PARTY_MEMBERSHIP_DEFAULT_SELECT_FIELDS,
  PARTY_MEMBERSHIP_EDITABLE_FIELDS
} from './party-membership.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Party Membership */
export interface IPartyMembership extends B.IBase {
  isCurrent: boolean;
  partyId: string;
  personId: string;
  roleTitle: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly party?: PartyTypes.IParty;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PartyMembershipKey = keyof IPartyMembership;

export type PartyMembershipRelationKey = (typeof PARTY_MEMBERSHIP_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPartyMembershipReadonlyFields = B.IBaseReadonlyFields;

export type IPartyMembershipContextualFields = never;

export type IPartyMembershipSensitiveFields = never;

export type IPartyMembershipTransitionFields = never;

export type IPartyMembershipImmutableFields =
  | IPartyMembershipReadonlyFields
  | IPartyMembershipContextualFields
  | IPartyMembershipSensitiveFields
  | IPartyMembershipTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPartyMembershipCreatable = Omit<IPartyMembership, IPartyMembershipImmutableFields | PartyMembershipRelationKey>;

export type IPartyMembershipSystemWritable = Omit<IPartyMembership, B.IBaseReadonlyFields | PartyMembershipRelationKey>;

export type IPartyMembershipUpdatable = Partial<Omit<IPartyMembership, IPartyMembershipImmutableFields | PartyMembershipRelationKey>>;

export interface IPartyMembershipTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PartyMembershipSortableField = (typeof PARTY_MEMBERSHIP_SORTABLE_FIELDS)[number];

export type PartyMembershipSearchableField = (typeof PARTY_MEMBERSHIP_SEARCHABLE_FIELDS)[number];

export type PartyMembershipFilterableField = (typeof PARTY_MEMBERSHIP_FILTERABLE_FIELDS)[number];

export type PartyMembershipDateRangeField = (typeof PARTY_MEMBERSHIP_DATE_RANGE_FIELDS)[number];

export type PartyMembershipSelectableField = (typeof PARTY_MEMBERSHIP_SELECTABLE_FIELDS)[number];

export type PartyMembershipDefaultSelectField = (typeof PARTY_MEMBERSHIP_DEFAULT_SELECT_FIELDS)[number];

export type PartyMembershipEditableField = (typeof PARTY_MEMBERSHIP_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPartyMembershipAsOneRelationConfig = Q.IOneRelationConfig<'partyMembership', PartyMembershipSelectableField>;

export type IPartyMembershipAsManyRelationConfig = Q.IManyRelationConfig<'partyMemberships', PartyMembershipSelectableField, PartyMembershipSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPartyMembershipAsOneRelationQuery = Q.IAsOneRelationQuery<IPartyMembership, PartyMembershipSelectableField>;

export type IPartyMembershipAsManyRelationQuery = Q.IAsManyRelationQuery<IPartyMembership, PartyMembershipSelectableField, PartyMembershipSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPartyMembershipRelationMap extends Record<PartyMembershipRelationKey, unknown> {
  party: PartyTypes.IPartyAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPartyMembershipRelationQueries = Q.IBaseRelationQueries<IPartyMembership, PartyMembershipRelationKey, IPartyMembershipRelationMap>;

export type IPartyMembershipItemQuery = Q.IBaseItemQuery<
  IPartyMembership,
  PartyMembershipRelationKey,
  PartyMembershipSelectableField,
  PartyMembershipRelationKey,
  PartyMembershipSelectableField,
  IPartyMembershipRelationMap,
  IPartyMembershipRelationQueries
>;

export type IPartyMembershipListQuery = Q.IBaseListQuery<
  IPartyMembership,
  PartyMembershipRelationKey,
  PartyMembershipSelectableField,
  PartyMembershipSortableField,
  PartyMembershipRelationKey,
  PartyMembershipSelectableField,
  PartyMembershipSortableField,
  PartyMembershipDateRangeField,
  PartyMembershipFilterableField,
  IPartyMembershipRelationMap,
  IPartyMembershipRelationQueries,
  IPartyMembershipItemQuery
>;