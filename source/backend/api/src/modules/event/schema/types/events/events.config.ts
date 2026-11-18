// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ProvisionsConfig from "#/modules/legal/schema/types/provisions/provisions.config";
import * as CalendarsConfig from "#/modules/event/schema/types/calendars/calendars.config";
import * as CountryConfig from "#/modules/reference/schema/types/country/country.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as EntitiesConfig from "#/modules/official/schema/types/entities/entities.config";
import * as FeaturesConfig from "#/modules/geography/schema/types/features/features.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IEvents,
  EventsKey,
  EventsRelationKey,
  EventsSortableField,
  EventsFilterableField,
  EventsDateRangeField,
  EventsSelectableField,
  IEventsAsOneRelationConfig,
  IEventsAsManyRelationConfig,
} from "./events.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const EVENTS_RELATION_KEYS = [
  "basisProvision",
  "calendar",
  "country",
  "eventKind",
  "organiserEntity",
  "scopeFeature",
  "scopeLevelKind",
  "sourceCitation",
] as const satisfies readonly EventsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const EVENTS_SORTABLE_FIELDS = [
  "basisProvisionId",
  "calendarId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "eventKindId",
  "id",
  "organiserEntityId",
  "scopeFeatureId",
  "scopeLevelKindId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly EventsKey[];

export const EVENTS_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly EventsKey[];

export const EVENTS_FILTERABLE_FIELDS = [
  "basisProvisionId",
  "calendarId",
  "countryId",
  "eventKindId",
  "id",
  "organiserEntityId",
  "scopeFeatureId",
  "scopeLevelKindId",
  "sourceCitationId",
] as const satisfies readonly EventsKey[];

export const EVENTS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly EventsKey[];

export const EVENTS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IEvents> = {
  searchableFields: [...EVENTS_SEARCHABLE_FIELDS],
  filterFields: [...EVENTS_FILTERABLE_FIELDS],
  dateRangeFields: [...EVENTS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const EVENTS_SELECTABLE_FIELDS = [
  "basisProvisionId",
  "calendarId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "eventKindId",
  "id",
  "organiserEntityId",
  "scopeFeatureId",
  "scopeLevelKindId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly EventsKey[];

export const EVENTS_DEFAULT_SELECT_FIELDS = [
  "basisProvisionId",
  "calendarId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "eventKindId",
  "id",
  "organiserEntityId",
  "scopeFeatureId",
  "scopeLevelKindId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly EventsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const EVENTS_EDITABLE_FIELDS = [
  "basisProvisionId",
  "calendarId",
  "code",
  "countryId",
  "eventKindId",
  "organiserEntityId",
  "scopeFeatureId",
  "scopeLevelKindId",
  "sourceCitationId",
] as const satisfies readonly EventsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const EVENTS_AS_ONE_RELATION_CONFIG = {
  relation: "events",
  type: ERelationType.One,
  selectableFields: EVENTS_SELECTABLE_FIELDS,
  defaultSelectFields: EVENTS_DEFAULT_SELECT_FIELDS,
} as const satisfies IEventsAsOneRelationConfig;

export const EVENTS_AS_MANY_RELATION_CONFIG = {
  relation: "events",
  type: ERelationType.Many,
  selectableFields: EVENTS_SELECTABLE_FIELDS,
  defaultSelectFields: EVENTS_DEFAULT_SELECT_FIELDS,
  sortableFields: EVENTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IEventsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const EVENTS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<EventsRelationKey>().one(
    () => ProvisionsConfig.PROVISIONS_AS_ONE_RELATION_CONFIG,
    "basisProvision",
  ),
  Q.createRelationKeyMapper<EventsRelationKey>().one(
    () => CalendarsConfig.CALENDARS_AS_ONE_RELATION_CONFIG,
    "calendar",
  ),
  Q.createRelationKeyMapper<EventsRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<EventsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "eventKind",
  ),
  Q.createRelationKeyMapper<EventsRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "organiserEntity",
  ),
  Q.createRelationKeyMapper<EventsRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "scopeFeature",
  ),
  Q.createRelationKeyMapper<EventsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "scopeLevelKind",
  ),
  Q.createRelationKeyMapper<EventsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const EVENTS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const EVENTS_QUERY_OPTIONS = {
  searchableFields: EVENTS_SEARCHABLE_FIELDS,
  selectableFields: EVENTS_SELECTABLE_FIELDS,
  defaultSelectFields: EVENTS_DEFAULT_SELECT_FIELDS,
  sortableFields: EVENTS_SORTABLE_FIELDS,
  filterFields: EVENTS_FILTERABLE_FIELDS,
  dateRangeFields: EVENTS_DATE_RANGE_FIELDS,
  relationKeys: EVENTS_RELATION_KEYS,
  editableFields: EVENTS_EDITABLE_FIELDS,
  asOne: EVENTS_AS_ONE_RELATION_CONFIG,
  asMany: EVENTS_AS_MANY_RELATION_CONFIG,
  oneRelations: EVENTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: EVENTS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IEvents,
  EventsSortableField,
  EventsSelectableField,
  EventsFilterableField,
  EventsDateRangeField,
  EventsRelationKey,
  typeof EVENTS_ONE_RELATION_QUERY_OPTIONS,
  typeof EVENTS_MANY_RELATION_QUERY_OPTIONS
>;
