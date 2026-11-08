// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { SitePublisherRole } from '#/types/website/site-publisher-role.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as SiteTypes from '#/modules/website/types/site.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SITE_PUBLISHER_RELATION_KEYS,
  SITE_PUBLISHER_SORTABLE_FIELDS,
  SITE_PUBLISHER_SEARCHABLE_FIELDS,
  SITE_PUBLISHER_FILTERABLE_FIELDS,
  SITE_PUBLISHER_DATE_RANGE_FIELDS,
  SITE_PUBLISHER_SELECTABLE_FIELDS,
  SITE_PUBLISHER_DEFAULT_SELECT_FIELDS,
  SITE_PUBLISHER_EDITABLE_FIELDS
} from './site-publisher.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Site Publisher */
export interface ISitePublisher extends B.IBase {
  publisherId: string;
  role: SitePublisherRole;
  siteId: string;
  validFrom: Date | null;
  validTo: Date | null;
  readonly site?: SiteTypes.ISite;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SitePublisherKey = keyof ISitePublisher;

export type SitePublisherRelationKey = (typeof SITE_PUBLISHER_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISitePublisherReadonlyFields = B.IBaseReadonlyFields;

export type ISitePublisherContextualFields = never;

export type ISitePublisherSensitiveFields = never;

export type ISitePublisherTransitionFields = never;

export type ISitePublisherImmutableFields =
  | ISitePublisherReadonlyFields
  | ISitePublisherContextualFields
  | ISitePublisherSensitiveFields
  | ISitePublisherTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISitePublisherCreatable = Omit<ISitePublisher, ISitePublisherImmutableFields | SitePublisherRelationKey>;

export type ISitePublisherSystemWritable = Omit<ISitePublisher, B.IBaseReadonlyFields | SitePublisherRelationKey>;

export type ISitePublisherUpdatable = Partial<Omit<ISitePublisher, ISitePublisherImmutableFields | SitePublisherRelationKey>>;

export interface ISitePublisherTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SitePublisherSortableField = (typeof SITE_PUBLISHER_SORTABLE_FIELDS)[number];

export type SitePublisherSearchableField = (typeof SITE_PUBLISHER_SEARCHABLE_FIELDS)[number];

export type SitePublisherFilterableField = (typeof SITE_PUBLISHER_FILTERABLE_FIELDS)[number];

export type SitePublisherDateRangeField = (typeof SITE_PUBLISHER_DATE_RANGE_FIELDS)[number];

export type SitePublisherSelectableField = (typeof SITE_PUBLISHER_SELECTABLE_FIELDS)[number];

export type SitePublisherDefaultSelectField = (typeof SITE_PUBLISHER_DEFAULT_SELECT_FIELDS)[number];

export type SitePublisherEditableField = (typeof SITE_PUBLISHER_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISitePublisherAsOneRelationConfig = Q.IOneRelationConfig<'sitePublisher', SitePublisherSelectableField>;

export type ISitePublisherAsManyRelationConfig = Q.IManyRelationConfig<'sitePublishers', SitePublisherSelectableField, SitePublisherSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISitePublisherAsOneRelationQuery = Q.IAsOneRelationQuery<ISitePublisher, SitePublisherSelectableField>;

export type ISitePublisherAsManyRelationQuery = Q.IAsManyRelationQuery<ISitePublisher, SitePublisherSelectableField, SitePublisherSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISitePublisherRelationMap extends Record<SitePublisherRelationKey, unknown> {
  site: SiteTypes.ISiteAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISitePublisherRelationQueries = Q.IBaseRelationQueries<ISitePublisher, SitePublisherRelationKey, ISitePublisherRelationMap>;

export type ISitePublisherItemQuery = Q.IBaseItemQuery<
  ISitePublisher,
  SitePublisherRelationKey,
  SitePublisherSelectableField,
  SitePublisherRelationKey,
  SitePublisherSelectableField,
  ISitePublisherRelationMap,
  ISitePublisherRelationQueries
>;

export type ISitePublisherListQuery = Q.IBaseListQuery<
  ISitePublisher,
  SitePublisherRelationKey,
  SitePublisherSelectableField,
  SitePublisherSortableField,
  SitePublisherRelationKey,
  SitePublisherSelectableField,
  SitePublisherSortableField,
  SitePublisherDateRangeField,
  SitePublisherFilterableField,
  ISitePublisherRelationMap,
  ISitePublisherRelationQueries,
  ISitePublisherItemQuery
>;