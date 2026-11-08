// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IEvidenceReference,
  EvidenceReferenceKey,
  EvidenceReferenceRelationKey,
  EvidenceReferenceSortableField,
  EvidenceReferenceFilterableField,
  EvidenceReferenceDateRangeField,
  EvidenceReferenceSelectableField,
  IEvidenceReferenceAsOneRelationConfig,
  IEvidenceReferenceAsManyRelationConfig
} from './evidence-reference.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const EVIDENCE_REFERENCE_RELATION_KEYS = [] as const satisfies readonly EvidenceReferenceKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const EVIDENCE_REFERENCE_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly EvidenceReferenceKey[];

export const EVIDENCE_REFERENCE_SEARCHABLE_FIELDS = [] as const satisfies readonly EvidenceReferenceKey[];

export const EVIDENCE_REFERENCE_FILTERABLE_FIELDS = ['actorId', 'fileId', 'id', 'targetId', 'targetKind', 'version', ] as const satisfies readonly EvidenceReferenceKey[];

export const EVIDENCE_REFERENCE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly EvidenceReferenceKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const EVIDENCE_REFERENCE_SELECTABLE_FIELDS = ['actorId', 'createdAt', 'fileId', 'id', 'note', 'targetId', 'targetKind', 'updatedAt', ] as const satisfies readonly EvidenceReferenceKey[];

export const EVIDENCE_REFERENCE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly EvidenceReferenceSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const EVIDENCE_REFERENCE_EDITABLE_FIELDS = ['fileId', 'note', 'targetId', 'targetKind', ] as const satisfies readonly EvidenceReferenceKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const EVIDENCE_REFERENCE_AS_ONE_RELATION_CONFIG = {
  relation: 'evidenceReference',
  type: ERelationType.One,
  selectableFields: EVIDENCE_REFERENCE_SELECTABLE_FIELDS,
  defaultSelectFields: EVIDENCE_REFERENCE_DEFAULT_SELECT_FIELDS
} as const satisfies IEvidenceReferenceAsOneRelationConfig;

export const EVIDENCE_REFERENCE_AS_MANY_RELATION_CONFIG = {
  relation: 'evidenceReferences',
  type: ERelationType.Many,
  selectableFields: EVIDENCE_REFERENCE_SELECTABLE_FIELDS,
  defaultSelectFields: EVIDENCE_REFERENCE_DEFAULT_SELECT_FIELDS,
  sortableFields: EVIDENCE_REFERENCE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IEvidenceReferenceAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const EVIDENCE_REFERENCE_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const EVIDENCE_REFERENCE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const EVIDENCE_REFERENCE_QUERY_OPTIONS = {
  searchableFields: EVIDENCE_REFERENCE_SEARCHABLE_FIELDS,
  selectableFields: EVIDENCE_REFERENCE_SELECTABLE_FIELDS,
  defaultSelectFields: EVIDENCE_REFERENCE_DEFAULT_SELECT_FIELDS,
  sortableFields: EVIDENCE_REFERENCE_SORTABLE_FIELDS,
  filterFields: EVIDENCE_REFERENCE_FILTERABLE_FIELDS,
  dateRangeFields: EVIDENCE_REFERENCE_DATE_RANGE_FIELDS,
  oneRelations: EVIDENCE_REFERENCE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: EVIDENCE_REFERENCE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IEvidenceReference,
  EvidenceReferenceSortableField,
  EvidenceReferenceSelectableField,
  EvidenceReferenceFilterableField,
  EvidenceReferenceDateRangeField,
  EvidenceReferenceRelationKey,
  typeof EVIDENCE_REFERENCE_ONE_RELATION_QUERY_OPTIONS,
  typeof EVIDENCE_REFERENCE_MANY_RELATION_QUERY_OPTIONS
>;