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
import type * as ElectionTypes from '#/modules/elections/types/election.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SEAT_RELATION_KEYS,
  SEAT_SORTABLE_FIELDS,
  SEAT_SEARCHABLE_FIELDS,
  SEAT_FILTERABLE_FIELDS,
  SEAT_DATE_RANGE_FIELDS,
  SEAT_SELECTABLE_FIELDS,
  SEAT_DEFAULT_SELECT_FIELDS,
  SEAT_EDITABLE_FIELDS
} from './seat.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Seat */
export interface ISeat extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  code: string;
  confidence: number | null;
  electionId: string;
  geoUnitId: string | null;
  isCurrent: boolean;
  legalBasisId: string | null;
  licence: string | null;
  method: ProvenanceMethod;
  officeId: string | null;
  positions: number;
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
  readonly election?: ElectionTypes.IElection;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SeatKey = keyof ISeat;

export type SeatRelationKey = (typeof SEAT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISeatReadonlyFields = B.IBaseReadonlyFields;

export type ISeatContextualFields = never;

export type ISeatSensitiveFields = never;

export type ISeatTransitionFields = never;

export type ISeatImmutableFields =
  | ISeatReadonlyFields
  | ISeatContextualFields
  | ISeatSensitiveFields
  | ISeatTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISeatCreatable = Omit<ISeat, ISeatImmutableFields | SeatRelationKey>;

export type ISeatSystemWritable = Omit<ISeat, B.IBaseReadonlyFields | SeatRelationKey>;

export type ISeatUpdatable = Partial<Omit<ISeat, ISeatImmutableFields | SeatRelationKey>>;

export interface ISeatTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SeatSortableField = (typeof SEAT_SORTABLE_FIELDS)[number];

export type SeatSearchableField = (typeof SEAT_SEARCHABLE_FIELDS)[number];

export type SeatFilterableField = (typeof SEAT_FILTERABLE_FIELDS)[number];

export type SeatDateRangeField = (typeof SEAT_DATE_RANGE_FIELDS)[number];

export type SeatSelectableField = (typeof SEAT_SELECTABLE_FIELDS)[number];

export type SeatDefaultSelectField = (typeof SEAT_DEFAULT_SELECT_FIELDS)[number];

export type SeatEditableField = (typeof SEAT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISeatAsOneRelationConfig = Q.IOneRelationConfig<'seat', SeatSelectableField>;

export type ISeatAsManyRelationConfig = Q.IManyRelationConfig<'seats', SeatSelectableField, SeatSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISeatAsOneRelationQuery = Q.IAsOneRelationQuery<ISeat, SeatSelectableField>;

export type ISeatAsManyRelationQuery = Q.IAsManyRelationQuery<ISeat, SeatSelectableField, SeatSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISeatRelationMap extends Record<SeatRelationKey, unknown> {
  election: ElectionTypes.IElectionAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISeatRelationQueries = Q.IBaseRelationQueries<ISeat, SeatRelationKey, ISeatRelationMap>;

export type ISeatItemQuery = Q.IBaseItemQuery<
  ISeat,
  SeatRelationKey,
  SeatSelectableField,
  SeatRelationKey,
  SeatSelectableField,
  ISeatRelationMap,
  ISeatRelationQueries
>;

export type ISeatListQuery = Q.IBaseListQuery<
  ISeat,
  SeatRelationKey,
  SeatSelectableField,
  SeatSortableField,
  SeatRelationKey,
  SeatSelectableField,
  SeatSortableField,
  SeatDateRangeField,
  SeatFilterableField,
  ISeatRelationMap,
  ISeatRelationQueries,
  ISeatItemQuery
>;