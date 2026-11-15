// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import * as B from '#/modules/common/schema/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SCHEME_RELATION_KEYS,
  SCHEME_SORTABLE_FIELDS,
  SCHEME_SEARCHABLE_FIELDS,
  SCHEME_FILTERABLE_FIELDS,
  SCHEME_DATE_RANGE_FIELDS,
  SCHEME_SELECTABLE_FIELDS,
  SCHEME_DEFAULT_SELECT_FIELDS,
  SCHEME_EDITABLE_FIELDS
} from './scheme.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Stable identity and stewardship snapshot for a controlled vocabulary scheme. */
export interface IScheme extends B.IBase {
  code: string;
  ownerSnapshot: string;
  title: string;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SchemeKey = keyof IScheme;

export type SchemeRelationKey = (typeof SCHEME_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISchemeReadonlyFields = B.IBaseReadonlyFields;

export type ISchemeContextualFields = never;

export type ISchemeSensitiveFields = never;

export type ISchemeTransitionFields = never;

export type ISchemeImmutableFields =
  | ISchemeReadonlyFields
  | ISchemeContextualFields
  | ISchemeSensitiveFields
  | ISchemeTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISchemeCreatable = Omit<IScheme, ISchemeImmutableFields | SchemeRelationKey>;

export type ISchemeSystemWritable = Omit<IScheme, B.IBaseReadonlyFields | SchemeRelationKey>;

export type ISchemeUpdatable = Partial<Omit<IScheme, ISchemeImmutableFields | SchemeRelationKey>>;

export interface ISchemeTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SchemeSortableField = (typeof SCHEME_SORTABLE_FIELDS)[number];

export type SchemeSearchableField = (typeof SCHEME_SEARCHABLE_FIELDS)[number];

export type SchemeFilterableField = (typeof SCHEME_FILTERABLE_FIELDS)[number];

export type SchemeDateRangeField = (typeof SCHEME_DATE_RANGE_FIELDS)[number];

export type SchemeSelectableField = (typeof SCHEME_SELECTABLE_FIELDS)[number];

export type SchemeDefaultSelectField = (typeof SCHEME_DEFAULT_SELECT_FIELDS)[number];

export type SchemeEditableField = (typeof SCHEME_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISchemeAsOneRelationConfig = Q.IOneRelationConfig<'scheme', SchemeSelectableField>;

export type ISchemeAsManyRelationConfig = Q.IManyRelationConfig<'schemes', SchemeSelectableField, SchemeSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISchemeAsOneRelationQuery = Q.IAsOneRelationQuery<IScheme, SchemeSelectableField>;

export type ISchemeAsManyRelationQuery = Q.IAsManyRelationQuery<IScheme, SchemeSelectableField, SchemeSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISchemeRelationMap extends Record<SchemeRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISchemeRelationQueries = Q.IBaseRelationQueries<IScheme, SchemeRelationKey, ISchemeRelationMap>;

export type ISchemeItemQuery = Q.IBaseItemQuery<
  IScheme,
  SchemeRelationKey,
  SchemeSelectableField,
  SchemeRelationKey,
  SchemeSelectableField,
  ISchemeRelationMap,
  ISchemeRelationQueries
>;

export type ISchemeListQuery = Q.IBaseListQuery<
  IScheme,
  SchemeRelationKey,
  SchemeSelectableField,
  SchemeSortableField,
  SchemeRelationKey,
  SchemeSelectableField,
  SchemeSortableField,
  SchemeDateRangeField,
  SchemeFilterableField,
  ISchemeRelationMap,
  ISchemeRelationQueries,
  ISchemeItemQuery
>;