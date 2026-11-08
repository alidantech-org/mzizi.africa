// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as SiteConfig from '#/modules/website/types/site.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ISiteDomain,
  SiteDomainKey,
  SiteDomainRelationKey,
  SiteDomainSortableField,
  SiteDomainFilterableField,
  SiteDomainDateRangeField,
  SiteDomainSelectableField,
  ISiteDomainAsOneRelationConfig,
  ISiteDomainAsManyRelationConfig
} from './site-domain.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SITE_DOMAIN_RELATION_KEYS = ['site', ] as const satisfies readonly SiteDomainKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SITE_DOMAIN_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'version', ] as const satisfies readonly SiteDomainKey[];

export const SITE_DOMAIN_SEARCHABLE_FIELDS = [] as const satisfies readonly SiteDomainKey[];

export const SITE_DOMAIN_FILTERABLE_FIELDS = ['hostname', 'id', 'parentDomainId', 'role', 'siteId', 'status', 'version', 'zoneId', ] as const satisfies readonly SiteDomainKey[];

export const SITE_DOMAIN_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', ] as const satisfies readonly SiteDomainKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SITE_DOMAIN_SELECTABLE_FIELDS = ['createdAt', 'hostname', 'id', 'isApex', 'lastHttpStatus', 'lastProbeAt', 'observedAt', 'origin', 'parentDomainId', 'redirectTo', 'role', 'scheme', 'siteId', 'status', 'statusReason', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'zoneId', ] as const satisfies readonly SiteDomainKey[];

export const SITE_DOMAIN_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly SiteDomainSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SITE_DOMAIN_EDITABLE_FIELDS = ['hostname', 'isApex', 'lastHttpStatus', 'lastProbeAt', 'observedAt', 'origin', 'parentDomainId', 'redirectTo', 'role', 'scheme', 'siteId', 'status', 'statusReason', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'zoneId', ] as const satisfies readonly SiteDomainKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SITE_DOMAIN_AS_ONE_RELATION_CONFIG = {
  relation: 'siteDomain',
  type: ERelationType.One,
  selectableFields: SITE_DOMAIN_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_DOMAIN_DEFAULT_SELECT_FIELDS
} as const satisfies ISiteDomainAsOneRelationConfig;

export const SITE_DOMAIN_AS_MANY_RELATION_CONFIG = {
  relation: 'siteDomains',
  type: ERelationType.Many,
  selectableFields: SITE_DOMAIN_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_DOMAIN_DEFAULT_SELECT_FIELDS,
  sortableFields: SITE_DOMAIN_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ISiteDomainAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SITE_DOMAIN_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<SiteDomainRelationKey>().one(SiteConfig.SITE_AS_ONE_RELATION_CONFIG, 'site'),
] as const;

export const SITE_DOMAIN_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SITE_DOMAIN_QUERY_OPTIONS = {
  searchableFields: SITE_DOMAIN_SEARCHABLE_FIELDS,
  selectableFields: SITE_DOMAIN_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_DOMAIN_DEFAULT_SELECT_FIELDS,
  sortableFields: SITE_DOMAIN_SORTABLE_FIELDS,
  filterFields: SITE_DOMAIN_FILTERABLE_FIELDS,
  dateRangeFields: SITE_DOMAIN_DATE_RANGE_FIELDS,
  oneRelations: SITE_DOMAIN_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SITE_DOMAIN_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ISiteDomain,
  SiteDomainSortableField,
  SiteDomainSelectableField,
  SiteDomainFilterableField,
  SiteDomainDateRangeField,
  SiteDomainRelationKey,
  typeof SITE_DOMAIN_ONE_RELATION_QUERY_OPTIONS,
  typeof SITE_DOMAIN_MANY_RELATION_QUERY_OPTIONS
>;