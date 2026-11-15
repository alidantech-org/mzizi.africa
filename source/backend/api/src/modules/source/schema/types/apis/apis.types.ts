// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import * as B from '#/modules/common/schema/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as SourcesTypes from '#/modules/source/schema/types/sources/sources.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  APIS_RELATION_KEYS,
  APIS_SORTABLE_FIELDS,
  APIS_SEARCHABLE_FIELDS,
  APIS_FILTERABLE_FIELDS,
  APIS_DATE_RANGE_FIELDS,
  APIS_SELECTABLE_FIELDS,
  APIS_DEFAULT_SELECT_FIELDS,
  APIS_EDITABLE_FIELDS
} from './apis.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** API channel with named credential binding only; request behavior is pinned in manifest releases. */
export interface IApis extends B.IBase {
  baseUrl: string;
  credentialBinding: string | null;
  sourceId: string;
  readonly source?: SourcesTypes.ISources;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ApisKey = keyof IApis;

export type ApisRelationKey = (typeof APIS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IApisReadonlyFields = B.IBaseReadonlyFields;

export type IApisContextualFields = never;

export type IApisSensitiveFields = never;

export type IApisTransitionFields = never;

export type IApisImmutableFields =
  | IApisReadonlyFields
  | IApisContextualFields
  | IApisSensitiveFields
  | IApisTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IApisCreatable = Omit<IApis, IApisImmutableFields | ApisRelationKey>;

export type IApisSystemWritable = Omit<IApis, B.IBaseReadonlyFields | ApisRelationKey>;

export type IApisUpdatable = Partial<Omit<IApis, IApisImmutableFields | ApisRelationKey>>;

export interface IApisTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ApisSortableField = (typeof APIS_SORTABLE_FIELDS)[number];

export type ApisSearchableField = (typeof APIS_SEARCHABLE_FIELDS)[number];

export type ApisFilterableField = (typeof APIS_FILTERABLE_FIELDS)[number];

export type ApisDateRangeField = (typeof APIS_DATE_RANGE_FIELDS)[number];

export type ApisSelectableField = (typeof APIS_SELECTABLE_FIELDS)[number];

export type ApisDefaultSelectField = (typeof APIS_DEFAULT_SELECT_FIELDS)[number];

export type ApisEditableField = (typeof APIS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IApisAsOneRelationConfig = Q.IOneRelationConfig<'apis', ApisSelectableField>;

export type IApisAsManyRelationConfig = Q.IManyRelationConfig<'apiss', ApisSelectableField, ApisSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IApisAsOneRelationQuery = Q.IAsOneRelationQuery<IApis, ApisSelectableField>;

export type IApisAsManyRelationQuery = Q.IAsManyRelationQuery<IApis, ApisSelectableField, ApisSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IApisRelationMap extends Record<ApisRelationKey, unknown> {
  source: SourcesTypes.ISourcesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IApisRelationQueries = Q.IBaseRelationQueries<IApis, ApisRelationKey, IApisRelationMap>;

export type IApisItemQuery = Q.IBaseItemQuery<
  IApis,
  ApisRelationKey,
  ApisSelectableField,
  ApisRelationKey,
  ApisSelectableField,
  IApisRelationMap,
  IApisRelationQueries
>;

export type IApisListQuery = Q.IBaseListQuery<
  IApis,
  ApisRelationKey,
  ApisSelectableField,
  ApisSortableField,
  ApisRelationKey,
  ApisSelectableField,
  ApisSortableField,
  ApisDateRangeField,
  ApisFilterableField,
  IApisRelationMap,
  IApisRelationQueries,
  IApisItemQuery
>;