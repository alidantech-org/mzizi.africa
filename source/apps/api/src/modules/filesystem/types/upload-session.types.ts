// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { UploadState } from '#/types/filesystem/upload-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  UPLOAD_SESSION_RELATION_KEYS,
  UPLOAD_SESSION_SORTABLE_FIELDS,
  UPLOAD_SESSION_SEARCHABLE_FIELDS,
  UPLOAD_SESSION_FILTERABLE_FIELDS,
  UPLOAD_SESSION_DATE_RANGE_FIELDS,
  UPLOAD_SESSION_SELECTABLE_FIELDS,
  UPLOAD_SESSION_DEFAULT_SELECT_FIELDS,
  UPLOAD_SESSION_EDITABLE_FIELDS
} from './upload-session.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Upload Session */
export interface IUploadSession extends B.IBase {
  completedFileId: string | null;
  expectedHash: string | null;
  expectedSizeBytes: number;
  expiresAt: Date;
  fileName: string;
  folderId: string;
  requestedBy: string | null;
  state: UploadState;
  storeId: string;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type UploadSessionKey = keyof IUploadSession;

export type UploadSessionRelationKey = (typeof UPLOAD_SESSION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IUploadSessionReadonlyFields = B.IBaseReadonlyFields;

export type IUploadSessionContextualFields = never;

export type IUploadSessionSensitiveFields = never;

export type IUploadSessionTransitionFields = never;

export type IUploadSessionImmutableFields =
  | IUploadSessionReadonlyFields
  | IUploadSessionContextualFields
  | IUploadSessionSensitiveFields
  | IUploadSessionTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IUploadSessionCreatable = Omit<IUploadSession, IUploadSessionImmutableFields | UploadSessionRelationKey>;

export type IUploadSessionSystemWritable = Omit<IUploadSession, B.IBaseReadonlyFields | UploadSessionRelationKey>;

export type IUploadSessionUpdatable = Partial<Omit<IUploadSession, IUploadSessionImmutableFields | UploadSessionRelationKey>>;

export interface IUploadSessionTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type UploadSessionSortableField = (typeof UPLOAD_SESSION_SORTABLE_FIELDS)[number];

export type UploadSessionSearchableField = (typeof UPLOAD_SESSION_SEARCHABLE_FIELDS)[number];

export type UploadSessionFilterableField = (typeof UPLOAD_SESSION_FILTERABLE_FIELDS)[number];

export type UploadSessionDateRangeField = (typeof UPLOAD_SESSION_DATE_RANGE_FIELDS)[number];

export type UploadSessionSelectableField = (typeof UPLOAD_SESSION_SELECTABLE_FIELDS)[number];

export type UploadSessionDefaultSelectField = (typeof UPLOAD_SESSION_DEFAULT_SELECT_FIELDS)[number];

export type UploadSessionEditableField = (typeof UPLOAD_SESSION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IUploadSessionAsOneRelationConfig = Q.IOneRelationConfig<'uploadSession', UploadSessionSelectableField>;

export type IUploadSessionAsManyRelationConfig = Q.IManyRelationConfig<'uploadSessions', UploadSessionSelectableField, UploadSessionSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IUploadSessionAsOneRelationQuery = Q.IAsOneRelationQuery<IUploadSession, UploadSessionSelectableField>;

export type IUploadSessionAsManyRelationQuery = Q.IAsManyRelationQuery<IUploadSession, UploadSessionSelectableField, UploadSessionSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IUploadSessionRelationMap extends Record<UploadSessionRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IUploadSessionRelationQueries = Q.IBaseRelationQueries<IUploadSession, UploadSessionRelationKey, IUploadSessionRelationMap>;

export type IUploadSessionItemQuery = Q.IBaseItemQuery<
  IUploadSession,
  UploadSessionRelationKey,
  UploadSessionSelectableField,
  UploadSessionRelationKey,
  UploadSessionSelectableField,
  IUploadSessionRelationMap,
  IUploadSessionRelationQueries
>;

export type IUploadSessionListQuery = Q.IBaseListQuery<
  IUploadSession,
  UploadSessionRelationKey,
  UploadSessionSelectableField,
  UploadSessionSortableField,
  UploadSessionRelationKey,
  UploadSessionSelectableField,
  UploadSessionSortableField,
  UploadSessionDateRangeField,
  UploadSessionFilterableField,
  IUploadSessionRelationMap,
  IUploadSessionRelationQueries,
  IUploadSessionItemQuery
>;