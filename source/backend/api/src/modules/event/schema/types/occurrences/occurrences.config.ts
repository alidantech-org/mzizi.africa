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
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as EntitiesConfig from "#/modules/official/schema/types/entities/entities.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";
import * as FeaturesConfig from "#/modules/geography/schema/types/features/features.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IOccurrences,
  OccurrencesKey,
  OccurrencesRelationKey,
  OccurrencesSortableField,
  OccurrencesFilterableField,
  OccurrencesDateRangeField,
  OccurrencesSelectableField,
  IOccurrencesAsOneRelationConfig,
  IOccurrencesAsManyRelationConfig,
} from "./occurrences.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const OCCURRENCES_RELATION_KEYS = [
  "continuesOccurrence",
  "event",
  "format",
  "knowledge",
  "organiserEntity",
  "sourceCitation",
  "status",
  "venueFeature",
] as const satisfies readonly OccurrencesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const OCCURRENCES_SORTABLE_FIELDS = [
  "actualEndsOn",
  "actualStartsOn",
  "code",
  "continuesOccurrenceId",
  "createdAt",
  "deletedAt",
  "eventId",
  "formatId",
  "id",
  "isAllDay",
  "knowledgeId",
  "organiserEntityId",
  "plannedEndsOn",
  "plannedStartsOn",
  "sourceCitationId",
  "startsAt",
  "statusId",
  "timezone",
  "updatedAt",
  "venueFeatureId",
  "venueNote",
  "version",
] as const satisfies readonly OccurrencesKey[];

export const OCCURRENCES_SEARCHABLE_FIELDS = [
  "code",
  "timezone",
  "venueNote",
] as const satisfies readonly OccurrencesKey[];

export const OCCURRENCES_FILTERABLE_FIELDS = [
  "continuesOccurrenceId",
  "eventId",
  "formatId",
  "id",
  "isAllDay",
  "knowledgeId",
  "organiserEntityId",
  "sourceCitationId",
  "statusId",
  "venueFeatureId",
] as const satisfies readonly OccurrencesKey[];

export const OCCURRENCES_DATE_RANGE_FIELDS = [
  "actualEndsOn",
  "actualStartsOn",
  "createdAt",
  "deletedAt",
  "plannedEndsOn",
  "plannedStartsOn",
  "startsAt",
  "updatedAt",
] as const satisfies readonly OccurrencesKey[];

export const OCCURRENCES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IOccurrences> = {
  searchableFields: [...OCCURRENCES_SEARCHABLE_FIELDS],
  filterFields: [...OCCURRENCES_FILTERABLE_FIELDS],
  dateRangeFields: [...OCCURRENCES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const OCCURRENCES_SELECTABLE_FIELDS = [
  "actualEndsOn",
  "actualStartsOn",
  "code",
  "continuesOccurrenceId",
  "createdAt",
  "deletedAt",
  "eventId",
  "formatId",
  "id",
  "isAllDay",
  "knowledgeId",
  "organiserEntityId",
  "plannedEndsOn",
  "plannedStartsOn",
  "sourceCitationId",
  "startsAt",
  "statusId",
  "timezone",
  "updatedAt",
  "venueFeatureId",
  "venueNote",
  "version",
] as const satisfies readonly OccurrencesKey[];

export const OCCURRENCES_DEFAULT_SELECT_FIELDS = [
  "actualEndsOn",
  "actualStartsOn",
  "code",
  "continuesOccurrenceId",
  "createdAt",
  "deletedAt",
  "eventId",
  "formatId",
  "id",
  "isAllDay",
  "knowledgeId",
  "organiserEntityId",
  "plannedEndsOn",
  "plannedStartsOn",
  "sourceCitationId",
  "startsAt",
  "statusId",
  "timezone",
  "updatedAt",
  "venueFeatureId",
  "venueNote",
  "version",
] as const satisfies readonly OccurrencesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const OCCURRENCES_EDITABLE_FIELDS = [
  "actualEndsOn",
  "actualStartsOn",
  "code",
  "continuesOccurrenceId",
  "eventId",
  "formatId",
  "isAllDay",
  "knowledgeId",
  "organiserEntityId",
  "plannedEndsOn",
  "plannedStartsOn",
  "sourceCitationId",
  "startsAt",
  "statusId",
  "timezone",
  "venueFeatureId",
  "venueNote",
] as const satisfies readonly OccurrencesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const OCCURRENCES_AS_ONE_RELATION_CONFIG = {
  relation: "occurrences",
  type: ERelationType.One,
  selectableFields: OCCURRENCES_SELECTABLE_FIELDS,
  defaultSelectFields: OCCURRENCES_DEFAULT_SELECT_FIELDS,
} as const satisfies IOccurrencesAsOneRelationConfig;

export const OCCURRENCES_AS_MANY_RELATION_CONFIG = {
  relation: "occurrences",
  type: ERelationType.Many,
  selectableFields: OCCURRENCES_SELECTABLE_FIELDS,
  defaultSelectFields: OCCURRENCES_DEFAULT_SELECT_FIELDS,
  sortableFields: OCCURRENCES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IOccurrencesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const OCCURRENCES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<OccurrencesRelationKey>().one(
    () => EventsConfig.EVENTS_AS_ONE_RELATION_CONFIG,
    "event",
  ),
  Q.createRelationKeyMapper<OccurrencesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "format",
  ),
  Q.createRelationKeyMapper<OccurrencesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "knowledge",
  ),
  Q.createRelationKeyMapper<OccurrencesRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "organiserEntity",
  ),
  Q.createRelationKeyMapper<OccurrencesRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<OccurrencesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "status",
  ),
  Q.createRelationKeyMapper<OccurrencesRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "venueFeature",
  ),
] as const;

export const OCCURRENCES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const OCCURRENCES_QUERY_OPTIONS = {
  searchableFields: OCCURRENCES_SEARCHABLE_FIELDS,
  selectableFields: OCCURRENCES_SELECTABLE_FIELDS,
  defaultSelectFields: OCCURRENCES_DEFAULT_SELECT_FIELDS,
  sortableFields: OCCURRENCES_SORTABLE_FIELDS,
  filterFields: OCCURRENCES_FILTERABLE_FIELDS,
  dateRangeFields: OCCURRENCES_DATE_RANGE_FIELDS,
  relationKeys: OCCURRENCES_RELATION_KEYS,
  editableFields: OCCURRENCES_EDITABLE_FIELDS,
  asOne: OCCURRENCES_AS_ONE_RELATION_CONFIG,
  asMany: OCCURRENCES_AS_MANY_RELATION_CONFIG,
  oneRelations: OCCURRENCES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: OCCURRENCES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IOccurrences,
  OccurrencesSortableField,
  OccurrencesSelectableField,
  OccurrencesFilterableField,
  OccurrencesDateRangeField,
  OccurrencesRelationKey,
  typeof OCCURRENCES_ONE_RELATION_QUERY_OPTIONS,
  typeof OCCURRENCES_MANY_RELATION_QUERY_OPTIONS
>;
