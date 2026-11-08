// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  COMMENT_RELATION_KEYS,
  COMMENT_SORTABLE_FIELDS,
  COMMENT_SEARCHABLE_FIELDS,
  COMMENT_FILTERABLE_FIELDS,
  COMMENT_DATE_RANGE_FIELDS,
  COMMENT_SELECTABLE_FIELDS,
  COMMENT_DEFAULT_SELECT_FIELDS,
  COMMENT_EDITABLE_FIELDS
} from './comment.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Comment */
export interface IComment extends B.IBase {
  actorId: string;
  body: string;
  parentCommentId: string | null;
  targetId: string;
  targetKind: string;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type CommentKey = keyof IComment;

export type CommentRelationKey = (typeof COMMENT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ICommentReadonlyFields = B.IBaseReadonlyFields;

export type ICommentContextualFields = never;

export type ICommentSensitiveFields = never;

export type ICommentTransitionFields = never;

export type ICommentImmutableFields =
  | ICommentReadonlyFields
  | ICommentContextualFields
  | ICommentSensitiveFields
  | ICommentTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ICommentCreatable = Omit<IComment, ICommentImmutableFields | CommentRelationKey>;

export type ICommentSystemWritable = Omit<IComment, B.IBaseReadonlyFields | CommentRelationKey>;

export type ICommentUpdatable = Partial<Omit<IComment, ICommentImmutableFields | CommentRelationKey>>;

export interface ICommentTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type CommentSortableField = (typeof COMMENT_SORTABLE_FIELDS)[number];

export type CommentSearchableField = (typeof COMMENT_SEARCHABLE_FIELDS)[number];

export type CommentFilterableField = (typeof COMMENT_FILTERABLE_FIELDS)[number];

export type CommentDateRangeField = (typeof COMMENT_DATE_RANGE_FIELDS)[number];

export type CommentSelectableField = (typeof COMMENT_SELECTABLE_FIELDS)[number];

export type CommentDefaultSelectField = (typeof COMMENT_DEFAULT_SELECT_FIELDS)[number];

export type CommentEditableField = (typeof COMMENT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ICommentAsOneRelationConfig = Q.IOneRelationConfig<'comment', CommentSelectableField>;

export type ICommentAsManyRelationConfig = Q.IManyRelationConfig<'comments', CommentSelectableField, CommentSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ICommentAsOneRelationQuery = Q.IAsOneRelationQuery<IComment, CommentSelectableField>;

export type ICommentAsManyRelationQuery = Q.IAsManyRelationQuery<IComment, CommentSelectableField, CommentSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ICommentRelationMap extends Record<CommentRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ICommentRelationQueries = Q.IBaseRelationQueries<IComment, CommentRelationKey, ICommentRelationMap>;

export type ICommentItemQuery = Q.IBaseItemQuery<
  IComment,
  CommentRelationKey,
  CommentSelectableField,
  CommentRelationKey,
  CommentSelectableField,
  ICommentRelationMap,
  ICommentRelationQueries
>;

export type ICommentListQuery = Q.IBaseListQuery<
  IComment,
  CommentRelationKey,
  CommentSelectableField,
  CommentSortableField,
  CommentRelationKey,
  CommentSelectableField,
  CommentSortableField,
  CommentDateRangeField,
  CommentFilterableField,
  ICommentRelationMap,
  ICommentRelationQueries,
  ICommentItemQuery
>;