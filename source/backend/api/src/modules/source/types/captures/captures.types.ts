// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as DocumentsTypes from '#/modules/source/types/documents/documents.types';
import type * as FileVersionsTypes from '#/modules/filesystem/types/file-versions/file-versions.types';
import type * as ManifestReleasesTypes from '#/modules/source/types/manifest-releases/manifest-releases.types';
import type * as SourcesTypes from '#/modules/source/types/sources/sources.types';

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
  CAPTURES_EDITABLE_FIELDS
} from './captures.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Immutable accepted retrieval snapshot with exact bytes; failed requests remain in Operations. */
export interface ICaptures extends B.IBase {
  contentHash: string;
  documentId: string | null;
  fileVersionId: string;
  manifestReleaseId: string | null;
  responseMetadata: string;
  retrievedAt: Date;
  retrievedUrl: string;
  sourceId: string;
  readonly document?: DocumentsTypes.IDocuments;
  readonly fileVersion?: FileVersionsTypes.IFileVersions;
  readonly manifestRelease?: ManifestReleasesTypes.IManifestReleases;
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

export type ICapturesUpdatable = Partial<Omit<ICaptures, ICapturesImmutableFields | CapturesRelationKey>>;

export interface ICapturesTransitionPayload {
}

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

export type ICapturesAsOneRelationConfig = Q.IOneRelationConfig<'captures', CapturesSelectableField>;

export type ICapturesAsManyRelationConfig = Q.IManyRelationConfig<'capturess', CapturesSelectableField, CapturesSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ICapturesAsOneRelationQuery = Q.IAsOneRelationQuery<ICaptures, CapturesSelectableField>;

export type ICapturesAsManyRelationQuery = Q.IAsManyRelationQuery<ICaptures, CapturesSelectableField, CapturesSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ICapturesRelationMap extends Record<CapturesRelationKey, unknown> {
  document: DocumentsTypes.IDocumentsAsOneRelationQuery;
  fileVersion: FileVersionsTypes.IFileVersionsAsOneRelationQuery;
  manifestRelease: ManifestReleasesTypes.IManifestReleasesAsOneRelationQuery;
  source: SourcesTypes.ISourcesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ICapturesRelationQueries = Q.IBaseRelationQueries<ICaptures, CapturesRelationKey, ICapturesRelationMap>;

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