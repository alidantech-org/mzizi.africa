// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as PartyTypes from '#/modules/political/types/party.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PARTY_IDEOLOGY_RELATION_KEYS,
  PARTY_IDEOLOGY_SORTABLE_FIELDS,
  PARTY_IDEOLOGY_SEARCHABLE_FIELDS,
  PARTY_IDEOLOGY_FILTERABLE_FIELDS,
  PARTY_IDEOLOGY_DATE_RANGE_FIELDS,
  PARTY_IDEOLOGY_SELECTABLE_FIELDS,
  PARTY_IDEOLOGY_DEFAULT_SELECT_FIELDS,
  PARTY_IDEOLOGY_EDITABLE_FIELDS
} from './party-ideology.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Party Ideology */
export interface IPartyIdeology extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  confidence: number | null;
  ideologyId: string;
  isCurrent: boolean;
  licence: string | null;
  method: ProvenanceMethod;
  partyId: string;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  toolOrModel: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly party?: PartyTypes.IParty;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PartyIdeologyKey = keyof IPartyIdeology;

export type PartyIdeologyRelationKey = (typeof PARTY_IDEOLOGY_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPartyIdeologyReadonlyFields = B.IBaseReadonlyFields;

export type IPartyIdeologyContextualFields = never;

export type IPartyIdeologySensitiveFields = never;

export type IPartyIdeologyTransitionFields = never;

export type IPartyIdeologyImmutableFields =
  | IPartyIdeologyReadonlyFields
  | IPartyIdeologyContextualFields
  | IPartyIdeologySensitiveFields
  | IPartyIdeologyTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPartyIdeologyCreatable = Omit<IPartyIdeology, IPartyIdeologyImmutableFields | PartyIdeologyRelationKey>;

export type IPartyIdeologySystemWritable = Omit<IPartyIdeology, B.IBaseReadonlyFields | PartyIdeologyRelationKey>;

export type IPartyIdeologyUpdatable = Partial<Omit<IPartyIdeology, IPartyIdeologyImmutableFields | PartyIdeologyRelationKey>>;

export interface IPartyIdeologyTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PartyIdeologySortableField = (typeof PARTY_IDEOLOGY_SORTABLE_FIELDS)[number];

export type PartyIdeologySearchableField = (typeof PARTY_IDEOLOGY_SEARCHABLE_FIELDS)[number];

export type PartyIdeologyFilterableField = (typeof PARTY_IDEOLOGY_FILTERABLE_FIELDS)[number];

export type PartyIdeologyDateRangeField = (typeof PARTY_IDEOLOGY_DATE_RANGE_FIELDS)[number];

export type PartyIdeologySelectableField = (typeof PARTY_IDEOLOGY_SELECTABLE_FIELDS)[number];

export type PartyIdeologyDefaultSelectField = (typeof PARTY_IDEOLOGY_DEFAULT_SELECT_FIELDS)[number];

export type PartyIdeologyEditableField = (typeof PARTY_IDEOLOGY_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPartyIdeologyAsOneRelationConfig = Q.IOneRelationConfig<'partyIdeology', PartyIdeologySelectableField>;

export type IPartyIdeologyAsManyRelationConfig = Q.IManyRelationConfig<'partyIdeologys', PartyIdeologySelectableField, PartyIdeologySortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPartyIdeologyAsOneRelationQuery = Q.IAsOneRelationQuery<IPartyIdeology, PartyIdeologySelectableField>;

export type IPartyIdeologyAsManyRelationQuery = Q.IAsManyRelationQuery<IPartyIdeology, PartyIdeologySelectableField, PartyIdeologySortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPartyIdeologyRelationMap extends Record<PartyIdeologyRelationKey, unknown> {
  party: PartyTypes.IPartyAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPartyIdeologyRelationQueries = Q.IBaseRelationQueries<IPartyIdeology, PartyIdeologyRelationKey, IPartyIdeologyRelationMap>;

export type IPartyIdeologyItemQuery = Q.IBaseItemQuery<
  IPartyIdeology,
  PartyIdeologyRelationKey,
  PartyIdeologySelectableField,
  PartyIdeologyRelationKey,
  PartyIdeologySelectableField,
  IPartyIdeologyRelationMap,
  IPartyIdeologyRelationQueries
>;

export type IPartyIdeologyListQuery = Q.IBaseListQuery<
  IPartyIdeology,
  PartyIdeologyRelationKey,
  PartyIdeologySelectableField,
  PartyIdeologySortableField,
  PartyIdeologyRelationKey,
  PartyIdeologySelectableField,
  PartyIdeologySortableField,
  PartyIdeologyDateRangeField,
  PartyIdeologyFilterableField,
  IPartyIdeologyRelationMap,
  IPartyIdeologyRelationQueries,
  IPartyIdeologyItemQuery
>;