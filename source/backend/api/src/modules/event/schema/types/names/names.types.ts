// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as EventsTypes from "#/modules/event/schema/types/events/events.types";
import type * as LanguageTypes from "#/modules/reference/schema/types/language/language.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  NAMES_RELATION_KEYS,
  NAMES_SORTABLE_FIELDS,
  NAMES_SEARCHABLE_FIELDS,
  NAMES_FILTERABLE_FIELDS,
  NAMES_DATE_RANGE_FIELDS,
  NAMES_SELECTABLE_FIELDS,
  NAMES_DEFAULT_SELECT_FIELDS,
  NAMES_EDITABLE_FIELDS,
} from "./names.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** The name of an event in one language; at most one preferred name per event and language. */
export interface INames extends B.IBase {
  eventId: string;
  isPreferred: boolean;
  languageId: string;
  name: string;
  readonly event?: EventsTypes.IEvents;
  readonly language?: LanguageTypes.ILanguage;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type NamesKey = keyof INames;

export type NamesRelationKey = (typeof NAMES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type INamesReadonlyFields = B.IBaseReadonlyFields;

export type INamesContextualFields = never;

export type INamesSensitiveFields = never;

export type INamesTransitionFields = never;

export type INamesImmutableFields =
  INamesReadonlyFields | INamesContextualFields | INamesSensitiveFields | INamesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type INamesCreatable = Omit<INames, INamesImmutableFields | NamesRelationKey>;

export type INamesSystemWritable = Omit<INames, B.IBaseReadonlyFields | NamesRelationKey>;

export type INamesUpdatable = Partial<Omit<INames, INamesImmutableFields | NamesRelationKey>>;

export interface INamesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type NamesSortableField = (typeof NAMES_SORTABLE_FIELDS)[number];

export type NamesSearchableField = (typeof NAMES_SEARCHABLE_FIELDS)[number];

export type NamesFilterableField = (typeof NAMES_FILTERABLE_FIELDS)[number];

export type NamesDateRangeField = (typeof NAMES_DATE_RANGE_FIELDS)[number];

export type NamesSelectableField = (typeof NAMES_SELECTABLE_FIELDS)[number];

export type NamesDefaultSelectField = (typeof NAMES_DEFAULT_SELECT_FIELDS)[number];

export type NamesEditableField = (typeof NAMES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type INamesAsOneRelationConfig = Q.IOneRelationConfig<"names", NamesSelectableField>;

export type INamesAsManyRelationConfig = Q.IManyRelationConfig<
  "names",
  NamesSelectableField,
  NamesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type INamesAsOneRelationQuery = Q.IAsOneRelationQuery<INames, NamesSelectableField>;

export type INamesAsManyRelationQuery = Q.IAsManyRelationQuery<
  INames,
  NamesSelectableField,
  NamesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface INamesRelationMap extends Record<NamesRelationKey, unknown> {
  event: EventsTypes.IEventsAsOneRelationQuery;
  language: LanguageTypes.ILanguageAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type INamesRelationQueries = Q.IBaseRelationQueries<
  INames,
  NamesRelationKey,
  INamesRelationMap
>;

export type INamesItemQuery = Q.IBaseItemQuery<
  INames,
  NamesRelationKey,
  NamesSelectableField,
  NamesRelationKey,
  NamesSelectableField,
  INamesRelationMap,
  INamesRelationQueries
>;

export type INamesListQuery = Q.IBaseListQuery<
  INames,
  NamesRelationKey,
  NamesSelectableField,
  NamesSortableField,
  NamesRelationKey,
  NamesSelectableField,
  NamesSortableField,
  NamesDateRangeField,
  NamesFilterableField,
  INamesRelationMap,
  INamesRelationQueries,
  INamesItemQuery
>;
