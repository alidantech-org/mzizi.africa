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

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  INDICATOR_CATEGORY_RELATION_KEYS,
  INDICATOR_CATEGORY_SORTABLE_FIELDS,
  INDICATOR_CATEGORY_SEARCHABLE_FIELDS,
  INDICATOR_CATEGORY_FILTERABLE_FIELDS,
  INDICATOR_CATEGORY_DATE_RANGE_FIELDS,
  INDICATOR_CATEGORY_SELECTABLE_FIELDS,
  INDICATOR_CATEGORY_DEFAULT_SELECT_FIELDS,
  INDICATOR_CATEGORY_EDITABLE_FIELDS
} from './indicator-category.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Indicator Category */
export interface IIndicatorCategory extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  code: string;
  confidence: number | null;
  isCurrent: boolean;
  label: string;
  licence: string | null;
  method: ProvenanceMethod;
  parentId: string | null;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  toolOrModel: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type IndicatorCategoryKey = keyof IIndicatorCategory;

export type IndicatorCategoryRelationKey = (typeof INDICATOR_CATEGORY_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IIndicatorCategoryReadonlyFields = B.IBaseReadonlyFields;

export type IIndicatorCategoryContextualFields = never;

export type IIndicatorCategorySensitiveFields = never;

export type IIndicatorCategoryTransitionFields = never;

export type IIndicatorCategoryImmutableFields =
  | IIndicatorCategoryReadonlyFields
  | IIndicatorCategoryContextualFields
  | IIndicatorCategorySensitiveFields
  | IIndicatorCategoryTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IIndicatorCategoryCreatable = Omit<IIndicatorCategory, IIndicatorCategoryImmutableFields | IndicatorCategoryRelationKey>;

export type IIndicatorCategorySystemWritable = Omit<IIndicatorCategory, B.IBaseReadonlyFields | IndicatorCategoryRelationKey>;

export type IIndicatorCategoryUpdatable = Partial<Omit<IIndicatorCategory, IIndicatorCategoryImmutableFields | IndicatorCategoryRelationKey>>;

export interface IIndicatorCategoryTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type IndicatorCategorySortableField = (typeof INDICATOR_CATEGORY_SORTABLE_FIELDS)[number];

export type IndicatorCategorySearchableField = (typeof INDICATOR_CATEGORY_SEARCHABLE_FIELDS)[number];

export type IndicatorCategoryFilterableField = (typeof INDICATOR_CATEGORY_FILTERABLE_FIELDS)[number];

export type IndicatorCategoryDateRangeField = (typeof INDICATOR_CATEGORY_DATE_RANGE_FIELDS)[number];

export type IndicatorCategorySelectableField = (typeof INDICATOR_CATEGORY_SELECTABLE_FIELDS)[number];

export type IndicatorCategoryDefaultSelectField = (typeof INDICATOR_CATEGORY_DEFAULT_SELECT_FIELDS)[number];

export type IndicatorCategoryEditableField = (typeof INDICATOR_CATEGORY_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IIndicatorCategoryAsOneRelationConfig = Q.IOneRelationConfig<'indicatorCategory', IndicatorCategorySelectableField>;

export type IIndicatorCategoryAsManyRelationConfig = Q.IManyRelationConfig<'indicatorCategorys', IndicatorCategorySelectableField, IndicatorCategorySortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IIndicatorCategoryAsOneRelationQuery = Q.IAsOneRelationQuery<IIndicatorCategory, IndicatorCategorySelectableField>;

export type IIndicatorCategoryAsManyRelationQuery = Q.IAsManyRelationQuery<IIndicatorCategory, IndicatorCategorySelectableField, IndicatorCategorySortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IIndicatorCategoryRelationMap extends Record<IndicatorCategoryRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IIndicatorCategoryRelationQueries = Q.IBaseRelationQueries<IIndicatorCategory, IndicatorCategoryRelationKey, IIndicatorCategoryRelationMap>;

export type IIndicatorCategoryItemQuery = Q.IBaseItemQuery<
  IIndicatorCategory,
  IndicatorCategoryRelationKey,
  IndicatorCategorySelectableField,
  IndicatorCategoryRelationKey,
  IndicatorCategorySelectableField,
  IIndicatorCategoryRelationMap,
  IIndicatorCategoryRelationQueries
>;

export type IIndicatorCategoryListQuery = Q.IBaseListQuery<
  IIndicatorCategory,
  IndicatorCategoryRelationKey,
  IndicatorCategorySelectableField,
  IndicatorCategorySortableField,
  IndicatorCategoryRelationKey,
  IndicatorCategorySelectableField,
  IndicatorCategorySortableField,
  IndicatorCategoryDateRangeField,
  IndicatorCategoryFilterableField,
  IIndicatorCategoryRelationMap,
  IIndicatorCategoryRelationQueries,
  IIndicatorCategoryItemQuery
>;