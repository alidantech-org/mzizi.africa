// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SCOPES_RELATION_KEYS,
  SCOPES_SORTABLE_FIELDS,
  SCOPES_SEARCHABLE_FIELDS,
  SCOPES_FILTERABLE_FIELDS,
  SCOPES_DATE_RANGE_FIELDS,
  SCOPES_SELECTABLE_FIELDS,
  SCOPES_DEFAULT_SELECT_FIELDS,
  SCOPES_EDITABLE_FIELDS
} from './scopes.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Deduplicated access scope: global, or narrowed by country, geographic unit, dataset or field group. */
export interface IScopes extends B.IBase {
  countryRefId: string | null;
  datasetRefId: string | null;
  fieldGroup: string | null;
  geographicUnitRefId: string | null;
  includeDescendants: boolean;
  institutionRefId: string;
  isGlobal: boolean;
  scopeHash: string;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ScopesKey = keyof IScopes;

export type ScopesRelationKey = (typeof SCOPES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IScopesReadonlyFields = B.IBaseReadonlyFields;

export type IScopesContextualFields = never;

export type IScopesSensitiveFields = never;

export type IScopesTransitionFields = never;

export type IScopesImmutableFields =
  | IScopesReadonlyFields
  | IScopesContextualFields
  | IScopesSensitiveFields
  | IScopesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IScopesCreatable = Omit<IScopes, IScopesImmutableFields | ScopesRelationKey>;

export type IScopesSystemWritable = Omit<IScopes, B.IBaseReadonlyFields | ScopesRelationKey>;

export type IScopesUpdatable = Partial<Omit<IScopes, IScopesImmutableFields | ScopesRelationKey>>;

export interface IScopesTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ScopesSortableField = (typeof SCOPES_SORTABLE_FIELDS)[number];

export type ScopesSearchableField = (typeof SCOPES_SEARCHABLE_FIELDS)[number];

export type ScopesFilterableField = (typeof SCOPES_FILTERABLE_FIELDS)[number];

export type ScopesDateRangeField = (typeof SCOPES_DATE_RANGE_FIELDS)[number];

export type ScopesSelectableField = (typeof SCOPES_SELECTABLE_FIELDS)[number];

export type ScopesDefaultSelectField = (typeof SCOPES_DEFAULT_SELECT_FIELDS)[number];

export type ScopesEditableField = (typeof SCOPES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IScopesAsOneRelationConfig = Q.IOneRelationConfig<'scopes', ScopesSelectableField>;

export type IScopesAsManyRelationConfig = Q.IManyRelationConfig<'scopess', ScopesSelectableField, ScopesSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IScopesAsOneRelationQuery = Q.IAsOneRelationQuery<IScopes, ScopesSelectableField>;

export type IScopesAsManyRelationQuery = Q.IAsManyRelationQuery<IScopes, ScopesSelectableField, ScopesSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IScopesRelationMap extends Record<ScopesRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IScopesRelationQueries = Q.IBaseRelationQueries<IScopes, ScopesRelationKey, IScopesRelationMap>;

export type IScopesItemQuery = Q.IBaseItemQuery<
  IScopes,
  ScopesRelationKey,
  ScopesSelectableField,
  ScopesRelationKey,
  ScopesSelectableField,
  IScopesRelationMap,
  IScopesRelationQueries
>;

export type IScopesListQuery = Q.IBaseListQuery<
  IScopes,
  ScopesRelationKey,
  ScopesSelectableField,
  ScopesSortableField,
  ScopesRelationKey,
  ScopesSelectableField,
  ScopesSortableField,
  ScopesDateRangeField,
  ScopesFilterableField,
  IScopesRelationMap,
  IScopesRelationQueries,
  IScopesItemQuery
>;