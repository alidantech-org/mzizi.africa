// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as EventConfig from '#/modules/events/types/event.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IEventLink,
  EventLinkKey,
  EventLinkRelationKey,
  EventLinkSortableField,
  EventLinkFilterableField,
  EventLinkDateRangeField,
  EventLinkSelectableField,
  IEventLinkAsOneRelationConfig,
  IEventLinkAsManyRelationConfig
} from './event-link.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const EVENT_LINK_RELATION_KEYS = ['event', ] as const satisfies readonly EventLinkKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const EVENT_LINK_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly EventLinkKey[];

export const EVENT_LINK_SEARCHABLE_FIELDS = [] as const satisfies readonly EventLinkKey[];

export const EVENT_LINK_FILTERABLE_FIELDS = ['eventId', 'id', 'isCurrent', 'targetId', 'targetKind', 'version', ] as const satisfies readonly EventLinkKey[];

export const EVENT_LINK_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly EventLinkKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const EVENT_LINK_SELECTABLE_FIELDS = ['createdAt', 'eventId', 'id', 'isCurrent', 'role', 'targetId', 'targetKind', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly EventLinkKey[];

export const EVENT_LINK_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly EventLinkSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const EVENT_LINK_EDITABLE_FIELDS = ['eventId', 'isCurrent', 'role', 'targetId', 'targetKind', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly EventLinkKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const EVENT_LINK_AS_ONE_RELATION_CONFIG = {
  relation: 'eventLink',
  type: ERelationType.One,
  selectableFields: EVENT_LINK_SELECTABLE_FIELDS,
  defaultSelectFields: EVENT_LINK_DEFAULT_SELECT_FIELDS
} as const satisfies IEventLinkAsOneRelationConfig;

export const EVENT_LINK_AS_MANY_RELATION_CONFIG = {
  relation: 'eventLinks',
  type: ERelationType.Many,
  selectableFields: EVENT_LINK_SELECTABLE_FIELDS,
  defaultSelectFields: EVENT_LINK_DEFAULT_SELECT_FIELDS,
  sortableFields: EVENT_LINK_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IEventLinkAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const EVENT_LINK_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<EventLinkRelationKey>().one(EventConfig.EVENT_AS_ONE_RELATION_CONFIG, 'event'),
] as const;

export const EVENT_LINK_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const EVENT_LINK_QUERY_OPTIONS = {
  searchableFields: EVENT_LINK_SEARCHABLE_FIELDS,
  selectableFields: EVENT_LINK_SELECTABLE_FIELDS,
  defaultSelectFields: EVENT_LINK_DEFAULT_SELECT_FIELDS,
  sortableFields: EVENT_LINK_SORTABLE_FIELDS,
  filterFields: EVENT_LINK_FILTERABLE_FIELDS,
  dateRangeFields: EVENT_LINK_DATE_RANGE_FIELDS,
  oneRelations: EVENT_LINK_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: EVENT_LINK_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IEventLink,
  EventLinkSortableField,
  EventLinkSelectableField,
  EventLinkFilterableField,
  EventLinkDateRangeField,
  EventLinkRelationKey,
  typeof EVENT_LINK_ONE_RELATION_QUERY_OPTIONS,
  typeof EVENT_LINK_MANY_RELATION_QUERY_OPTIONS
>;