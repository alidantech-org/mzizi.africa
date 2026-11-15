// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from '#/modules/reference/types/value/value.types';
import type * as EntitiesTypes from '#/modules/official/types/entities/entities.types';
import type * as PublishersTypes from '#/modules/source/types/publishers/publishers.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SOURCES_RELATION_KEYS,
  SOURCES_SORTABLE_FIELDS,
  SOURCES_SEARCHABLE_FIELDS,
  SOURCES_FILTERABLE_FIELDS,
  SOURCES_DATE_RANGE_FIELDS,
  SOURCES_SELECTABLE_FIELDS,
  SOURCES_DEFAULT_SELECT_FIELDS,
  SOURCES_EDITABLE_FIELDS
} from './sources.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Stable publication-channel identity independent of any public website. */
export interface ISources extends B.IBase {
  code: string;
  description: string | null;
  kindId: string;
  officialEntityId: string | null;
  publisherId: string;
  title: string;
  readonly kind?: ValueTypes.IValue;
  readonly officialEntity?: EntitiesTypes.IEntities;
  readonly publisher?: PublishersTypes.IPublishers;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SourcesKey = keyof ISources;

export type SourcesRelationKey = (typeof SOURCES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISourcesReadonlyFields = B.IBaseReadonlyFields;

export type ISourcesContextualFields = never;

export type ISourcesSensitiveFields = never;

export type ISourcesTransitionFields = never;

export type ISourcesImmutableFields =
  | ISourcesReadonlyFields
  | ISourcesContextualFields
  | ISourcesSensitiveFields
  | ISourcesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISourcesCreatable = Omit<ISources, ISourcesImmutableFields | SourcesRelationKey>;

export type ISourcesSystemWritable = Omit<ISources, B.IBaseReadonlyFields | SourcesRelationKey>;

export type ISourcesUpdatable = Partial<Omit<ISources, ISourcesImmutableFields | SourcesRelationKey>>;

export interface ISourcesTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SourcesSortableField = (typeof SOURCES_SORTABLE_FIELDS)[number];

export type SourcesSearchableField = (typeof SOURCES_SEARCHABLE_FIELDS)[number];

export type SourcesFilterableField = (typeof SOURCES_FILTERABLE_FIELDS)[number];

export type SourcesDateRangeField = (typeof SOURCES_DATE_RANGE_FIELDS)[number];

export type SourcesSelectableField = (typeof SOURCES_SELECTABLE_FIELDS)[number];

export type SourcesDefaultSelectField = (typeof SOURCES_DEFAULT_SELECT_FIELDS)[number];

export type SourcesEditableField = (typeof SOURCES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISourcesAsOneRelationConfig = Q.IOneRelationConfig<'sources', SourcesSelectableField>;

export type ISourcesAsManyRelationConfig = Q.IManyRelationConfig<'sourcess', SourcesSelectableField, SourcesSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISourcesAsOneRelationQuery = Q.IAsOneRelationQuery<ISources, SourcesSelectableField>;

export type ISourcesAsManyRelationQuery = Q.IAsManyRelationQuery<ISources, SourcesSelectableField, SourcesSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISourcesRelationMap extends Record<SourcesRelationKey, unknown> {
  kind: ValueTypes.IValueAsOneRelationQuery;
  officialEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  publisher: PublishersTypes.IPublishersAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISourcesRelationQueries = Q.IBaseRelationQueries<ISources, SourcesRelationKey, ISourcesRelationMap>;

export type ISourcesItemQuery = Q.IBaseItemQuery<
  ISources,
  SourcesRelationKey,
  SourcesSelectableField,
  SourcesRelationKey,
  SourcesSelectableField,
  ISourcesRelationMap,
  ISourcesRelationQueries
>;

export type ISourcesListQuery = Q.IBaseListQuery<
  ISources,
  SourcesRelationKey,
  SourcesSelectableField,
  SourcesSortableField,
  SourcesRelationKey,
  SourcesSelectableField,
  SourcesSortableField,
  SourcesDateRangeField,
  SourcesFilterableField,
  ISourcesRelationMap,
  ISourcesRelationQueries,
  ISourcesItemQuery
>;