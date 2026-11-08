// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as FileTypes from '#/modules/filesystem/types/file.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  FILE_ATTACHMENT_RELATION_KEYS,
  FILE_ATTACHMENT_SORTABLE_FIELDS,
  FILE_ATTACHMENT_SEARCHABLE_FIELDS,
  FILE_ATTACHMENT_FILTERABLE_FIELDS,
  FILE_ATTACHMENT_DATE_RANGE_FIELDS,
  FILE_ATTACHMENT_SELECTABLE_FIELDS,
  FILE_ATTACHMENT_DEFAULT_SELECT_FIELDS,
  FILE_ATTACHMENT_EDITABLE_FIELDS
} from './file-attachment.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** File Attachment */
export interface IFileAttachment extends B.IBase {
  fileId: string;
  position: number;
  role: string;
  targetId: string;
  targetKind: string;
  readonly file?: FileTypes.IFile;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type FileAttachmentKey = keyof IFileAttachment;

export type FileAttachmentRelationKey = (typeof FILE_ATTACHMENT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IFileAttachmentReadonlyFields = B.IBaseReadonlyFields;

export type IFileAttachmentContextualFields = never;

export type IFileAttachmentSensitiveFields = never;

export type IFileAttachmentTransitionFields = never;

export type IFileAttachmentImmutableFields =
  | IFileAttachmentReadonlyFields
  | IFileAttachmentContextualFields
  | IFileAttachmentSensitiveFields
  | IFileAttachmentTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IFileAttachmentCreatable = Omit<IFileAttachment, IFileAttachmentImmutableFields | FileAttachmentRelationKey>;

export type IFileAttachmentSystemWritable = Omit<IFileAttachment, B.IBaseReadonlyFields | FileAttachmentRelationKey>;

export type IFileAttachmentUpdatable = Partial<Omit<IFileAttachment, IFileAttachmentImmutableFields | FileAttachmentRelationKey>>;

export interface IFileAttachmentTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type FileAttachmentSortableField = (typeof FILE_ATTACHMENT_SORTABLE_FIELDS)[number];

export type FileAttachmentSearchableField = (typeof FILE_ATTACHMENT_SEARCHABLE_FIELDS)[number];

export type FileAttachmentFilterableField = (typeof FILE_ATTACHMENT_FILTERABLE_FIELDS)[number];

export type FileAttachmentDateRangeField = (typeof FILE_ATTACHMENT_DATE_RANGE_FIELDS)[number];

export type FileAttachmentSelectableField = (typeof FILE_ATTACHMENT_SELECTABLE_FIELDS)[number];

export type FileAttachmentDefaultSelectField = (typeof FILE_ATTACHMENT_DEFAULT_SELECT_FIELDS)[number];

export type FileAttachmentEditableField = (typeof FILE_ATTACHMENT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IFileAttachmentAsOneRelationConfig = Q.IOneRelationConfig<'fileAttachment', FileAttachmentSelectableField>;

export type IFileAttachmentAsManyRelationConfig = Q.IManyRelationConfig<'fileAttachments', FileAttachmentSelectableField, FileAttachmentSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IFileAttachmentAsOneRelationQuery = Q.IAsOneRelationQuery<IFileAttachment, FileAttachmentSelectableField>;

export type IFileAttachmentAsManyRelationQuery = Q.IAsManyRelationQuery<IFileAttachment, FileAttachmentSelectableField, FileAttachmentSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IFileAttachmentRelationMap extends Record<FileAttachmentRelationKey, unknown> {
  file: FileTypes.IFileAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IFileAttachmentRelationQueries = Q.IBaseRelationQueries<IFileAttachment, FileAttachmentRelationKey, IFileAttachmentRelationMap>;

export type IFileAttachmentItemQuery = Q.IBaseItemQuery<
  IFileAttachment,
  FileAttachmentRelationKey,
  FileAttachmentSelectableField,
  FileAttachmentRelationKey,
  FileAttachmentSelectableField,
  IFileAttachmentRelationMap,
  IFileAttachmentRelationQueries
>;

export type IFileAttachmentListQuery = Q.IBaseListQuery<
  IFileAttachment,
  FileAttachmentRelationKey,
  FileAttachmentSelectableField,
  FileAttachmentSortableField,
  FileAttachmentRelationKey,
  FileAttachmentSelectableField,
  FileAttachmentSortableField,
  FileAttachmentDateRangeField,
  FileAttachmentFilterableField,
  IFileAttachmentRelationMap,
  IFileAttachmentRelationQueries,
  IFileAttachmentItemQuery
>;