// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { EventKind } from '#/types/filesystem/event-kind.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  FILE_EVENT_RELATION_KEYS,
  FILE_EVENT_SORTABLE_FIELDS,
  FILE_EVENT_SEARCHABLE_FIELDS,
  FILE_EVENT_FILTERABLE_FIELDS,
  FILE_EVENT_DATE_RANGE_FIELDS,
  FILE_EVENT_SELECTABLE_FIELDS,
  FILE_EVENT_DEFAULT_SELECT_FIELDS,
  FILE_EVENT_EDITABLE_FIELDS
} from './file-event.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** File Event */
export interface IFileEvent extends B.IBase {
  actorId: string | null;
  detail: string | null;
  fileId: string;
  kind: EventKind;
  occurredAt: Date;
  versionId: string | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type FileEventKey = keyof IFileEvent;

export type FileEventRelationKey = (typeof FILE_EVENT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IFileEventReadonlyFields = B.IBaseReadonlyFields;

export type IFileEventContextualFields = never;

export type IFileEventSensitiveFields = never;

export type IFileEventTransitionFields = never;

export type IFileEventImmutableFields =
  | IFileEventReadonlyFields
  | IFileEventContextualFields
  | IFileEventSensitiveFields
  | IFileEventTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IFileEventCreatable = Omit<IFileEvent, IFileEventImmutableFields | FileEventRelationKey>;

export type IFileEventSystemWritable = Omit<IFileEvent, B.IBaseReadonlyFields | FileEventRelationKey>;

export type IFileEventUpdatable = Partial<Omit<IFileEvent, IFileEventImmutableFields | FileEventRelationKey>>;

export interface IFileEventTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type FileEventSortableField = (typeof FILE_EVENT_SORTABLE_FIELDS)[number];

export type FileEventSearchableField = (typeof FILE_EVENT_SEARCHABLE_FIELDS)[number];

export type FileEventFilterableField = (typeof FILE_EVENT_FILTERABLE_FIELDS)[number];

export type FileEventDateRangeField = (typeof FILE_EVENT_DATE_RANGE_FIELDS)[number];

export type FileEventSelectableField = (typeof FILE_EVENT_SELECTABLE_FIELDS)[number];

export type FileEventDefaultSelectField = (typeof FILE_EVENT_DEFAULT_SELECT_FIELDS)[number];

export type FileEventEditableField = (typeof FILE_EVENT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IFileEventAsOneRelationConfig = Q.IOneRelationConfig<'fileEvent', FileEventSelectableField>;

export type IFileEventAsManyRelationConfig = Q.IManyRelationConfig<'fileEvents', FileEventSelectableField, FileEventSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IFileEventAsOneRelationQuery = Q.IAsOneRelationQuery<IFileEvent, FileEventSelectableField>;

export type IFileEventAsManyRelationQuery = Q.IAsManyRelationQuery<IFileEvent, FileEventSelectableField, FileEventSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IFileEventRelationMap extends Record<FileEventRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IFileEventRelationQueries = Q.IBaseRelationQueries<IFileEvent, FileEventRelationKey, IFileEventRelationMap>;

export type IFileEventItemQuery = Q.IBaseItemQuery<
  IFileEvent,
  FileEventRelationKey,
  FileEventSelectableField,
  FileEventRelationKey,
  FileEventSelectableField,
  IFileEventRelationMap,
  IFileEventRelationQueries
>;

export type IFileEventListQuery = Q.IBaseListQuery<
  IFileEvent,
  FileEventRelationKey,
  FileEventSelectableField,
  FileEventSortableField,
  FileEventRelationKey,
  FileEventSelectableField,
  FileEventSortableField,
  FileEventDateRangeField,
  FileEventFilterableField,
  IFileEventRelationMap,
  IFileEventRelationQueries,
  IFileEventItemQuery
>;