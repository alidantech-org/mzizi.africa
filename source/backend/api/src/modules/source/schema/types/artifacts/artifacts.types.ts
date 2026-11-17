// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as EditionsTypes from "#/modules/source/schema/types/editions/editions.types";
import type * as FileVersionsTypes from "#/modules/filesystem/schema/types/file-versions/file-versions.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ARTIFACTS_RELATION_KEYS,
  ARTIFACTS_SORTABLE_FIELDS,
  ARTIFACTS_SEARCHABLE_FIELDS,
  ARTIFACTS_FILTERABLE_FIELDS,
  ARTIFACTS_DATE_RANGE_FIELDS,
  ARTIFACTS_SELECTABLE_FIELDS,
  ARTIFACTS_DEFAULT_SELECT_FIELDS,
  ARTIFACTS_EDITABLE_FIELDS,
} from "./artifacts.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One exact representation of an edition, tied to immutable bytes. Identical downloads from many sources are one artifact with many captures. */
export interface IArtifacts extends B.IBase {
  code: string;
  contentType: string | null;
  description: string | null;
  editionId: string;
  fileVersionId: string | null;
  format: string | null;
  location: string | null;
  parentId: string | null;
  sha256: string;
  sizeBytes: number | null;
  readonly edition?: EditionsTypes.IEditions;
  readonly fileVersion?: FileVersionsTypes.IFileVersions;
  readonly parent?: IArtifacts;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ArtifactsKey = keyof IArtifacts;

export type ArtifactsRelationKey = (typeof ARTIFACTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IArtifactsReadonlyFields = B.IBaseReadonlyFields;

export type IArtifactsContextualFields = never;

export type IArtifactsSensitiveFields = never;

export type IArtifactsTransitionFields = never;

export type IArtifactsImmutableFields =
  | IArtifactsReadonlyFields
  | IArtifactsContextualFields
  | IArtifactsSensitiveFields
  | IArtifactsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IArtifactsCreatable = Omit<
  IArtifacts,
  IArtifactsImmutableFields | ArtifactsRelationKey
>;

export type IArtifactsSystemWritable = Omit<
  IArtifacts,
  B.IBaseReadonlyFields | ArtifactsRelationKey
>;

export type IArtifactsUpdatable = Partial<
  Omit<IArtifacts, IArtifactsImmutableFields | ArtifactsRelationKey>
>;

export interface IArtifactsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ArtifactsSortableField = (typeof ARTIFACTS_SORTABLE_FIELDS)[number];

export type ArtifactsSearchableField = (typeof ARTIFACTS_SEARCHABLE_FIELDS)[number];

export type ArtifactsFilterableField = (typeof ARTIFACTS_FILTERABLE_FIELDS)[number];

export type ArtifactsDateRangeField = (typeof ARTIFACTS_DATE_RANGE_FIELDS)[number];

export type ArtifactsSelectableField = (typeof ARTIFACTS_SELECTABLE_FIELDS)[number];

export type ArtifactsDefaultSelectField = (typeof ARTIFACTS_DEFAULT_SELECT_FIELDS)[number];

export type ArtifactsEditableField = (typeof ARTIFACTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IArtifactsAsOneRelationConfig = Q.IOneRelationConfig<
  "artifacts",
  ArtifactsSelectableField
>;

export type IArtifactsAsManyRelationConfig = Q.IManyRelationConfig<
  "artifacts",
  ArtifactsSelectableField,
  ArtifactsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IArtifactsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IArtifacts,
  ArtifactsSelectableField
>;

export type IArtifactsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IArtifacts,
  ArtifactsSelectableField,
  ArtifactsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IArtifactsRelationMap extends Record<ArtifactsRelationKey, unknown> {
  edition: EditionsTypes.IEditionsAsOneRelationQuery;
  fileVersion: FileVersionsTypes.IFileVersionsAsOneRelationQuery;
  parent: IArtifactsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IArtifactsRelationQueries = Q.IBaseRelationQueries<
  IArtifacts,
  ArtifactsRelationKey,
  IArtifactsRelationMap
>;

export type IArtifactsItemQuery = Q.IBaseItemQuery<
  IArtifacts,
  ArtifactsRelationKey,
  ArtifactsSelectableField,
  ArtifactsRelationKey,
  ArtifactsSelectableField,
  IArtifactsRelationMap,
  IArtifactsRelationQueries
>;

export type IArtifactsListQuery = Q.IBaseListQuery<
  IArtifacts,
  ArtifactsRelationKey,
  ArtifactsSelectableField,
  ArtifactsSortableField,
  ArtifactsRelationKey,
  ArtifactsSelectableField,
  ArtifactsSortableField,
  ArtifactsDateRangeField,
  ArtifactsFilterableField,
  IArtifactsRelationMap,
  IArtifactsRelationQueries,
  IArtifactsItemQuery
>;
