// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as DimensionTypes from '#/modules/statistics/types/dimension.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  DIMENSION_MEMBER_RELATION_KEYS,
  DIMENSION_MEMBER_SORTABLE_FIELDS,
  DIMENSION_MEMBER_SEARCHABLE_FIELDS,
  DIMENSION_MEMBER_FILTERABLE_FIELDS,
  DIMENSION_MEMBER_DATE_RANGE_FIELDS,
  DIMENSION_MEMBER_SELECTABLE_FIELDS,
  DIMENSION_MEMBER_DEFAULT_SELECT_FIELDS,
  DIMENSION_MEMBER_EDITABLE_FIELDS
} from './dimension-member.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Dimension Member */
export interface IDimensionMember extends B.IBase {
  code: string;
  dimensionId: string;
  isCurrent: boolean;
  label: string;
  parentId: string | null;
  referenceCode: string | null;
  sortOrder: number | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly dimension?: DimensionTypes.IDimension;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type DimensionMemberKey = keyof IDimensionMember;

export type DimensionMemberRelationKey = (typeof DIMENSION_MEMBER_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IDimensionMemberReadonlyFields = B.IBaseReadonlyFields;

export type IDimensionMemberContextualFields = never;

export type IDimensionMemberSensitiveFields = never;

export type IDimensionMemberTransitionFields = never;

export type IDimensionMemberImmutableFields =
  | IDimensionMemberReadonlyFields
  | IDimensionMemberContextualFields
  | IDimensionMemberSensitiveFields
  | IDimensionMemberTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IDimensionMemberCreatable = Omit<IDimensionMember, IDimensionMemberImmutableFields | DimensionMemberRelationKey>;

export type IDimensionMemberSystemWritable = Omit<IDimensionMember, B.IBaseReadonlyFields | DimensionMemberRelationKey>;

export type IDimensionMemberUpdatable = Partial<Omit<IDimensionMember, IDimensionMemberImmutableFields | DimensionMemberRelationKey>>;

export interface IDimensionMemberTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type DimensionMemberSortableField = (typeof DIMENSION_MEMBER_SORTABLE_FIELDS)[number];

export type DimensionMemberSearchableField = (typeof DIMENSION_MEMBER_SEARCHABLE_FIELDS)[number];

export type DimensionMemberFilterableField = (typeof DIMENSION_MEMBER_FILTERABLE_FIELDS)[number];

export type DimensionMemberDateRangeField = (typeof DIMENSION_MEMBER_DATE_RANGE_FIELDS)[number];

export type DimensionMemberSelectableField = (typeof DIMENSION_MEMBER_SELECTABLE_FIELDS)[number];

export type DimensionMemberDefaultSelectField = (typeof DIMENSION_MEMBER_DEFAULT_SELECT_FIELDS)[number];

export type DimensionMemberEditableField = (typeof DIMENSION_MEMBER_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IDimensionMemberAsOneRelationConfig = Q.IOneRelationConfig<'dimensionMember', DimensionMemberSelectableField>;

export type IDimensionMemberAsManyRelationConfig = Q.IManyRelationConfig<'dimensionMembers', DimensionMemberSelectableField, DimensionMemberSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IDimensionMemberAsOneRelationQuery = Q.IAsOneRelationQuery<IDimensionMember, DimensionMemberSelectableField>;

export type IDimensionMemberAsManyRelationQuery = Q.IAsManyRelationQuery<IDimensionMember, DimensionMemberSelectableField, DimensionMemberSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IDimensionMemberRelationMap extends Record<DimensionMemberRelationKey, unknown> {
  dimension: DimensionTypes.IDimensionAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IDimensionMemberRelationQueries = Q.IBaseRelationQueries<IDimensionMember, DimensionMemberRelationKey, IDimensionMemberRelationMap>;

export type IDimensionMemberItemQuery = Q.IBaseItemQuery<
  IDimensionMember,
  DimensionMemberRelationKey,
  DimensionMemberSelectableField,
  DimensionMemberRelationKey,
  DimensionMemberSelectableField,
  IDimensionMemberRelationMap,
  IDimensionMemberRelationQueries
>;

export type IDimensionMemberListQuery = Q.IBaseListQuery<
  IDimensionMember,
  DimensionMemberRelationKey,
  DimensionMemberSelectableField,
  DimensionMemberSortableField,
  DimensionMemberRelationKey,
  DimensionMemberSelectableField,
  DimensionMemberSortableField,
  DimensionMemberDateRangeField,
  DimensionMemberFilterableField,
  IDimensionMemberRelationMap,
  IDimensionMemberRelationQueries,
  IDimensionMemberItemQuery
>;