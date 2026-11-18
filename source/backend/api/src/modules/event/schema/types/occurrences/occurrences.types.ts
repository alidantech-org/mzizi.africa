// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as EventsTypes from "#/modules/event/schema/types/events/events.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  OCCURRENCES_RELATION_KEYS,
  OCCURRENCES_SORTABLE_FIELDS,
  OCCURRENCES_SEARCHABLE_FIELDS,
  OCCURRENCES_FILTERABLE_FIELDS,
  OCCURRENCES_DATE_RANGE_FIELDS,
  OCCURRENCES_SELECTABLE_FIELDS,
  OCCURRENCES_DEFAULT_SELECT_FIELDS,
  OCCURRENCES_EDITABLE_FIELDS,
} from "./occurrences.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One dated instance of an event with its planned and actual dates, status, how we know the date, venue and format. Planned dates are never overwritten; changes are recorded. */
export interface IOccurrences extends B.IBase {
  actualEndsOn: Date | null;
  actualStartsOn: Date | null;
  code: string;
  continuesOccurrenceId: string | null;
  eventId: string;
  formatId: string | null;
  isAllDay: boolean;
  knowledgeId: string;
  organiserEntityId: string | null;
  plannedEndsOn: Date | null;
  plannedStartsOn: Date;
  sourceCitationId: string | null;
  startsAt: Date | null;
  statusId: string;
  timezone: string | null;
  venueFeatureId: string | null;
  venueNote: string | null;
  readonly continuesOccurrence?: IOccurrences;
  readonly event?: EventsTypes.IEvents;
  readonly format?: ValueTypes.IValue;
  readonly knowledge?: ValueTypes.IValue;
  readonly organiserEntity?: EntitiesTypes.IEntities;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly status?: ValueTypes.IValue;
  readonly venueFeature?: FeaturesTypes.IFeatures;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type OccurrencesKey = keyof IOccurrences;

export type OccurrencesRelationKey = (typeof OCCURRENCES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IOccurrencesReadonlyFields = B.IBaseReadonlyFields;

export type IOccurrencesContextualFields = never;

export type IOccurrencesSensitiveFields = never;

export type IOccurrencesTransitionFields = never;

export type IOccurrencesImmutableFields =
  | IOccurrencesReadonlyFields
  | IOccurrencesContextualFields
  | IOccurrencesSensitiveFields
  | IOccurrencesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IOccurrencesCreatable = Omit<
  IOccurrences,
  IOccurrencesImmutableFields | OccurrencesRelationKey
>;

export type IOccurrencesSystemWritable = Omit<
  IOccurrences,
  B.IBaseReadonlyFields | OccurrencesRelationKey
>;

export type IOccurrencesUpdatable = Partial<
  Omit<IOccurrences, IOccurrencesImmutableFields | OccurrencesRelationKey>
>;

export interface IOccurrencesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type OccurrencesSortableField = (typeof OCCURRENCES_SORTABLE_FIELDS)[number];

export type OccurrencesSearchableField = (typeof OCCURRENCES_SEARCHABLE_FIELDS)[number];

export type OccurrencesFilterableField = (typeof OCCURRENCES_FILTERABLE_FIELDS)[number];

export type OccurrencesDateRangeField = (typeof OCCURRENCES_DATE_RANGE_FIELDS)[number];

export type OccurrencesSelectableField = (typeof OCCURRENCES_SELECTABLE_FIELDS)[number];

export type OccurrencesDefaultSelectField = (typeof OCCURRENCES_DEFAULT_SELECT_FIELDS)[number];

export type OccurrencesEditableField = (typeof OCCURRENCES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IOccurrencesAsOneRelationConfig = Q.IOneRelationConfig<
  "occurrences",
  OccurrencesSelectableField
>;

export type IOccurrencesAsManyRelationConfig = Q.IManyRelationConfig<
  "occurrences",
  OccurrencesSelectableField,
  OccurrencesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IOccurrencesAsOneRelationQuery = Q.IAsOneRelationQuery<
  IOccurrences,
  OccurrencesSelectableField
>;

export type IOccurrencesAsManyRelationQuery = Q.IAsManyRelationQuery<
  IOccurrences,
  OccurrencesSelectableField,
  OccurrencesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IOccurrencesRelationMap extends Record<OccurrencesRelationKey, unknown> {
  continuesOccurrence: IOccurrencesAsOneRelationQuery;
  event: EventsTypes.IEventsAsOneRelationQuery;
  format: ValueTypes.IValueAsOneRelationQuery;
  knowledge: ValueTypes.IValueAsOneRelationQuery;
  organiserEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  status: ValueTypes.IValueAsOneRelationQuery;
  venueFeature: FeaturesTypes.IFeaturesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IOccurrencesRelationQueries = Q.IBaseRelationQueries<
  IOccurrences,
  OccurrencesRelationKey,
  IOccurrencesRelationMap
>;

export type IOccurrencesItemQuery = Q.IBaseItemQuery<
  IOccurrences,
  OccurrencesRelationKey,
  OccurrencesSelectableField,
  OccurrencesRelationKey,
  OccurrencesSelectableField,
  IOccurrencesRelationMap,
  IOccurrencesRelationQueries
>;

export type IOccurrencesListQuery = Q.IBaseListQuery<
  IOccurrences,
  OccurrencesRelationKey,
  OccurrencesSelectableField,
  OccurrencesSortableField,
  OccurrencesRelationKey,
  OccurrencesSelectableField,
  OccurrencesSortableField,
  OccurrencesDateRangeField,
  OccurrencesFilterableField,
  IOccurrencesRelationMap,
  IOccurrencesRelationQueries,
  IOccurrencesItemQuery
>;
