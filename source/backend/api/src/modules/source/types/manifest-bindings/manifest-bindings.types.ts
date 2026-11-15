// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ManifestReleasesTypes from '#/modules/source/types/manifest-releases/manifest-releases.types';
import type * as SourcesTypes from '#/modules/source/types/sources/sources.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  MANIFEST_BINDINGS_RELATION_KEYS,
  MANIFEST_BINDINGS_SORTABLE_FIELDS,
  MANIFEST_BINDINGS_SEARCHABLE_FIELDS,
  MANIFEST_BINDINGS_FILTERABLE_FIELDS,
  MANIFEST_BINDINGS_DATE_RANGE_FIELDS,
  MANIFEST_BINDINGS_SELECTABLE_FIELDS,
  MANIFEST_BINDINGS_DEFAULT_SELECT_FIELDS,
  MANIFEST_BINDINGS_EDITABLE_FIELDS
} from './manifest-bindings.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Dated release binding; activation never changes releases already pinned by running jobs. */
export interface IManifestBindings extends B.IBase {
  activatedAt: Date;
  deactivatedAt: Date | null;
  effectiveFrom: Date;
  effectiveUntil: Date | null;
  manifestReleaseId: string;
  sourceId: string;
  readonly manifestRelease?: ManifestReleasesTypes.IManifestReleases;
  readonly source?: SourcesTypes.ISources;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ManifestBindingsKey = keyof IManifestBindings;

export type ManifestBindingsRelationKey = (typeof MANIFEST_BINDINGS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IManifestBindingsReadonlyFields = B.IBaseReadonlyFields;

export type IManifestBindingsContextualFields = never;

export type IManifestBindingsSensitiveFields = never;

export type IManifestBindingsTransitionFields = never;

export type IManifestBindingsImmutableFields =
  | IManifestBindingsReadonlyFields
  | IManifestBindingsContextualFields
  | IManifestBindingsSensitiveFields
  | IManifestBindingsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IManifestBindingsCreatable = Omit<IManifestBindings, IManifestBindingsImmutableFields | ManifestBindingsRelationKey>;

export type IManifestBindingsSystemWritable = Omit<IManifestBindings, B.IBaseReadonlyFields | ManifestBindingsRelationKey>;

export type IManifestBindingsUpdatable = Partial<Omit<IManifestBindings, IManifestBindingsImmutableFields | ManifestBindingsRelationKey>>;

export interface IManifestBindingsTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ManifestBindingsSortableField = (typeof MANIFEST_BINDINGS_SORTABLE_FIELDS)[number];

export type ManifestBindingsSearchableField = (typeof MANIFEST_BINDINGS_SEARCHABLE_FIELDS)[number];

export type ManifestBindingsFilterableField = (typeof MANIFEST_BINDINGS_FILTERABLE_FIELDS)[number];

export type ManifestBindingsDateRangeField = (typeof MANIFEST_BINDINGS_DATE_RANGE_FIELDS)[number];

export type ManifestBindingsSelectableField = (typeof MANIFEST_BINDINGS_SELECTABLE_FIELDS)[number];

export type ManifestBindingsDefaultSelectField = (typeof MANIFEST_BINDINGS_DEFAULT_SELECT_FIELDS)[number];

export type ManifestBindingsEditableField = (typeof MANIFEST_BINDINGS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IManifestBindingsAsOneRelationConfig = Q.IOneRelationConfig<'manifestBindings', ManifestBindingsSelectableField>;

export type IManifestBindingsAsManyRelationConfig = Q.IManyRelationConfig<'manifestBindingss', ManifestBindingsSelectableField, ManifestBindingsSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IManifestBindingsAsOneRelationQuery = Q.IAsOneRelationQuery<IManifestBindings, ManifestBindingsSelectableField>;

export type IManifestBindingsAsManyRelationQuery = Q.IAsManyRelationQuery<IManifestBindings, ManifestBindingsSelectableField, ManifestBindingsSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IManifestBindingsRelationMap extends Record<ManifestBindingsRelationKey, unknown> {
  manifestRelease: ManifestReleasesTypes.IManifestReleasesAsOneRelationQuery;
  source: SourcesTypes.ISourcesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IManifestBindingsRelationQueries = Q.IBaseRelationQueries<IManifestBindings, ManifestBindingsRelationKey, IManifestBindingsRelationMap>;

export type IManifestBindingsItemQuery = Q.IBaseItemQuery<
  IManifestBindings,
  ManifestBindingsRelationKey,
  ManifestBindingsSelectableField,
  ManifestBindingsRelationKey,
  ManifestBindingsSelectableField,
  IManifestBindingsRelationMap,
  IManifestBindingsRelationQueries
>;

export type IManifestBindingsListQuery = Q.IBaseListQuery<
  IManifestBindings,
  ManifestBindingsRelationKey,
  ManifestBindingsSelectableField,
  ManifestBindingsSortableField,
  ManifestBindingsRelationKey,
  ManifestBindingsSelectableField,
  ManifestBindingsSortableField,
  ManifestBindingsDateRangeField,
  ManifestBindingsFilterableField,
  IManifestBindingsRelationMap,
  IManifestBindingsRelationQueries,
  IManifestBindingsItemQuery
>;