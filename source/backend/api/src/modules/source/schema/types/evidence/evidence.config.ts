// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import { ERelationType } from '#/modules/common/schema/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ValueConfig from '#/modules/reference/schema/types/value/value.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IEvidence,
  EvidenceKey,
  EvidenceRelationKey,
  EvidenceSortableField,
  EvidenceFilterableField,
  EvidenceDateRangeField,
  EvidenceSelectableField,
  IEvidenceAsOneRelationConfig,
  IEvidenceAsManyRelationConfig
} from './evidence.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const EVIDENCE_RELATION_KEYS = ['kind', ] as const satisfies readonly EvidenceKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const EVIDENCE_SORTABLE_FIELDS = [] as const satisfies readonly EvidenceKey[];

export const EVIDENCE_SEARCHABLE_FIELDS = [] as const satisfies readonly EvidenceKey[];

export const EVIDENCE_FILTERABLE_FIELDS = [] as const satisfies readonly EvidenceKey[];

export const EVIDENCE_DATE_RANGE_FIELDS = [] as const satisfies readonly EvidenceKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const EVIDENCE_SELECTABLE_FIELDS = ['assembledAt', 'assembledBySnapshot', 'code', 'createdAt', 'deletedAt', 'description', 'id', 'kindId', 'title', 'updatedAt', 'version', ] as const satisfies readonly EvidenceKey[];

export const EVIDENCE_DEFAULT_SELECT_FIELDS = ['assembledAt', 'assembledBySnapshot', 'code', 'createdAt', 'deletedAt', 'description', 'id', 'kindId', 'title', 'updatedAt', 'version', ] as const satisfies readonly EvidenceSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const EVIDENCE_EDITABLE_FIELDS = ['assembledAt', 'assembledBySnapshot', 'code', 'description', 'kindId', 'title', ] as const satisfies readonly EvidenceKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const EVIDENCE_AS_ONE_RELATION_CONFIG = {
  relation: 'evidence',
  type: ERelationType.One,
  selectableFields: EVIDENCE_SELECTABLE_FIELDS,
  defaultSelectFields: EVIDENCE_DEFAULT_SELECT_FIELDS
} as const satisfies IEvidenceAsOneRelationConfig;

export const EVIDENCE_AS_MANY_RELATION_CONFIG = {
  relation: 'evidences',
  type: ERelationType.Many,
  selectableFields: EVIDENCE_SELECTABLE_FIELDS,
  defaultSelectFields: EVIDENCE_DEFAULT_SELECT_FIELDS,
  sortableFields: EVIDENCE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IEvidenceAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const EVIDENCE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<EvidenceRelationKey>().one(ValueConfig.VALUE_AS_ONE_RELATION_CONFIG, 'kind'),
] as const;

export const EVIDENCE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const EVIDENCE_QUERY_OPTIONS = {
  searchableFields: EVIDENCE_SEARCHABLE_FIELDS,
  selectableFields: EVIDENCE_SELECTABLE_FIELDS,
  defaultSelectFields: EVIDENCE_DEFAULT_SELECT_FIELDS,
  sortableFields: EVIDENCE_SORTABLE_FIELDS,
  filterFields: EVIDENCE_FILTERABLE_FIELDS,
  dateRangeFields: EVIDENCE_DATE_RANGE_FIELDS,
  oneRelations: EVIDENCE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: EVIDENCE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IEvidence,
  EvidenceSortableField,
  EvidenceSelectableField,
  EvidenceFilterableField,
  EvidenceDateRangeField,
  EvidenceRelationKey,
  typeof EVIDENCE_ONE_RELATION_QUERY_OPTIONS,
  typeof EVIDENCE_MANY_RELATION_QUERY_OPTIONS
>;