// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as EventsTypes from "#/modules/event/schema/types/events/events.types";
import type * as ProvisionsTypes from "#/modules/legal/schema/types/provisions/provisions.types";
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SCHEDULES_RELATION_KEYS,
  SCHEDULES_SORTABLE_FIELDS,
  SCHEDULES_SEARCHABLE_FIELDS,
  SCHEDULES_FILTERABLE_FIELDS,
  SCHEDULES_DATE_RANGE_FIELDS,
  SCHEDULES_SELECTABLE_FIELDS,
  SCHEDULES_DEFAULT_SELECT_FIELDS,
  SCHEDULES_EDITABLE_FIELDS,
} from "./schedules.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A published plan of dated items: an election timetable, a school year, a parliamentary calendar. Items are placed by offset from an anchor, so moving the anchor moves the plan. */
export interface ISchedules extends B.IBase {
  anchorEventId: string | null;
  anchorOn: Date | null;
  basisProvisionId: string | null;
  code: string;
  countryId: string | null;
  issuerEntityId: string | null;
  publishedOn: Date | null;
  scheduleKindId: string;
  sourceCitationId: string | null;
  statusId: string;
  supersedesScheduleId: string | null;
  readonly anchorEvent?: EventsTypes.IEvents;
  readonly basisProvision?: ProvisionsTypes.IProvisions;
  readonly country?: CountryTypes.ICountry;
  readonly issuerEntity?: EntitiesTypes.IEntities;
  readonly scheduleKind?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly status?: ValueTypes.IValue;
  readonly supersedesSchedule?: ISchedules;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SchedulesKey = keyof ISchedules;

export type SchedulesRelationKey = (typeof SCHEDULES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISchedulesReadonlyFields = B.IBaseReadonlyFields;

export type ISchedulesContextualFields = never;

export type ISchedulesSensitiveFields = never;

export type ISchedulesTransitionFields = never;

export type ISchedulesImmutableFields =
  | ISchedulesReadonlyFields
  | ISchedulesContextualFields
  | ISchedulesSensitiveFields
  | ISchedulesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISchedulesCreatable = Omit<
  ISchedules,
  ISchedulesImmutableFields | SchedulesRelationKey
>;

export type ISchedulesSystemWritable = Omit<
  ISchedules,
  B.IBaseReadonlyFields | SchedulesRelationKey
>;

export type ISchedulesUpdatable = Partial<
  Omit<ISchedules, ISchedulesImmutableFields | SchedulesRelationKey>
>;

export interface ISchedulesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SchedulesSortableField = (typeof SCHEDULES_SORTABLE_FIELDS)[number];

export type SchedulesSearchableField = (typeof SCHEDULES_SEARCHABLE_FIELDS)[number];

export type SchedulesFilterableField = (typeof SCHEDULES_FILTERABLE_FIELDS)[number];

export type SchedulesDateRangeField = (typeof SCHEDULES_DATE_RANGE_FIELDS)[number];

export type SchedulesSelectableField = (typeof SCHEDULES_SELECTABLE_FIELDS)[number];

export type SchedulesDefaultSelectField = (typeof SCHEDULES_DEFAULT_SELECT_FIELDS)[number];

export type SchedulesEditableField = (typeof SCHEDULES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISchedulesAsOneRelationConfig = Q.IOneRelationConfig<
  "schedules",
  SchedulesSelectableField
>;

export type ISchedulesAsManyRelationConfig = Q.IManyRelationConfig<
  "schedules",
  SchedulesSelectableField,
  SchedulesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISchedulesAsOneRelationQuery = Q.IAsOneRelationQuery<
  ISchedules,
  SchedulesSelectableField
>;

export type ISchedulesAsManyRelationQuery = Q.IAsManyRelationQuery<
  ISchedules,
  SchedulesSelectableField,
  SchedulesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISchedulesRelationMap extends Record<SchedulesRelationKey, unknown> {
  anchorEvent: EventsTypes.IEventsAsOneRelationQuery;
  basisProvision: ProvisionsTypes.IProvisionsAsOneRelationQuery;
  country: CountryTypes.ICountryAsOneRelationQuery;
  issuerEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  scheduleKind: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  status: ValueTypes.IValueAsOneRelationQuery;
  supersedesSchedule: ISchedulesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISchedulesRelationQueries = Q.IBaseRelationQueries<
  ISchedules,
  SchedulesRelationKey,
  ISchedulesRelationMap
>;

export type ISchedulesItemQuery = Q.IBaseItemQuery<
  ISchedules,
  SchedulesRelationKey,
  SchedulesSelectableField,
  SchedulesRelationKey,
  SchedulesSelectableField,
  ISchedulesRelationMap,
  ISchedulesRelationQueries
>;

export type ISchedulesListQuery = Q.IBaseListQuery<
  ISchedules,
  SchedulesRelationKey,
  SchedulesSelectableField,
  SchedulesSortableField,
  SchedulesRelationKey,
  SchedulesSelectableField,
  SchedulesSortableField,
  SchedulesDateRangeField,
  SchedulesFilterableField,
  ISchedulesRelationMap,
  ISchedulesRelationQueries,
  ISchedulesItemQuery
>;
