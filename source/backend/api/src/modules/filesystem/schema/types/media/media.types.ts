// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as FileVersionsTypes from "#/modules/filesystem/schema/types/file-versions/file-versions.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  MEDIA_RELATION_KEYS,
  MEDIA_SORTABLE_FIELDS,
  MEDIA_SEARCHABLE_FIELDS,
  MEDIA_FILTERABLE_FIELDS,
  MEDIA_DATE_RANGE_FIELDS,
  MEDIA_SELECTABLE_FIELDS,
  MEDIA_DEFAULT_SELECT_FIELDS,
  MEDIA_EDITABLE_FIELDS,
} from "./media.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One use of a stored media file by one subject record, which it mentions by table and id. A subject can have many media of any kind and one file can serve many subjects; subjects carry no media pointer. */
export interface IMedia extends B.IBase {
  altText: string | null;
  code: string;
  description: string | null;
  endSecond: number | null;
  externalUrl: string | null;
  fileVersionId: string | null;
  kindId: string;
  platformId: string | null;
  position: number | null;
  purpose: string | null;
  startSecond: number | null;
  subjectId: string;
  subjectTable: SubjectTable;
  thumbnailUrl: string | null;
  title: string;
  readonly fileVersion?: FileVersionsTypes.IFileVersions;
  readonly kind?: ValueTypes.IValue;
  readonly platform?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type MediaKey = keyof IMedia;

export type MediaRelationKey = (typeof MEDIA_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IMediaReadonlyFields = B.IBaseReadonlyFields;

export type IMediaContextualFields = never;

export type IMediaSensitiveFields = never;

export type IMediaTransitionFields = never;

export type IMediaImmutableFields =
  IMediaReadonlyFields | IMediaContextualFields | IMediaSensitiveFields | IMediaTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IMediaCreatable = Omit<IMedia, IMediaImmutableFields | MediaRelationKey>;

export type IMediaSystemWritable = Omit<IMedia, B.IBaseReadonlyFields | MediaRelationKey>;

export type IMediaUpdatable = Partial<Omit<IMedia, IMediaImmutableFields | MediaRelationKey>>;

export interface IMediaTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type MediaSortableField = (typeof MEDIA_SORTABLE_FIELDS)[number];

export type MediaSearchableField = (typeof MEDIA_SEARCHABLE_FIELDS)[number];

export type MediaFilterableField = (typeof MEDIA_FILTERABLE_FIELDS)[number];

export type MediaDateRangeField = (typeof MEDIA_DATE_RANGE_FIELDS)[number];

export type MediaSelectableField = (typeof MEDIA_SELECTABLE_FIELDS)[number];

export type MediaDefaultSelectField = (typeof MEDIA_DEFAULT_SELECT_FIELDS)[number];

export type MediaEditableField = (typeof MEDIA_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IMediaAsOneRelationConfig = Q.IOneRelationConfig<"media", MediaSelectableField>;

export type IMediaAsManyRelationConfig = Q.IManyRelationConfig<
  "medias",
  MediaSelectableField,
  MediaSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IMediaAsOneRelationQuery = Q.IAsOneRelationQuery<IMedia, MediaSelectableField>;

export type IMediaAsManyRelationQuery = Q.IAsManyRelationQuery<
  IMedia,
  MediaSelectableField,
  MediaSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IMediaRelationMap extends Record<MediaRelationKey, unknown> {
  fileVersion: FileVersionsTypes.IFileVersionsAsOneRelationQuery;
  kind: ValueTypes.IValueAsOneRelationQuery;
  platform: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IMediaRelationQueries = Q.IBaseRelationQueries<
  IMedia,
  MediaRelationKey,
  IMediaRelationMap
>;

export type IMediaItemQuery = Q.IBaseItemQuery<
  IMedia,
  MediaRelationKey,
  MediaSelectableField,
  MediaRelationKey,
  MediaSelectableField,
  IMediaRelationMap,
  IMediaRelationQueries
>;

export type IMediaListQuery = Q.IBaseListQuery<
  IMedia,
  MediaRelationKey,
  MediaSelectableField,
  MediaSortableField,
  MediaRelationKey,
  MediaSelectableField,
  MediaSortableField,
  MediaDateRangeField,
  MediaFilterableField,
  IMediaRelationMap,
  IMediaRelationQueries,
  IMediaItemQuery
>;
