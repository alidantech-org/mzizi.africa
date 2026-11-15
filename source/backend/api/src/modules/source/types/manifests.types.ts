// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from '#/modules/reference/types/value.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  MANIFESTS_RELATION_KEYS,
  MANIFESTS_SORTABLE_FIELDS,
  MANIFESTS_SEARCHABLE_FIELDS,
  MANIFESTS_FILTERABLE_FIELDS,
  MANIFESTS_DATE_RANGE_FIELDS,
  MANIFESTS_SELECTABLE_FIELDS,
  MANIFESTS_DEFAULT_SELECT_FIELDS,
  MANIFESTS_EDITABLE_FIELDS
} from './manifests.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Stable API, website or extraction configuration identity; contents remain versioned artifacts. */
export interface IManifests extends B.IBase {
  code: string;
  description: string | null;
  kindId: string;
  title: string;
  readonly kind?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ManifestsKey = keyof IManifests;

export type ManifestsRelationKey = (typeof MANIFESTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IManifestsReadonlyFields = B.IBaseReadonlyFields;

export type IManifestsContextualFields = never;

export type IManifestsSensitiveFields = never;

export type IManifestsTransitionFields = never;

export type IManifestsImmutableFields =
  | IManifestsReadonlyFields
  | IManifestsContextualFields
  | IManifestsSensitiveFields
  | IManifestsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IManifestsCreatable = Omit<IManifests, IManifestsImmutableFields | ManifestsRelationKey>;

export type IManifestsSystemWritable = Omit<IManifests, B.IBaseReadonlyFields | ManifestsRelationKey>;

export type IManifestsUpdatable = Partial<Omit<IManifests, IManifestsImmutableFields | ManifestsRelationKey>>;

export interface IManifestsTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ManifestsSortableField = (typeof MANIFESTS_SORTABLE_FIELDS)[number];

export type ManifestsSearchableField = (typeof MANIFESTS_SEARCHABLE_FIELDS)[number];

export type ManifestsFilterableField = (typeof MANIFESTS_FILTERABLE_FIELDS)[number];

export type ManifestsDateRangeField = (typeof MANIFESTS_DATE_RANGE_FIELDS)[number];

export type ManifestsSelectableField = (typeof MANIFESTS_SELECTABLE_FIELDS)[number];

export type ManifestsDefaultSelectField = (typeof MANIFESTS_DEFAULT_SELECT_FIELDS)[number];

export type ManifestsEditableField = (typeof MANIFESTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IManifestsAsOneRelationConfig = Q.IOneRelationConfig<'manifests', ManifestsSelectableField>;

export type IManifestsAsManyRelationConfig = Q.IManyRelationConfig<'manifestss', ManifestsSelectableField, ManifestsSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IManifestsAsOneRelationQuery = Q.IAsOneRelationQuery<IManifests, ManifestsSelectableField>;

export type IManifestsAsManyRelationQuery = Q.IAsManyRelationQuery<IManifests, ManifestsSelectableField, ManifestsSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IManifestsRelationMap extends Record<ManifestsRelationKey, unknown> {
  kind: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IManifestsRelationQueries = Q.IBaseRelationQueries<IManifests, ManifestsRelationKey, IManifestsRelationMap>;

export type IManifestsItemQuery = Q.IBaseItemQuery<
  IManifests,
  ManifestsRelationKey,
  ManifestsSelectableField,
  ManifestsRelationKey,
  ManifestsSelectableField,
  IManifestsRelationMap,
  IManifestsRelationQueries
>;

export type IManifestsListQuery = Q.IBaseListQuery<
  IManifests,
  ManifestsRelationKey,
  ManifestsSelectableField,
  ManifestsSortableField,
  ManifestsRelationKey,
  ManifestsSelectableField,
  ManifestsSortableField,
  ManifestsDateRangeField,
  ManifestsFilterableField,
  IManifestsRelationMap,
  IManifestsRelationQueries,
  IManifestsItemQuery
>;