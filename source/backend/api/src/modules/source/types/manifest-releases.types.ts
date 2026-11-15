// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { ReleaseStatus } from '#/modules/source/enum/release-status.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as FileVersionsTypes from '#/modules/filesystem/types/file-versions.types';
import type * as ManifestsTypes from '#/modules/source/types/manifests.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  MANIFEST_RELEASES_RELATION_KEYS,
  MANIFEST_RELEASES_SORTABLE_FIELDS,
  MANIFEST_RELEASES_SEARCHABLE_FIELDS,
  MANIFEST_RELEASES_FILTERABLE_FIELDS,
  MANIFEST_RELEASES_DATE_RANGE_FIELDS,
  MANIFEST_RELEASES_SELECTABLE_FIELDS,
  MANIFEST_RELEASES_DEFAULT_SELECT_FIELDS,
  MANIFEST_RELEASES_EDITABLE_FIELDS
} from './manifest-releases.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Pinned approved manifest content; schema and capabilities are immutable release inputs. */
export interface IManifestReleases extends B.IBase {
  approvedAt: Date;
  approvedBySnapshot: string;
  contentHash: string;
  effectiveFrom: Date;
  effectiveUntil: Date | null;
  fileVersionId: string;
  inputSchemaCode: string;
  inputSchemaVersion: string;
  manifestId: string;
  releaseLabel: string;
  requiredCapabilities: string;
  status: ReleaseStatus;
  readonly fileVersion?: FileVersionsTypes.IFileVersions;
  readonly manifest?: ManifestsTypes.IManifests;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ManifestReleasesKey = keyof IManifestReleases;

export type ManifestReleasesRelationKey = (typeof MANIFEST_RELEASES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IManifestReleasesReadonlyFields = B.IBaseReadonlyFields;

export type IManifestReleasesContextualFields = never;

export type IManifestReleasesSensitiveFields = never;

export type IManifestReleasesTransitionFields = never;

export type IManifestReleasesImmutableFields =
  | IManifestReleasesReadonlyFields
  | IManifestReleasesContextualFields
  | IManifestReleasesSensitiveFields
  | IManifestReleasesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IManifestReleasesCreatable = Omit<IManifestReleases, IManifestReleasesImmutableFields | ManifestReleasesRelationKey>;

export type IManifestReleasesSystemWritable = Omit<IManifestReleases, B.IBaseReadonlyFields | ManifestReleasesRelationKey>;

export type IManifestReleasesUpdatable = Partial<Omit<IManifestReleases, IManifestReleasesImmutableFields | ManifestReleasesRelationKey>>;

export interface IManifestReleasesTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ManifestReleasesSortableField = (typeof MANIFEST_RELEASES_SORTABLE_FIELDS)[number];

export type ManifestReleasesSearchableField = (typeof MANIFEST_RELEASES_SEARCHABLE_FIELDS)[number];

export type ManifestReleasesFilterableField = (typeof MANIFEST_RELEASES_FILTERABLE_FIELDS)[number];

export type ManifestReleasesDateRangeField = (typeof MANIFEST_RELEASES_DATE_RANGE_FIELDS)[number];

export type ManifestReleasesSelectableField = (typeof MANIFEST_RELEASES_SELECTABLE_FIELDS)[number];

export type ManifestReleasesDefaultSelectField = (typeof MANIFEST_RELEASES_DEFAULT_SELECT_FIELDS)[number];

export type ManifestReleasesEditableField = (typeof MANIFEST_RELEASES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IManifestReleasesAsOneRelationConfig = Q.IOneRelationConfig<'manifestReleases', ManifestReleasesSelectableField>;

export type IManifestReleasesAsManyRelationConfig = Q.IManyRelationConfig<'manifestReleasess', ManifestReleasesSelectableField, ManifestReleasesSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IManifestReleasesAsOneRelationQuery = Q.IAsOneRelationQuery<IManifestReleases, ManifestReleasesSelectableField>;

export type IManifestReleasesAsManyRelationQuery = Q.IAsManyRelationQuery<IManifestReleases, ManifestReleasesSelectableField, ManifestReleasesSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IManifestReleasesRelationMap extends Record<ManifestReleasesRelationKey, unknown> {
  fileVersion: FileVersionsTypes.IFileVersionsAsOneRelationQuery;
  manifest: ManifestsTypes.IManifestsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IManifestReleasesRelationQueries = Q.IBaseRelationQueries<IManifestReleases, ManifestReleasesRelationKey, IManifestReleasesRelationMap>;

export type IManifestReleasesItemQuery = Q.IBaseItemQuery<
  IManifestReleases,
  ManifestReleasesRelationKey,
  ManifestReleasesSelectableField,
  ManifestReleasesRelationKey,
  ManifestReleasesSelectableField,
  IManifestReleasesRelationMap,
  IManifestReleasesRelationQueries
>;

export type IManifestReleasesListQuery = Q.IBaseListQuery<
  IManifestReleases,
  ManifestReleasesRelationKey,
  ManifestReleasesSelectableField,
  ManifestReleasesSortableField,
  ManifestReleasesRelationKey,
  ManifestReleasesSelectableField,
  ManifestReleasesSortableField,
  ManifestReleasesDateRangeField,
  ManifestReleasesFilterableField,
  IManifestReleasesRelationMap,
  IManifestReleasesRelationQueries,
  IManifestReleasesItemQuery
>;