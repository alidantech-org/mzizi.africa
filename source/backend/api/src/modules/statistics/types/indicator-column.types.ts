// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ColumnDataType } from '#/types/statistics/column-data-type.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as IndicatorTypes from '#/modules/statistics/types/indicator.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  INDICATOR_COLUMN_RELATION_KEYS,
  INDICATOR_COLUMN_SORTABLE_FIELDS,
  INDICATOR_COLUMN_SEARCHABLE_FIELDS,
  INDICATOR_COLUMN_FILTERABLE_FIELDS,
  INDICATOR_COLUMN_DATE_RANGE_FIELDS,
  INDICATOR_COLUMN_SELECTABLE_FIELDS,
  INDICATOR_COLUMN_DEFAULT_SELECT_FIELDS,
  INDICATOR_COLUMN_EDITABLE_FIELDS
} from './indicator-column.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Indicator Column */
export interface IIndicatorColumn extends B.IBase {
  code: string;
  dataType: ColumnDataType;
  indicatorId: string;
  isCurrent: boolean;
  label: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly indicator?: IndicatorTypes.IIndicator;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type IndicatorColumnKey = keyof IIndicatorColumn;

export type IndicatorColumnRelationKey = (typeof INDICATOR_COLUMN_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IIndicatorColumnReadonlyFields = B.IBaseReadonlyFields;

export type IIndicatorColumnContextualFields = never;

export type IIndicatorColumnSensitiveFields = never;

export type IIndicatorColumnTransitionFields = never;

export type IIndicatorColumnImmutableFields =
  | IIndicatorColumnReadonlyFields
  | IIndicatorColumnContextualFields
  | IIndicatorColumnSensitiveFields
  | IIndicatorColumnTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IIndicatorColumnCreatable = Omit<IIndicatorColumn, IIndicatorColumnImmutableFields | IndicatorColumnRelationKey>;

export type IIndicatorColumnSystemWritable = Omit<IIndicatorColumn, B.IBaseReadonlyFields | IndicatorColumnRelationKey>;

export type IIndicatorColumnUpdatable = Partial<Omit<IIndicatorColumn, IIndicatorColumnImmutableFields | IndicatorColumnRelationKey>>;

export interface IIndicatorColumnTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type IndicatorColumnSortableField = (typeof INDICATOR_COLUMN_SORTABLE_FIELDS)[number];

export type IndicatorColumnSearchableField = (typeof INDICATOR_COLUMN_SEARCHABLE_FIELDS)[number];

export type IndicatorColumnFilterableField = (typeof INDICATOR_COLUMN_FILTERABLE_FIELDS)[number];

export type IndicatorColumnDateRangeField = (typeof INDICATOR_COLUMN_DATE_RANGE_FIELDS)[number];

export type IndicatorColumnSelectableField = (typeof INDICATOR_COLUMN_SELECTABLE_FIELDS)[number];

export type IndicatorColumnDefaultSelectField = (typeof INDICATOR_COLUMN_DEFAULT_SELECT_FIELDS)[number];

export type IndicatorColumnEditableField = (typeof INDICATOR_COLUMN_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IIndicatorColumnAsOneRelationConfig = Q.IOneRelationConfig<'indicatorColumn', IndicatorColumnSelectableField>;

export type IIndicatorColumnAsManyRelationConfig = Q.IManyRelationConfig<'indicatorColumns', IndicatorColumnSelectableField, IndicatorColumnSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IIndicatorColumnAsOneRelationQuery = Q.IAsOneRelationQuery<IIndicatorColumn, IndicatorColumnSelectableField>;

export type IIndicatorColumnAsManyRelationQuery = Q.IAsManyRelationQuery<IIndicatorColumn, IndicatorColumnSelectableField, IndicatorColumnSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IIndicatorColumnRelationMap extends Record<IndicatorColumnRelationKey, unknown> {
  indicator: IndicatorTypes.IIndicatorAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IIndicatorColumnRelationQueries = Q.IBaseRelationQueries<IIndicatorColumn, IndicatorColumnRelationKey, IIndicatorColumnRelationMap>;

export type IIndicatorColumnItemQuery = Q.IBaseItemQuery<
  IIndicatorColumn,
  IndicatorColumnRelationKey,
  IndicatorColumnSelectableField,
  IndicatorColumnRelationKey,
  IndicatorColumnSelectableField,
  IIndicatorColumnRelationMap,
  IIndicatorColumnRelationQueries
>;

export type IIndicatorColumnListQuery = Q.IBaseListQuery<
  IIndicatorColumn,
  IndicatorColumnRelationKey,
  IndicatorColumnSelectableField,
  IndicatorColumnSortableField,
  IndicatorColumnRelationKey,
  IndicatorColumnSelectableField,
  IndicatorColumnSortableField,
  IndicatorColumnDateRangeField,
  IndicatorColumnFilterableField,
  IIndicatorColumnRelationMap,
  IIndicatorColumnRelationQueries,
  IIndicatorColumnItemQuery
>;