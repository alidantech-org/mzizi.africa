// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as EventsTypes from "#/modules/event/schema/types/events/events.types";
import type * as OccurrencesTypes from "#/modules/event/schema/types/occurrences/occurrences.types";
import type * as SchedulesTypes from "#/modules/event/schema/types/schedules/schedules.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  ITEMS_RELATION_KEYS,
  ITEMS_SORTABLE_FIELDS,
  ITEMS_SEARCHABLE_FIELDS,
  ITEMS_FILTERABLE_FIELDS,
  ITEMS_DATE_RANGE_FIELDS,
  ITEMS_SELECTABLE_FIELDS,
  ITEMS_DEFAULT_SELECT_FIELDS,
  ITEMS_EDITABLE_FIELDS,
} from "./items.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One line of a schedule: an event placed at an offset from the anchor, and the occurrence it became. */
export interface IItems extends B.IBase {
  countsWorkingDays: boolean;
  eventId: string;
  note: string | null;
  occurrenceId: string | null;
  offsetDays: number | null;
  position: number;
  scheduleId: string;
  readonly event?: EventsTypes.IEvents;
  readonly occurrence?: OccurrencesTypes.IOccurrences;
  readonly schedule?: SchedulesTypes.ISchedules;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ItemsKey = keyof IItems;

export type ItemsRelationKey = (typeof ITEMS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IItemsReadonlyFields = B.IBaseReadonlyFields;

export type IItemsContextualFields = never;

export type IItemsSensitiveFields = never;

export type IItemsTransitionFields = never;

export type IItemsImmutableFields =
  IItemsReadonlyFields | IItemsContextualFields | IItemsSensitiveFields | IItemsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IItemsCreatable = Omit<IItems, IItemsImmutableFields | ItemsRelationKey>;

export type IItemsSystemWritable = Omit<IItems, B.IBaseReadonlyFields | ItemsRelationKey>;

export type IItemsUpdatable = Partial<Omit<IItems, IItemsImmutableFields | ItemsRelationKey>>;

export interface IItemsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ItemsSortableField = (typeof ITEMS_SORTABLE_FIELDS)[number];

export type ItemsSearchableField = (typeof ITEMS_SEARCHABLE_FIELDS)[number];

export type ItemsFilterableField = (typeof ITEMS_FILTERABLE_FIELDS)[number];

export type ItemsDateRangeField = (typeof ITEMS_DATE_RANGE_FIELDS)[number];

export type ItemsSelectableField = (typeof ITEMS_SELECTABLE_FIELDS)[number];

export type ItemsDefaultSelectField = (typeof ITEMS_DEFAULT_SELECT_FIELDS)[number];

export type ItemsEditableField = (typeof ITEMS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IItemsAsOneRelationConfig = Q.IOneRelationConfig<"items", ItemsSelectableField>;

export type IItemsAsManyRelationConfig = Q.IManyRelationConfig<
  "items",
  ItemsSelectableField,
  ItemsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IItemsAsOneRelationQuery = Q.IAsOneRelationQuery<IItems, ItemsSelectableField>;

export type IItemsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IItems,
  ItemsSelectableField,
  ItemsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IItemsRelationMap extends Record<ItemsRelationKey, unknown> {
  event: EventsTypes.IEventsAsOneRelationQuery;
  occurrence: OccurrencesTypes.IOccurrencesAsOneRelationQuery;
  schedule: SchedulesTypes.ISchedulesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IItemsRelationQueries = Q.IBaseRelationQueries<
  IItems,
  ItemsRelationKey,
  IItemsRelationMap
>;

export type IItemsItemQuery = Q.IBaseItemQuery<
  IItems,
  ItemsRelationKey,
  ItemsSelectableField,
  ItemsRelationKey,
  ItemsSelectableField,
  IItemsRelationMap,
  IItemsRelationQueries
>;

export type IItemsListQuery = Q.IBaseListQuery<
  IItems,
  ItemsRelationKey,
  ItemsSelectableField,
  ItemsSortableField,
  ItemsRelationKey,
  ItemsSelectableField,
  ItemsSortableField,
  ItemsDateRangeField,
  ItemsFilterableField,
  IItemsRelationMap,
  IItemsRelationQueries,
  IItemsItemQuery
>;
