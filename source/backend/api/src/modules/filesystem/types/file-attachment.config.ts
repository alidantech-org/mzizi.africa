// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as FileConfig from '#/modules/filesystem/types/file.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IFileAttachment,
  FileAttachmentKey,
  FileAttachmentRelationKey,
  FileAttachmentSortableField,
  FileAttachmentFilterableField,
  FileAttachmentDateRangeField,
  FileAttachmentSelectableField,
  IFileAttachmentAsOneRelationConfig,
  IFileAttachmentAsManyRelationConfig
} from './file-attachment.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const FILE_ATTACHMENT_RELATION_KEYS = ['file', ] as const satisfies readonly FileAttachmentKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const FILE_ATTACHMENT_SORTABLE_FIELDS = ['createdAt', 'position', 'updatedAt', 'version', ] as const satisfies readonly FileAttachmentKey[];

export const FILE_ATTACHMENT_SEARCHABLE_FIELDS = [] as const satisfies readonly FileAttachmentKey[];

export const FILE_ATTACHMENT_FILTERABLE_FIELDS = ['fileId', 'id', 'role', 'targetId', 'targetKind', 'version', ] as const satisfies readonly FileAttachmentKey[];

export const FILE_ATTACHMENT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly FileAttachmentKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const FILE_ATTACHMENT_SELECTABLE_FIELDS = ['createdAt', 'fileId', 'id', 'position', 'role', 'targetId', 'targetKind', 'updatedAt', ] as const satisfies readonly FileAttachmentKey[];

export const FILE_ATTACHMENT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly FileAttachmentSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const FILE_ATTACHMENT_EDITABLE_FIELDS = ['fileId', 'position', 'role', 'targetId', 'targetKind', ] as const satisfies readonly FileAttachmentKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const FILE_ATTACHMENT_AS_ONE_RELATION_CONFIG = {
  relation: 'fileAttachment',
  type: ERelationType.One,
  selectableFields: FILE_ATTACHMENT_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_ATTACHMENT_DEFAULT_SELECT_FIELDS
} as const satisfies IFileAttachmentAsOneRelationConfig;

export const FILE_ATTACHMENT_AS_MANY_RELATION_CONFIG = {
  relation: 'fileAttachments',
  type: ERelationType.Many,
  selectableFields: FILE_ATTACHMENT_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_ATTACHMENT_DEFAULT_SELECT_FIELDS,
  sortableFields: FILE_ATTACHMENT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IFileAttachmentAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const FILE_ATTACHMENT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<FileAttachmentRelationKey>().one(FileConfig.FILE_AS_ONE_RELATION_CONFIG, 'file'),
] as const;

export const FILE_ATTACHMENT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const FILE_ATTACHMENT_QUERY_OPTIONS = {
  searchableFields: FILE_ATTACHMENT_SEARCHABLE_FIELDS,
  selectableFields: FILE_ATTACHMENT_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_ATTACHMENT_DEFAULT_SELECT_FIELDS,
  sortableFields: FILE_ATTACHMENT_SORTABLE_FIELDS,
  filterFields: FILE_ATTACHMENT_FILTERABLE_FIELDS,
  dateRangeFields: FILE_ATTACHMENT_DATE_RANGE_FIELDS,
  oneRelations: FILE_ATTACHMENT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: FILE_ATTACHMENT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IFileAttachment,
  FileAttachmentSortableField,
  FileAttachmentSelectableField,
  FileAttachmentFilterableField,
  FileAttachmentDateRangeField,
  FileAttachmentRelationKey,
  typeof FILE_ATTACHMENT_ONE_RELATION_QUERY_OPTIONS,
  typeof FILE_ATTACHMENT_MANY_RELATION_QUERY_OPTIONS
>;