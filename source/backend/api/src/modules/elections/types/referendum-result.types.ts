// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { ResultStatus } from '#/types/elections/result-status.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ReferendumOptionTypes from '#/modules/elections/types/referendum-option.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  REFERENDUM_RESULT_RELATION_KEYS,
  REFERENDUM_RESULT_SORTABLE_FIELDS,
  REFERENDUM_RESULT_SEARCHABLE_FIELDS,
  REFERENDUM_RESULT_FILTERABLE_FIELDS,
  REFERENDUM_RESULT_DATE_RANGE_FIELDS,
  REFERENDUM_RESULT_SELECTABLE_FIELDS,
  REFERENDUM_RESULT_DEFAULT_SELECT_FIELDS,
  REFERENDUM_RESULT_EDITABLE_FIELDS
} from './referendum-result.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Referendum Result */
export interface IReferendumResult extends B.IBase {
  declaredAt: Date | null;
  declaringInstitutionId: string | null;
  evidenceForm: string | null;
  geoUnitId: string | null;
  isCurrent: boolean;
  optionId: string;
  resultLevelId: string;
  resultStatus: ResultStatus | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  votes: number;
  readonly referendumOption?: ReferendumOptionTypes.IReferendumOption;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ReferendumResultKey = keyof IReferendumResult;

export type ReferendumResultRelationKey = (typeof REFERENDUM_RESULT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IReferendumResultReadonlyFields = B.IBaseReadonlyFields;

export type IReferendumResultContextualFields = never;

export type IReferendumResultSensitiveFields = never;

export type IReferendumResultTransitionFields = never;

export type IReferendumResultImmutableFields =
  | IReferendumResultReadonlyFields
  | IReferendumResultContextualFields
  | IReferendumResultSensitiveFields
  | IReferendumResultTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IReferendumResultCreatable = Omit<IReferendumResult, IReferendumResultImmutableFields | ReferendumResultRelationKey>;

export type IReferendumResultSystemWritable = Omit<IReferendumResult, B.IBaseReadonlyFields | ReferendumResultRelationKey>;

export type IReferendumResultUpdatable = Partial<Omit<IReferendumResult, IReferendumResultImmutableFields | ReferendumResultRelationKey>>;

export interface IReferendumResultTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ReferendumResultSortableField = (typeof REFERENDUM_RESULT_SORTABLE_FIELDS)[number];

export type ReferendumResultSearchableField = (typeof REFERENDUM_RESULT_SEARCHABLE_FIELDS)[number];

export type ReferendumResultFilterableField = (typeof REFERENDUM_RESULT_FILTERABLE_FIELDS)[number];

export type ReferendumResultDateRangeField = (typeof REFERENDUM_RESULT_DATE_RANGE_FIELDS)[number];

export type ReferendumResultSelectableField = (typeof REFERENDUM_RESULT_SELECTABLE_FIELDS)[number];

export type ReferendumResultDefaultSelectField = (typeof REFERENDUM_RESULT_DEFAULT_SELECT_FIELDS)[number];

export type ReferendumResultEditableField = (typeof REFERENDUM_RESULT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IReferendumResultAsOneRelationConfig = Q.IOneRelationConfig<'referendumResult', ReferendumResultSelectableField>;

export type IReferendumResultAsManyRelationConfig = Q.IManyRelationConfig<'referendumResults', ReferendumResultSelectableField, ReferendumResultSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IReferendumResultAsOneRelationQuery = Q.IAsOneRelationQuery<IReferendumResult, ReferendumResultSelectableField>;

export type IReferendumResultAsManyRelationQuery = Q.IAsManyRelationQuery<IReferendumResult, ReferendumResultSelectableField, ReferendumResultSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IReferendumResultRelationMap extends Record<ReferendumResultRelationKey, unknown> {
  referendumOption: ReferendumOptionTypes.IReferendumOptionAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IReferendumResultRelationQueries = Q.IBaseRelationQueries<IReferendumResult, ReferendumResultRelationKey, IReferendumResultRelationMap>;

export type IReferendumResultItemQuery = Q.IBaseItemQuery<
  IReferendumResult,
  ReferendumResultRelationKey,
  ReferendumResultSelectableField,
  ReferendumResultRelationKey,
  ReferendumResultSelectableField,
  IReferendumResultRelationMap,
  IReferendumResultRelationQueries
>;

export type IReferendumResultListQuery = Q.IBaseListQuery<
  IReferendumResult,
  ReferendumResultRelationKey,
  ReferendumResultSelectableField,
  ReferendumResultSortableField,
  ReferendumResultRelationKey,
  ReferendumResultSelectableField,
  ReferendumResultSortableField,
  ReferendumResultDateRangeField,
  ReferendumResultFilterableField,
  IReferendumResultRelationMap,
  IReferendumResultRelationQueries,
  IReferendumResultItemQuery
>;