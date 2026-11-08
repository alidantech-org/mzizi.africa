// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ElectionTypes from '#/modules/elections/types/election.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  REFERENDUM_QUESTION_RELATION_KEYS,
  REFERENDUM_QUESTION_SORTABLE_FIELDS,
  REFERENDUM_QUESTION_SEARCHABLE_FIELDS,
  REFERENDUM_QUESTION_FILTERABLE_FIELDS,
  REFERENDUM_QUESTION_DATE_RANGE_FIELDS,
  REFERENDUM_QUESTION_SELECTABLE_FIELDS,
  REFERENDUM_QUESTION_DEFAULT_SELECT_FIELDS,
  REFERENDUM_QUESTION_EDITABLE_FIELDS
} from './referendum-question.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Referendum Question */
export interface IReferendumQuestion extends B.IBase {
  code: string;
  electionId: string;
  isCurrent: boolean;
  position: number | null;
  text: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly election?: ElectionTypes.IElection;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ReferendumQuestionKey = keyof IReferendumQuestion;

export type ReferendumQuestionRelationKey = (typeof REFERENDUM_QUESTION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IReferendumQuestionReadonlyFields = B.IBaseReadonlyFields;

export type IReferendumQuestionContextualFields = never;

export type IReferendumQuestionSensitiveFields = never;

export type IReferendumQuestionTransitionFields = never;

export type IReferendumQuestionImmutableFields =
  | IReferendumQuestionReadonlyFields
  | IReferendumQuestionContextualFields
  | IReferendumQuestionSensitiveFields
  | IReferendumQuestionTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IReferendumQuestionCreatable = Omit<IReferendumQuestion, IReferendumQuestionImmutableFields | ReferendumQuestionRelationKey>;

export type IReferendumQuestionSystemWritable = Omit<IReferendumQuestion, B.IBaseReadonlyFields | ReferendumQuestionRelationKey>;

export type IReferendumQuestionUpdatable = Partial<Omit<IReferendumQuestion, IReferendumQuestionImmutableFields | ReferendumQuestionRelationKey>>;

export interface IReferendumQuestionTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ReferendumQuestionSortableField = (typeof REFERENDUM_QUESTION_SORTABLE_FIELDS)[number];

export type ReferendumQuestionSearchableField = (typeof REFERENDUM_QUESTION_SEARCHABLE_FIELDS)[number];

export type ReferendumQuestionFilterableField = (typeof REFERENDUM_QUESTION_FILTERABLE_FIELDS)[number];

export type ReferendumQuestionDateRangeField = (typeof REFERENDUM_QUESTION_DATE_RANGE_FIELDS)[number];

export type ReferendumQuestionSelectableField = (typeof REFERENDUM_QUESTION_SELECTABLE_FIELDS)[number];

export type ReferendumQuestionDefaultSelectField = (typeof REFERENDUM_QUESTION_DEFAULT_SELECT_FIELDS)[number];

export type ReferendumQuestionEditableField = (typeof REFERENDUM_QUESTION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IReferendumQuestionAsOneRelationConfig = Q.IOneRelationConfig<'referendumQuestion', ReferendumQuestionSelectableField>;

export type IReferendumQuestionAsManyRelationConfig = Q.IManyRelationConfig<'referendumQuestions', ReferendumQuestionSelectableField, ReferendumQuestionSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IReferendumQuestionAsOneRelationQuery = Q.IAsOneRelationQuery<IReferendumQuestion, ReferendumQuestionSelectableField>;

export type IReferendumQuestionAsManyRelationQuery = Q.IAsManyRelationQuery<IReferendumQuestion, ReferendumQuestionSelectableField, ReferendumQuestionSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IReferendumQuestionRelationMap extends Record<ReferendumQuestionRelationKey, unknown> {
  election: ElectionTypes.IElectionAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IReferendumQuestionRelationQueries = Q.IBaseRelationQueries<IReferendumQuestion, ReferendumQuestionRelationKey, IReferendumQuestionRelationMap>;

export type IReferendumQuestionItemQuery = Q.IBaseItemQuery<
  IReferendumQuestion,
  ReferendumQuestionRelationKey,
  ReferendumQuestionSelectableField,
  ReferendumQuestionRelationKey,
  ReferendumQuestionSelectableField,
  IReferendumQuestionRelationMap,
  IReferendumQuestionRelationQueries
>;

export type IReferendumQuestionListQuery = Q.IBaseListQuery<
  IReferendumQuestion,
  ReferendumQuestionRelationKey,
  ReferendumQuestionSelectableField,
  ReferendumQuestionSortableField,
  ReferendumQuestionRelationKey,
  ReferendumQuestionSelectableField,
  ReferendumQuestionSortableField,
  ReferendumQuestionDateRangeField,
  ReferendumQuestionFilterableField,
  IReferendumQuestionRelationMap,
  IReferendumQuestionRelationQueries,
  IReferendumQuestionItemQuery
>;