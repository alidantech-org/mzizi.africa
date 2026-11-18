// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as CountryConfig from "#/modules/reference/schema/types/country/country.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ICalendars,
  CalendarsKey,
  CalendarsRelationKey,
  CalendarsSortableField,
  CalendarsFilterableField,
  CalendarsDateRangeField,
  CalendarsSelectableField,
  ICalendarsAsOneRelationConfig,
  ICalendarsAsManyRelationConfig,
} from "./calendars.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const CALENDARS_RELATION_KEYS = [
  "calendarKind",
  "country",
  "sourceCitation",
] as const satisfies readonly CalendarsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const CALENDARS_SORTABLE_FIELDS = [
  "calendarKindId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "description",
  "id",
  "isObserved",
  "sourceCitationId",
  "updatedAt",
  "version",
  "yearStartDay",
  "yearStartMonth",
] as const satisfies readonly CalendarsKey[];

export const CALENDARS_SEARCHABLE_FIELDS = [
  "code",
  "description",
] as const satisfies readonly CalendarsKey[];

export const CALENDARS_FILTERABLE_FIELDS = [
  "calendarKindId",
  "countryId",
  "id",
  "isObserved",
  "sourceCitationId",
] as const satisfies readonly CalendarsKey[];

export const CALENDARS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly CalendarsKey[];

export const CALENDARS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<ICalendars> = {
  searchableFields: [...CALENDARS_SEARCHABLE_FIELDS],
  filterFields: [...CALENDARS_FILTERABLE_FIELDS],
  dateRangeFields: [...CALENDARS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const CALENDARS_SELECTABLE_FIELDS = [
  "calendarKindId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "description",
  "id",
  "isObserved",
  "sourceCitationId",
  "updatedAt",
  "version",
  "yearStartDay",
  "yearStartMonth",
] as const satisfies readonly CalendarsKey[];

export const CALENDARS_DEFAULT_SELECT_FIELDS = [
  "calendarKindId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "description",
  "id",
  "isObserved",
  "sourceCitationId",
  "updatedAt",
  "version",
  "yearStartDay",
  "yearStartMonth",
] as const satisfies readonly CalendarsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const CALENDARS_EDITABLE_FIELDS = [
  "calendarKindId",
  "code",
  "countryId",
  "description",
  "isObserved",
  "sourceCitationId",
  "yearStartDay",
  "yearStartMonth",
] as const satisfies readonly CalendarsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const CALENDARS_AS_ONE_RELATION_CONFIG = {
  relation: "calendars",
  type: ERelationType.One,
  selectableFields: CALENDARS_SELECTABLE_FIELDS,
  defaultSelectFields: CALENDARS_DEFAULT_SELECT_FIELDS,
} as const satisfies ICalendarsAsOneRelationConfig;

export const CALENDARS_AS_MANY_RELATION_CONFIG = {
  relation: "calendars",
  type: ERelationType.Many,
  selectableFields: CALENDARS_SELECTABLE_FIELDS,
  defaultSelectFields: CALENDARS_DEFAULT_SELECT_FIELDS,
  sortableFields: CALENDARS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies ICalendarsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const CALENDARS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<CalendarsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "calendarKind",
  ),
  Q.createRelationKeyMapper<CalendarsRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<CalendarsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const CALENDARS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const CALENDARS_QUERY_OPTIONS = {
  searchableFields: CALENDARS_SEARCHABLE_FIELDS,
  selectableFields: CALENDARS_SELECTABLE_FIELDS,
  defaultSelectFields: CALENDARS_DEFAULT_SELECT_FIELDS,
  sortableFields: CALENDARS_SORTABLE_FIELDS,
  filterFields: CALENDARS_FILTERABLE_FIELDS,
  dateRangeFields: CALENDARS_DATE_RANGE_FIELDS,
  relationKeys: CALENDARS_RELATION_KEYS,
  editableFields: CALENDARS_EDITABLE_FIELDS,
  asOne: CALENDARS_AS_ONE_RELATION_CONFIG,
  asMany: CALENDARS_AS_MANY_RELATION_CONFIG,
  oneRelations: CALENDARS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: CALENDARS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  ICalendars,
  CalendarsSortableField,
  CalendarsSelectableField,
  CalendarsFilterableField,
  CalendarsDateRangeField,
  CalendarsRelationKey,
  typeof CALENDARS_ONE_RELATION_QUERY_OPTIONS,
  typeof CALENDARS_MANY_RELATION_QUERY_OPTIONS
>;
