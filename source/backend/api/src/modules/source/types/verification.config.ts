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
  IVerification,
  VerificationKey,
  VerificationRelationKey,
  VerificationSortableField,
  VerificationFilterableField,
  VerificationDateRangeField,
  VerificationSelectableField,
  IVerificationAsOneRelationConfig,
  IVerificationAsManyRelationConfig
} from './verification.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const VERIFICATION_RELATION_KEYS = [] as const satisfies readonly VerificationKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const VERIFICATION_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly VerificationKey[];

export const VERIFICATION_SEARCHABLE_FIELDS = [] as const satisfies readonly VerificationKey[];

export const VERIFICATION_FILTERABLE_FIELDS = ['decidedBy', 'decisionId', 'id', 'isCurrent', 'state', 'targetId', 'targetKind', 'version', ] as const satisfies readonly VerificationKey[];

export const VERIFICATION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly VerificationKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const VERIFICATION_SELECTABLE_FIELDS = ['createdAt', 'decidedBy', 'decisionId', 'id', 'isCurrent', 'rationale', 'state', 'targetId', 'targetKind', 'updatedAt', ] as const satisfies readonly VerificationKey[];

export const VERIFICATION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly VerificationSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const VERIFICATION_EDITABLE_FIELDS = ['decidedBy', 'decisionId', 'isCurrent', 'rationale', 'state', 'targetId', 'targetKind', ] as const satisfies readonly VerificationKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const VERIFICATION_AS_ONE_RELATION_CONFIG = {
  relation: 'verification',
  type: ERelationType.One,
  selectableFields: VERIFICATION_SELECTABLE_FIELDS,
  defaultSelectFields: VERIFICATION_DEFAULT_SELECT_FIELDS
} as const satisfies IVerificationAsOneRelationConfig;

export const VERIFICATION_AS_MANY_RELATION_CONFIG = {
  relation: 'verifications',
  type: ERelationType.Many,
  selectableFields: VERIFICATION_SELECTABLE_FIELDS,
  defaultSelectFields: VERIFICATION_DEFAULT_SELECT_FIELDS,
  sortableFields: VERIFICATION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IVerificationAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const VERIFICATION_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const VERIFICATION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const VERIFICATION_QUERY_OPTIONS = {
  searchableFields: VERIFICATION_SEARCHABLE_FIELDS,
  selectableFields: VERIFICATION_SELECTABLE_FIELDS,
  defaultSelectFields: VERIFICATION_DEFAULT_SELECT_FIELDS,
  sortableFields: VERIFICATION_SORTABLE_FIELDS,
  filterFields: VERIFICATION_FILTERABLE_FIELDS,
  dateRangeFields: VERIFICATION_DATE_RANGE_FIELDS,
  oneRelations: VERIFICATION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: VERIFICATION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IVerification,
  VerificationSortableField,
  VerificationSelectableField,
  VerificationFilterableField,
  VerificationDateRangeField,
  VerificationRelationKey,
  typeof VERIFICATION_ONE_RELATION_QUERY_OPTIONS,
  typeof VERIFICATION_MANY_RELATION_QUERY_OPTIONS
>;