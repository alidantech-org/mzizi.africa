// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import * as B from '#/modules/common/schema/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as FilesTypes from '#/modules/filesystem/schema/types/files/files.types';
import type * as FoldersTypes from '#/modules/filesystem/schema/types/folders/folders.types';
import type * as TagsTypes from '#/modules/filesystem/schema/types/tags/tags.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  TAGGINGS_RELATION_KEYS,
  TAGGINGS_SORTABLE_FIELDS,
  TAGGINGS_SEARCHABLE_FIELDS,
  TAGGINGS_FILTERABLE_FIELDS,
  TAGGINGS_DATE_RANGE_FIELDS,
  TAGGINGS_SELECTABLE_FIELDS,
  TAGGINGS_DEFAULT_SELECT_FIELDS,
  TAGGINGS_EDITABLE_FIELDS
} from './taggings.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One tag assignment to exactly one typed file or folder target. */
export interface ITaggings extends B.IBase {
  fileId: string | null;
  folderId: string | null;
  tagId: string;
  readonly file?: FilesTypes.IFiles;
  readonly folder?: FoldersTypes.IFolders;
  readonly tag?: TagsTypes.ITags;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type TaggingsKey = keyof ITaggings;

export type TaggingsRelationKey = (typeof TAGGINGS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ITaggingsReadonlyFields = B.IBaseReadonlyFields;

export type ITaggingsContextualFields = never;

export type ITaggingsSensitiveFields = never;

export type ITaggingsTransitionFields = never;

export type ITaggingsImmutableFields =
  | ITaggingsReadonlyFields
  | ITaggingsContextualFields
  | ITaggingsSensitiveFields
  | ITaggingsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ITaggingsCreatable = Omit<ITaggings, ITaggingsImmutableFields | TaggingsRelationKey>;

export type ITaggingsSystemWritable = Omit<ITaggings, B.IBaseReadonlyFields | TaggingsRelationKey>;

export type ITaggingsUpdatable = Partial<Omit<ITaggings, ITaggingsImmutableFields | TaggingsRelationKey>>;

export interface ITaggingsTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type TaggingsSortableField = (typeof TAGGINGS_SORTABLE_FIELDS)[number];

export type TaggingsSearchableField = (typeof TAGGINGS_SEARCHABLE_FIELDS)[number];

export type TaggingsFilterableField = (typeof TAGGINGS_FILTERABLE_FIELDS)[number];

export type TaggingsDateRangeField = (typeof TAGGINGS_DATE_RANGE_FIELDS)[number];

export type TaggingsSelectableField = (typeof TAGGINGS_SELECTABLE_FIELDS)[number];

export type TaggingsDefaultSelectField = (typeof TAGGINGS_DEFAULT_SELECT_FIELDS)[number];

export type TaggingsEditableField = (typeof TAGGINGS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ITaggingsAsOneRelationConfig = Q.IOneRelationConfig<'taggings', TaggingsSelectableField>;

export type ITaggingsAsManyRelationConfig = Q.IManyRelationConfig<'taggingss', TaggingsSelectableField, TaggingsSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ITaggingsAsOneRelationQuery = Q.IAsOneRelationQuery<ITaggings, TaggingsSelectableField>;

export type ITaggingsAsManyRelationQuery = Q.IAsManyRelationQuery<ITaggings, TaggingsSelectableField, TaggingsSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ITaggingsRelationMap extends Record<TaggingsRelationKey, unknown> {
  file: FilesTypes.IFilesAsOneRelationQuery;
  folder: FoldersTypes.IFoldersAsOneRelationQuery;
  tag: TagsTypes.ITagsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ITaggingsRelationQueries = Q.IBaseRelationQueries<ITaggings, TaggingsRelationKey, ITaggingsRelationMap>;

export type ITaggingsItemQuery = Q.IBaseItemQuery<
  ITaggings,
  TaggingsRelationKey,
  TaggingsSelectableField,
  TaggingsRelationKey,
  TaggingsSelectableField,
  ITaggingsRelationMap,
  ITaggingsRelationQueries
>;

export type ITaggingsListQuery = Q.IBaseListQuery<
  ITaggings,
  TaggingsRelationKey,
  TaggingsSelectableField,
  TaggingsSortableField,
  TaggingsRelationKey,
  TaggingsSelectableField,
  TaggingsSortableField,
  TaggingsDateRangeField,
  TaggingsFilterableField,
  ITaggingsRelationMap,
  ITaggingsRelationQueries,
  ITaggingsItemQuery
>;