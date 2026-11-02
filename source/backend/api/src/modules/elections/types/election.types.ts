// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { ElectionStatus } from '#/types/elections/election-status.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as JurisdictionTypes from '#/modules/reference/types/jurisdiction.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ELECTION_RELATION_KEYS,
  ELECTION_SORTABLE_FIELDS,
  ELECTION_SEARCHABLE_FIELDS,
  ELECTION_FILTERABLE_FIELDS,
  ELECTION_DATE_RANGE_FIELDS,
  ELECTION_SELECTABLE_FIELDS,
  ELECTION_DEFAULT_SELECT_FIELDS,
  ELECTION_EDITABLE_FIELDS
} from './election.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Election */
export interface IElection extends B.IBase {
  administeringInstitutionId: string | null;
  artifactChecksum: string | null;
  artifactId: string | null;
  code: string;
  confidence: number | null;
  geoUnitId: string | null;
  heldDate: Date | null;
  isCurrent: boolean;
  jurisdictionId: string;
  legalBasisId: string | null;
  licence: string | null;
  method: ProvenanceMethod;
  name: string;
  retrievedAt: Date | null;
  scheduledDate: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  status: ElectionStatus;
  toolOrModel: string | null;
  typeId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly jurisdiction?: JurisdictionTypes.IJurisdiction;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ElectionKey = keyof IElection;

export type ElectionRelationKey = (typeof ELECTION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IElectionReadonlyFields = B.IBaseReadonlyFields;

export type IElectionContextualFields = never;

export type IElectionSensitiveFields = never;

export type IElectionTransitionFields = never;

export type IElectionImmutableFields =
  | IElectionReadonlyFields
  | IElectionContextualFields
  | IElectionSensitiveFields
  | IElectionTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IElectionCreatable = Omit<IElection, IElectionImmutableFields | ElectionRelationKey>;

export type IElectionSystemWritable = Omit<IElection, B.IBaseReadonlyFields | ElectionRelationKey>;

export type IElectionUpdatable = Partial<Omit<IElection, IElectionImmutableFields | ElectionRelationKey>>;

export interface IElectionTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ElectionSortableField = (typeof ELECTION_SORTABLE_FIELDS)[number];

export type ElectionSearchableField = (typeof ELECTION_SEARCHABLE_FIELDS)[number];

export type ElectionFilterableField = (typeof ELECTION_FILTERABLE_FIELDS)[number];

export type ElectionDateRangeField = (typeof ELECTION_DATE_RANGE_FIELDS)[number];

export type ElectionSelectableField = (typeof ELECTION_SELECTABLE_FIELDS)[number];

export type ElectionDefaultSelectField = (typeof ELECTION_DEFAULT_SELECT_FIELDS)[number];

export type ElectionEditableField = (typeof ELECTION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IElectionAsOneRelationConfig = Q.IOneRelationConfig<'election', ElectionSelectableField>;

export type IElectionAsManyRelationConfig = Q.IManyRelationConfig<'elections', ElectionSelectableField, ElectionSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IElectionAsOneRelationQuery = Q.IAsOneRelationQuery<IElection, ElectionSelectableField>;

export type IElectionAsManyRelationQuery = Q.IAsManyRelationQuery<IElection, ElectionSelectableField, ElectionSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IElectionRelationMap extends Record<ElectionRelationKey, unknown> {
  jurisdiction: JurisdictionTypes.IJurisdictionAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IElectionRelationQueries = Q.IBaseRelationQueries<IElection, ElectionRelationKey, IElectionRelationMap>;

export type IElectionItemQuery = Q.IBaseItemQuery<
  IElection,
  ElectionRelationKey,
  ElectionSelectableField,
  ElectionRelationKey,
  ElectionSelectableField,
  IElectionRelationMap,
  IElectionRelationQueries
>;

export type IElectionListQuery = Q.IBaseListQuery<
  IElection,
  ElectionRelationKey,
  ElectionSelectableField,
  ElectionSortableField,
  ElectionRelationKey,
  ElectionSelectableField,
  ElectionSortableField,
  ElectionDateRangeField,
  ElectionFilterableField,
  IElectionRelationMap,
  IElectionRelationQueries,
  IElectionItemQuery
>;