// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { EventStatus } from '#/types/events/event-status.enum';
import type { ImpactLevel } from '#/types/events/impact-level.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as JurisdictionTypes from '#/modules/reference/types/jurisdiction.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  EVENT_RELATION_KEYS,
  EVENT_SORTABLE_FIELDS,
  EVENT_SEARCHABLE_FIELDS,
  EVENT_FILTERABLE_FIELDS,
  EVENT_DATE_RANGE_FIELDS,
  EVENT_SELECTABLE_FIELDS,
  EVENT_DEFAULT_SELECT_FIELDS,
  EVENT_EDITABLE_FIELDS
} from './event.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Event */
export interface IEvent extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  code: string;
  confidence: number | null;
  description: string | null;
  endsOn: Date | null;
  geoUnitId: string | null;
  impactLevel: ImpactLevel | null;
  isCurrent: boolean;
  isRecurring: boolean;
  jurisdictionId: string;
  licence: string | null;
  method: ProvenanceMethod;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  startsOn: Date;
  status: EventStatus;
  title: string;
  toolOrModel: string | null;
  typeId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly jurisdiction?: JurisdictionTypes.IJurisdiction;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type EventKey = keyof IEvent;

export type EventRelationKey = (typeof EVENT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IEventReadonlyFields = B.IBaseReadonlyFields;

export type IEventContextualFields = never;

export type IEventSensitiveFields = never;

export type IEventTransitionFields = never;

export type IEventImmutableFields =
  | IEventReadonlyFields
  | IEventContextualFields
  | IEventSensitiveFields
  | IEventTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IEventCreatable = Omit<IEvent, IEventImmutableFields | EventRelationKey>;

export type IEventSystemWritable = Omit<IEvent, B.IBaseReadonlyFields | EventRelationKey>;

export type IEventUpdatable = Partial<Omit<IEvent, IEventImmutableFields | EventRelationKey>>;

export interface IEventTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type EventSortableField = (typeof EVENT_SORTABLE_FIELDS)[number];

export type EventSearchableField = (typeof EVENT_SEARCHABLE_FIELDS)[number];

export type EventFilterableField = (typeof EVENT_FILTERABLE_FIELDS)[number];

export type EventDateRangeField = (typeof EVENT_DATE_RANGE_FIELDS)[number];

export type EventSelectableField = (typeof EVENT_SELECTABLE_FIELDS)[number];

export type EventDefaultSelectField = (typeof EVENT_DEFAULT_SELECT_FIELDS)[number];

export type EventEditableField = (typeof EVENT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IEventAsOneRelationConfig = Q.IOneRelationConfig<'event', EventSelectableField>;

export type IEventAsManyRelationConfig = Q.IManyRelationConfig<'events', EventSelectableField, EventSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IEventAsOneRelationQuery = Q.IAsOneRelationQuery<IEvent, EventSelectableField>;

export type IEventAsManyRelationQuery = Q.IAsManyRelationQuery<IEvent, EventSelectableField, EventSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IEventRelationMap extends Record<EventRelationKey, unknown> {
  jurisdiction: JurisdictionTypes.IJurisdictionAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IEventRelationQueries = Q.IBaseRelationQueries<IEvent, EventRelationKey, IEventRelationMap>;

export type IEventItemQuery = Q.IBaseItemQuery<
  IEvent,
  EventRelationKey,
  EventSelectableField,
  EventRelationKey,
  EventSelectableField,
  IEventRelationMap,
  IEventRelationQueries
>;

export type IEventListQuery = Q.IBaseListQuery<
  IEvent,
  EventRelationKey,
  EventSelectableField,
  EventSortableField,
  EventRelationKey,
  EventSelectableField,
  EventSortableField,
  EventDateRangeField,
  EventFilterableField,
  IEventRelationMap,
  IEventRelationQueries,
  IEventItemQuery
>;