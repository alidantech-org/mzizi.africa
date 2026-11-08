// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  DIMENSION_RELATION_KEYS,
  DIMENSION_SORTABLE_FIELDS,
  DIMENSION_SEARCHABLE_FIELDS,
  DIMENSION_FILTERABLE_FIELDS,
  DIMENSION_DATE_RANGE_FIELDS,
  DIMENSION_SELECTABLE_FIELDS,
  DIMENSION_DEFAULT_SELECT_FIELDS,
  DIMENSION_EDITABLE_FIELDS
} from './dimension.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Dimension */
export interface IDimension extends B.IBase {
  code: string;
  description: string | null;
  isCurrent: boolean;
  name: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type DimensionKey = keyof IDimension;

export type DimensionRelationKey = (typeof DIMENSION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IDimensionReadonlyFields = B.IBaseReadonlyFields;

export type IDimensionContextualFields = never;

export type IDimensionSensitiveFields = never;

export type IDimensionTransitionFields = never;

export type IDimensionImmutableFields =
  | IDimensionReadonlyFields
  | IDimensionContextualFields
  | IDimensionSensitiveFields
  | IDimensionTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IDimensionCreatable = Omit<IDimension, IDimensionImmutableFields | DimensionRelationKey>;

export type IDimensionSystemWritable = Omit<IDimension, B.IBaseReadonlyFields | DimensionRelationKey>;

export type IDimensionUpdatable = Partial<Omit<IDimension, IDimensionImmutableFields | DimensionRelationKey>>;

export interface IDimensionTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type DimensionSortableField = (typeof DIMENSION_SORTABLE_FIELDS)[number];

export type DimensionSearchableField = (typeof DIMENSION_SEARCHABLE_FIELDS)[number];

export type DimensionFilterableField = (typeof DIMENSION_FILTERABLE_FIELDS)[number];

export type DimensionDateRangeField = (typeof DIMENSION_DATE_RANGE_FIELDS)[number];

export type DimensionSelectableField = (typeof DIMENSION_SELECTABLE_FIELDS)[number];

export type DimensionDefaultSelectField = (typeof DIMENSION_DEFAULT_SELECT_FIELDS)[number];

export type DimensionEditableField = (typeof DIMENSION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IDimensionAsOneRelationConfig = Q.IOneRelationConfig<'dimension', DimensionSelectableField>;

export type IDimensionAsManyRelationConfig = Q.IManyRelationConfig<'dimensions', DimensionSelectableField, DimensionSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IDimensionAsOneRelationQuery = Q.IAsOneRelationQuery<IDimension, DimensionSelectableField>;

export type IDimensionAsManyRelationQuery = Q.IAsManyRelationQuery<IDimension, DimensionSelectableField, DimensionSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IDimensionRelationMap extends Record<DimensionRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IDimensionRelationQueries = Q.IBaseRelationQueries<IDimension, DimensionRelationKey, IDimensionRelationMap>;

export type IDimensionItemQuery = Q.IBaseItemQuery<
  IDimension,
  DimensionRelationKey,
  DimensionSelectableField,
  DimensionRelationKey,
  DimensionSelectableField,
  IDimensionRelationMap,
  IDimensionRelationQueries
>;

export type IDimensionListQuery = Q.IBaseListQuery<
  IDimension,
  DimensionRelationKey,
  DimensionSelectableField,
  DimensionSortableField,
  DimensionRelationKey,
  DimensionSelectableField,
  DimensionSortableField,
  DimensionDateRangeField,
  DimensionFilterableField,
  IDimensionRelationMap,
  IDimensionRelationQueries,
  IDimensionItemQuery
>;