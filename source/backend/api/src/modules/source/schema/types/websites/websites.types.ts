// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/schema/types/query';
import * as B from '#/modules/common/schema/types/base';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as SourcesTypes from '#/modules/source/schema/types/sources/sources.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  WEBSITES_RELATION_KEYS,
  WEBSITES_SORTABLE_FIELDS,
  WEBSITES_SEARCHABLE_FIELDS,
  WEBSITES_FILTERABLE_FIELDS,
  WEBSITES_DATE_RANGE_FIELDS,
  WEBSITES_SELECTABLE_FIELDS,
  WEBSITES_DEFAULT_SELECT_FIELDS,
  WEBSITES_EDITABLE_FIELDS
} from './websites.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Website-specific identity attached to a source channel. */
export interface IWebsites extends B.IBase {
  canonicalUrl: string;
  sourceId: string;
  title: string;
  readonly source?: SourcesTypes.ISources;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type WebsitesKey = keyof IWebsites;

export type WebsitesRelationKey = (typeof WEBSITES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IWebsitesReadonlyFields = B.IBaseReadonlyFields;

export type IWebsitesContextualFields = never;

export type IWebsitesSensitiveFields = never;

export type IWebsitesTransitionFields = never;

export type IWebsitesImmutableFields =
  | IWebsitesReadonlyFields
  | IWebsitesContextualFields
  | IWebsitesSensitiveFields
  | IWebsitesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IWebsitesCreatable = Omit<IWebsites, IWebsitesImmutableFields | WebsitesRelationKey>;

export type IWebsitesSystemWritable = Omit<IWebsites, B.IBaseReadonlyFields | WebsitesRelationKey>;

export type IWebsitesUpdatable = Partial<Omit<IWebsites, IWebsitesImmutableFields | WebsitesRelationKey>>;

export interface IWebsitesTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type WebsitesSortableField = (typeof WEBSITES_SORTABLE_FIELDS)[number];

export type WebsitesSearchableField = (typeof WEBSITES_SEARCHABLE_FIELDS)[number];

export type WebsitesFilterableField = (typeof WEBSITES_FILTERABLE_FIELDS)[number];

export type WebsitesDateRangeField = (typeof WEBSITES_DATE_RANGE_FIELDS)[number];

export type WebsitesSelectableField = (typeof WEBSITES_SELECTABLE_FIELDS)[number];

export type WebsitesDefaultSelectField = (typeof WEBSITES_DEFAULT_SELECT_FIELDS)[number];

export type WebsitesEditableField = (typeof WEBSITES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IWebsitesAsOneRelationConfig = Q.IOneRelationConfig<'websites', WebsitesSelectableField>;

export type IWebsitesAsManyRelationConfig = Q.IManyRelationConfig<'websitess', WebsitesSelectableField, WebsitesSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IWebsitesAsOneRelationQuery = Q.IAsOneRelationQuery<IWebsites, WebsitesSelectableField>;

export type IWebsitesAsManyRelationQuery = Q.IAsManyRelationQuery<IWebsites, WebsitesSelectableField, WebsitesSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IWebsitesRelationMap extends Record<WebsitesRelationKey, unknown> {
  source: SourcesTypes.ISourcesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IWebsitesRelationQueries = Q.IBaseRelationQueries<IWebsites, WebsitesRelationKey, IWebsitesRelationMap>;

export type IWebsitesItemQuery = Q.IBaseItemQuery<
  IWebsites,
  WebsitesRelationKey,
  WebsitesSelectableField,
  WebsitesRelationKey,
  WebsitesSelectableField,
  IWebsitesRelationMap,
  IWebsitesRelationQueries
>;

export type IWebsitesListQuery = Q.IBaseListQuery<
  IWebsites,
  WebsitesRelationKey,
  WebsitesSelectableField,
  WebsitesSortableField,
  WebsitesRelationKey,
  WebsitesSelectableField,
  WebsitesSortableField,
  WebsitesDateRangeField,
  WebsitesFilterableField,
  IWebsitesRelationMap,
  IWebsitesRelationQueries,
  IWebsitesItemQuery
>;