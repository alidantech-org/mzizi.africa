// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { NominationStatus } from '#/types/elections/nomination-status.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as SeatTypes from '#/modules/elections/types/seat.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  CANDIDATE_RELATION_KEYS,
  CANDIDATE_SORTABLE_FIELDS,
  CANDIDATE_SEARCHABLE_FIELDS,
  CANDIDATE_FILTERABLE_FIELDS,
  CANDIDATE_DATE_RANGE_FIELDS,
  CANDIDATE_SELECTABLE_FIELDS,
  CANDIDATE_DEFAULT_SELECT_FIELDS,
  CANDIDATE_EDITABLE_FIELDS
} from './candidate.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Candidate */
export interface ICandidate extends B.IBase {
  isCurrent: boolean;
  isIndependent: boolean;
  nominationStatus: NominationStatus;
  partyId: string | null;
  personId: string;
  seatId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly seat?: SeatTypes.ISeat;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type CandidateKey = keyof ICandidate;

export type CandidateRelationKey = (typeof CANDIDATE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ICandidateReadonlyFields = B.IBaseReadonlyFields;

export type ICandidateContextualFields = never;

export type ICandidateSensitiveFields = never;

export type ICandidateTransitionFields = never;

export type ICandidateImmutableFields =
  | ICandidateReadonlyFields
  | ICandidateContextualFields
  | ICandidateSensitiveFields
  | ICandidateTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ICandidateCreatable = Omit<ICandidate, ICandidateImmutableFields | CandidateRelationKey>;

export type ICandidateSystemWritable = Omit<ICandidate, B.IBaseReadonlyFields | CandidateRelationKey>;

export type ICandidateUpdatable = Partial<Omit<ICandidate, ICandidateImmutableFields | CandidateRelationKey>>;

export interface ICandidateTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type CandidateSortableField = (typeof CANDIDATE_SORTABLE_FIELDS)[number];

export type CandidateSearchableField = (typeof CANDIDATE_SEARCHABLE_FIELDS)[number];

export type CandidateFilterableField = (typeof CANDIDATE_FILTERABLE_FIELDS)[number];

export type CandidateDateRangeField = (typeof CANDIDATE_DATE_RANGE_FIELDS)[number];

export type CandidateSelectableField = (typeof CANDIDATE_SELECTABLE_FIELDS)[number];

export type CandidateDefaultSelectField = (typeof CANDIDATE_DEFAULT_SELECT_FIELDS)[number];

export type CandidateEditableField = (typeof CANDIDATE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ICandidateAsOneRelationConfig = Q.IOneRelationConfig<'candidate', CandidateSelectableField>;

export type ICandidateAsManyRelationConfig = Q.IManyRelationConfig<'candidates', CandidateSelectableField, CandidateSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ICandidateAsOneRelationQuery = Q.IAsOneRelationQuery<ICandidate, CandidateSelectableField>;

export type ICandidateAsManyRelationQuery = Q.IAsManyRelationQuery<ICandidate, CandidateSelectableField, CandidateSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ICandidateRelationMap extends Record<CandidateRelationKey, unknown> {
  seat: SeatTypes.ISeatAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ICandidateRelationQueries = Q.IBaseRelationQueries<ICandidate, CandidateRelationKey, ICandidateRelationMap>;

export type ICandidateItemQuery = Q.IBaseItemQuery<
  ICandidate,
  CandidateRelationKey,
  CandidateSelectableField,
  CandidateRelationKey,
  CandidateSelectableField,
  ICandidateRelationMap,
  ICandidateRelationQueries
>;

export type ICandidateListQuery = Q.IBaseListQuery<
  ICandidate,
  CandidateRelationKey,
  CandidateSelectableField,
  CandidateSortableField,
  CandidateRelationKey,
  CandidateSelectableField,
  CandidateSortableField,
  CandidateDateRangeField,
  CandidateFilterableField,
  ICandidateRelationMap,
  ICandidateRelationQueries,
  ICandidateItemQuery
>;