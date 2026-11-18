// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ProvisionsTypes from "#/modules/legal/schema/types/provisions/provisions.types";
import type * as CalendarsTypes from "#/modules/event/schema/types/calendars/calendars.types";
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  EVENTS_RELATION_KEYS,
  EVENTS_SORTABLE_FIELDS,
  EVENTS_SEARCHABLE_FIELDS,
  EVENTS_FILTERABLE_FIELDS,
  EVENTS_DATE_RANGE_FIELDS,
  EVENTS_SELECTABLE_FIELDS,
  EVENTS_DEFAULT_SELECT_FIELDS,
  EVENTS_EDITABLE_FIELDS,
} from "./events.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One event or a recurring series of events: a public holiday, a national day, an election, a sitting, a government visit. Names, rules and dated occurrences are separate; content and media attach through the subject mechanism. */
export interface IEvents extends B.IBase {
  basisProvisionId: string | null;
  calendarId: string | null;
  code: string;
  countryId: string | null;
  eventKindId: string;
  organiserEntityId: string | null;
  scopeFeatureId: string | null;
  scopeLevelKindId: string | null;
  sourceCitationId: string | null;
  readonly basisProvision?: ProvisionsTypes.IProvisions;
  readonly calendar?: CalendarsTypes.ICalendars;
  readonly country?: CountryTypes.ICountry;
  readonly eventKind?: ValueTypes.IValue;
  readonly organiserEntity?: EntitiesTypes.IEntities;
  readonly scopeFeature?: FeaturesTypes.IFeatures;
  readonly scopeLevelKind?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type EventsKey = keyof IEvents;

export type EventsRelationKey = (typeof EVENTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IEventsReadonlyFields = B.IBaseReadonlyFields;

export type IEventsContextualFields = never;

export type IEventsSensitiveFields = never;

export type IEventsTransitionFields = never;

export type IEventsImmutableFields =
  | IEventsReadonlyFields
  | IEventsContextualFields
  | IEventsSensitiveFields
  | IEventsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IEventsCreatable = Omit<IEvents, IEventsImmutableFields | EventsRelationKey>;

export type IEventsSystemWritable = Omit<IEvents, B.IBaseReadonlyFields | EventsRelationKey>;

export type IEventsUpdatable = Partial<Omit<IEvents, IEventsImmutableFields | EventsRelationKey>>;

export interface IEventsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type EventsSortableField = (typeof EVENTS_SORTABLE_FIELDS)[number];

export type EventsSearchableField = (typeof EVENTS_SEARCHABLE_FIELDS)[number];

export type EventsFilterableField = (typeof EVENTS_FILTERABLE_FIELDS)[number];

export type EventsDateRangeField = (typeof EVENTS_DATE_RANGE_FIELDS)[number];

export type EventsSelectableField = (typeof EVENTS_SELECTABLE_FIELDS)[number];

export type EventsDefaultSelectField = (typeof EVENTS_DEFAULT_SELECT_FIELDS)[number];

export type EventsEditableField = (typeof EVENTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IEventsAsOneRelationConfig = Q.IOneRelationConfig<"events", EventsSelectableField>;

export type IEventsAsManyRelationConfig = Q.IManyRelationConfig<
  "events",
  EventsSelectableField,
  EventsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IEventsAsOneRelationQuery = Q.IAsOneRelationQuery<IEvents, EventsSelectableField>;

export type IEventsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IEvents,
  EventsSelectableField,
  EventsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IEventsRelationMap extends Record<EventsRelationKey, unknown> {
  basisProvision: ProvisionsTypes.IProvisionsAsOneRelationQuery;
  calendar: CalendarsTypes.ICalendarsAsOneRelationQuery;
  country: CountryTypes.ICountryAsOneRelationQuery;
  eventKind: ValueTypes.IValueAsOneRelationQuery;
  organiserEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  scopeFeature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  scopeLevelKind: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IEventsRelationQueries = Q.IBaseRelationQueries<
  IEvents,
  EventsRelationKey,
  IEventsRelationMap
>;

export type IEventsItemQuery = Q.IBaseItemQuery<
  IEvents,
  EventsRelationKey,
  EventsSelectableField,
  EventsRelationKey,
  EventsSelectableField,
  IEventsRelationMap,
  IEventsRelationQueries
>;

export type IEventsListQuery = Q.IBaseListQuery<
  IEvents,
  EventsRelationKey,
  EventsSelectableField,
  EventsSortableField,
  EventsRelationKey,
  EventsSelectableField,
  EventsSortableField,
  EventsDateRangeField,
  EventsFilterableField,
  IEventsRelationMap,
  IEventsRelationQueries,
  IEventsItemQuery
>;
