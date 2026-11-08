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
  IReviewDecision,
  ReviewDecisionKey,
  ReviewDecisionRelationKey,
  ReviewDecisionSortableField,
  ReviewDecisionFilterableField,
  ReviewDecisionDateRangeField,
  ReviewDecisionSelectableField,
  IReviewDecisionAsOneRelationConfig,
  IReviewDecisionAsManyRelationConfig
} from './review-decision.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const REVIEW_DECISION_RELATION_KEYS = [] as const satisfies readonly ReviewDecisionKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const REVIEW_DECISION_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly ReviewDecisionKey[];

export const REVIEW_DECISION_SEARCHABLE_FIELDS = [] as const satisfies readonly ReviewDecisionKey[];

export const REVIEW_DECISION_FILTERABLE_FIELDS = ['decision', 'id', 'reviewerId', 'targetId', 'targetKind', 'version', ] as const satisfies readonly ReviewDecisionKey[];

export const REVIEW_DECISION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly ReviewDecisionKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const REVIEW_DECISION_SELECTABLE_FIELDS = ['createdAt', 'decision', 'id', 'proposedState', 'rationale', 'reviewerId', 'targetId', 'targetKind', 'updatedAt', ] as const satisfies readonly ReviewDecisionKey[];

export const REVIEW_DECISION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ReviewDecisionSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const REVIEW_DECISION_EDITABLE_FIELDS = ['decision', 'proposedState', 'rationale', 'targetId', 'targetKind', ] as const satisfies readonly ReviewDecisionKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const REVIEW_DECISION_AS_ONE_RELATION_CONFIG = {
  relation: 'reviewDecision',
  type: ERelationType.One,
  selectableFields: REVIEW_DECISION_SELECTABLE_FIELDS,
  defaultSelectFields: REVIEW_DECISION_DEFAULT_SELECT_FIELDS
} as const satisfies IReviewDecisionAsOneRelationConfig;

export const REVIEW_DECISION_AS_MANY_RELATION_CONFIG = {
  relation: 'reviewDecisions',
  type: ERelationType.Many,
  selectableFields: REVIEW_DECISION_SELECTABLE_FIELDS,
  defaultSelectFields: REVIEW_DECISION_DEFAULT_SELECT_FIELDS,
  sortableFields: REVIEW_DECISION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IReviewDecisionAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const REVIEW_DECISION_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const REVIEW_DECISION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const REVIEW_DECISION_QUERY_OPTIONS = {
  searchableFields: REVIEW_DECISION_SEARCHABLE_FIELDS,
  selectableFields: REVIEW_DECISION_SELECTABLE_FIELDS,
  defaultSelectFields: REVIEW_DECISION_DEFAULT_SELECT_FIELDS,
  sortableFields: REVIEW_DECISION_SORTABLE_FIELDS,
  filterFields: REVIEW_DECISION_FILTERABLE_FIELDS,
  dateRangeFields: REVIEW_DECISION_DATE_RANGE_FIELDS,
  oneRelations: REVIEW_DECISION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: REVIEW_DECISION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IReviewDecision,
  ReviewDecisionSortableField,
  ReviewDecisionSelectableField,
  ReviewDecisionFilterableField,
  ReviewDecisionDateRangeField,
  ReviewDecisionRelationKey,
  typeof REVIEW_DECISION_ONE_RELATION_QUERY_OPTIONS,
  typeof REVIEW_DECISION_MANY_RELATION_QUERY_OPTIONS
>;