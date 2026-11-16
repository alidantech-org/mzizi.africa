// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as DocumentsTypes from "#/modules/source/schema/types/documents/documents.types";
import type * as ManifestReleasesTypes from "#/modules/source/schema/types/manifest-releases/manifest-releases.types";
import type * as PathsTypes from "#/modules/source/schema/types/paths/paths.types";
import type * as SourcesTypes from "#/modules/source/schema/types/sources/sources.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  CAPTURES_RELATION_KEYS,
  CAPTURES_SORTABLE_FIELDS,
  CAPTURES_SEARCHABLE_FIELDS,
  CAPTURES_FILTERABLE_FIELDS,
  CAPTURES_DATE_RANGE_FIELDS,
  CAPTURES_SELECTABLE_FIELDS,
  CAPTURES_DEFAULT_SELECT_FIELDS,
  CAPTURES_EDITABLE_FIELDS,
} from "./captures.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One retrieval of a path by a source: when, from which link, with what response. The content is a document, shared by every capture of the same bytes; failed requests remain in Operations. */
export interface ICaptures extends B.IBase {
  code: string;
  documentId: string | null;
  manifestReleaseId: string | null;
  originalUrl: string;
  pathId: string | null;
  responseMetadata: string;
  retrievedAt: Date;
  retrievedUrl: string | null;
  sourceId: string;
  readonly document?: DocumentsTypes.IDocuments;
  readonly manifestRelease?: ManifestReleasesTypes.IManifestReleases;
  readonly path?: PathsTypes.IPaths;
  readonly source?: SourcesTypes.ISources;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type CapturesKey = keyof ICaptures;

export type CapturesRelationKey = (typeof CAPTURES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ICapturesReadonlyFields = B.IBaseReadonlyFields;

export type ICapturesContextualFields = never;

export type ICapturesSensitiveFields = never;

export type ICapturesTransitionFields = never;

export type ICapturesImmutableFields =
  | ICapturesReadonlyFields
  | ICapturesContextualFields
  | ICapturesSensitiveFields
  | ICapturesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ICapturesCreatable = Omit<ICaptures, ICapturesImmutableFields | CapturesRelationKey>;

export type ICapturesSystemWritable = Omit<ICaptures, B.IBaseReadonlyFields | CapturesRelationKey>;

export type ICapturesUpdatable = Partial<
  Omit<ICaptures, ICapturesImmutableFields | CapturesRelationKey>
>;

export interface ICapturesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type CapturesSortableField = (typeof CAPTURES_SORTABLE_FIELDS)[number];

export type CapturesSearchableField = (typeof CAPTURES_SEARCHABLE_FIELDS)[number];

export type CapturesFilterableField = (typeof CAPTURES_FILTERABLE_FIELDS)[number];

export type CapturesDateRangeField = (typeof CAPTURES_DATE_RANGE_FIELDS)[number];

export type CapturesSelectableField = (typeof CAPTURES_SELECTABLE_FIELDS)[number];

export type CapturesDefaultSelectField = (typeof CAPTURES_DEFAULT_SELECT_FIELDS)[number];

export type CapturesEditableField = (typeof CAPTURES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ICapturesAsOneRelationConfig = Q.IOneRelationConfig<
  "captures",
  CapturesSelectableField
>;

export type ICapturesAsManyRelationConfig = Q.IManyRelationConfig<
  "captures",
  CapturesSelectableField,
  CapturesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ICapturesAsOneRelationQuery = Q.IAsOneRelationQuery<ICaptures, CapturesSelectableField>;

export type ICapturesAsManyRelationQuery = Q.IAsManyRelationQuery<
  ICaptures,
  CapturesSelectableField,
  CapturesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ICapturesRelationMap extends Record<CapturesRelationKey, unknown> {
  document: DocumentsTypes.IDocumentsAsOneRelationQuery;
  manifestRelease: ManifestReleasesTypes.IManifestReleasesAsOneRelationQuery;
  path: PathsTypes.IPathsAsOneRelationQuery;
  source: SourcesTypes.ISourcesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ICapturesRelationQueries = Q.IBaseRelationQueries<
  ICaptures,
  CapturesRelationKey,
  ICapturesRelationMap
>;

export type ICapturesItemQuery = Q.IBaseItemQuery<
  ICaptures,
  CapturesRelationKey,
  CapturesSelectableField,
  CapturesRelationKey,
  CapturesSelectableField,
  ICapturesRelationMap,
  ICapturesRelationQueries
>;

export type ICapturesListQuery = Q.IBaseListQuery<
  ICaptures,
  CapturesRelationKey,
  CapturesSelectableField,
  CapturesSortableField,
  CapturesRelationKey,
  CapturesSelectableField,
  CapturesSortableField,
  CapturesDateRangeField,
  CapturesFilterableField,
  ICapturesRelationMap,
  ICapturesRelationQueries,
  ICapturesItemQuery
>;
