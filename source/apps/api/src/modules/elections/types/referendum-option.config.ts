// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ReferendumQuestionConfig from '#/modules/elections/types/referendum-question.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IReferendumOption,
  ReferendumOptionKey,
  ReferendumOptionRelationKey,
  ReferendumOptionSortableField,
  ReferendumOptionFilterableField,
  ReferendumOptionDateRangeField,
  ReferendumOptionSelectableField,
  IReferendumOptionAsOneRelationConfig,
  IReferendumOptionAsManyRelationConfig
} from './referendum-option.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const REFERENDUM_OPTION_RELATION_KEYS = ['referendumQuestion', ] as const satisfies readonly ReferendumOptionKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const REFERENDUM_OPTION_SORTABLE_FIELDS = ['code', 'createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly ReferendumOptionKey[];

export const REFERENDUM_OPTION_SEARCHABLE_FIELDS = ['code', ] as const satisfies readonly ReferendumOptionKey[];

export const REFERENDUM_OPTION_FILTERABLE_FIELDS = ['code', 'id', 'isCurrent', 'questionId', 'version', ] as const satisfies readonly ReferendumOptionKey[];

export const REFERENDUM_OPTION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly ReferendumOptionKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const REFERENDUM_OPTION_SELECTABLE_FIELDS = ['code', 'createdAt', 'id', 'isCurrent', 'label', 'position', 'questionId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly ReferendumOptionKey[];

export const REFERENDUM_OPTION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ReferendumOptionSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const REFERENDUM_OPTION_EDITABLE_FIELDS = ['code', 'isCurrent', 'label', 'position', 'questionId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly ReferendumOptionKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const REFERENDUM_OPTION_AS_ONE_RELATION_CONFIG = {
  relation: 'referendumOption',
  type: ERelationType.One,
  selectableFields: REFERENDUM_OPTION_SELECTABLE_FIELDS,
  defaultSelectFields: REFERENDUM_OPTION_DEFAULT_SELECT_FIELDS
} as const satisfies IReferendumOptionAsOneRelationConfig;

export const REFERENDUM_OPTION_AS_MANY_RELATION_CONFIG = {
  relation: 'referendumOptions',
  type: ERelationType.Many,
  selectableFields: REFERENDUM_OPTION_SELECTABLE_FIELDS,
  defaultSelectFields: REFERENDUM_OPTION_DEFAULT_SELECT_FIELDS,
  sortableFields: REFERENDUM_OPTION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IReferendumOptionAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const REFERENDUM_OPTION_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ReferendumOptionRelationKey>().one(ReferendumQuestionConfig.REFERENDUM_QUESTION_AS_ONE_RELATION_CONFIG, 'referendumQuestion'),
] as const;

export const REFERENDUM_OPTION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const REFERENDUM_OPTION_QUERY_OPTIONS = {
  searchableFields: REFERENDUM_OPTION_SEARCHABLE_FIELDS,
  selectableFields: REFERENDUM_OPTION_SELECTABLE_FIELDS,
  defaultSelectFields: REFERENDUM_OPTION_DEFAULT_SELECT_FIELDS,
  sortableFields: REFERENDUM_OPTION_SORTABLE_FIELDS,
  filterFields: REFERENDUM_OPTION_FILTERABLE_FIELDS,
  dateRangeFields: REFERENDUM_OPTION_DATE_RANGE_FIELDS,
  oneRelations: REFERENDUM_OPTION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: REFERENDUM_OPTION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IReferendumOption,
  ReferendumOptionSortableField,
  ReferendumOptionSelectableField,
  ReferendumOptionFilterableField,
  ReferendumOptionDateRangeField,
  ReferendumOptionRelationKey,
  typeof REFERENDUM_OPTION_ONE_RELATION_QUERY_OPTIONS,
  typeof REFERENDUM_OPTION_MANY_RELATION_QUERY_OPTIONS
>;