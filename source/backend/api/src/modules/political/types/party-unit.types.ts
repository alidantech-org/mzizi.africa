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
  PARTY_UNIT_RELATION_KEYS,
  PARTY_UNIT_SORTABLE_FIELDS,
  PARTY_UNIT_SEARCHABLE_FIELDS,
  PARTY_UNIT_FILTERABLE_FIELDS,
  PARTY_UNIT_DATE_RANGE_FIELDS,
  PARTY_UNIT_SELECTABLE_FIELDS,
  PARTY_UNIT_DEFAULT_SELECT_FIELDS,
  PARTY_UNIT_EDITABLE_FIELDS
} from './party-unit.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Party Unit */
export interface IPartyUnit extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  code: string;
  confidence: number | null;
  geoUnitId: string | null;
  isCurrent: boolean;
  levelId: string;
  licence: string | null;
  method: ProvenanceMethod;
  name: string;
  parentUnitId: string | null;
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

export type PartyUnitKey = keyof IPartyUnit;

export type PartyUnitRelationKey = (typeof PARTY_UNIT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPartyUnitReadonlyFields = B.IBaseReadonlyFields;

export type IPartyUnitContextualFields = never;

export type IPartyUnitSensitiveFields = never;

export type IPartyUnitTransitionFields = never;

export type IPartyUnitImmutableFields =
  | IPartyUnitReadonlyFields
  | IPartyUnitContextualFields
  | IPartyUnitSensitiveFields
  | IPartyUnitTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPartyUnitCreatable = Omit<IPartyUnit, IPartyUnitImmutableFields | PartyUnitRelationKey>;

export type IPartyUnitSystemWritable = Omit<IPartyUnit, B.IBaseReadonlyFields | PartyUnitRelationKey>;

export type IPartyUnitUpdatable = Partial<Omit<IPartyUnit, IPartyUnitImmutableFields | PartyUnitRelationKey>>;

export interface IPartyUnitTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PartyUnitSortableField = (typeof PARTY_UNIT_SORTABLE_FIELDS)[number];

export type PartyUnitSearchableField = (typeof PARTY_UNIT_SEARCHABLE_FIELDS)[number];

export type PartyUnitFilterableField = (typeof PARTY_UNIT_FILTERABLE_FIELDS)[number];

export type PartyUnitDateRangeField = (typeof PARTY_UNIT_DATE_RANGE_FIELDS)[number];

export type PartyUnitSelectableField = (typeof PARTY_UNIT_SELECTABLE_FIELDS)[number];

export type PartyUnitDefaultSelectField = (typeof PARTY_UNIT_DEFAULT_SELECT_FIELDS)[number];

export type PartyUnitEditableField = (typeof PARTY_UNIT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPartyUnitAsOneRelationConfig = Q.IOneRelationConfig<'partyUnit', PartyUnitSelectableField>;

export type IPartyUnitAsManyRelationConfig = Q.IManyRelationConfig<'partyUnits', PartyUnitSelectableField, PartyUnitSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPartyUnitAsOneRelationQuery = Q.IAsOneRelationQuery<IPartyUnit, PartyUnitSelectableField>;

export type IPartyUnitAsManyRelationQuery = Q.IAsManyRelationQuery<IPartyUnit, PartyUnitSelectableField, PartyUnitSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPartyUnitRelationMap extends Record<PartyUnitRelationKey, unknown> {
  party: PartyTypes.IPartyAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPartyUnitRelationQueries = Q.IBaseRelationQueries<IPartyUnit, PartyUnitRelationKey, IPartyUnitRelationMap>;

export type IPartyUnitItemQuery = Q.IBaseItemQuery<
  IPartyUnit,
  PartyUnitRelationKey,
  PartyUnitSelectableField,
  PartyUnitRelationKey,
  PartyUnitSelectableField,
  IPartyUnitRelationMap,
  IPartyUnitRelationQueries
>;

export type IPartyUnitListQuery = Q.IBaseListQuery<
  IPartyUnit,
  PartyUnitRelationKey,
  PartyUnitSelectableField,
  PartyUnitSortableField,
  PartyUnitRelationKey,
  PartyUnitSelectableField,
  PartyUnitSortableField,
  PartyUnitDateRangeField,
  PartyUnitFilterableField,
  IPartyUnitRelationMap,
  IPartyUnitRelationQueries,
  IPartyUnitItemQuery
>;