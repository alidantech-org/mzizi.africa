// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as EventsTypes from "#/modules/event/schema/types/events/events.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  RULES_RELATION_KEYS,
  RULES_SORTABLE_FIELDS,
  RULES_SEARCHABLE_FIELDS,
  RULES_FILTERABLE_FIELDS,
  RULES_DATE_RANGE_FIELDS,
  RULES_SELECTABLE_FIELDS,
  RULES_DEFAULT_SELECT_FIELDS,
  RULES_EDITABLE_FIELDS,
} from "./rules.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** How the dates of an event are produced, with the adjustment the law applies when a date falls on a rest day. Occurrences generated from a rule are projected until announced. */
export interface IRules extends B.IBase {
  adjustmentId: string | null;
  anchorOn: Date | null;
  dayOfMonth: number | null;
  eventId: string;
  fromToPrecision: DatePrecision | null;
  fromYear: number | null;
  intervalYears: number | null;
  month: number | null;
  nthWeekday: number | null;
  rrule: string | null;
  ruleKindId: string;
  sourceCitationId: string | null;
  toYear: number | null;
  weekday: number | null;
  readonly adjustment?: ValueTypes.IValue;
  readonly event?: EventsTypes.IEvents;
  readonly ruleKind?: ValueTypes.IValue;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type RulesKey = keyof IRules;

export type RulesRelationKey = (typeof RULES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IRulesReadonlyFields = B.IBaseReadonlyFields;

export type IRulesContextualFields = never;

export type IRulesSensitiveFields = never;

export type IRulesTransitionFields = never;

export type IRulesImmutableFields =
  IRulesReadonlyFields | IRulesContextualFields | IRulesSensitiveFields | IRulesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IRulesCreatable = Omit<IRules, IRulesImmutableFields | RulesRelationKey>;

export type IRulesSystemWritable = Omit<IRules, B.IBaseReadonlyFields | RulesRelationKey>;

export type IRulesUpdatable = Partial<Omit<IRules, IRulesImmutableFields | RulesRelationKey>>;

export interface IRulesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type RulesSortableField = (typeof RULES_SORTABLE_FIELDS)[number];

export type RulesSearchableField = (typeof RULES_SEARCHABLE_FIELDS)[number];

export type RulesFilterableField = (typeof RULES_FILTERABLE_FIELDS)[number];

export type RulesDateRangeField = (typeof RULES_DATE_RANGE_FIELDS)[number];

export type RulesSelectableField = (typeof RULES_SELECTABLE_FIELDS)[number];

export type RulesDefaultSelectField = (typeof RULES_DEFAULT_SELECT_FIELDS)[number];

export type RulesEditableField = (typeof RULES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IRulesAsOneRelationConfig = Q.IOneRelationConfig<"rules", RulesSelectableField>;

export type IRulesAsManyRelationConfig = Q.IManyRelationConfig<
  "rules",
  RulesSelectableField,
  RulesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IRulesAsOneRelationQuery = Q.IAsOneRelationQuery<IRules, RulesSelectableField>;

export type IRulesAsManyRelationQuery = Q.IAsManyRelationQuery<
  IRules,
  RulesSelectableField,
  RulesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IRulesRelationMap extends Record<RulesRelationKey, unknown> {
  adjustment: ValueTypes.IValueAsOneRelationQuery;
  event: EventsTypes.IEventsAsOneRelationQuery;
  ruleKind: ValueTypes.IValueAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IRulesRelationQueries = Q.IBaseRelationQueries<
  IRules,
  RulesRelationKey,
  IRulesRelationMap
>;

export type IRulesItemQuery = Q.IBaseItemQuery<
  IRules,
  RulesRelationKey,
  RulesSelectableField,
  RulesRelationKey,
  RulesSelectableField,
  IRulesRelationMap,
  IRulesRelationQueries
>;

export type IRulesListQuery = Q.IBaseListQuery<
  IRules,
  RulesRelationKey,
  RulesSelectableField,
  RulesSortableField,
  RulesRelationKey,
  RulesSelectableField,
  RulesSortableField,
  RulesDateRangeField,
  RulesFilterableField,
  IRulesRelationMap,
  IRulesRelationQueries,
  IRulesItemQuery
>;
