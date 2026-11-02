// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { Decision } from '#/types/audit/decision.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  REVIEW_DECISION_RELATION_KEYS,
  REVIEW_DECISION_SORTABLE_FIELDS,
  REVIEW_DECISION_SEARCHABLE_FIELDS,
  REVIEW_DECISION_FILTERABLE_FIELDS,
  REVIEW_DECISION_DATE_RANGE_FIELDS,
  REVIEW_DECISION_SELECTABLE_FIELDS,
  REVIEW_DECISION_DEFAULT_SELECT_FIELDS,
  REVIEW_DECISION_EDITABLE_FIELDS
} from './review-decision.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Review Decision */
export interface IReviewDecision extends B.IBase {
  decision: Decision;
  proposedState: VerificationState;
  rationale: string;
  reviewerId: string;
  targetId: string;
  targetKind: string;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ReviewDecisionKey = keyof IReviewDecision;

export type ReviewDecisionRelationKey = (typeof REVIEW_DECISION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IReviewDecisionReadonlyFields = B.IBaseReadonlyFields;

export type IReviewDecisionContextualFields = never;

export type IReviewDecisionSensitiveFields = never;

export type IReviewDecisionTransitionFields = never;

export type IReviewDecisionImmutableFields =
  | IReviewDecisionReadonlyFields
  | IReviewDecisionContextualFields
  | IReviewDecisionSensitiveFields
  | IReviewDecisionTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IReviewDecisionCreatable = Omit<IReviewDecision, IReviewDecisionImmutableFields | ReviewDecisionRelationKey>;

export type IReviewDecisionSystemWritable = Omit<IReviewDecision, B.IBaseReadonlyFields | ReviewDecisionRelationKey>;

export type IReviewDecisionUpdatable = Partial<Omit<IReviewDecision, IReviewDecisionImmutableFields | ReviewDecisionRelationKey>>;

export interface IReviewDecisionTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ReviewDecisionSortableField = (typeof REVIEW_DECISION_SORTABLE_FIELDS)[number];

export type ReviewDecisionSearchableField = (typeof REVIEW_DECISION_SEARCHABLE_FIELDS)[number];

export type ReviewDecisionFilterableField = (typeof REVIEW_DECISION_FILTERABLE_FIELDS)[number];

export type ReviewDecisionDateRangeField = (typeof REVIEW_DECISION_DATE_RANGE_FIELDS)[number];

export type ReviewDecisionSelectableField = (typeof REVIEW_DECISION_SELECTABLE_FIELDS)[number];

export type ReviewDecisionDefaultSelectField = (typeof REVIEW_DECISION_DEFAULT_SELECT_FIELDS)[number];

export type ReviewDecisionEditableField = (typeof REVIEW_DECISION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IReviewDecisionAsOneRelationConfig = Q.IOneRelationConfig<'reviewDecision', ReviewDecisionSelectableField>;

export type IReviewDecisionAsManyRelationConfig = Q.IManyRelationConfig<'reviewDecisions', ReviewDecisionSelectableField, ReviewDecisionSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IReviewDecisionAsOneRelationQuery = Q.IAsOneRelationQuery<IReviewDecision, ReviewDecisionSelectableField>;

export type IReviewDecisionAsManyRelationQuery = Q.IAsManyRelationQuery<IReviewDecision, ReviewDecisionSelectableField, ReviewDecisionSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IReviewDecisionRelationMap extends Record<ReviewDecisionRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IReviewDecisionRelationQueries = Q.IBaseRelationQueries<IReviewDecision, ReviewDecisionRelationKey, IReviewDecisionRelationMap>;

export type IReviewDecisionItemQuery = Q.IBaseItemQuery<
  IReviewDecision,
  ReviewDecisionRelationKey,
  ReviewDecisionSelectableField,
  ReviewDecisionRelationKey,
  ReviewDecisionSelectableField,
  IReviewDecisionRelationMap,
  IReviewDecisionRelationQueries
>;

export type IReviewDecisionListQuery = Q.IBaseListQuery<
  IReviewDecision,
  ReviewDecisionRelationKey,
  ReviewDecisionSelectableField,
  ReviewDecisionSortableField,
  ReviewDecisionRelationKey,
  ReviewDecisionSelectableField,
  ReviewDecisionSortableField,
  ReviewDecisionDateRangeField,
  ReviewDecisionFilterableField,
  IReviewDecisionRelationMap,
  IReviewDecisionRelationQueries,
  IReviewDecisionItemQuery
>;