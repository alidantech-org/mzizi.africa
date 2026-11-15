// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import { ERelationType } from '#/modules/common/schema/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as FileVersionsConfig from '#/modules/filesystem/schema/types/file-versions/file-versions.config';
import * as ManifestsConfig from '#/modules/source/schema/types/manifests/manifests.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IManifestReleases,
  ManifestReleasesKey,
  ManifestReleasesRelationKey,
  ManifestReleasesSortableField,
  ManifestReleasesFilterableField,
  ManifestReleasesDateRangeField,
  ManifestReleasesSelectableField,
  IManifestReleasesAsOneRelationConfig,
  IManifestReleasesAsManyRelationConfig
} from './manifest-releases.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const MANIFEST_RELEASES_RELATION_KEYS = ['fileVersion', 'manifest', ] as const satisfies readonly ManifestReleasesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const MANIFEST_RELEASES_SORTABLE_FIELDS = [] as const satisfies readonly ManifestReleasesKey[];

export const MANIFEST_RELEASES_SEARCHABLE_FIELDS = [] as const satisfies readonly ManifestReleasesKey[];

export const MANIFEST_RELEASES_FILTERABLE_FIELDS = [] as const satisfies readonly ManifestReleasesKey[];

export const MANIFEST_RELEASES_DATE_RANGE_FIELDS = [] as const satisfies readonly ManifestReleasesKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const MANIFEST_RELEASES_SELECTABLE_FIELDS = ['approvedAt', 'approvedBySnapshot', 'contentHash', 'createdAt', 'deletedAt', 'effectiveFrom', 'effectiveUntil', 'fileVersionId', 'id', 'inputSchemaCode', 'inputSchemaVersion', 'manifestId', 'releaseLabel', 'requiredCapabilities', 'status', 'updatedAt', 'version', ] as const satisfies readonly ManifestReleasesKey[];

export const MANIFEST_RELEASES_DEFAULT_SELECT_FIELDS = ['approvedAt', 'approvedBySnapshot', 'contentHash', 'createdAt', 'deletedAt', 'effectiveFrom', 'effectiveUntil', 'fileVersionId', 'id', 'inputSchemaCode', 'inputSchemaVersion', 'manifestId', 'releaseLabel', 'requiredCapabilities', 'status', 'updatedAt', 'version', ] as const satisfies readonly ManifestReleasesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const MANIFEST_RELEASES_EDITABLE_FIELDS = ['approvedAt', 'approvedBySnapshot', 'contentHash', 'effectiveFrom', 'effectiveUntil', 'fileVersionId', 'inputSchemaCode', 'inputSchemaVersion', 'manifestId', 'releaseLabel', 'requiredCapabilities', 'status', ] as const satisfies readonly ManifestReleasesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const MANIFEST_RELEASES_AS_ONE_RELATION_CONFIG = {
  relation: 'manifestReleases',
  type: ERelationType.One,
  selectableFields: MANIFEST_RELEASES_SELECTABLE_FIELDS,
  defaultSelectFields: MANIFEST_RELEASES_DEFAULT_SELECT_FIELDS
} as const satisfies IManifestReleasesAsOneRelationConfig;

export const MANIFEST_RELEASES_AS_MANY_RELATION_CONFIG = {
  relation: 'manifestReleasess',
  type: ERelationType.Many,
  selectableFields: MANIFEST_RELEASES_SELECTABLE_FIELDS,
  defaultSelectFields: MANIFEST_RELEASES_DEFAULT_SELECT_FIELDS,
  sortableFields: MANIFEST_RELEASES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IManifestReleasesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const MANIFEST_RELEASES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ManifestReleasesRelationKey>().one(FileVersionsConfig.FILE_VERSIONS_AS_ONE_RELATION_CONFIG, 'fileVersion'),
  Q.createRelationKeyMapper<ManifestReleasesRelationKey>().one(ManifestsConfig.MANIFESTS_AS_ONE_RELATION_CONFIG, 'manifest'),
] as const;

export const MANIFEST_RELEASES_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const MANIFEST_RELEASES_QUERY_OPTIONS = {
  searchableFields: MANIFEST_RELEASES_SEARCHABLE_FIELDS,
  selectableFields: MANIFEST_RELEASES_SELECTABLE_FIELDS,
  defaultSelectFields: MANIFEST_RELEASES_DEFAULT_SELECT_FIELDS,
  sortableFields: MANIFEST_RELEASES_SORTABLE_FIELDS,
  filterFields: MANIFEST_RELEASES_FILTERABLE_FIELDS,
  dateRangeFields: MANIFEST_RELEASES_DATE_RANGE_FIELDS,
  oneRelations: MANIFEST_RELEASES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: MANIFEST_RELEASES_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IManifestReleases,
  ManifestReleasesSortableField,
  ManifestReleasesSelectableField,
  ManifestReleasesFilterableField,
  ManifestReleasesDateRangeField,
  ManifestReleasesRelationKey,
  typeof MANIFEST_RELEASES_ONE_RELATION_QUERY_OPTIONS,
  typeof MANIFEST_RELEASES_MANY_RELATION_QUERY_OPTIONS
>;