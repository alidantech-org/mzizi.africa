// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { InstrumentStatus } from '#/types/legal/instrument-status.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  LEGAL_INSTRUMENT_RELATION_KEYS,
  LEGAL_INSTRUMENT_SORTABLE_FIELDS,
  LEGAL_INSTRUMENT_SEARCHABLE_FIELDS,
  LEGAL_INSTRUMENT_FILTERABLE_FIELDS,
  LEGAL_INSTRUMENT_DATE_RANGE_FIELDS,
  LEGAL_INSTRUMENT_SELECTABLE_FIELDS,
  LEGAL_INSTRUMENT_DEFAULT_SELECT_FIELDS,
  LEGAL_INSTRUMENT_EDITABLE_FIELDS
} from './legal-instrument.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Legal Instrument */
export interface ILegalInstrument extends B.IBase {
  code: string;
  contentHash: string | null;
  documentUrl: string | null;
  isCurrent: boolean;
  issuingInstitutionId: string | null;
  jurisdictionId: string;
  kindId: string;
  status: InstrumentStatus;
  summary: string | null;
  title: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type LegalInstrumentKey = keyof ILegalInstrument;

export type LegalInstrumentRelationKey = (typeof LEGAL_INSTRUMENT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ILegalInstrumentReadonlyFields = B.IBaseReadonlyFields;

export type ILegalInstrumentContextualFields = never;

export type ILegalInstrumentSensitiveFields = never;

export type ILegalInstrumentTransitionFields = never;

export type ILegalInstrumentImmutableFields =
  | ILegalInstrumentReadonlyFields
  | ILegalInstrumentContextualFields
  | ILegalInstrumentSensitiveFields
  | ILegalInstrumentTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ILegalInstrumentCreatable = Omit<ILegalInstrument, ILegalInstrumentImmutableFields | LegalInstrumentRelationKey>;

export type ILegalInstrumentSystemWritable = Omit<ILegalInstrument, B.IBaseReadonlyFields | LegalInstrumentRelationKey>;

export type ILegalInstrumentUpdatable = Partial<Omit<ILegalInstrument, ILegalInstrumentImmutableFields | LegalInstrumentRelationKey>>;

export interface ILegalInstrumentTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type LegalInstrumentSortableField = (typeof LEGAL_INSTRUMENT_SORTABLE_FIELDS)[number];

export type LegalInstrumentSearchableField = (typeof LEGAL_INSTRUMENT_SEARCHABLE_FIELDS)[number];

export type LegalInstrumentFilterableField = (typeof LEGAL_INSTRUMENT_FILTERABLE_FIELDS)[number];

export type LegalInstrumentDateRangeField = (typeof LEGAL_INSTRUMENT_DATE_RANGE_FIELDS)[number];

export type LegalInstrumentSelectableField = (typeof LEGAL_INSTRUMENT_SELECTABLE_FIELDS)[number];

export type LegalInstrumentDefaultSelectField = (typeof LEGAL_INSTRUMENT_DEFAULT_SELECT_FIELDS)[number];

export type LegalInstrumentEditableField = (typeof LEGAL_INSTRUMENT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ILegalInstrumentAsOneRelationConfig = Q.IOneRelationConfig<'legalInstrument', LegalInstrumentSelectableField>;

export type ILegalInstrumentAsManyRelationConfig = Q.IManyRelationConfig<'legalInstruments', LegalInstrumentSelectableField, LegalInstrumentSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ILegalInstrumentAsOneRelationQuery = Q.IAsOneRelationQuery<ILegalInstrument, LegalInstrumentSelectableField>;

export type ILegalInstrumentAsManyRelationQuery = Q.IAsManyRelationQuery<ILegalInstrument, LegalInstrumentSelectableField, LegalInstrumentSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ILegalInstrumentRelationMap extends Record<LegalInstrumentRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ILegalInstrumentRelationQueries = Q.IBaseRelationQueries<ILegalInstrument, LegalInstrumentRelationKey, ILegalInstrumentRelationMap>;

export type ILegalInstrumentItemQuery = Q.IBaseItemQuery<
  ILegalInstrument,
  LegalInstrumentRelationKey,
  LegalInstrumentSelectableField,
  LegalInstrumentRelationKey,
  LegalInstrumentSelectableField,
  ILegalInstrumentRelationMap,
  ILegalInstrumentRelationQueries
>;

export type ILegalInstrumentListQuery = Q.IBaseListQuery<
  ILegalInstrument,
  LegalInstrumentRelationKey,
  LegalInstrumentSelectableField,
  LegalInstrumentSortableField,
  LegalInstrumentRelationKey,
  LegalInstrumentSelectableField,
  LegalInstrumentSortableField,
  LegalInstrumentDateRangeField,
  LegalInstrumentFilterableField,
  ILegalInstrumentRelationMap,
  ILegalInstrumentRelationQueries,
  ILegalInstrumentItemQuery
>;