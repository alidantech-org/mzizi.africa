// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { ValueRelationKind } from '#/modules/reference/enum/value-relation-kind.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from '#/modules/reference/types/value.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  VALUE_RELATION_RELATION_KEYS,
  VALUE_RELATION_SORTABLE_FIELDS,
  VALUE_RELATION_SEARCHABLE_FIELDS,
  VALUE_RELATION_FILTERABLE_FIELDS,
  VALUE_RELATION_DATE_RANGE_FIELDS,
  VALUE_RELATION_SELECTABLE_FIELDS,
  VALUE_RELATION_DEFAULT_SELECT_FIELDS,
  VALUE_RELATION_EDITABLE_FIELDS
} from './value-relation.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Proposed directed, typed, time-aware relation between classification values; supports multi-parent and cross-scheme taxonomy. */
export interface IValueRelation extends B.IBase {
  relationKind: ValueRelationKind;
  sourceValueId: string;
  targetValueId: string;
  validFrom: Date | null;
  validUntil: Date | null;
  readonly sourceValue?: ValueTypes.IValue;
  readonly targetValue?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ValueRelationKey = keyof IValueRelation;

export type ValueRelationRelationKey = (typeof VALUE_RELATION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IValueRelationReadonlyFields = B.IBaseReadonlyFields;

export type IValueRelationContextualFields = never;

export type IValueRelationSensitiveFields = never;

export type IValueRelationTransitionFields = never;

export type IValueRelationImmutableFields =
  | IValueRelationReadonlyFields
  | IValueRelationContextualFields
  | IValueRelationSensitiveFields
  | IValueRelationTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IValueRelationCreatable = Omit<IValueRelation, IValueRelationImmutableFields | ValueRelationRelationKey>;

export type IValueRelationSystemWritable = Omit<IValueRelation, B.IBaseReadonlyFields | ValueRelationRelationKey>;

export type IValueRelationUpdatable = Partial<Omit<IValueRelation, IValueRelationImmutableFields | ValueRelationRelationKey>>;

export interface IValueRelationTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ValueRelationSortableField = (typeof VALUE_RELATION_SORTABLE_FIELDS)[number];

export type ValueRelationSearchableField = (typeof VALUE_RELATION_SEARCHABLE_FIELDS)[number];

export type ValueRelationFilterableField = (typeof VALUE_RELATION_FILTERABLE_FIELDS)[number];

export type ValueRelationDateRangeField = (typeof VALUE_RELATION_DATE_RANGE_FIELDS)[number];

export type ValueRelationSelectableField = (typeof VALUE_RELATION_SELECTABLE_FIELDS)[number];

export type ValueRelationDefaultSelectField = (typeof VALUE_RELATION_DEFAULT_SELECT_FIELDS)[number];

export type ValueRelationEditableField = (typeof VALUE_RELATION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IValueRelationAsOneRelationConfig = Q.IOneRelationConfig<'valueRelation', ValueRelationSelectableField>;

export type IValueRelationAsManyRelationConfig = Q.IManyRelationConfig<'valueRelations', ValueRelationSelectableField, ValueRelationSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IValueRelationAsOneRelationQuery = Q.IAsOneRelationQuery<IValueRelation, ValueRelationSelectableField>;

export type IValueRelationAsManyRelationQuery = Q.IAsManyRelationQuery<IValueRelation, ValueRelationSelectableField, ValueRelationSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IValueRelationRelationMap extends Record<ValueRelationRelationKey, unknown> {
  sourceValue: ValueTypes.IValueAsOneRelationQuery;
  targetValue: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IValueRelationRelationQueries = Q.IBaseRelationQueries<IValueRelation, ValueRelationRelationKey, IValueRelationRelationMap>;

export type IValueRelationItemQuery = Q.IBaseItemQuery<
  IValueRelation,
  ValueRelationRelationKey,
  ValueRelationSelectableField,
  ValueRelationRelationKey,
  ValueRelationSelectableField,
  IValueRelationRelationMap,
  IValueRelationRelationQueries
>;

export type IValueRelationListQuery = Q.IBaseListQuery<
  IValueRelation,
  ValueRelationRelationKey,
  ValueRelationSelectableField,
  ValueRelationSortableField,
  ValueRelationRelationKey,
  ValueRelationSelectableField,
  ValueRelationSortableField,
  ValueRelationDateRangeField,
  ValueRelationFilterableField,
  IValueRelationRelationMap,
  IValueRelationRelationQueries,
  IValueRelationItemQuery
>;