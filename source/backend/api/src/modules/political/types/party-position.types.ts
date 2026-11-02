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
import type * as PartyUnitTypes from '#/modules/political/types/party-unit.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PARTY_POSITION_RELATION_KEYS,
  PARTY_POSITION_SORTABLE_FIELDS,
  PARTY_POSITION_SEARCHABLE_FIELDS,
  PARTY_POSITION_FILTERABLE_FIELDS,
  PARTY_POSITION_DATE_RANGE_FIELDS,
  PARTY_POSITION_SELECTABLE_FIELDS,
  PARTY_POSITION_DEFAULT_SELECT_FIELDS,
  PARTY_POSITION_EDITABLE_FIELDS
} from './party-position.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Party Position */
export interface IPartyPosition extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  code: string;
  confidence: number | null;
  isCurrent: boolean;
  licence: string | null;
  method: ProvenanceMethod;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  title: string;
  toolOrModel: string | null;
  unitId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly partyUnit?: PartyUnitTypes.IPartyUnit;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PartyPositionKey = keyof IPartyPosition;

export type PartyPositionRelationKey = (typeof PARTY_POSITION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPartyPositionReadonlyFields = B.IBaseReadonlyFields;

export type IPartyPositionContextualFields = never;

export type IPartyPositionSensitiveFields = never;

export type IPartyPositionTransitionFields = never;

export type IPartyPositionImmutableFields =
  | IPartyPositionReadonlyFields
  | IPartyPositionContextualFields
  | IPartyPositionSensitiveFields
  | IPartyPositionTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPartyPositionCreatable = Omit<IPartyPosition, IPartyPositionImmutableFields | PartyPositionRelationKey>;

export type IPartyPositionSystemWritable = Omit<IPartyPosition, B.IBaseReadonlyFields | PartyPositionRelationKey>;

export type IPartyPositionUpdatable = Partial<Omit<IPartyPosition, IPartyPositionImmutableFields | PartyPositionRelationKey>>;

export interface IPartyPositionTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PartyPositionSortableField = (typeof PARTY_POSITION_SORTABLE_FIELDS)[number];

export type PartyPositionSearchableField = (typeof PARTY_POSITION_SEARCHABLE_FIELDS)[number];

export type PartyPositionFilterableField = (typeof PARTY_POSITION_FILTERABLE_FIELDS)[number];

export type PartyPositionDateRangeField = (typeof PARTY_POSITION_DATE_RANGE_FIELDS)[number];

export type PartyPositionSelectableField = (typeof PARTY_POSITION_SELECTABLE_FIELDS)[number];

export type PartyPositionDefaultSelectField = (typeof PARTY_POSITION_DEFAULT_SELECT_FIELDS)[number];

export type PartyPositionEditableField = (typeof PARTY_POSITION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPartyPositionAsOneRelationConfig = Q.IOneRelationConfig<'partyPosition', PartyPositionSelectableField>;

export type IPartyPositionAsManyRelationConfig = Q.IManyRelationConfig<'partyPositions', PartyPositionSelectableField, PartyPositionSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPartyPositionAsOneRelationQuery = Q.IAsOneRelationQuery<IPartyPosition, PartyPositionSelectableField>;

export type IPartyPositionAsManyRelationQuery = Q.IAsManyRelationQuery<IPartyPosition, PartyPositionSelectableField, PartyPositionSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPartyPositionRelationMap extends Record<PartyPositionRelationKey, unknown> {
  partyUnit: PartyUnitTypes.IPartyUnitAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPartyPositionRelationQueries = Q.IBaseRelationQueries<IPartyPosition, PartyPositionRelationKey, IPartyPositionRelationMap>;

export type IPartyPositionItemQuery = Q.IBaseItemQuery<
  IPartyPosition,
  PartyPositionRelationKey,
  PartyPositionSelectableField,
  PartyPositionRelationKey,
  PartyPositionSelectableField,
  IPartyPositionRelationMap,
  IPartyPositionRelationQueries
>;

export type IPartyPositionListQuery = Q.IBaseListQuery<
  IPartyPosition,
  PartyPositionRelationKey,
  PartyPositionSelectableField,
  PartyPositionSortableField,
  PartyPositionRelationKey,
  PartyPositionSelectableField,
  PartyPositionSortableField,
  PartyPositionDateRangeField,
  PartyPositionFilterableField,
  IPartyPositionRelationMap,
  IPartyPositionRelationQueries,
  IPartyPositionItemQuery
>;