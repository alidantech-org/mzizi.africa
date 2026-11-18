// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as EventsConfig from "#/modules/event/schema/types/events/events.config";
import * as OccurrencesConfig from "#/modules/event/schema/types/occurrences/occurrences.config";
import * as SchedulesConfig from "#/modules/event/schema/types/schedules/schedules.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IItems,
  ItemsKey,
  ItemsRelationKey,
  ItemsSortableField,
  ItemsFilterableField,
  ItemsDateRangeField,
  ItemsSelectableField,
  IItemsAsOneRelationConfig,
  IItemsAsManyRelationConfig,
} from "./items.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ITEMS_RELATION_KEYS = [
  "event",
  "occurrence",
  "schedule",
] as const satisfies readonly ItemsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ITEMS_SORTABLE_FIELDS = [
  "countsWorkingDays",
  "createdAt",
  "deletedAt",
  "eventId",
  "id",
  "note",
  "occurrenceId",
  "offsetDays",
  "position",
  "scheduleId",
  "updatedAt",
  "version",
] as const satisfies readonly ItemsKey[];

export const ITEMS_SEARCHABLE_FIELDS = ["note"] as const satisfies readonly ItemsKey[];

export const ITEMS_FILTERABLE_FIELDS = [
  "countsWorkingDays",
  "eventId",
  "id",
  "occurrenceId",
  "scheduleId",
] as const satisfies readonly ItemsKey[];

export const ITEMS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly ItemsKey[];

export const ITEMS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IItems> = {
  searchableFields: [...ITEMS_SEARCHABLE_FIELDS],
  filterFields: [...ITEMS_FILTERABLE_FIELDS],
  dateRangeFields: [...ITEMS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ITEMS_SELECTABLE_FIELDS = [
  "countsWorkingDays",
  "createdAt",
  "deletedAt",
  "eventId",
  "id",
  "note",
  "occurrenceId",
  "offsetDays",
  "position",
  "scheduleId",
  "updatedAt",
  "version",
] as const satisfies readonly ItemsKey[];

export const ITEMS_DEFAULT_SELECT_FIELDS = [
  "countsWorkingDays",
  "createdAt",
  "deletedAt",
  "eventId",
  "id",
  "note",
  "occurrenceId",
  "offsetDays",
  "position",
  "scheduleId",
  "updatedAt",
  "version",
] as const satisfies readonly ItemsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ITEMS_EDITABLE_FIELDS = [
  "countsWorkingDays",
  "eventId",
  "note",
  "occurrenceId",
  "offsetDays",
  "position",
  "scheduleId",
] as const satisfies readonly ItemsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ITEMS_AS_ONE_RELATION_CONFIG = {
  relation: "items",
  type: ERelationType.One,
  selectableFields: ITEMS_SELECTABLE_FIELDS,
  defaultSelectFields: ITEMS_DEFAULT_SELECT_FIELDS,
} as const satisfies IItemsAsOneRelationConfig;

export const ITEMS_AS_MANY_RELATION_CONFIG = {
  relation: "items",
  type: ERelationType.Many,
  selectableFields: ITEMS_SELECTABLE_FIELDS,
  defaultSelectFields: ITEMS_DEFAULT_SELECT_FIELDS,
  sortableFields: ITEMS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IItemsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ITEMS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ItemsRelationKey>().one(
    () => EventsConfig.EVENTS_AS_ONE_RELATION_CONFIG,
    "event",
  ),
  Q.createRelationKeyMapper<ItemsRelationKey>().one(
    () => OccurrencesConfig.OCCURRENCES_AS_ONE_RELATION_CONFIG,
    "occurrence",
  ),
  Q.createRelationKeyMapper<ItemsRelationKey>().one(
    () => SchedulesConfig.SCHEDULES_AS_ONE_RELATION_CONFIG,
    "schedule",
  ),
] as const;

export const ITEMS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ITEMS_QUERY_OPTIONS = {
  searchableFields: ITEMS_SEARCHABLE_FIELDS,
  selectableFields: ITEMS_SELECTABLE_FIELDS,
  defaultSelectFields: ITEMS_DEFAULT_SELECT_FIELDS,
  sortableFields: ITEMS_SORTABLE_FIELDS,
  filterFields: ITEMS_FILTERABLE_FIELDS,
  dateRangeFields: ITEMS_DATE_RANGE_FIELDS,
  relationKeys: ITEMS_RELATION_KEYS,
  editableFields: ITEMS_EDITABLE_FIELDS,
  asOne: ITEMS_AS_ONE_RELATION_CONFIG,
  asMany: ITEMS_AS_MANY_RELATION_CONFIG,
  oneRelations: ITEMS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ITEMS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IItems,
  ItemsSortableField,
  ItemsSelectableField,
  ItemsFilterableField,
  ItemsDateRangeField,
  ItemsRelationKey,
  typeof ITEMS_ONE_RELATION_QUERY_OPTIONS,
  typeof ITEMS_MANY_RELATION_QUERY_OPTIONS
>;
