// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";
import type * as OccurrencesTypes from "#/modules/event/schema/types/occurrences/occurrences.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  VENUES_RELATION_KEYS,
  VENUES_SORTABLE_FIELDS,
  VENUES_SEARCHABLE_FIELDS,
  VENUES_FILTERABLE_FIELDS,
  VENUES_DATE_RANGE_FIELDS,
  VENUES_SELECTABLE_FIELDS,
  VENUES_DEFAULT_SELECT_FIELDS,
  VENUES_EDITABLE_FIELDS,
} from "./venues.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One place an occurrence happens at. An occurrence can have many: a national election covers every county and polling place. */
export interface IVenues extends B.IBase {
  featureId: string;
  note: string | null;
  occurrenceId: string;
  roleId: string;
  readonly feature?: FeaturesTypes.IFeatures;
  readonly occurrence?: OccurrencesTypes.IOccurrences;
  readonly role?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type VenuesKey = keyof IVenues;

export type VenuesRelationKey = (typeof VENUES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IVenuesReadonlyFields = B.IBaseReadonlyFields;

export type IVenuesContextualFields = never;

export type IVenuesSensitiveFields = never;

export type IVenuesTransitionFields = never;

export type IVenuesImmutableFields =
  | IVenuesReadonlyFields
  | IVenuesContextualFields
  | IVenuesSensitiveFields
  | IVenuesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IVenuesCreatable = Omit<IVenues, IVenuesImmutableFields | VenuesRelationKey>;

export type IVenuesSystemWritable = Omit<IVenues, B.IBaseReadonlyFields | VenuesRelationKey>;

export type IVenuesUpdatable = Partial<Omit<IVenues, IVenuesImmutableFields | VenuesRelationKey>>;

export interface IVenuesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type VenuesSortableField = (typeof VENUES_SORTABLE_FIELDS)[number];

export type VenuesSearchableField = (typeof VENUES_SEARCHABLE_FIELDS)[number];

export type VenuesFilterableField = (typeof VENUES_FILTERABLE_FIELDS)[number];

export type VenuesDateRangeField = (typeof VENUES_DATE_RANGE_FIELDS)[number];

export type VenuesSelectableField = (typeof VENUES_SELECTABLE_FIELDS)[number];

export type VenuesDefaultSelectField = (typeof VENUES_DEFAULT_SELECT_FIELDS)[number];

export type VenuesEditableField = (typeof VENUES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IVenuesAsOneRelationConfig = Q.IOneRelationConfig<"venues", VenuesSelectableField>;

export type IVenuesAsManyRelationConfig = Q.IManyRelationConfig<
  "venues",
  VenuesSelectableField,
  VenuesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IVenuesAsOneRelationQuery = Q.IAsOneRelationQuery<IVenues, VenuesSelectableField>;

export type IVenuesAsManyRelationQuery = Q.IAsManyRelationQuery<
  IVenues,
  VenuesSelectableField,
  VenuesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IVenuesRelationMap extends Record<VenuesRelationKey, unknown> {
  feature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  occurrence: OccurrencesTypes.IOccurrencesAsOneRelationQuery;
  role: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IVenuesRelationQueries = Q.IBaseRelationQueries<
  IVenues,
  VenuesRelationKey,
  IVenuesRelationMap
>;

export type IVenuesItemQuery = Q.IBaseItemQuery<
  IVenues,
  VenuesRelationKey,
  VenuesSelectableField,
  VenuesRelationKey,
  VenuesSelectableField,
  IVenuesRelationMap,
  IVenuesRelationQueries
>;

export type IVenuesListQuery = Q.IBaseListQuery<
  IVenues,
  VenuesRelationKey,
  VenuesSelectableField,
  VenuesSortableField,
  VenuesRelationKey,
  VenuesSelectableField,
  VenuesSortableField,
  VenuesDateRangeField,
  VenuesFilterableField,
  IVenuesRelationMap,
  IVenuesRelationQueries,
  IVenuesItemQuery
>;
