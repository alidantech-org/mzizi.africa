// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PUBLISHER_RELATION_KEYS,
  PUBLISHER_SORTABLE_FIELDS,
  PUBLISHER_SEARCHABLE_FIELDS,
  PUBLISHER_FILTERABLE_FIELDS,
  PUBLISHER_DATE_RANGE_FIELDS,
  PUBLISHER_SELECTABLE_FIELDS,
  PUBLISHER_DEFAULT_SELECT_FIELDS,
  PUBLISHER_EDITABLE_FIELDS
} from './publisher.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Publisher */
export interface IPublisher extends B.IBase {
  code: string;
  jurisdictionId: string | null;
  kindId: string;
  name: string;
  reliability: number | null;
  websiteUrl: string | null;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PublisherKey = keyof IPublisher;

export type PublisherRelationKey = (typeof PUBLISHER_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPublisherReadonlyFields = B.IBaseReadonlyFields;

export type IPublisherContextualFields = never;

export type IPublisherSensitiveFields = never;

export type IPublisherTransitionFields = never;

export type IPublisherImmutableFields =
  | IPublisherReadonlyFields
  | IPublisherContextualFields
  | IPublisherSensitiveFields
  | IPublisherTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPublisherCreatable = Omit<IPublisher, IPublisherImmutableFields | PublisherRelationKey>;

export type IPublisherSystemWritable = Omit<IPublisher, B.IBaseReadonlyFields | PublisherRelationKey>;

export type IPublisherUpdatable = Partial<Omit<IPublisher, IPublisherImmutableFields | PublisherRelationKey>>;

export interface IPublisherTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PublisherSortableField = (typeof PUBLISHER_SORTABLE_FIELDS)[number];

export type PublisherSearchableField = (typeof PUBLISHER_SEARCHABLE_FIELDS)[number];

export type PublisherFilterableField = (typeof PUBLISHER_FILTERABLE_FIELDS)[number];

export type PublisherDateRangeField = (typeof PUBLISHER_DATE_RANGE_FIELDS)[number];

export type PublisherSelectableField = (typeof PUBLISHER_SELECTABLE_FIELDS)[number];

export type PublisherDefaultSelectField = (typeof PUBLISHER_DEFAULT_SELECT_FIELDS)[number];

export type PublisherEditableField = (typeof PUBLISHER_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPublisherAsOneRelationConfig = Q.IOneRelationConfig<'publisher', PublisherSelectableField>;

export type IPublisherAsManyRelationConfig = Q.IManyRelationConfig<'publishers', PublisherSelectableField, PublisherSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPublisherAsOneRelationQuery = Q.IAsOneRelationQuery<IPublisher, PublisherSelectableField>;

export type IPublisherAsManyRelationQuery = Q.IAsManyRelationQuery<IPublisher, PublisherSelectableField, PublisherSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPublisherRelationMap extends Record<PublisherRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPublisherRelationQueries = Q.IBaseRelationQueries<IPublisher, PublisherRelationKey, IPublisherRelationMap>;

export type IPublisherItemQuery = Q.IBaseItemQuery<
  IPublisher,
  PublisherRelationKey,
  PublisherSelectableField,
  PublisherRelationKey,
  PublisherSelectableField,
  IPublisherRelationMap,
  IPublisherRelationQueries
>;

export type IPublisherListQuery = Q.IBaseListQuery<
  IPublisher,
  PublisherRelationKey,
  PublisherSelectableField,
  PublisherSortableField,
  PublisherRelationKey,
  PublisherSelectableField,
  PublisherSortableField,
  PublisherDateRangeField,
  PublisherFilterableField,
  IPublisherRelationMap,
  IPublisherRelationQueries,
  IPublisherItemQuery
>;