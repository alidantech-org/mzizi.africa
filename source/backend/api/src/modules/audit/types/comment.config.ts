// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IComment,
  CommentKey,
  CommentRelationKey,
  CommentSortableField,
  CommentFilterableField,
  CommentDateRangeField,
  CommentSelectableField,
  ICommentAsOneRelationConfig,
  ICommentAsManyRelationConfig
} from './comment.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const COMMENT_RELATION_KEYS = [] as const satisfies readonly CommentKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const COMMENT_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly CommentKey[];

export const COMMENT_SEARCHABLE_FIELDS = [] as const satisfies readonly CommentKey[];

export const COMMENT_FILTERABLE_FIELDS = ['actorId', 'id', 'parentCommentId', 'targetId', 'targetKind', 'version', ] as const satisfies readonly CommentKey[];

export const COMMENT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly CommentKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const COMMENT_SELECTABLE_FIELDS = ['actorId', 'body', 'createdAt', 'id', 'parentCommentId', 'targetId', 'targetKind', 'updatedAt', ] as const satisfies readonly CommentKey[];

export const COMMENT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly CommentSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const COMMENT_EDITABLE_FIELDS = ['body', 'parentCommentId', 'targetId', 'targetKind', ] as const satisfies readonly CommentKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const COMMENT_AS_ONE_RELATION_CONFIG = {
  relation: 'comment',
  type: ERelationType.One,
  selectableFields: COMMENT_SELECTABLE_FIELDS,
  defaultSelectFields: COMMENT_DEFAULT_SELECT_FIELDS
} as const satisfies ICommentAsOneRelationConfig;

export const COMMENT_AS_MANY_RELATION_CONFIG = {
  relation: 'comments',
  type: ERelationType.Many,
  selectableFields: COMMENT_SELECTABLE_FIELDS,
  defaultSelectFields: COMMENT_DEFAULT_SELECT_FIELDS,
  sortableFields: COMMENT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ICommentAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const COMMENT_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const COMMENT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const COMMENT_QUERY_OPTIONS = {
  searchableFields: COMMENT_SEARCHABLE_FIELDS,
  selectableFields: COMMENT_SELECTABLE_FIELDS,
  defaultSelectFields: COMMENT_DEFAULT_SELECT_FIELDS,
  sortableFields: COMMENT_SORTABLE_FIELDS,
  filterFields: COMMENT_FILTERABLE_FIELDS,
  dateRangeFields: COMMENT_DATE_RANGE_FIELDS,
  oneRelations: COMMENT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: COMMENT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IComment,
  CommentSortableField,
  CommentSelectableField,
  CommentFilterableField,
  CommentDateRangeField,
  CommentRelationKey,
  typeof COMMENT_ONE_RELATION_QUERY_OPTIONS,
  typeof COMMENT_MANY_RELATION_QUERY_OPTIONS
>;