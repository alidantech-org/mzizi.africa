// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ElectionConfig from '#/modules/elections/types/election.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IReferendumQuestion,
  ReferendumQuestionKey,
  ReferendumQuestionRelationKey,
  ReferendumQuestionSortableField,
  ReferendumQuestionFilterableField,
  ReferendumQuestionDateRangeField,
  ReferendumQuestionSelectableField,
  IReferendumQuestionAsOneRelationConfig,
  IReferendumQuestionAsManyRelationConfig
} from './referendum-question.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const REFERENDUM_QUESTION_RELATION_KEYS = ['election', ] as const satisfies readonly ReferendumQuestionKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const REFERENDUM_QUESTION_SORTABLE_FIELDS = ['code', 'createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly ReferendumQuestionKey[];

export const REFERENDUM_QUESTION_SEARCHABLE_FIELDS = ['code', ] as const satisfies readonly ReferendumQuestionKey[];

export const REFERENDUM_QUESTION_FILTERABLE_FIELDS = ['code', 'electionId', 'id', 'isCurrent', 'version', ] as const satisfies readonly ReferendumQuestionKey[];

export const REFERENDUM_QUESTION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly ReferendumQuestionKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const REFERENDUM_QUESTION_SELECTABLE_FIELDS = ['code', 'createdAt', 'electionId', 'id', 'isCurrent', 'position', 'text', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly ReferendumQuestionKey[];

export const REFERENDUM_QUESTION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ReferendumQuestionSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const REFERENDUM_QUESTION_EDITABLE_FIELDS = ['code', 'electionId', 'isCurrent', 'position', 'text', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly ReferendumQuestionKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const REFERENDUM_QUESTION_AS_ONE_RELATION_CONFIG = {
  relation: 'referendumQuestion',
  type: ERelationType.One,
  selectableFields: REFERENDUM_QUESTION_SELECTABLE_FIELDS,
  defaultSelectFields: REFERENDUM_QUESTION_DEFAULT_SELECT_FIELDS
} as const satisfies IReferendumQuestionAsOneRelationConfig;

export const REFERENDUM_QUESTION_AS_MANY_RELATION_CONFIG = {
  relation: 'referendumQuestions',
  type: ERelationType.Many,
  selectableFields: REFERENDUM_QUESTION_SELECTABLE_FIELDS,
  defaultSelectFields: REFERENDUM_QUESTION_DEFAULT_SELECT_FIELDS,
  sortableFields: REFERENDUM_QUESTION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IReferendumQuestionAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const REFERENDUM_QUESTION_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ReferendumQuestionRelationKey>().one(ElectionConfig.ELECTION_AS_ONE_RELATION_CONFIG, 'election'),
] as const;

export const REFERENDUM_QUESTION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const REFERENDUM_QUESTION_QUERY_OPTIONS = {
  searchableFields: REFERENDUM_QUESTION_SEARCHABLE_FIELDS,
  selectableFields: REFERENDUM_QUESTION_SELECTABLE_FIELDS,
  defaultSelectFields: REFERENDUM_QUESTION_DEFAULT_SELECT_FIELDS,
  sortableFields: REFERENDUM_QUESTION_SORTABLE_FIELDS,
  filterFields: REFERENDUM_QUESTION_FILTERABLE_FIELDS,
  dateRangeFields: REFERENDUM_QUESTION_DATE_RANGE_FIELDS,
  oneRelations: REFERENDUM_QUESTION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: REFERENDUM_QUESTION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IReferendumQuestion,
  ReferendumQuestionSortableField,
  ReferendumQuestionSelectableField,
  ReferendumQuestionFilterableField,
  ReferendumQuestionDateRangeField,
  ReferendumQuestionRelationKey,
  typeof REFERENDUM_QUESTION_ONE_RELATION_QUERY_OPTIONS,
  typeof REFERENDUM_QUESTION_MANY_RELATION_QUERY_OPTIONS
>;