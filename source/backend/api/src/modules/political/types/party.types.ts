// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { PartyStatus } from '#/types/political/party-status.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PARTY_RELATION_KEYS,
  PARTY_SORTABLE_FIELDS,
  PARTY_SEARCHABLE_FIELDS,
  PARTY_FILTERABLE_FIELDS,
  PARTY_DATE_RANGE_FIELDS,
  PARTY_SELECTABLE_FIELDS,
  PARTY_DEFAULT_SELECT_FIELDS,
  PARTY_EDITABLE_FIELDS
} from './party.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Party */
export interface IParty extends B.IBase {
  abbreviation: string | null;
  code: string;
  isCurrent: boolean;
  jurisdictionId: string;
  name: string;
  registryAuthorityId: string | null;
  registryIdentifier: string | null;
  status: PartyStatus;
  symbolUrl: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PartyKey = keyof IParty;

export type PartyRelationKey = (typeof PARTY_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPartyReadonlyFields = B.IBaseReadonlyFields;

export type IPartyContextualFields = never;

export type IPartySensitiveFields = never;

export type IPartyTransitionFields = never;

export type IPartyImmutableFields =
  | IPartyReadonlyFields
  | IPartyContextualFields
  | IPartySensitiveFields
  | IPartyTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPartyCreatable = Omit<IParty, IPartyImmutableFields | PartyRelationKey>;

export type IPartySystemWritable = Omit<IParty, B.IBaseReadonlyFields | PartyRelationKey>;

export type IPartyUpdatable = Partial<Omit<IParty, IPartyImmutableFields | PartyRelationKey>>;

export interface IPartyTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PartySortableField = (typeof PARTY_SORTABLE_FIELDS)[number];

export type PartySearchableField = (typeof PARTY_SEARCHABLE_FIELDS)[number];

export type PartyFilterableField = (typeof PARTY_FILTERABLE_FIELDS)[number];

export type PartyDateRangeField = (typeof PARTY_DATE_RANGE_FIELDS)[number];

export type PartySelectableField = (typeof PARTY_SELECTABLE_FIELDS)[number];

export type PartyDefaultSelectField = (typeof PARTY_DEFAULT_SELECT_FIELDS)[number];

export type PartyEditableField = (typeof PARTY_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPartyAsOneRelationConfig = Q.IOneRelationConfig<'party', PartySelectableField>;

export type IPartyAsManyRelationConfig = Q.IManyRelationConfig<'partys', PartySelectableField, PartySortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPartyAsOneRelationQuery = Q.IAsOneRelationQuery<IParty, PartySelectableField>;

export type IPartyAsManyRelationQuery = Q.IAsManyRelationQuery<IParty, PartySelectableField, PartySortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPartyRelationMap extends Record<PartyRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPartyRelationQueries = Q.IBaseRelationQueries<IParty, PartyRelationKey, IPartyRelationMap>;

export type IPartyItemQuery = Q.IBaseItemQuery<
  IParty,
  PartyRelationKey,
  PartySelectableField,
  PartyRelationKey,
  PartySelectableField,
  IPartyRelationMap,
  IPartyRelationQueries
>;

export type IPartyListQuery = Q.IBaseListQuery<
  IParty,
  PartyRelationKey,
  PartySelectableField,
  PartySortableField,
  PartyRelationKey,
  PartySelectableField,
  PartySortableField,
  PartyDateRangeField,
  PartyFilterableField,
  IPartyRelationMap,
  IPartyRelationQueries,
  IPartyItemQuery
>;