// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { FormatCategory } from '#/types/filesystem/format-category.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  FORMAT_RELATION_KEYS,
  FORMAT_SORTABLE_FIELDS,
  FORMAT_SEARCHABLE_FIELDS,
  FORMAT_FILTERABLE_FIELDS,
  FORMAT_DATE_RANGE_FIELDS,
  FORMAT_SELECTABLE_FIELDS,
  FORMAT_DEFAULT_SELECT_FIELDS,
  FORMAT_EDITABLE_FIELDS
} from './format.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Format */
export interface IFormat extends B.IBase {
  category: FormatCategory;
  code: string;
  extension: string;
  isPreviewable: boolean;
  maxSizeBytes: number | null;
  mimeType: string;
  name: string;
  processingStrategy: string | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type FormatKey = keyof IFormat;

export type FormatRelationKey = (typeof FORMAT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IFormatReadonlyFields = B.IBaseReadonlyFields;

export type IFormatContextualFields = never;

export type IFormatSensitiveFields = never;

export type IFormatTransitionFields = never;

export type IFormatImmutableFields =
  | IFormatReadonlyFields
  | IFormatContextualFields
  | IFormatSensitiveFields
  | IFormatTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IFormatCreatable = Omit<IFormat, IFormatImmutableFields | FormatRelationKey>;

export type IFormatSystemWritable = Omit<IFormat, B.IBaseReadonlyFields | FormatRelationKey>;

export type IFormatUpdatable = Partial<Omit<IFormat, IFormatImmutableFields | FormatRelationKey>>;

export interface IFormatTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type FormatSortableField = (typeof FORMAT_SORTABLE_FIELDS)[number];

export type FormatSearchableField = (typeof FORMAT_SEARCHABLE_FIELDS)[number];

export type FormatFilterableField = (typeof FORMAT_FILTERABLE_FIELDS)[number];

export type FormatDateRangeField = (typeof FORMAT_DATE_RANGE_FIELDS)[number];

export type FormatSelectableField = (typeof FORMAT_SELECTABLE_FIELDS)[number];

export type FormatDefaultSelectField = (typeof FORMAT_DEFAULT_SELECT_FIELDS)[number];

export type FormatEditableField = (typeof FORMAT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IFormatAsOneRelationConfig = Q.IOneRelationConfig<'format', FormatSelectableField>;

export type IFormatAsManyRelationConfig = Q.IManyRelationConfig<'formats', FormatSelectableField, FormatSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IFormatAsOneRelationQuery = Q.IAsOneRelationQuery<IFormat, FormatSelectableField>;

export type IFormatAsManyRelationQuery = Q.IAsManyRelationQuery<IFormat, FormatSelectableField, FormatSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IFormatRelationMap extends Record<FormatRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IFormatRelationQueries = Q.IBaseRelationQueries<IFormat, FormatRelationKey, IFormatRelationMap>;

export type IFormatItemQuery = Q.IBaseItemQuery<
  IFormat,
  FormatRelationKey,
  FormatSelectableField,
  FormatRelationKey,
  FormatSelectableField,
  IFormatRelationMap,
  IFormatRelationQueries
>;

export type IFormatListQuery = Q.IBaseListQuery<
  IFormat,
  FormatRelationKey,
  FormatSelectableField,
  FormatSortableField,
  FormatRelationKey,
  FormatSelectableField,
  FormatSortableField,
  FormatDateRangeField,
  FormatFilterableField,
  IFormatRelationMap,
  IFormatRelationQueries,
  IFormatItemQuery
>;