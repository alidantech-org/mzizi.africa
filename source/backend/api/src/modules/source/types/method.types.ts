// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  METHOD_RELATION_KEYS,
  METHOD_SORTABLE_FIELDS,
  METHOD_SEARCHABLE_FIELDS,
  METHOD_FILTERABLE_FIELDS,
  METHOD_DATE_RANGE_FIELDS,
  METHOD_SELECTABLE_FIELDS,
  METHOD_DEFAULT_SELECT_FIELDS,
  METHOD_EDITABLE_FIELDS
} from './method.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Method */
export interface IMethod extends B.IBase {
  description: string | null;
  kind: ProvenanceMethod;
  model: string | null;
  name: string;
  tool: string | null;
  toolVersion: string | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type MethodKey = keyof IMethod;

export type MethodRelationKey = (typeof METHOD_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IMethodReadonlyFields = B.IBaseReadonlyFields;

export type IMethodContextualFields = never;

export type IMethodSensitiveFields = never;

export type IMethodTransitionFields = never;

export type IMethodImmutableFields =
  | IMethodReadonlyFields
  | IMethodContextualFields
  | IMethodSensitiveFields
  | IMethodTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IMethodCreatable = Omit<IMethod, IMethodImmutableFields | MethodRelationKey>;

export type IMethodSystemWritable = Omit<IMethod, B.IBaseReadonlyFields | MethodRelationKey>;

export type IMethodUpdatable = Partial<Omit<IMethod, IMethodImmutableFields | MethodRelationKey>>;

export interface IMethodTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type MethodSortableField = (typeof METHOD_SORTABLE_FIELDS)[number];

export type MethodSearchableField = (typeof METHOD_SEARCHABLE_FIELDS)[number];

export type MethodFilterableField = (typeof METHOD_FILTERABLE_FIELDS)[number];

export type MethodDateRangeField = (typeof METHOD_DATE_RANGE_FIELDS)[number];

export type MethodSelectableField = (typeof METHOD_SELECTABLE_FIELDS)[number];

export type MethodDefaultSelectField = (typeof METHOD_DEFAULT_SELECT_FIELDS)[number];

export type MethodEditableField = (typeof METHOD_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IMethodAsOneRelationConfig = Q.IOneRelationConfig<'method', MethodSelectableField>;

export type IMethodAsManyRelationConfig = Q.IManyRelationConfig<'methods', MethodSelectableField, MethodSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IMethodAsOneRelationQuery = Q.IAsOneRelationQuery<IMethod, MethodSelectableField>;

export type IMethodAsManyRelationQuery = Q.IAsManyRelationQuery<IMethod, MethodSelectableField, MethodSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IMethodRelationMap extends Record<MethodRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IMethodRelationQueries = Q.IBaseRelationQueries<IMethod, MethodRelationKey, IMethodRelationMap>;

export type IMethodItemQuery = Q.IBaseItemQuery<
  IMethod,
  MethodRelationKey,
  MethodSelectableField,
  MethodRelationKey,
  MethodSelectableField,
  IMethodRelationMap,
  IMethodRelationQueries
>;

export type IMethodListQuery = Q.IBaseListQuery<
  IMethod,
  MethodRelationKey,
  MethodSelectableField,
  MethodSortableField,
  MethodRelationKey,
  MethodSelectableField,
  MethodSortableField,
  MethodDateRangeField,
  MethodFilterableField,
  IMethodRelationMap,
  IMethodRelationQueries,
  IMethodItemQuery
>;