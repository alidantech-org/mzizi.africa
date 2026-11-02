// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as EventTypes from '#/modules/events/types/event.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  EVENT_LINK_RELATION_KEYS,
  EVENT_LINK_SORTABLE_FIELDS,
  EVENT_LINK_SEARCHABLE_FIELDS,
  EVENT_LINK_FILTERABLE_FIELDS,
  EVENT_LINK_DATE_RANGE_FIELDS,
  EVENT_LINK_SELECTABLE_FIELDS,
  EVENT_LINK_DEFAULT_SELECT_FIELDS,
  EVENT_LINK_EDITABLE_FIELDS
} from './event-link.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Event Link */
export interface IEventLink extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  confidence: number | null;
  eventId: string;
  isCurrent: boolean;
  licence: string | null;
  method: ProvenanceMethod;
  retrievedAt: Date | null;
  role: string | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  targetId: string;
  targetKind: string;
  toolOrModel: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly event?: EventTypes.IEvent;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type EventLinkKey = keyof IEventLink;

export type EventLinkRelationKey = (typeof EVENT_LINK_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IEventLinkReadonlyFields = B.IBaseReadonlyFields;

export type IEventLinkContextualFields = never;

export type IEventLinkSensitiveFields = never;

export type IEventLinkTransitionFields = never;

export type IEventLinkImmutableFields =
  | IEventLinkReadonlyFields
  | IEventLinkContextualFields
  | IEventLinkSensitiveFields
  | IEventLinkTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IEventLinkCreatable = Omit<IEventLink, IEventLinkImmutableFields | EventLinkRelationKey>;

export type IEventLinkSystemWritable = Omit<IEventLink, B.IBaseReadonlyFields | EventLinkRelationKey>;

export type IEventLinkUpdatable = Partial<Omit<IEventLink, IEventLinkImmutableFields | EventLinkRelationKey>>;

export interface IEventLinkTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type EventLinkSortableField = (typeof EVENT_LINK_SORTABLE_FIELDS)[number];

export type EventLinkSearchableField = (typeof EVENT_LINK_SEARCHABLE_FIELDS)[number];

export type EventLinkFilterableField = (typeof EVENT_LINK_FILTERABLE_FIELDS)[number];

export type EventLinkDateRangeField = (typeof EVENT_LINK_DATE_RANGE_FIELDS)[number];

export type EventLinkSelectableField = (typeof EVENT_LINK_SELECTABLE_FIELDS)[number];

export type EventLinkDefaultSelectField = (typeof EVENT_LINK_DEFAULT_SELECT_FIELDS)[number];

export type EventLinkEditableField = (typeof EVENT_LINK_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IEventLinkAsOneRelationConfig = Q.IOneRelationConfig<'eventLink', EventLinkSelectableField>;

export type IEventLinkAsManyRelationConfig = Q.IManyRelationConfig<'eventLinks', EventLinkSelectableField, EventLinkSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IEventLinkAsOneRelationQuery = Q.IAsOneRelationQuery<IEventLink, EventLinkSelectableField>;

export type IEventLinkAsManyRelationQuery = Q.IAsManyRelationQuery<IEventLink, EventLinkSelectableField, EventLinkSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IEventLinkRelationMap extends Record<EventLinkRelationKey, unknown> {
  event: EventTypes.IEventAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IEventLinkRelationQueries = Q.IBaseRelationQueries<IEventLink, EventLinkRelationKey, IEventLinkRelationMap>;

export type IEventLinkItemQuery = Q.IBaseItemQuery<
  IEventLink,
  EventLinkRelationKey,
  EventLinkSelectableField,
  EventLinkRelationKey,
  EventLinkSelectableField,
  IEventLinkRelationMap,
  IEventLinkRelationQueries
>;

export type IEventLinkListQuery = Q.IBaseListQuery<
  IEventLink,
  EventLinkRelationKey,
  EventLinkSelectableField,
  EventLinkSortableField,
  EventLinkRelationKey,
  EventLinkSelectableField,
  EventLinkSortableField,
  EventLinkDateRangeField,
  EventLinkFilterableField,
  IEventLinkRelationMap,
  IEventLinkRelationQueries,
  IEventLinkItemQuery
>;