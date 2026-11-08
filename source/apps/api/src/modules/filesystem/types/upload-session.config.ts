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
  IUploadSession,
  UploadSessionKey,
  UploadSessionRelationKey,
  UploadSessionSortableField,
  UploadSessionFilterableField,
  UploadSessionDateRangeField,
  UploadSessionSelectableField,
  IUploadSessionAsOneRelationConfig,
  IUploadSessionAsManyRelationConfig
} from './upload-session.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const UPLOAD_SESSION_RELATION_KEYS = [] as const satisfies readonly UploadSessionKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const UPLOAD_SESSION_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly UploadSessionKey[];

export const UPLOAD_SESSION_SEARCHABLE_FIELDS = [] as const satisfies readonly UploadSessionKey[];

export const UPLOAD_SESSION_FILTERABLE_FIELDS = ['completedFileId', 'folderId', 'id', 'requestedBy', 'state', 'storeId', 'version', ] as const satisfies readonly UploadSessionKey[];

export const UPLOAD_SESSION_DATE_RANGE_FIELDS = ['createdAt', 'expiresAt', 'updatedAt', ] as const satisfies readonly UploadSessionKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const UPLOAD_SESSION_SELECTABLE_FIELDS = ['completedFileId', 'createdAt', 'expectedHash', 'expectedSizeBytes', 'expiresAt', 'fileName', 'folderId', 'id', 'requestedBy', 'state', 'storeId', 'updatedAt', ] as const satisfies readonly UploadSessionKey[];

export const UPLOAD_SESSION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly UploadSessionSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const UPLOAD_SESSION_EDITABLE_FIELDS = ['completedFileId', 'expectedHash', 'expectedSizeBytes', 'expiresAt', 'fileName', 'folderId', 'requestedBy', 'state', 'storeId', ] as const satisfies readonly UploadSessionKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const UPLOAD_SESSION_AS_ONE_RELATION_CONFIG = {
  relation: 'uploadSession',
  type: ERelationType.One,
  selectableFields: UPLOAD_SESSION_SELECTABLE_FIELDS,
  defaultSelectFields: UPLOAD_SESSION_DEFAULT_SELECT_FIELDS
} as const satisfies IUploadSessionAsOneRelationConfig;

export const UPLOAD_SESSION_AS_MANY_RELATION_CONFIG = {
  relation: 'uploadSessions',
  type: ERelationType.Many,
  selectableFields: UPLOAD_SESSION_SELECTABLE_FIELDS,
  defaultSelectFields: UPLOAD_SESSION_DEFAULT_SELECT_FIELDS,
  sortableFields: UPLOAD_SESSION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IUploadSessionAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const UPLOAD_SESSION_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const UPLOAD_SESSION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const UPLOAD_SESSION_QUERY_OPTIONS = {
  searchableFields: UPLOAD_SESSION_SEARCHABLE_FIELDS,
  selectableFields: UPLOAD_SESSION_SELECTABLE_FIELDS,
  defaultSelectFields: UPLOAD_SESSION_DEFAULT_SELECT_FIELDS,
  sortableFields: UPLOAD_SESSION_SORTABLE_FIELDS,
  filterFields: UPLOAD_SESSION_FILTERABLE_FIELDS,
  dateRangeFields: UPLOAD_SESSION_DATE_RANGE_FIELDS,
  oneRelations: UPLOAD_SESSION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: UPLOAD_SESSION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IUploadSession,
  UploadSessionSortableField,
  UploadSessionSelectableField,
  UploadSessionFilterableField,
  UploadSessionDateRangeField,
  UploadSessionRelationKey,
  typeof UPLOAD_SESSION_ONE_RELATION_QUERY_OPTIONS,
  typeof UPLOAD_SESSION_MANY_RELATION_QUERY_OPTIONS
>;