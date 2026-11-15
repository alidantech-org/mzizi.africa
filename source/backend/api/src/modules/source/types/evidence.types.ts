// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from '#/modules/reference/types/value.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  EVIDENCE_RELATION_KEYS,
  EVIDENCE_SORTABLE_FIELDS,
  EVIDENCE_SEARCHABLE_FIELDS,
  EVIDENCE_FILTERABLE_FIELDS,
  EVIDENCE_DATE_RANGE_FIELDS,
  EVIDENCE_SELECTABLE_FIELDS,
  EVIDENCE_DEFAULT_SELECT_FIELDS,
  EVIDENCE_EDITABLE_FIELDS
} from './evidence.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Durable evidence bundle whose exact supporting items are normalized citations. */
export interface IEvidence extends B.IBase {
  assembledAt: Date;
  assembledBySnapshot: string;
  code: string;
  description: string | null;
  kindId: string;
  title: string;
  readonly kind?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type EvidenceKey = keyof IEvidence;

export type EvidenceRelationKey = (typeof EVIDENCE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IEvidenceReadonlyFields = B.IBaseReadonlyFields;

export type IEvidenceContextualFields = never;

export type IEvidenceSensitiveFields = never;

export type IEvidenceTransitionFields = never;

export type IEvidenceImmutableFields =
  | IEvidenceReadonlyFields
  | IEvidenceContextualFields
  | IEvidenceSensitiveFields
  | IEvidenceTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IEvidenceCreatable = Omit<IEvidence, IEvidenceImmutableFields | EvidenceRelationKey>;

export type IEvidenceSystemWritable = Omit<IEvidence, B.IBaseReadonlyFields | EvidenceRelationKey>;

export type IEvidenceUpdatable = Partial<Omit<IEvidence, IEvidenceImmutableFields | EvidenceRelationKey>>;

export interface IEvidenceTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type EvidenceSortableField = (typeof EVIDENCE_SORTABLE_FIELDS)[number];

export type EvidenceSearchableField = (typeof EVIDENCE_SEARCHABLE_FIELDS)[number];

export type EvidenceFilterableField = (typeof EVIDENCE_FILTERABLE_FIELDS)[number];

export type EvidenceDateRangeField = (typeof EVIDENCE_DATE_RANGE_FIELDS)[number];

export type EvidenceSelectableField = (typeof EVIDENCE_SELECTABLE_FIELDS)[number];

export type EvidenceDefaultSelectField = (typeof EVIDENCE_DEFAULT_SELECT_FIELDS)[number];

export type EvidenceEditableField = (typeof EVIDENCE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IEvidenceAsOneRelationConfig = Q.IOneRelationConfig<'evidence', EvidenceSelectableField>;

export type IEvidenceAsManyRelationConfig = Q.IManyRelationConfig<'evidences', EvidenceSelectableField, EvidenceSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IEvidenceAsOneRelationQuery = Q.IAsOneRelationQuery<IEvidence, EvidenceSelectableField>;

export type IEvidenceAsManyRelationQuery = Q.IAsManyRelationQuery<IEvidence, EvidenceSelectableField, EvidenceSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IEvidenceRelationMap extends Record<EvidenceRelationKey, unknown> {
  kind: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IEvidenceRelationQueries = Q.IBaseRelationQueries<IEvidence, EvidenceRelationKey, IEvidenceRelationMap>;

export type IEvidenceItemQuery = Q.IBaseItemQuery<
  IEvidence,
  EvidenceRelationKey,
  EvidenceSelectableField,
  EvidenceRelationKey,
  EvidenceSelectableField,
  IEvidenceRelationMap,
  IEvidenceRelationQueries
>;

export type IEvidenceListQuery = Q.IBaseListQuery<
  IEvidence,
  EvidenceRelationKey,
  EvidenceSelectableField,
  EvidenceSortableField,
  EvidenceRelationKey,
  EvidenceSelectableField,
  EvidenceSortableField,
  EvidenceDateRangeField,
  EvidenceFilterableField,
  IEvidenceRelationMap,
  IEvidenceRelationQueries,
  IEvidenceItemQuery
>;