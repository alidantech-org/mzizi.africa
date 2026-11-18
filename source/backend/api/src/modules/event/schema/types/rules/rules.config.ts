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
import * as EventsConfig from "#/modules/event/schema/types/events/events.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IRules,
  RulesKey,
  RulesRelationKey,
  RulesSortableField,
  RulesFilterableField,
  RulesDateRangeField,
  RulesSelectableField,
  IRulesAsOneRelationConfig,
  IRulesAsManyRelationConfig,
} from "./rules.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const RULES_RELATION_KEYS = [
  "adjustment",
  "event",
  "ruleKind",
  "sourceCitation",
] as const satisfies readonly RulesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const RULES_SORTABLE_FIELDS = [
  "adjustmentId",
  "anchorOn",
  "createdAt",
  "dayOfMonth",
  "deletedAt",
  "eventId",
  "fromToPrecision",
  "fromYear",
  "id",
  "intervalYears",
  "month",
  "nthWeekday",
  "rrule",
  "ruleKindId",
  "sourceCitationId",
  "toYear",
  "updatedAt",
  "version",
  "weekday",
] as const satisfies readonly RulesKey[];

export const RULES_SEARCHABLE_FIELDS = ["rrule"] as const satisfies readonly RulesKey[];

export const RULES_FILTERABLE_FIELDS = [
  "adjustmentId",
  "eventId",
  "fromToPrecision",
  "id",
  "ruleKindId",
  "sourceCitationId",
] as const satisfies readonly RulesKey[];

export const RULES_DATE_RANGE_FIELDS = [
  "anchorOn",
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly RulesKey[];

export const RULES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IRules> = {
  searchableFields: [...RULES_SEARCHABLE_FIELDS],
  filterFields: [...RULES_FILTERABLE_FIELDS],
  dateRangeFields: [...RULES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const RULES_SELECTABLE_FIELDS = [
  "adjustmentId",
  "anchorOn",
  "createdAt",
  "dayOfMonth",
  "deletedAt",
  "eventId",
  "fromToPrecision",
  "fromYear",
  "id",
  "intervalYears",
  "month",
  "nthWeekday",
  "rrule",
  "ruleKindId",
  "sourceCitationId",
  "toYear",
  "updatedAt",
  "version",
  "weekday",
] as const satisfies readonly RulesKey[];

export const RULES_DEFAULT_SELECT_FIELDS = [
  "adjustmentId",
  "anchorOn",
  "createdAt",
  "dayOfMonth",
  "deletedAt",
  "eventId",
  "fromToPrecision",
  "fromYear",
  "id",
  "intervalYears",
  "month",
  "nthWeekday",
  "rrule",
  "ruleKindId",
  "sourceCitationId",
  "toYear",
  "updatedAt",
  "version",
  "weekday",
] as const satisfies readonly RulesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const RULES_EDITABLE_FIELDS = [
  "adjustmentId",
  "anchorOn",
  "dayOfMonth",
  "eventId",
  "fromToPrecision",
  "fromYear",
  "intervalYears",
  "month",
  "nthWeekday",
  "rrule",
  "ruleKindId",
  "sourceCitationId",
  "toYear",
  "weekday",
] as const satisfies readonly RulesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const RULES_AS_ONE_RELATION_CONFIG = {
  relation: "rules",
  type: ERelationType.One,
  selectableFields: RULES_SELECTABLE_FIELDS,
  defaultSelectFields: RULES_DEFAULT_SELECT_FIELDS,
} as const satisfies IRulesAsOneRelationConfig;

export const RULES_AS_MANY_RELATION_CONFIG = {
  relation: "rules",
  type: ERelationType.Many,
  selectableFields: RULES_SELECTABLE_FIELDS,
  defaultSelectFields: RULES_DEFAULT_SELECT_FIELDS,
  sortableFields: RULES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IRulesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const RULES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<RulesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "adjustment",
  ),
  Q.createRelationKeyMapper<RulesRelationKey>().one(
    () => EventsConfig.EVENTS_AS_ONE_RELATION_CONFIG,
    "event",
  ),
  Q.createRelationKeyMapper<RulesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "ruleKind",
  ),
  Q.createRelationKeyMapper<RulesRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const RULES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const RULES_QUERY_OPTIONS = {
  searchableFields: RULES_SEARCHABLE_FIELDS,
  selectableFields: RULES_SELECTABLE_FIELDS,
  defaultSelectFields: RULES_DEFAULT_SELECT_FIELDS,
  sortableFields: RULES_SORTABLE_FIELDS,
  filterFields: RULES_FILTERABLE_FIELDS,
  dateRangeFields: RULES_DATE_RANGE_FIELDS,
  relationKeys: RULES_RELATION_KEYS,
  editableFields: RULES_EDITABLE_FIELDS,
  asOne: RULES_AS_ONE_RELATION_CONFIG,
  asMany: RULES_AS_MANY_RELATION_CONFIG,
  oneRelations: RULES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: RULES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IRules,
  RulesSortableField,
  RulesSelectableField,
  RulesFilterableField,
  RulesDateRangeField,
  RulesRelationKey,
  typeof RULES_ONE_RELATION_QUERY_OPTIONS,
  typeof RULES_MANY_RELATION_QUERY_OPTIONS
>;
