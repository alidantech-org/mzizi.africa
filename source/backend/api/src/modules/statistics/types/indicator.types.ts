// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as IndicatorCategoryTypes from '#/modules/statistics/types/indicator-category.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  INDICATOR_RELATION_KEYS,
  INDICATOR_SORTABLE_FIELDS,
  INDICATOR_SEARCHABLE_FIELDS,
  INDICATOR_FILTERABLE_FIELDS,
  INDICATOR_DATE_RANGE_FIELDS,
  INDICATOR_SELECTABLE_FIELDS,
  INDICATOR_DEFAULT_SELECT_FIELDS,
  INDICATOR_EDITABLE_FIELDS
} from './indicator.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Indicator */
export interface IIndicator extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  categoryId: string;
  code: string;
  confidence: number | null;
  definition: string | null;
  isCurrent: boolean;
  licence: string | null;
  method: ProvenanceMethod;
  name: string;
  parentId: string | null;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  toolOrModel: string | null;
  unitOfMeasure: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly indicatorCategory?: IndicatorCategoryTypes.IIndicatorCategory;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type IndicatorKey = keyof IIndicator;

export type IndicatorRelationKey = (typeof INDICATOR_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IIndicatorReadonlyFields = B.IBaseReadonlyFields;

export type IIndicatorContextualFields = never;

export type IIndicatorSensitiveFields = never;

export type IIndicatorTransitionFields = never;

export type IIndicatorImmutableFields =
  | IIndicatorReadonlyFields
  | IIndicatorContextualFields
  | IIndicatorSensitiveFields
  | IIndicatorTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IIndicatorCreatable = Omit<IIndicator, IIndicatorImmutableFields | IndicatorRelationKey>;

export type IIndicatorSystemWritable = Omit<IIndicator, B.IBaseReadonlyFields | IndicatorRelationKey>;

export type IIndicatorUpdatable = Partial<Omit<IIndicator, IIndicatorImmutableFields | IndicatorRelationKey>>;

export interface IIndicatorTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type IndicatorSortableField = (typeof INDICATOR_SORTABLE_FIELDS)[number];

export type IndicatorSearchableField = (typeof INDICATOR_SEARCHABLE_FIELDS)[number];

export type IndicatorFilterableField = (typeof INDICATOR_FILTERABLE_FIELDS)[number];

export type IndicatorDateRangeField = (typeof INDICATOR_DATE_RANGE_FIELDS)[number];

export type IndicatorSelectableField = (typeof INDICATOR_SELECTABLE_FIELDS)[number];

export type IndicatorDefaultSelectField = (typeof INDICATOR_DEFAULT_SELECT_FIELDS)[number];

export type IndicatorEditableField = (typeof INDICATOR_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IIndicatorAsOneRelationConfig = Q.IOneRelationConfig<'indicator', IndicatorSelectableField>;

export type IIndicatorAsManyRelationConfig = Q.IManyRelationConfig<'indicators', IndicatorSelectableField, IndicatorSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IIndicatorAsOneRelationQuery = Q.IAsOneRelationQuery<IIndicator, IndicatorSelectableField>;

export type IIndicatorAsManyRelationQuery = Q.IAsManyRelationQuery<IIndicator, IndicatorSelectableField, IndicatorSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IIndicatorRelationMap extends Record<IndicatorRelationKey, unknown> {
  indicatorCategory: IndicatorCategoryTypes.IIndicatorCategoryAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IIndicatorRelationQueries = Q.IBaseRelationQueries<IIndicator, IndicatorRelationKey, IIndicatorRelationMap>;

export type IIndicatorItemQuery = Q.IBaseItemQuery<
  IIndicator,
  IndicatorRelationKey,
  IndicatorSelectableField,
  IndicatorRelationKey,
  IndicatorSelectableField,
  IIndicatorRelationMap,
  IIndicatorRelationQueries
>;

export type IIndicatorListQuery = Q.IBaseListQuery<
  IIndicator,
  IndicatorRelationKey,
  IndicatorSelectableField,
  IndicatorSortableField,
  IndicatorRelationKey,
  IndicatorSelectableField,
  IndicatorSortableField,
  IndicatorDateRangeField,
  IndicatorFilterableField,
  IIndicatorRelationMap,
  IIndicatorRelationQueries,
  IIndicatorItemQuery
>;