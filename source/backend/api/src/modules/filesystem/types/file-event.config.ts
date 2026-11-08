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
  IFileEvent,
  FileEventKey,
  FileEventRelationKey,
  FileEventSortableField,
  FileEventFilterableField,
  FileEventDateRangeField,
  FileEventSelectableField,
  IFileEventAsOneRelationConfig,
  IFileEventAsManyRelationConfig
} from './file-event.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const FILE_EVENT_RELATION_KEYS = [] as const satisfies readonly FileEventKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const FILE_EVENT_SORTABLE_FIELDS = ['createdAt', 'occurredAt', 'updatedAt', 'version', ] as const satisfies readonly FileEventKey[];

export const FILE_EVENT_SEARCHABLE_FIELDS = [] as const satisfies readonly FileEventKey[];

export const FILE_EVENT_FILTERABLE_FIELDS = ['actorId', 'fileId', 'id', 'kind', 'version', 'versionId', ] as const satisfies readonly FileEventKey[];

export const FILE_EVENT_DATE_RANGE_FIELDS = ['createdAt', 'occurredAt', 'updatedAt', ] as const satisfies readonly FileEventKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const FILE_EVENT_SELECTABLE_FIELDS = ['actorId', 'createdAt', 'detail', 'fileId', 'id', 'kind', 'occurredAt', 'updatedAt', 'versionId', ] as const satisfies readonly FileEventKey[];

export const FILE_EVENT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly FileEventSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const FILE_EVENT_EDITABLE_FIELDS = ['actorId', 'detail', 'fileId', 'kind', 'occurredAt', 'versionId', ] as const satisfies readonly FileEventKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const FILE_EVENT_AS_ONE_RELATION_CONFIG = {
  relation: 'fileEvent',
  type: ERelationType.One,
  selectableFields: FILE_EVENT_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_EVENT_DEFAULT_SELECT_FIELDS
} as const satisfies IFileEventAsOneRelationConfig;

export const FILE_EVENT_AS_MANY_RELATION_CONFIG = {
  relation: 'fileEvents',
  type: ERelationType.Many,
  selectableFields: FILE_EVENT_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_EVENT_DEFAULT_SELECT_FIELDS,
  sortableFields: FILE_EVENT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IFileEventAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const FILE_EVENT_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const FILE_EVENT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const FILE_EVENT_QUERY_OPTIONS = {
  searchableFields: FILE_EVENT_SEARCHABLE_FIELDS,
  selectableFields: FILE_EVENT_SELECTABLE_FIELDS,
  defaultSelectFields: FILE_EVENT_DEFAULT_SELECT_FIELDS,
  sortableFields: FILE_EVENT_SORTABLE_FIELDS,
  filterFields: FILE_EVENT_FILTERABLE_FIELDS,
  dateRangeFields: FILE_EVENT_DATE_RANGE_FIELDS,
  oneRelations: FILE_EVENT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: FILE_EVENT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IFileEvent,
  FileEventSortableField,
  FileEventSelectableField,
  FileEventFilterableField,
  FileEventDateRangeField,
  FileEventRelationKey,
  typeof FILE_EVENT_ONE_RELATION_QUERY_OPTIONS,
  typeof FILE_EVENT_MANY_RELATION_QUERY_OPTIONS
>;