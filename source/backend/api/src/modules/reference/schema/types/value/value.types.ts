// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as SchemeTypes from "#/modules/reference/schema/types/scheme/scheme.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  VALUE_RELATION_KEYS,
  VALUE_SORTABLE_FIELDS,
  VALUE_SEARCHABLE_FIELDS,
  VALUE_FILTERABLE_FIELDS,
  VALUE_DATE_RANGE_FIELDS,
  VALUE_SELECTABLE_FIELDS,
  VALUE_DEFAULT_SELECT_FIELDS,
  VALUE_EDITABLE_FIELDS,
} from "./value.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A controlled classification member within one scheme, with optional supersession and an optional broader parent value in the same scheme. Wider, cross-scheme or many-parent links use value relations. */
export interface IValue extends B.IBase {
  code: string;
  label: string;
  parentId: string | null;
  position: number | null;
  schemeId: string;
  supersedesId: string | null;
  readonly parent?: IValue;
  readonly scheme?: SchemeTypes.IScheme;
  readonly supersedes?: IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ValueKey = keyof IValue;

export type ValueRelationKey = (typeof VALUE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IValueReadonlyFields = B.IBaseReadonlyFields;

export type IValueContextualFields = never;

export type IValueSensitiveFields = never;

export type IValueTransitionFields = never;

export type IValueImmutableFields =
  IValueReadonlyFields | IValueContextualFields | IValueSensitiveFields | IValueTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IValueCreatable = Omit<IValue, IValueImmutableFields | ValueRelationKey>;

export type IValueSystemWritable = Omit<IValue, B.IBaseReadonlyFields | ValueRelationKey>;

export type IValueUpdatable = Partial<Omit<IValue, IValueImmutableFields | ValueRelationKey>>;

export interface IValueTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ValueSortableField = (typeof VALUE_SORTABLE_FIELDS)[number];

export type ValueSearchableField = (typeof VALUE_SEARCHABLE_FIELDS)[number];

export type ValueFilterableField = (typeof VALUE_FILTERABLE_FIELDS)[number];

export type ValueDateRangeField = (typeof VALUE_DATE_RANGE_FIELDS)[number];

export type ValueSelectableField = (typeof VALUE_SELECTABLE_FIELDS)[number];

export type ValueDefaultSelectField = (typeof VALUE_DEFAULT_SELECT_FIELDS)[number];

export type ValueEditableField = (typeof VALUE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IValueAsOneRelationConfig = Q.IOneRelationConfig<"value", ValueSelectableField>;

export type IValueAsManyRelationConfig = Q.IManyRelationConfig<
  "values",
  ValueSelectableField,
  ValueSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IValueAsOneRelationQuery = Q.IAsOneRelationQuery<IValue, ValueSelectableField>;

export type IValueAsManyRelationQuery = Q.IAsManyRelationQuery<
  IValue,
  ValueSelectableField,
  ValueSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IValueRelationMap extends Record<ValueRelationKey, unknown> {
  parent: IValueAsOneRelationQuery;
  scheme: SchemeTypes.ISchemeAsOneRelationQuery;
  supersedes: IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IValueRelationQueries = Q.IBaseRelationQueries<
  IValue,
  ValueRelationKey,
  IValueRelationMap
>;

export type IValueItemQuery = Q.IBaseItemQuery<
  IValue,
  ValueRelationKey,
  ValueSelectableField,
  ValueRelationKey,
  ValueSelectableField,
  IValueRelationMap,
  IValueRelationQueries
>;

export type IValueListQuery = Q.IBaseListQuery<
  IValue,
  ValueRelationKey,
  ValueSelectableField,
  ValueSortableField,
  ValueRelationKey,
  ValueSelectableField,
  ValueSortableField,
  ValueDateRangeField,
  ValueFilterableField,
  IValueRelationMap,
  IValueRelationQueries,
  IValueItemQuery
>;
