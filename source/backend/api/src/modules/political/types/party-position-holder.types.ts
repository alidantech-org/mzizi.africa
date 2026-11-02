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
import type * as PartyPositionTypes from '#/modules/political/types/party-position.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PARTY_POSITION_HOLDER_RELATION_KEYS,
  PARTY_POSITION_HOLDER_SORTABLE_FIELDS,
  PARTY_POSITION_HOLDER_SEARCHABLE_FIELDS,
  PARTY_POSITION_HOLDER_FILTERABLE_FIELDS,
  PARTY_POSITION_HOLDER_DATE_RANGE_FIELDS,
  PARTY_POSITION_HOLDER_SELECTABLE_FIELDS,
  PARTY_POSITION_HOLDER_DEFAULT_SELECT_FIELDS,
  PARTY_POSITION_HOLDER_EDITABLE_FIELDS
} from './party-position-holder.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Party Position Holder */
export interface IPartyPositionHolder extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  confidence: number | null;
  isActing: boolean;
  isCurrent: boolean;
  licence: string | null;
  method: ProvenanceMethod;
  personId: string;
  positionId: string;
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
  readonly partyPosition?: PartyPositionTypes.IPartyPosition;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PartyPositionHolderKey = keyof IPartyPositionHolder;

export type PartyPositionHolderRelationKey = (typeof PARTY_POSITION_HOLDER_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPartyPositionHolderReadonlyFields = B.IBaseReadonlyFields;

export type IPartyPositionHolderContextualFields = never;

export type IPartyPositionHolderSensitiveFields = never;

export type IPartyPositionHolderTransitionFields = never;

export type IPartyPositionHolderImmutableFields =
  | IPartyPositionHolderReadonlyFields
  | IPartyPositionHolderContextualFields
  | IPartyPositionHolderSensitiveFields
  | IPartyPositionHolderTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPartyPositionHolderCreatable = Omit<IPartyPositionHolder, IPartyPositionHolderImmutableFields | PartyPositionHolderRelationKey>;

export type IPartyPositionHolderSystemWritable = Omit<IPartyPositionHolder, B.IBaseReadonlyFields | PartyPositionHolderRelationKey>;

export type IPartyPositionHolderUpdatable = Partial<Omit<IPartyPositionHolder, IPartyPositionHolderImmutableFields | PartyPositionHolderRelationKey>>;

export interface IPartyPositionHolderTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PartyPositionHolderSortableField = (typeof PARTY_POSITION_HOLDER_SORTABLE_FIELDS)[number];

export type PartyPositionHolderSearchableField = (typeof PARTY_POSITION_HOLDER_SEARCHABLE_FIELDS)[number];

export type PartyPositionHolderFilterableField = (typeof PARTY_POSITION_HOLDER_FILTERABLE_FIELDS)[number];

export type PartyPositionHolderDateRangeField = (typeof PARTY_POSITION_HOLDER_DATE_RANGE_FIELDS)[number];

export type PartyPositionHolderSelectableField = (typeof PARTY_POSITION_HOLDER_SELECTABLE_FIELDS)[number];

export type PartyPositionHolderDefaultSelectField = (typeof PARTY_POSITION_HOLDER_DEFAULT_SELECT_FIELDS)[number];

export type PartyPositionHolderEditableField = (typeof PARTY_POSITION_HOLDER_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPartyPositionHolderAsOneRelationConfig = Q.IOneRelationConfig<'partyPositionHolder', PartyPositionHolderSelectableField>;

export type IPartyPositionHolderAsManyRelationConfig = Q.IManyRelationConfig<'partyPositionHolders', PartyPositionHolderSelectableField, PartyPositionHolderSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPartyPositionHolderAsOneRelationQuery = Q.IAsOneRelationQuery<IPartyPositionHolder, PartyPositionHolderSelectableField>;

export type IPartyPositionHolderAsManyRelationQuery = Q.IAsManyRelationQuery<IPartyPositionHolder, PartyPositionHolderSelectableField, PartyPositionHolderSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPartyPositionHolderRelationMap extends Record<PartyPositionHolderRelationKey, unknown> {
  partyPosition: PartyPositionTypes.IPartyPositionAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPartyPositionHolderRelationQueries = Q.IBaseRelationQueries<IPartyPositionHolder, PartyPositionHolderRelationKey, IPartyPositionHolderRelationMap>;

export type IPartyPositionHolderItemQuery = Q.IBaseItemQuery<
  IPartyPositionHolder,
  PartyPositionHolderRelationKey,
  PartyPositionHolderSelectableField,
  PartyPositionHolderRelationKey,
  PartyPositionHolderSelectableField,
  IPartyPositionHolderRelationMap,
  IPartyPositionHolderRelationQueries
>;

export type IPartyPositionHolderListQuery = Q.IBaseListQuery<
  IPartyPositionHolder,
  PartyPositionHolderRelationKey,
  PartyPositionHolderSelectableField,
  PartyPositionHolderSortableField,
  PartyPositionHolderRelationKey,
  PartyPositionHolderSelectableField,
  PartyPositionHolderSortableField,
  PartyPositionHolderDateRangeField,
  PartyPositionHolderFilterableField,
  IPartyPositionHolderRelationMap,
  IPartyPositionHolderRelationQueries,
  IPartyPositionHolderItemQuery
>;