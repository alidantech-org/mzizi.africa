// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { ValueLabelKind } from "#/modules/reference/schema/enum/value-label-kind.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as LanguageTypes from "#/modules/reference/schema/types/language/language.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  VALUE_LABEL_RELATION_KEYS,
  VALUE_LABEL_SORTABLE_FIELDS,
  VALUE_LABEL_SEARCHABLE_FIELDS,
  VALUE_LABEL_FILTERABLE_FIELDS,
  VALUE_LABEL_DATE_RANGE_FIELDS,
  VALUE_LABEL_SELECTABLE_FIELDS,
  VALUE_LABEL_DEFAULT_SELECT_FIELDS,
  VALUE_LABEL_EDITABLE_FIELDS,
} from "./value-label.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A label of a value in one language and of one kind, so a value can be shown in English, Swahili and other languages, with alternative names, abbreviations and definitions. The value's own label is the default display text. */
export interface IValueLabel extends B.IBase {
  label: string;
  labelKind: ValueLabelKind;
  languageId: string;
  valueId: string;
  readonly language?: LanguageTypes.ILanguage;
  readonly value?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ValueLabelKey = keyof IValueLabel;

export type ValueLabelRelationKey = (typeof VALUE_LABEL_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IValueLabelReadonlyFields = B.IBaseReadonlyFields;

export type IValueLabelContextualFields = never;

export type IValueLabelSensitiveFields = never;

export type IValueLabelTransitionFields = never;

export type IValueLabelImmutableFields =
  | IValueLabelReadonlyFields
  | IValueLabelContextualFields
  | IValueLabelSensitiveFields
  | IValueLabelTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IValueLabelCreatable = Omit<
  IValueLabel,
  IValueLabelImmutableFields | ValueLabelRelationKey
>;

export type IValueLabelSystemWritable = Omit<
  IValueLabel,
  B.IBaseReadonlyFields | ValueLabelRelationKey
>;

export type IValueLabelUpdatable = Partial<
  Omit<IValueLabel, IValueLabelImmutableFields | ValueLabelRelationKey>
>;

export interface IValueLabelTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ValueLabelSortableField = (typeof VALUE_LABEL_SORTABLE_FIELDS)[number];

export type ValueLabelSearchableField = (typeof VALUE_LABEL_SEARCHABLE_FIELDS)[number];

export type ValueLabelFilterableField = (typeof VALUE_LABEL_FILTERABLE_FIELDS)[number];

export type ValueLabelDateRangeField = (typeof VALUE_LABEL_DATE_RANGE_FIELDS)[number];

export type ValueLabelSelectableField = (typeof VALUE_LABEL_SELECTABLE_FIELDS)[number];

export type ValueLabelDefaultSelectField = (typeof VALUE_LABEL_DEFAULT_SELECT_FIELDS)[number];

export type ValueLabelEditableField = (typeof VALUE_LABEL_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IValueLabelAsOneRelationConfig = Q.IOneRelationConfig<
  "valueLabel",
  ValueLabelSelectableField
>;

export type IValueLabelAsManyRelationConfig = Q.IManyRelationConfig<
  "valueLabels",
  ValueLabelSelectableField,
  ValueLabelSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IValueLabelAsOneRelationQuery = Q.IAsOneRelationQuery<
  IValueLabel,
  ValueLabelSelectableField
>;

export type IValueLabelAsManyRelationQuery = Q.IAsManyRelationQuery<
  IValueLabel,
  ValueLabelSelectableField,
  ValueLabelSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IValueLabelRelationMap extends Record<ValueLabelRelationKey, unknown> {
  language: LanguageTypes.ILanguageAsOneRelationQuery;
  value: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IValueLabelRelationQueries = Q.IBaseRelationQueries<
  IValueLabel,
  ValueLabelRelationKey,
  IValueLabelRelationMap
>;

export type IValueLabelItemQuery = Q.IBaseItemQuery<
  IValueLabel,
  ValueLabelRelationKey,
  ValueLabelSelectableField,
  ValueLabelRelationKey,
  ValueLabelSelectableField,
  IValueLabelRelationMap,
  IValueLabelRelationQueries
>;

export type IValueLabelListQuery = Q.IBaseListQuery<
  IValueLabel,
  ValueLabelRelationKey,
  ValueLabelSelectableField,
  ValueLabelSortableField,
  ValueLabelRelationKey,
  ValueLabelSelectableField,
  ValueLabelSortableField,
  ValueLabelDateRangeField,
  ValueLabelFilterableField,
  IValueLabelRelationMap,
  IValueLabelRelationQueries,
  IValueLabelItemQuery
>;
