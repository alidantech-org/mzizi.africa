// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ReferendumQuestionTypes from '#/modules/elections/types/referendum-question.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  REFERENDUM_OPTION_RELATION_KEYS,
  REFERENDUM_OPTION_SORTABLE_FIELDS,
  REFERENDUM_OPTION_SEARCHABLE_FIELDS,
  REFERENDUM_OPTION_FILTERABLE_FIELDS,
  REFERENDUM_OPTION_DATE_RANGE_FIELDS,
  REFERENDUM_OPTION_SELECTABLE_FIELDS,
  REFERENDUM_OPTION_DEFAULT_SELECT_FIELDS,
  REFERENDUM_OPTION_EDITABLE_FIELDS
} from './referendum-option.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Referendum Option */
export interface IReferendumOption extends B.IBase {
  code: string;
  isCurrent: boolean;
  label: string;
  position: number | null;
  questionId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly referendumQuestion?: ReferendumQuestionTypes.IReferendumQuestion;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ReferendumOptionKey = keyof IReferendumOption;

export type ReferendumOptionRelationKey = (typeof REFERENDUM_OPTION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IReferendumOptionReadonlyFields = B.IBaseReadonlyFields;

export type IReferendumOptionContextualFields = never;

export type IReferendumOptionSensitiveFields = never;

export type IReferendumOptionTransitionFields = never;

export type IReferendumOptionImmutableFields =
  | IReferendumOptionReadonlyFields
  | IReferendumOptionContextualFields
  | IReferendumOptionSensitiveFields
  | IReferendumOptionTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IReferendumOptionCreatable = Omit<IReferendumOption, IReferendumOptionImmutableFields | ReferendumOptionRelationKey>;

export type IReferendumOptionSystemWritable = Omit<IReferendumOption, B.IBaseReadonlyFields | ReferendumOptionRelationKey>;

export type IReferendumOptionUpdatable = Partial<Omit<IReferendumOption, IReferendumOptionImmutableFields | ReferendumOptionRelationKey>>;

export interface IReferendumOptionTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ReferendumOptionSortableField = (typeof REFERENDUM_OPTION_SORTABLE_FIELDS)[number];

export type ReferendumOptionSearchableField = (typeof REFERENDUM_OPTION_SEARCHABLE_FIELDS)[number];

export type ReferendumOptionFilterableField = (typeof REFERENDUM_OPTION_FILTERABLE_FIELDS)[number];

export type ReferendumOptionDateRangeField = (typeof REFERENDUM_OPTION_DATE_RANGE_FIELDS)[number];

export type ReferendumOptionSelectableField = (typeof REFERENDUM_OPTION_SELECTABLE_FIELDS)[number];

export type ReferendumOptionDefaultSelectField = (typeof REFERENDUM_OPTION_DEFAULT_SELECT_FIELDS)[number];

export type ReferendumOptionEditableField = (typeof REFERENDUM_OPTION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IReferendumOptionAsOneRelationConfig = Q.IOneRelationConfig<'referendumOption', ReferendumOptionSelectableField>;

export type IReferendumOptionAsManyRelationConfig = Q.IManyRelationConfig<'referendumOptions', ReferendumOptionSelectableField, ReferendumOptionSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IReferendumOptionAsOneRelationQuery = Q.IAsOneRelationQuery<IReferendumOption, ReferendumOptionSelectableField>;

export type IReferendumOptionAsManyRelationQuery = Q.IAsManyRelationQuery<IReferendumOption, ReferendumOptionSelectableField, ReferendumOptionSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IReferendumOptionRelationMap extends Record<ReferendumOptionRelationKey, unknown> {
  referendumQuestion: ReferendumQuestionTypes.IReferendumQuestionAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IReferendumOptionRelationQueries = Q.IBaseRelationQueries<IReferendumOption, ReferendumOptionRelationKey, IReferendumOptionRelationMap>;

export type IReferendumOptionItemQuery = Q.IBaseItemQuery<
  IReferendumOption,
  ReferendumOptionRelationKey,
  ReferendumOptionSelectableField,
  ReferendumOptionRelationKey,
  ReferendumOptionSelectableField,
  IReferendumOptionRelationMap,
  IReferendumOptionRelationQueries
>;

export type IReferendumOptionListQuery = Q.IBaseListQuery<
  IReferendumOption,
  ReferendumOptionRelationKey,
  ReferendumOptionSelectableField,
  ReferendumOptionSortableField,
  ReferendumOptionRelationKey,
  ReferendumOptionSelectableField,
  ReferendumOptionSortableField,
  ReferendumOptionDateRangeField,
  ReferendumOptionFilterableField,
  IReferendumOptionRelationMap,
  IReferendumOptionRelationQueries,
  IReferendumOptionItemQuery
>;