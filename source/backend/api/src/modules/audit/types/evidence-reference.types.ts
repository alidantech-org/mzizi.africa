// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  EVIDENCE_REFERENCE_RELATION_KEYS,
  EVIDENCE_REFERENCE_SORTABLE_FIELDS,
  EVIDENCE_REFERENCE_SEARCHABLE_FIELDS,
  EVIDENCE_REFERENCE_FILTERABLE_FIELDS,
  EVIDENCE_REFERENCE_DATE_RANGE_FIELDS,
  EVIDENCE_REFERENCE_SELECTABLE_FIELDS,
  EVIDENCE_REFERENCE_DEFAULT_SELECT_FIELDS,
  EVIDENCE_REFERENCE_EDITABLE_FIELDS
} from './evidence-reference.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Evidence Reference */
export interface IEvidenceReference extends B.IBase {
  actorId: string;
  artifactChecksum: string;
  artifactId: string;
  mediaType: string;
  note: string | null;
  sizeBytes: number;
  targetId: string;
  targetKind: string;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type EvidenceReferenceKey = keyof IEvidenceReference;

export type EvidenceReferenceRelationKey = (typeof EVIDENCE_REFERENCE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IEvidenceReferenceReadonlyFields = B.IBaseReadonlyFields;

export type IEvidenceReferenceContextualFields = never;

export type IEvidenceReferenceSensitiveFields = never;

export type IEvidenceReferenceTransitionFields = never;

export type IEvidenceReferenceImmutableFields =
  | IEvidenceReferenceReadonlyFields
  | IEvidenceReferenceContextualFields
  | IEvidenceReferenceSensitiveFields
  | IEvidenceReferenceTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IEvidenceReferenceCreatable = Omit<IEvidenceReference, IEvidenceReferenceImmutableFields | EvidenceReferenceRelationKey>;

export type IEvidenceReferenceSystemWritable = Omit<IEvidenceReference, B.IBaseReadonlyFields | EvidenceReferenceRelationKey>;

export type IEvidenceReferenceUpdatable = Partial<Omit<IEvidenceReference, IEvidenceReferenceImmutableFields | EvidenceReferenceRelationKey>>;

export interface IEvidenceReferenceTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type EvidenceReferenceSortableField = (typeof EVIDENCE_REFERENCE_SORTABLE_FIELDS)[number];

export type EvidenceReferenceSearchableField = (typeof EVIDENCE_REFERENCE_SEARCHABLE_FIELDS)[number];

export type EvidenceReferenceFilterableField = (typeof EVIDENCE_REFERENCE_FILTERABLE_FIELDS)[number];

export type EvidenceReferenceDateRangeField = (typeof EVIDENCE_REFERENCE_DATE_RANGE_FIELDS)[number];

export type EvidenceReferenceSelectableField = (typeof EVIDENCE_REFERENCE_SELECTABLE_FIELDS)[number];

export type EvidenceReferenceDefaultSelectField = (typeof EVIDENCE_REFERENCE_DEFAULT_SELECT_FIELDS)[number];

export type EvidenceReferenceEditableField = (typeof EVIDENCE_REFERENCE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IEvidenceReferenceAsOneRelationConfig = Q.IOneRelationConfig<'evidenceReference', EvidenceReferenceSelectableField>;

export type IEvidenceReferenceAsManyRelationConfig = Q.IManyRelationConfig<'evidenceReferences', EvidenceReferenceSelectableField, EvidenceReferenceSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IEvidenceReferenceAsOneRelationQuery = Q.IAsOneRelationQuery<IEvidenceReference, EvidenceReferenceSelectableField>;

export type IEvidenceReferenceAsManyRelationQuery = Q.IAsManyRelationQuery<IEvidenceReference, EvidenceReferenceSelectableField, EvidenceReferenceSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IEvidenceReferenceRelationMap extends Record<EvidenceReferenceRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IEvidenceReferenceRelationQueries = Q.IBaseRelationQueries<IEvidenceReference, EvidenceReferenceRelationKey, IEvidenceReferenceRelationMap>;

export type IEvidenceReferenceItemQuery = Q.IBaseItemQuery<
  IEvidenceReference,
  EvidenceReferenceRelationKey,
  EvidenceReferenceSelectableField,
  EvidenceReferenceRelationKey,
  EvidenceReferenceSelectableField,
  IEvidenceReferenceRelationMap,
  IEvidenceReferenceRelationQueries
>;

export type IEvidenceReferenceListQuery = Q.IBaseListQuery<
  IEvidenceReference,
  EvidenceReferenceRelationKey,
  EvidenceReferenceSelectableField,
  EvidenceReferenceSortableField,
  EvidenceReferenceRelationKey,
  EvidenceReferenceSelectableField,
  EvidenceReferenceSortableField,
  EvidenceReferenceDateRangeField,
  EvidenceReferenceFilterableField,
  IEvidenceReferenceRelationMap,
  IEvidenceReferenceRelationQueries,
  IEvidenceReferenceItemQuery
>;