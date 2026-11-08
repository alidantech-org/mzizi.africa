// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { SiteKind } from '#/types/website/site-kind.enum';
import type { SiteStatus } from '#/types/website/site-status.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SITE_RELATION_KEYS,
  SITE_SORTABLE_FIELDS,
  SITE_SEARCHABLE_FIELDS,
  SITE_FILTERABLE_FIELDS,
  SITE_DATE_RANGE_FIELDS,
  SITE_SELECTABLE_FIELDS,
  SITE_DEFAULT_SELECT_FIELDS,
  SITE_EDITABLE_FIELDS
} from './site.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Site */
export interface ISite extends B.IBase {
  code: string;
  description: string | null;
  firstSeenAt: Date | null;
  jurisdictionId: string | null;
  kind: SiteKind;
  lastSeenAt: Date | null;
  name: string;
  status: SiteStatus;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SiteKey = keyof ISite;

export type SiteRelationKey = (typeof SITE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISiteReadonlyFields = B.IBaseReadonlyFields;

export type ISiteContextualFields = never;

export type ISiteSensitiveFields = never;

export type ISiteTransitionFields = never;

export type ISiteImmutableFields =
  | ISiteReadonlyFields
  | ISiteContextualFields
  | ISiteSensitiveFields
  | ISiteTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISiteCreatable = Omit<ISite, ISiteImmutableFields | SiteRelationKey>;

export type ISiteSystemWritable = Omit<ISite, B.IBaseReadonlyFields | SiteRelationKey>;

export type ISiteUpdatable = Partial<Omit<ISite, ISiteImmutableFields | SiteRelationKey>>;

export interface ISiteTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SiteSortableField = (typeof SITE_SORTABLE_FIELDS)[number];

export type SiteSearchableField = (typeof SITE_SEARCHABLE_FIELDS)[number];

export type SiteFilterableField = (typeof SITE_FILTERABLE_FIELDS)[number];

export type SiteDateRangeField = (typeof SITE_DATE_RANGE_FIELDS)[number];

export type SiteSelectableField = (typeof SITE_SELECTABLE_FIELDS)[number];

export type SiteDefaultSelectField = (typeof SITE_DEFAULT_SELECT_FIELDS)[number];

export type SiteEditableField = (typeof SITE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISiteAsOneRelationConfig = Q.IOneRelationConfig<'site', SiteSelectableField>;

export type ISiteAsManyRelationConfig = Q.IManyRelationConfig<'sites', SiteSelectableField, SiteSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISiteAsOneRelationQuery = Q.IAsOneRelationQuery<ISite, SiteSelectableField>;

export type ISiteAsManyRelationQuery = Q.IAsManyRelationQuery<ISite, SiteSelectableField, SiteSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISiteRelationMap extends Record<SiteRelationKey, unknown> {
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISiteRelationQueries = Q.IBaseRelationQueries<ISite, SiteRelationKey, ISiteRelationMap>;

export type ISiteItemQuery = Q.IBaseItemQuery<
  ISite,
  SiteRelationKey,
  SiteSelectableField,
  SiteRelationKey,
  SiteSelectableField,
  ISiteRelationMap,
  ISiteRelationQueries
>;

export type ISiteListQuery = Q.IBaseListQuery<
  ISite,
  SiteRelationKey,
  SiteSelectableField,
  SiteSortableField,
  SiteRelationKey,
  SiteSelectableField,
  SiteSortableField,
  SiteDateRangeField,
  SiteFilterableField,
  ISiteRelationMap,
  ISiteRelationQueries,
  ISiteItemQuery
>;