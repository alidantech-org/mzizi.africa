// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { ResultStatus } from '#/types/elections/result-status.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ElectionTypes from '#/modules/elections/types/election.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ELECTORATE_RELATION_KEYS,
  ELECTORATE_SORTABLE_FIELDS,
  ELECTORATE_SEARCHABLE_FIELDS,
  ELECTORATE_FILTERABLE_FIELDS,
  ELECTORATE_DATE_RANGE_FIELDS,
  ELECTORATE_SELECTABLE_FIELDS,
  ELECTORATE_DEFAULT_SELECT_FIELDS,
  ELECTORATE_EDITABLE_FIELDS
} from './electorate.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Electorate */
export interface IElectorate extends B.IBase {
  declaredAt: Date | null;
  declaringInstitutionId: string | null;
  electionId: string;
  evidenceForm: string | null;
  geoUnitId: string | null;
  isCurrent: boolean;
  registerVersion: string | null;
  registeredVoters: number | null;
  rejectedVotes: number | null;
  resultLevelId: string;
  resultStatus: ResultStatus | null;
  seatId: string | null;
  spoiltVotes: number | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  validVotes: number | null;
  votesCast: number | null;
  readonly election?: ElectionTypes.IElection;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ElectorateKey = keyof IElectorate;

export type ElectorateRelationKey = (typeof ELECTORATE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IElectorateReadonlyFields = B.IBaseReadonlyFields;

export type IElectorateContextualFields = never;

export type IElectorateSensitiveFields = never;

export type IElectorateTransitionFields = never;

export type IElectorateImmutableFields =
  | IElectorateReadonlyFields
  | IElectorateContextualFields
  | IElectorateSensitiveFields
  | IElectorateTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IElectorateCreatable = Omit<IElectorate, IElectorateImmutableFields | ElectorateRelationKey>;

export type IElectorateSystemWritable = Omit<IElectorate, B.IBaseReadonlyFields | ElectorateRelationKey>;

export type IElectorateUpdatable = Partial<Omit<IElectorate, IElectorateImmutableFields | ElectorateRelationKey>>;

export interface IElectorateTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ElectorateSortableField = (typeof ELECTORATE_SORTABLE_FIELDS)[number];

export type ElectorateSearchableField = (typeof ELECTORATE_SEARCHABLE_FIELDS)[number];

export type ElectorateFilterableField = (typeof ELECTORATE_FILTERABLE_FIELDS)[number];

export type ElectorateDateRangeField = (typeof ELECTORATE_DATE_RANGE_FIELDS)[number];

export type ElectorateSelectableField = (typeof ELECTORATE_SELECTABLE_FIELDS)[number];

export type ElectorateDefaultSelectField = (typeof ELECTORATE_DEFAULT_SELECT_FIELDS)[number];

export type ElectorateEditableField = (typeof ELECTORATE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IElectorateAsOneRelationConfig = Q.IOneRelationConfig<'electorate', ElectorateSelectableField>;

export type IElectorateAsManyRelationConfig = Q.IManyRelationConfig<'electorates', ElectorateSelectableField, ElectorateSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IElectorateAsOneRelationQuery = Q.IAsOneRelationQuery<IElectorate, ElectorateSelectableField>;

export type IElectorateAsManyRelationQuery = Q.IAsManyRelationQuery<IElectorate, ElectorateSelectableField, ElectorateSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IElectorateRelationMap extends Record<ElectorateRelationKey, unknown> {
  election: ElectionTypes.IElectionAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IElectorateRelationQueries = Q.IBaseRelationQueries<IElectorate, ElectorateRelationKey, IElectorateRelationMap>;

export type IElectorateItemQuery = Q.IBaseItemQuery<
  IElectorate,
  ElectorateRelationKey,
  ElectorateSelectableField,
  ElectorateRelationKey,
  ElectorateSelectableField,
  IElectorateRelationMap,
  IElectorateRelationQueries
>;

export type IElectorateListQuery = Q.IBaseListQuery<
  IElectorate,
  ElectorateRelationKey,
  ElectorateSelectableField,
  ElectorateSortableField,
  ElectorateRelationKey,
  ElectorateSelectableField,
  ElectorateSortableField,
  ElectorateDateRangeField,
  ElectorateFilterableField,
  IElectorateRelationMap,
  IElectorateRelationQueries,
  IElectorateItemQuery
>;