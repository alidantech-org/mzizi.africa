// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ManifestReleasesConfig from "#/modules/source/schema/types/manifest-releases/manifest-releases.config";
import * as SourcesConfig from "#/modules/source/schema/types/sources/sources.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IManifestBindings,
  ManifestBindingsKey,
  ManifestBindingsRelationKey,
  ManifestBindingsSortableField,
  ManifestBindingsFilterableField,
  ManifestBindingsDateRangeField,
  ManifestBindingsSelectableField,
  IManifestBindingsAsOneRelationConfig,
  IManifestBindingsAsManyRelationConfig,
} from "./manifest-bindings.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const MANIFEST_BINDINGS_RELATION_KEYS = [
  "manifestRelease",
  "source",
] as const satisfies readonly ManifestBindingsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const MANIFEST_BINDINGS_SORTABLE_FIELDS = [
  "activatedAt",
  "createdAt",
  "deactivatedAt",
  "deletedAt",
  "effectiveFrom",
  "effectiveUntil",
  "id",
  "manifestReleaseId",
  "sourceId",
  "updatedAt",
  "version",
] as const satisfies readonly ManifestBindingsKey[];

export const MANIFEST_BINDINGS_SEARCHABLE_FIELDS =
  [] as const satisfies readonly ManifestBindingsKey[];

export const MANIFEST_BINDINGS_FILTERABLE_FIELDS = [
  "id",
  "manifestReleaseId",
  "sourceId",
] as const satisfies readonly ManifestBindingsKey[];

export const MANIFEST_BINDINGS_DATE_RANGE_FIELDS = [
  "activatedAt",
  "createdAt",
  "deactivatedAt",
  "deletedAt",
  "effectiveFrom",
  "effectiveUntil",
  "updatedAt",
] as const satisfies readonly ManifestBindingsKey[];

export const MANIFEST_BINDINGS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IManifestBindings> =
  {
    searchableFields: [...MANIFEST_BINDINGS_SEARCHABLE_FIELDS],
    filterFields: [...MANIFEST_BINDINGS_FILTERABLE_FIELDS],
    dateRangeFields: [...MANIFEST_BINDINGS_DATE_RANGE_FIELDS],
  };

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const MANIFEST_BINDINGS_SELECTABLE_FIELDS = [
  "activatedAt",
  "createdAt",
  "deactivatedAt",
  "deletedAt",
  "effectiveFrom",
  "effectiveUntil",
  "id",
  "manifestReleaseId",
  "sourceId",
  "updatedAt",
  "version",
] as const satisfies readonly ManifestBindingsKey[];

export const MANIFEST_BINDINGS_DEFAULT_SELECT_FIELDS = [
  "activatedAt",
  "createdAt",
  "deactivatedAt",
  "deletedAt",
  "effectiveFrom",
  "effectiveUntil",
  "id",
  "manifestReleaseId",
  "sourceId",
  "updatedAt",
  "version",
] as const satisfies readonly ManifestBindingsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const MANIFEST_BINDINGS_EDITABLE_FIELDS = [
  "activatedAt",
  "deactivatedAt",
  "effectiveFrom",
  "effectiveUntil",
  "manifestReleaseId",
  "sourceId",
] as const satisfies readonly ManifestBindingsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const MANIFEST_BINDINGS_AS_ONE_RELATION_CONFIG = {
  relation: "manifestBindings",
  type: ERelationType.One,
  selectableFields: MANIFEST_BINDINGS_SELECTABLE_FIELDS,
  defaultSelectFields: MANIFEST_BINDINGS_DEFAULT_SELECT_FIELDS,
} as const satisfies IManifestBindingsAsOneRelationConfig;

export const MANIFEST_BINDINGS_AS_MANY_RELATION_CONFIG = {
  relation: "manifestBindings",
  type: ERelationType.Many,
  selectableFields: MANIFEST_BINDINGS_SELECTABLE_FIELDS,
  defaultSelectFields: MANIFEST_BINDINGS_DEFAULT_SELECT_FIELDS,
  sortableFields: MANIFEST_BINDINGS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IManifestBindingsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const MANIFEST_BINDINGS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ManifestBindingsRelationKey>().one(
    () => ManifestReleasesConfig.MANIFEST_RELEASES_AS_ONE_RELATION_CONFIG,
    "manifestRelease",
  ),
  Q.createRelationKeyMapper<ManifestBindingsRelationKey>().one(
    () => SourcesConfig.SOURCES_AS_ONE_RELATION_CONFIG,
    "source",
  ),
] as const;

export const MANIFEST_BINDINGS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const MANIFEST_BINDINGS_QUERY_OPTIONS = {
  searchableFields: MANIFEST_BINDINGS_SEARCHABLE_FIELDS,
  selectableFields: MANIFEST_BINDINGS_SELECTABLE_FIELDS,
  defaultSelectFields: MANIFEST_BINDINGS_DEFAULT_SELECT_FIELDS,
  sortableFields: MANIFEST_BINDINGS_SORTABLE_FIELDS,
  filterFields: MANIFEST_BINDINGS_FILTERABLE_FIELDS,
  dateRangeFields: MANIFEST_BINDINGS_DATE_RANGE_FIELDS,
  relationKeys: MANIFEST_BINDINGS_RELATION_KEYS,
  editableFields: MANIFEST_BINDINGS_EDITABLE_FIELDS,
  asOne: MANIFEST_BINDINGS_AS_ONE_RELATION_CONFIG,
  asMany: MANIFEST_BINDINGS_AS_MANY_RELATION_CONFIG,
  oneRelations: MANIFEST_BINDINGS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: MANIFEST_BINDINGS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IManifestBindings,
  ManifestBindingsSortableField,
  ManifestBindingsSelectableField,
  ManifestBindingsFilterableField,
  ManifestBindingsDateRangeField,
  ManifestBindingsRelationKey,
  typeof MANIFEST_BINDINGS_ONE_RELATION_QUERY_OPTIONS,
  typeof MANIFEST_BINDINGS_MANY_RELATION_QUERY_OPTIONS
>;
