// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { DomainOrigin } from '#/types/website/domain-origin.enum';
import type { DomainRole } from '#/types/website/domain-role.enum';
import type { DomainStatus } from '#/types/website/domain-status.enum';
import type { UrlScheme } from '#/types/website/url-scheme.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as SiteTypes from '#/modules/website/types/site.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SITE_DOMAIN_RELATION_KEYS,
  SITE_DOMAIN_SORTABLE_FIELDS,
  SITE_DOMAIN_SEARCHABLE_FIELDS,
  SITE_DOMAIN_FILTERABLE_FIELDS,
  SITE_DOMAIN_DATE_RANGE_FIELDS,
  SITE_DOMAIN_SELECTABLE_FIELDS,
  SITE_DOMAIN_DEFAULT_SELECT_FIELDS,
  SITE_DOMAIN_EDITABLE_FIELDS
} from './site-domain.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Site Domain */
export interface ISiteDomain extends B.IBase {
  hostname: string;
  isApex: boolean | null;
  lastHttpStatus: number | null;
  lastProbeAt: Date | null;
  observedAt: Date | null;
  origin: DomainOrigin | null;
  parentDomainId: string | null;
  redirectTo: string | null;
  role: DomainRole;
  scheme: UrlScheme;
  siteId: string;
  status: DomainStatus;
  statusReason: string | null;
  validFrom: Date;
  validFromPrecision: DatePrecision;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  zoneId: string | null;
  readonly site?: SiteTypes.ISite;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SiteDomainKey = keyof ISiteDomain;

export type SiteDomainRelationKey = (typeof SITE_DOMAIN_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISiteDomainReadonlyFields = B.IBaseReadonlyFields;

export type ISiteDomainContextualFields = never;

export type ISiteDomainSensitiveFields = never;

export type ISiteDomainTransitionFields = never;

export type ISiteDomainImmutableFields =
  | ISiteDomainReadonlyFields
  | ISiteDomainContextualFields
  | ISiteDomainSensitiveFields
  | ISiteDomainTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISiteDomainCreatable = Omit<ISiteDomain, ISiteDomainImmutableFields | SiteDomainRelationKey>;

export type ISiteDomainSystemWritable = Omit<ISiteDomain, B.IBaseReadonlyFields | SiteDomainRelationKey>;

export type ISiteDomainUpdatable = Partial<Omit<ISiteDomain, ISiteDomainImmutableFields | SiteDomainRelationKey>>;

export interface ISiteDomainTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SiteDomainSortableField = (typeof SITE_DOMAIN_SORTABLE_FIELDS)[number];

export type SiteDomainSearchableField = (typeof SITE_DOMAIN_SEARCHABLE_FIELDS)[number];

export type SiteDomainFilterableField = (typeof SITE_DOMAIN_FILTERABLE_FIELDS)[number];

export type SiteDomainDateRangeField = (typeof SITE_DOMAIN_DATE_RANGE_FIELDS)[number];

export type SiteDomainSelectableField = (typeof SITE_DOMAIN_SELECTABLE_FIELDS)[number];

export type SiteDomainDefaultSelectField = (typeof SITE_DOMAIN_DEFAULT_SELECT_FIELDS)[number];

export type SiteDomainEditableField = (typeof SITE_DOMAIN_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISiteDomainAsOneRelationConfig = Q.IOneRelationConfig<'siteDomain', SiteDomainSelectableField>;

export type ISiteDomainAsManyRelationConfig = Q.IManyRelationConfig<'siteDomains', SiteDomainSelectableField, SiteDomainSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISiteDomainAsOneRelationQuery = Q.IAsOneRelationQuery<ISiteDomain, SiteDomainSelectableField>;

export type ISiteDomainAsManyRelationQuery = Q.IAsManyRelationQuery<ISiteDomain, SiteDomainSelectableField, SiteDomainSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISiteDomainRelationMap extends Record<SiteDomainRelationKey, unknown> {
  site: SiteTypes.ISiteAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISiteDomainRelationQueries = Q.IBaseRelationQueries<ISiteDomain, SiteDomainRelationKey, ISiteDomainRelationMap>;

export type ISiteDomainItemQuery = Q.IBaseItemQuery<
  ISiteDomain,
  SiteDomainRelationKey,
  SiteDomainSelectableField,
  SiteDomainRelationKey,
  SiteDomainSelectableField,
  ISiteDomainRelationMap,
  ISiteDomainRelationQueries
>;

export type ISiteDomainListQuery = Q.IBaseListQuery<
  ISiteDomain,
  SiteDomainRelationKey,
  SiteDomainSelectableField,
  SiteDomainSortableField,
  SiteDomainRelationKey,
  SiteDomainSelectableField,
  SiteDomainSortableField,
  SiteDomainDateRangeField,
  SiteDomainFilterableField,
  ISiteDomainRelationMap,
  ISiteDomainRelationQueries,
  ISiteDomainItemQuery
>;