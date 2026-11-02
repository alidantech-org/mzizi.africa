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
import type * as LegalInstrumentTypes from '#/modules/legal/types/legal-instrument.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  LEGAL_AMENDMENT_RELATION_KEYS,
  LEGAL_AMENDMENT_SORTABLE_FIELDS,
  LEGAL_AMENDMENT_SEARCHABLE_FIELDS,
  LEGAL_AMENDMENT_FILTERABLE_FIELDS,
  LEGAL_AMENDMENT_DATE_RANGE_FIELDS,
  LEGAL_AMENDMENT_SELECTABLE_FIELDS,
  LEGAL_AMENDMENT_DEFAULT_SELECT_FIELDS,
  LEGAL_AMENDMENT_EDITABLE_FIELDS
} from './legal-amendment.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Legal Amendment */
export interface ILegalAmendment extends B.IBase {
  amendingInstrumentId: string | null;
  artifactChecksum: string | null;
  artifactId: string | null;
  code: string;
  confidence: number | null;
  instrumentId: string;
  isCurrent: boolean;
  licence: string | null;
  method: ProvenanceMethod;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  summary: string | null;
  toolOrModel: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly legalInstrument?: LegalInstrumentTypes.ILegalInstrument;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type LegalAmendmentKey = keyof ILegalAmendment;

export type LegalAmendmentRelationKey = (typeof LEGAL_AMENDMENT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ILegalAmendmentReadonlyFields = B.IBaseReadonlyFields;

export type ILegalAmendmentContextualFields = never;

export type ILegalAmendmentSensitiveFields = never;

export type ILegalAmendmentTransitionFields = never;

export type ILegalAmendmentImmutableFields =
  | ILegalAmendmentReadonlyFields
  | ILegalAmendmentContextualFields
  | ILegalAmendmentSensitiveFields
  | ILegalAmendmentTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ILegalAmendmentCreatable = Omit<ILegalAmendment, ILegalAmendmentImmutableFields | LegalAmendmentRelationKey>;

export type ILegalAmendmentSystemWritable = Omit<ILegalAmendment, B.IBaseReadonlyFields | LegalAmendmentRelationKey>;

export type ILegalAmendmentUpdatable = Partial<Omit<ILegalAmendment, ILegalAmendmentImmutableFields | LegalAmendmentRelationKey>>;

export interface ILegalAmendmentTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type LegalAmendmentSortableField = (typeof LEGAL_AMENDMENT_SORTABLE_FIELDS)[number];

export type LegalAmendmentSearchableField = (typeof LEGAL_AMENDMENT_SEARCHABLE_FIELDS)[number];

export type LegalAmendmentFilterableField = (typeof LEGAL_AMENDMENT_FILTERABLE_FIELDS)[number];

export type LegalAmendmentDateRangeField = (typeof LEGAL_AMENDMENT_DATE_RANGE_FIELDS)[number];

export type LegalAmendmentSelectableField = (typeof LEGAL_AMENDMENT_SELECTABLE_FIELDS)[number];

export type LegalAmendmentDefaultSelectField = (typeof LEGAL_AMENDMENT_DEFAULT_SELECT_FIELDS)[number];

export type LegalAmendmentEditableField = (typeof LEGAL_AMENDMENT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ILegalAmendmentAsOneRelationConfig = Q.IOneRelationConfig<'legalAmendment', LegalAmendmentSelectableField>;

export type ILegalAmendmentAsManyRelationConfig = Q.IManyRelationConfig<'legalAmendments', LegalAmendmentSelectableField, LegalAmendmentSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ILegalAmendmentAsOneRelationQuery = Q.IAsOneRelationQuery<ILegalAmendment, LegalAmendmentSelectableField>;

export type ILegalAmendmentAsManyRelationQuery = Q.IAsManyRelationQuery<ILegalAmendment, LegalAmendmentSelectableField, LegalAmendmentSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ILegalAmendmentRelationMap extends Record<LegalAmendmentRelationKey, unknown> {
  legalInstrument: LegalInstrumentTypes.ILegalInstrumentAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ILegalAmendmentRelationQueries = Q.IBaseRelationQueries<ILegalAmendment, LegalAmendmentRelationKey, ILegalAmendmentRelationMap>;

export type ILegalAmendmentItemQuery = Q.IBaseItemQuery<
  ILegalAmendment,
  LegalAmendmentRelationKey,
  LegalAmendmentSelectableField,
  LegalAmendmentRelationKey,
  LegalAmendmentSelectableField,
  ILegalAmendmentRelationMap,
  ILegalAmendmentRelationQueries
>;

export type ILegalAmendmentListQuery = Q.IBaseListQuery<
  ILegalAmendment,
  LegalAmendmentRelationKey,
  LegalAmendmentSelectableField,
  LegalAmendmentSortableField,
  LegalAmendmentRelationKey,
  LegalAmendmentSelectableField,
  LegalAmendmentSortableField,
  LegalAmendmentDateRangeField,
  LegalAmendmentFilterableField,
  ILegalAmendmentRelationMap,
  ILegalAmendmentRelationQueries,
  ILegalAmendmentItemQuery
>;