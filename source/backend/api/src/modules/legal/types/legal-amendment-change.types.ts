// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { AmendmentChangeKind } from '#/types/legal/amendment-change-kind.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as LegalAmendmentTypes from '#/modules/legal/types/legal-amendment.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  LEGAL_AMENDMENT_CHANGE_RELATION_KEYS,
  LEGAL_AMENDMENT_CHANGE_SORTABLE_FIELDS,
  LEGAL_AMENDMENT_CHANGE_SEARCHABLE_FIELDS,
  LEGAL_AMENDMENT_CHANGE_FILTERABLE_FIELDS,
  LEGAL_AMENDMENT_CHANGE_DATE_RANGE_FIELDS,
  LEGAL_AMENDMENT_CHANGE_SELECTABLE_FIELDS,
  LEGAL_AMENDMENT_CHANGE_DEFAULT_SELECT_FIELDS,
  LEGAL_AMENDMENT_CHANGE_EDITABLE_FIELDS
} from './legal-amendment-change.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Legal Amendment Change */
export interface ILegalAmendmentChange extends B.IBase {
  amendmentId: string;
  artifactChecksum: string | null;
  artifactId: string | null;
  confidence: number | null;
  isCurrent: boolean;
  kind: AmendmentChangeKind;
  licence: string | null;
  method: ProvenanceMethod;
  newText: string | null;
  previousText: string | null;
  provisionId: string;
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
  readonly legalAmendment?: LegalAmendmentTypes.ILegalAmendment;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type LegalAmendmentChangeKey = keyof ILegalAmendmentChange;

export type LegalAmendmentChangeRelationKey = (typeof LEGAL_AMENDMENT_CHANGE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ILegalAmendmentChangeReadonlyFields = B.IBaseReadonlyFields;

export type ILegalAmendmentChangeContextualFields = never;

export type ILegalAmendmentChangeSensitiveFields = never;

export type ILegalAmendmentChangeTransitionFields = never;

export type ILegalAmendmentChangeImmutableFields =
  | ILegalAmendmentChangeReadonlyFields
  | ILegalAmendmentChangeContextualFields
  | ILegalAmendmentChangeSensitiveFields
  | ILegalAmendmentChangeTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ILegalAmendmentChangeCreatable = Omit<ILegalAmendmentChange, ILegalAmendmentChangeImmutableFields | LegalAmendmentChangeRelationKey>;

export type ILegalAmendmentChangeSystemWritable = Omit<ILegalAmendmentChange, B.IBaseReadonlyFields | LegalAmendmentChangeRelationKey>;

export type ILegalAmendmentChangeUpdatable = Partial<Omit<ILegalAmendmentChange, ILegalAmendmentChangeImmutableFields | LegalAmendmentChangeRelationKey>>;

export interface ILegalAmendmentChangeTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type LegalAmendmentChangeSortableField = (typeof LEGAL_AMENDMENT_CHANGE_SORTABLE_FIELDS)[number];

export type LegalAmendmentChangeSearchableField = (typeof LEGAL_AMENDMENT_CHANGE_SEARCHABLE_FIELDS)[number];

export type LegalAmendmentChangeFilterableField = (typeof LEGAL_AMENDMENT_CHANGE_FILTERABLE_FIELDS)[number];

export type LegalAmendmentChangeDateRangeField = (typeof LEGAL_AMENDMENT_CHANGE_DATE_RANGE_FIELDS)[number];

export type LegalAmendmentChangeSelectableField = (typeof LEGAL_AMENDMENT_CHANGE_SELECTABLE_FIELDS)[number];

export type LegalAmendmentChangeDefaultSelectField = (typeof LEGAL_AMENDMENT_CHANGE_DEFAULT_SELECT_FIELDS)[number];

export type LegalAmendmentChangeEditableField = (typeof LEGAL_AMENDMENT_CHANGE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ILegalAmendmentChangeAsOneRelationConfig = Q.IOneRelationConfig<'legalAmendmentChange', LegalAmendmentChangeSelectableField>;

export type ILegalAmendmentChangeAsManyRelationConfig = Q.IManyRelationConfig<'legalAmendmentChanges', LegalAmendmentChangeSelectableField, LegalAmendmentChangeSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ILegalAmendmentChangeAsOneRelationQuery = Q.IAsOneRelationQuery<ILegalAmendmentChange, LegalAmendmentChangeSelectableField>;

export type ILegalAmendmentChangeAsManyRelationQuery = Q.IAsManyRelationQuery<ILegalAmendmentChange, LegalAmendmentChangeSelectableField, LegalAmendmentChangeSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ILegalAmendmentChangeRelationMap extends Record<LegalAmendmentChangeRelationKey, unknown> {
  legalAmendment: LegalAmendmentTypes.ILegalAmendmentAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ILegalAmendmentChangeRelationQueries = Q.IBaseRelationQueries<ILegalAmendmentChange, LegalAmendmentChangeRelationKey, ILegalAmendmentChangeRelationMap>;

export type ILegalAmendmentChangeItemQuery = Q.IBaseItemQuery<
  ILegalAmendmentChange,
  LegalAmendmentChangeRelationKey,
  LegalAmendmentChangeSelectableField,
  LegalAmendmentChangeRelationKey,
  LegalAmendmentChangeSelectableField,
  ILegalAmendmentChangeRelationMap,
  ILegalAmendmentChangeRelationQueries
>;

export type ILegalAmendmentChangeListQuery = Q.IBaseListQuery<
  ILegalAmendmentChange,
  LegalAmendmentChangeRelationKey,
  LegalAmendmentChangeSelectableField,
  LegalAmendmentChangeSortableField,
  LegalAmendmentChangeRelationKey,
  LegalAmendmentChangeSelectableField,
  LegalAmendmentChangeSortableField,
  LegalAmendmentChangeDateRangeField,
  LegalAmendmentChangeFilterableField,
  ILegalAmendmentChangeRelationMap,
  ILegalAmendmentChangeRelationQueries,
  ILegalAmendmentChangeItemQuery
>;