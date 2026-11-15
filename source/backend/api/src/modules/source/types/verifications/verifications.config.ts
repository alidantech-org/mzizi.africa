// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as EvidenceConfig from '#/modules/source/types/evidence/evidence.config';
import * as ValueConfig from '#/modules/reference/types/value/value.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IVerifications,
  VerificationsKey,
  VerificationsRelationKey,
  VerificationsSortableField,
  VerificationsFilterableField,
  VerificationsDateRangeField,
  VerificationsSelectableField,
  IVerificationsAsOneRelationConfig,
  IVerificationsAsManyRelationConfig
} from './verifications.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const VERIFICATIONS_RELATION_KEYS = ['evidence', 'method', 'supersedes', ] as const satisfies readonly VerificationsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const VERIFICATIONS_SORTABLE_FIELDS = [] as const satisfies readonly VerificationsKey[];

export const VERIFICATIONS_SEARCHABLE_FIELDS = [] as const satisfies readonly VerificationsKey[];

export const VERIFICATIONS_FILTERABLE_FIELDS = [] as const satisfies readonly VerificationsKey[];

export const VERIFICATIONS_DATE_RANGE_FIELDS = [] as const satisfies readonly VerificationsKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const VERIFICATIONS_SELECTABLE_FIELDS = ['assessedAt', 'confidence', 'createdAt', 'deletedAt', 'evidenceId', 'explanation', 'id', 'methodId', 'outcome', 'reviewerSnapshot', 'supersedesId', 'updatedAt', 'version', ] as const satisfies readonly VerificationsKey[];

export const VERIFICATIONS_DEFAULT_SELECT_FIELDS = ['assessedAt', 'confidence', 'createdAt', 'deletedAt', 'evidenceId', 'explanation', 'id', 'methodId', 'outcome', 'reviewerSnapshot', 'supersedesId', 'updatedAt', 'version', ] as const satisfies readonly VerificationsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const VERIFICATIONS_EDITABLE_FIELDS = ['assessedAt', 'confidence', 'evidenceId', 'explanation', 'methodId', 'outcome', 'reviewerSnapshot', 'supersedesId', ] as const satisfies readonly VerificationsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const VERIFICATIONS_AS_ONE_RELATION_CONFIG = {
  relation: 'verifications',
  type: ERelationType.One,
  selectableFields: VERIFICATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: VERIFICATIONS_DEFAULT_SELECT_FIELDS
} as const satisfies IVerificationsAsOneRelationConfig;

export const VERIFICATIONS_AS_MANY_RELATION_CONFIG = {
  relation: 'verificationss',
  type: ERelationType.Many,
  selectableFields: VERIFICATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: VERIFICATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: VERIFICATIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IVerificationsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const VERIFICATIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<VerificationsRelationKey>().one(EvidenceConfig.EVIDENCE_AS_ONE_RELATION_CONFIG, 'evidence'),
  Q.createRelationKeyMapper<VerificationsRelationKey>().one(ValueConfig.VALUE_AS_ONE_RELATION_CONFIG, 'method'),
] as const;

export const VERIFICATIONS_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const VERIFICATIONS_QUERY_OPTIONS = {
  searchableFields: VERIFICATIONS_SEARCHABLE_FIELDS,
  selectableFields: VERIFICATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: VERIFICATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: VERIFICATIONS_SORTABLE_FIELDS,
  filterFields: VERIFICATIONS_FILTERABLE_FIELDS,
  dateRangeFields: VERIFICATIONS_DATE_RANGE_FIELDS,
  oneRelations: VERIFICATIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: VERIFICATIONS_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IVerifications,
  VerificationsSortableField,
  VerificationsSelectableField,
  VerificationsFilterableField,
  VerificationsDateRangeField,
  VerificationsRelationKey,
  typeof VERIFICATIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof VERIFICATIONS_MANY_RELATION_QUERY_OPTIONS
>;