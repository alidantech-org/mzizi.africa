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
import * as ProvisionsConfig from "#/modules/legal/schema/types/provisions/provisions.config";
import * as CountryConfig from "#/modules/reference/schema/types/country/country.config";
import * as EntitiesConfig from "#/modules/official/schema/types/entities/entities.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ISchedules,
  SchedulesKey,
  SchedulesRelationKey,
  SchedulesSortableField,
  SchedulesFilterableField,
  SchedulesDateRangeField,
  SchedulesSelectableField,
  ISchedulesAsOneRelationConfig,
  ISchedulesAsManyRelationConfig,
} from "./schedules.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SCHEDULES_RELATION_KEYS = [
  "anchorEvent",
  "basisProvision",
  "country",
  "issuerEntity",
  "scheduleKind",
  "sourceCitation",
  "status",
  "supersedesSchedule",
] as const satisfies readonly SchedulesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SCHEDULES_SORTABLE_FIELDS = [
  "anchorEventId",
  "anchorOn",
  "basisProvisionId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "id",
  "issuerEntityId",
  "publishedOn",
  "scheduleKindId",
  "sourceCitationId",
  "statusId",
  "supersedesScheduleId",
  "updatedAt",
  "version",
] as const satisfies readonly SchedulesKey[];

export const SCHEDULES_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly SchedulesKey[];

export const SCHEDULES_FILTERABLE_FIELDS = [
  "anchorEventId",
  "basisProvisionId",
  "countryId",
  "id",
  "issuerEntityId",
  "scheduleKindId",
  "sourceCitationId",
  "statusId",
  "supersedesScheduleId",
] as const satisfies readonly SchedulesKey[];

export const SCHEDULES_DATE_RANGE_FIELDS = [
  "anchorOn",
  "createdAt",
  "deletedAt",
  "publishedOn",
  "updatedAt",
] as const satisfies readonly SchedulesKey[];

export const SCHEDULES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<ISchedules> = {
  searchableFields: [...SCHEDULES_SEARCHABLE_FIELDS],
  filterFields: [...SCHEDULES_FILTERABLE_FIELDS],
  dateRangeFields: [...SCHEDULES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SCHEDULES_SELECTABLE_FIELDS = [
  "anchorEventId",
  "anchorOn",
  "basisProvisionId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "id",
  "issuerEntityId",
  "publishedOn",
  "scheduleKindId",
  "sourceCitationId",
  "statusId",
  "supersedesScheduleId",
  "updatedAt",
  "version",
] as const satisfies readonly SchedulesKey[];

export const SCHEDULES_DEFAULT_SELECT_FIELDS = [
  "anchorEventId",
  "anchorOn",
  "basisProvisionId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "id",
  "issuerEntityId",
  "publishedOn",
  "scheduleKindId",
  "sourceCitationId",
  "statusId",
  "supersedesScheduleId",
  "updatedAt",
  "version",
] as const satisfies readonly SchedulesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SCHEDULES_EDITABLE_FIELDS = [
  "anchorEventId",
  "anchorOn",
  "basisProvisionId",
  "code",
  "countryId",
  "issuerEntityId",
  "publishedOn",
  "scheduleKindId",
  "sourceCitationId",
  "statusId",
  "supersedesScheduleId",
] as const satisfies readonly SchedulesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SCHEDULES_AS_ONE_RELATION_CONFIG = {
  relation: "schedules",
  type: ERelationType.One,
  selectableFields: SCHEDULES_SELECTABLE_FIELDS,
  defaultSelectFields: SCHEDULES_DEFAULT_SELECT_FIELDS,
} as const satisfies ISchedulesAsOneRelationConfig;

export const SCHEDULES_AS_MANY_RELATION_CONFIG = {
  relation: "schedules",
  type: ERelationType.Many,
  selectableFields: SCHEDULES_SELECTABLE_FIELDS,
  defaultSelectFields: SCHEDULES_DEFAULT_SELECT_FIELDS,
  sortableFields: SCHEDULES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies ISchedulesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SCHEDULES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<SchedulesRelationKey>().one(
    () => EventsConfig.EVENTS_AS_ONE_RELATION_CONFIG,
    "anchorEvent",
  ),
  Q.createRelationKeyMapper<SchedulesRelationKey>().one(
    () => ProvisionsConfig.PROVISIONS_AS_ONE_RELATION_CONFIG,
    "basisProvision",
  ),
  Q.createRelationKeyMapper<SchedulesRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<SchedulesRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "issuerEntity",
  ),
  Q.createRelationKeyMapper<SchedulesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "scheduleKind",
  ),
  Q.createRelationKeyMapper<SchedulesRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<SchedulesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "status",
  ),
] as const;

export const SCHEDULES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SCHEDULES_QUERY_OPTIONS = {
  searchableFields: SCHEDULES_SEARCHABLE_FIELDS,
  selectableFields: SCHEDULES_SELECTABLE_FIELDS,
  defaultSelectFields: SCHEDULES_DEFAULT_SELECT_FIELDS,
  sortableFields: SCHEDULES_SORTABLE_FIELDS,
  filterFields: SCHEDULES_FILTERABLE_FIELDS,
  dateRangeFields: SCHEDULES_DATE_RANGE_FIELDS,
  relationKeys: SCHEDULES_RELATION_KEYS,
  editableFields: SCHEDULES_EDITABLE_FIELDS,
  asOne: SCHEDULES_AS_ONE_RELATION_CONFIG,
  asMany: SCHEDULES_AS_MANY_RELATION_CONFIG,
  oneRelations: SCHEDULES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SCHEDULES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  ISchedules,
  SchedulesSortableField,
  SchedulesSelectableField,
  SchedulesFilterableField,
  SchedulesDateRangeField,
  SchedulesRelationKey,
  typeof SCHEDULES_ONE_RELATION_QUERY_OPTIONS,
  typeof SCHEDULES_MANY_RELATION_QUERY_OPTIONS
>;
