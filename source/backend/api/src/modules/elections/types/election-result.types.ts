// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as CandidateTypes from '#/modules/elections/types/candidate.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ELECTION_RESULT_RELATION_KEYS,
  ELECTION_RESULT_SORTABLE_FIELDS,
  ELECTION_RESULT_SEARCHABLE_FIELDS,
  ELECTION_RESULT_FILTERABLE_FIELDS,
  ELECTION_RESULT_DATE_RANGE_FIELDS,
  ELECTION_RESULT_SELECTABLE_FIELDS,
  ELECTION_RESULT_DEFAULT_SELECT_FIELDS,
  ELECTION_RESULT_EDITABLE_FIELDS
} from './election-result.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Election Result */
export interface IElectionResult extends B.IBase {
  candidateId: string;
  declaredAt: Date | null;
  declaringInstitutionId: string | null;
  geoUnitId: string | null;
  isCurrent: boolean;
  isWinner: boolean;
  rank: number | null;
  resultLevelId: string;
  seatId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  votes: number;
  readonly candidate?: CandidateTypes.ICandidate;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ElectionResultKey = keyof IElectionResult;

export type ElectionResultRelationKey = (typeof ELECTION_RESULT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IElectionResultReadonlyFields = B.IBaseReadonlyFields;

export type IElectionResultContextualFields = never;

export type IElectionResultSensitiveFields = never;

export type IElectionResultTransitionFields = never;

export type IElectionResultImmutableFields =
  | IElectionResultReadonlyFields
  | IElectionResultContextualFields
  | IElectionResultSensitiveFields
  | IElectionResultTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IElectionResultCreatable = Omit<IElectionResult, IElectionResultImmutableFields | ElectionResultRelationKey>;

export type IElectionResultSystemWritable = Omit<IElectionResult, B.IBaseReadonlyFields | ElectionResultRelationKey>;

export type IElectionResultUpdatable = Partial<Omit<IElectionResult, IElectionResultImmutableFields | ElectionResultRelationKey>>;

export interface IElectionResultTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ElectionResultSortableField = (typeof ELECTION_RESULT_SORTABLE_FIELDS)[number];

export type ElectionResultSearchableField = (typeof ELECTION_RESULT_SEARCHABLE_FIELDS)[number];

export type ElectionResultFilterableField = (typeof ELECTION_RESULT_FILTERABLE_FIELDS)[number];

export type ElectionResultDateRangeField = (typeof ELECTION_RESULT_DATE_RANGE_FIELDS)[number];

export type ElectionResultSelectableField = (typeof ELECTION_RESULT_SELECTABLE_FIELDS)[number];

export type ElectionResultDefaultSelectField = (typeof ELECTION_RESULT_DEFAULT_SELECT_FIELDS)[number];

export type ElectionResultEditableField = (typeof ELECTION_RESULT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IElectionResultAsOneRelationConfig = Q.IOneRelationConfig<'electionResult', ElectionResultSelectableField>;

export type IElectionResultAsManyRelationConfig = Q.IManyRelationConfig<'electionResults', ElectionResultSelectableField, ElectionResultSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IElectionResultAsOneRelationQuery = Q.IAsOneRelationQuery<IElectionResult, ElectionResultSelectableField>;

export type IElectionResultAsManyRelationQuery = Q.IAsManyRelationQuery<IElectionResult, ElectionResultSelectableField, ElectionResultSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IElectionResultRelationMap extends Record<ElectionResultRelationKey, unknown> {
  candidate: CandidateTypes.ICandidateAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IElectionResultRelationQueries = Q.IBaseRelationQueries<IElectionResult, ElectionResultRelationKey, IElectionResultRelationMap>;

export type IElectionResultItemQuery = Q.IBaseItemQuery<
  IElectionResult,
  ElectionResultRelationKey,
  ElectionResultSelectableField,
  ElectionResultRelationKey,
  ElectionResultSelectableField,
  IElectionResultRelationMap,
  IElectionResultRelationQueries
>;

export type IElectionResultListQuery = Q.IBaseListQuery<
  IElectionResult,
  ElectionResultRelationKey,
  ElectionResultSelectableField,
  ElectionResultSortableField,
  ElectionResultRelationKey,
  ElectionResultSelectableField,
  ElectionResultSortableField,
  ElectionResultDateRangeField,
  ElectionResultFilterableField,
  IElectionResultRelationMap,
  IElectionResultRelationQueries,
  IElectionResultItemQuery
>;