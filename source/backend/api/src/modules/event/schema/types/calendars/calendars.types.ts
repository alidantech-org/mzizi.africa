// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  CALENDARS_RELATION_KEYS,
  CALENDARS_SORTABLE_FIELDS,
  CALENDARS_SEARCHABLE_FIELDS,
  CALENDARS_FILTERABLE_FIELDS,
  CALENDARS_DATE_RANGE_FIELDS,
  CALENDARS_SELECTABLE_FIELDS,
  CALENDARS_DEFAULT_SELECT_FIELDS,
  CALENDARS_EDITABLE_FIELDS,
} from "./calendars.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A way of counting time that gives events their dates: the civil calendar, a lunar calendar, a fiscal or school year. */
export interface ICalendars extends B.IBase {
  calendarKindId: string;
  code: string;
  countryId: string | null;
  description: string | null;
  isObserved: boolean;
  sourceCitationId: string | null;
  yearStartDay: number | null;
  yearStartMonth: number | null;
  readonly calendarKind?: ValueTypes.IValue;
  readonly country?: CountryTypes.ICountry;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type CalendarsKey = keyof ICalendars;

export type CalendarsRelationKey = (typeof CALENDARS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ICalendarsReadonlyFields = B.IBaseReadonlyFields;

export type ICalendarsContextualFields = never;

export type ICalendarsSensitiveFields = never;

export type ICalendarsTransitionFields = never;

export type ICalendarsImmutableFields =
  | ICalendarsReadonlyFields
  | ICalendarsContextualFields
  | ICalendarsSensitiveFields
  | ICalendarsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ICalendarsCreatable = Omit<
  ICalendars,
  ICalendarsImmutableFields | CalendarsRelationKey
>;

export type ICalendarsSystemWritable = Omit<
  ICalendars,
  B.IBaseReadonlyFields | CalendarsRelationKey
>;

export type ICalendarsUpdatable = Partial<
  Omit<ICalendars, ICalendarsImmutableFields | CalendarsRelationKey>
>;

export interface ICalendarsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type CalendarsSortableField = (typeof CALENDARS_SORTABLE_FIELDS)[number];

export type CalendarsSearchableField = (typeof CALENDARS_SEARCHABLE_FIELDS)[number];

export type CalendarsFilterableField = (typeof CALENDARS_FILTERABLE_FIELDS)[number];

export type CalendarsDateRangeField = (typeof CALENDARS_DATE_RANGE_FIELDS)[number];

export type CalendarsSelectableField = (typeof CALENDARS_SELECTABLE_FIELDS)[number];

export type CalendarsDefaultSelectField = (typeof CALENDARS_DEFAULT_SELECT_FIELDS)[number];

export type CalendarsEditableField = (typeof CALENDARS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ICalendarsAsOneRelationConfig = Q.IOneRelationConfig<
  "calendars",
  CalendarsSelectableField
>;

export type ICalendarsAsManyRelationConfig = Q.IManyRelationConfig<
  "calendars",
  CalendarsSelectableField,
  CalendarsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ICalendarsAsOneRelationQuery = Q.IAsOneRelationQuery<
  ICalendars,
  CalendarsSelectableField
>;

export type ICalendarsAsManyRelationQuery = Q.IAsManyRelationQuery<
  ICalendars,
  CalendarsSelectableField,
  CalendarsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ICalendarsRelationMap extends Record<CalendarsRelationKey, unknown> {
  calendarKind: ValueTypes.IValueAsOneRelationQuery;
  country: CountryTypes.ICountryAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ICalendarsRelationQueries = Q.IBaseRelationQueries<
  ICalendars,
  CalendarsRelationKey,
  ICalendarsRelationMap
>;

export type ICalendarsItemQuery = Q.IBaseItemQuery<
  ICalendars,
  CalendarsRelationKey,
  CalendarsSelectableField,
  CalendarsRelationKey,
  CalendarsSelectableField,
  ICalendarsRelationMap,
  ICalendarsRelationQueries
>;

export type ICalendarsListQuery = Q.IBaseListQuery<
  ICalendars,
  CalendarsRelationKey,
  CalendarsSelectableField,
  CalendarsSortableField,
  CalendarsRelationKey,
  CalendarsSelectableField,
  CalendarsSortableField,
  CalendarsDateRangeField,
  CalendarsFilterableField,
  ICalendarsRelationMap,
  ICalendarsRelationQueries,
  ICalendarsItemQuery
>;
