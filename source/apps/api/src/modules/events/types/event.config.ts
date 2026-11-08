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
  IEvent,
  EventKey,
  EventRelationKey,
  EventSortableField,
  EventFilterableField,
  EventDateRangeField,
  EventSelectableField,
  IEventAsOneRelationConfig,
  IEventAsManyRelationConfig
} from './event.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const EVENT_RELATION_KEYS = [] as const satisfies readonly EventKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const EVENT_SORTABLE_FIELDS = ['code', 'createdAt', 'startsOn', 'title', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly EventKey[];

export const EVENT_SEARCHABLE_FIELDS = ['code', 'title', ] as const satisfies readonly EventKey[];

export const EVENT_FILTERABLE_FIELDS = ['code', 'geoUnitId', 'id', 'impactLevel', 'isCurrent', 'isRecurring', 'jurisdictionId', 'status', 'title', 'typeId', 'version', ] as const satisfies readonly EventKey[];

export const EVENT_DATE_RANGE_FIELDS = ['createdAt', 'startsOn', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly EventKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const EVENT_SELECTABLE_FIELDS = ['code', 'createdAt', 'description', 'endsOn', 'geoUnitId', 'id', 'impactLevel', 'isCurrent', 'isRecurring', 'jurisdictionId', 'startsOn', 'status', 'title', 'typeId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly EventKey[];

export const EVENT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly EventSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const EVENT_EDITABLE_FIELDS = ['code', 'description', 'endsOn', 'geoUnitId', 'impactLevel', 'isCurrent', 'isRecurring', 'jurisdictionId', 'startsOn', 'status', 'title', 'typeId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly EventKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const EVENT_AS_ONE_RELATION_CONFIG = {
  relation: 'event',
  type: ERelationType.One,
  selectableFields: EVENT_SELECTABLE_FIELDS,
  defaultSelectFields: EVENT_DEFAULT_SELECT_FIELDS
} as const satisfies IEventAsOneRelationConfig;

export const EVENT_AS_MANY_RELATION_CONFIG = {
  relation: 'events',
  type: ERelationType.Many,
  selectableFields: EVENT_SELECTABLE_FIELDS,
  defaultSelectFields: EVENT_DEFAULT_SELECT_FIELDS,
  sortableFields: EVENT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IEventAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const EVENT_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const EVENT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const EVENT_QUERY_OPTIONS = {
  searchableFields: EVENT_SEARCHABLE_FIELDS,
  selectableFields: EVENT_SELECTABLE_FIELDS,
  defaultSelectFields: EVENT_DEFAULT_SELECT_FIELDS,
  sortableFields: EVENT_SORTABLE_FIELDS,
  filterFields: EVENT_FILTERABLE_FIELDS,
  dateRangeFields: EVENT_DATE_RANGE_FIELDS,
  oneRelations: EVENT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: EVENT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IEvent,
  EventSortableField,
  EventSelectableField,
  EventFilterableField,
  EventDateRangeField,
  EventRelationKey,
  typeof EVENT_ONE_RELATION_QUERY_OPTIONS,
  typeof EVENT_MANY_RELATION_QUERY_OPTIONS
>;