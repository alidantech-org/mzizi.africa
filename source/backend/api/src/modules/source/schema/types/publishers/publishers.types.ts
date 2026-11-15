// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PUBLISHERS_RELATION_KEYS,
  PUBLISHERS_SORTABLE_FIELDS,
  PUBLISHERS_SEARCHABLE_FIELDS,
  PUBLISHERS_FILTERABLE_FIELDS,
  PUBLISHERS_DATE_RANGE_FIELDS,
  PUBLISHERS_SELECTABLE_FIELDS,
  PUBLISHERS_DEFAULT_SELECT_FIELDS,
  PUBLISHERS_EDITABLE_FIELDS,
} from "./publishers.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Accepted publisher; an optional official identity distinguishes organization from publication channel. */
export interface IPublishers extends B.IBase {
  code: string;
  countryId: string | null;
  kindId: string;
  name: string;
  officialEntityId: string | null;
  readonly country?: CountryTypes.ICountry;
  readonly kind?: ValueTypes.IValue;
  readonly officialEntity?: EntitiesTypes.IEntities;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PublishersKey = keyof IPublishers;

export type PublishersRelationKey = (typeof PUBLISHERS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPublishersReadonlyFields = B.IBaseReadonlyFields;

export type IPublishersContextualFields = never;

export type IPublishersSensitiveFields = never;

export type IPublishersTransitionFields = never;

export type IPublishersImmutableFields =
  | IPublishersReadonlyFields
  | IPublishersContextualFields
  | IPublishersSensitiveFields
  | IPublishersTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPublishersCreatable = Omit<
  IPublishers,
  IPublishersImmutableFields | PublishersRelationKey
>;

export type IPublishersSystemWritable = Omit<
  IPublishers,
  B.IBaseReadonlyFields | PublishersRelationKey
>;

export type IPublishersUpdatable = Partial<
  Omit<IPublishers, IPublishersImmutableFields | PublishersRelationKey>
>;

export interface IPublishersTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PublishersSortableField = (typeof PUBLISHERS_SORTABLE_FIELDS)[number];

export type PublishersSearchableField = (typeof PUBLISHERS_SEARCHABLE_FIELDS)[number];

export type PublishersFilterableField = (typeof PUBLISHERS_FILTERABLE_FIELDS)[number];

export type PublishersDateRangeField = (typeof PUBLISHERS_DATE_RANGE_FIELDS)[number];

export type PublishersSelectableField = (typeof PUBLISHERS_SELECTABLE_FIELDS)[number];

export type PublishersDefaultSelectField = (typeof PUBLISHERS_DEFAULT_SELECT_FIELDS)[number];

export type PublishersEditableField = (typeof PUBLISHERS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPublishersAsOneRelationConfig = Q.IOneRelationConfig<
  "publishers",
  PublishersSelectableField
>;

export type IPublishersAsManyRelationConfig = Q.IManyRelationConfig<
  "publishers",
  PublishersSelectableField,
  PublishersSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPublishersAsOneRelationQuery = Q.IAsOneRelationQuery<
  IPublishers,
  PublishersSelectableField
>;

export type IPublishersAsManyRelationQuery = Q.IAsManyRelationQuery<
  IPublishers,
  PublishersSelectableField,
  PublishersSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPublishersRelationMap extends Record<PublishersRelationKey, unknown> {
  country: CountryTypes.ICountryAsOneRelationQuery;
  kind: ValueTypes.IValueAsOneRelationQuery;
  officialEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPublishersRelationQueries = Q.IBaseRelationQueries<
  IPublishers,
  PublishersRelationKey,
  IPublishersRelationMap
>;

export type IPublishersItemQuery = Q.IBaseItemQuery<
  IPublishers,
  PublishersRelationKey,
  PublishersSelectableField,
  PublishersRelationKey,
  PublishersSelectableField,
  IPublishersRelationMap,
  IPublishersRelationQueries
>;

export type IPublishersListQuery = Q.IBaseListQuery<
  IPublishers,
  PublishersRelationKey,
  PublishersSelectableField,
  PublishersSortableField,
  PublishersRelationKey,
  PublishersSelectableField,
  PublishersSortableField,
  PublishersDateRangeField,
  PublishersFilterableField,
  IPublishersRelationMap,
  IPublishersRelationQueries,
  IPublishersItemQuery
>;
