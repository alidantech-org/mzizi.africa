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
  ISitePublisher,
  SitePublisherKey,
  SitePublisherRelationKey,
  SitePublisherSortableField,
  SitePublisherFilterableField,
  SitePublisherDateRangeField,
  SitePublisherSelectableField,
  ISitePublisherAsOneRelationConfig,
  ISitePublisherAsManyRelationConfig
} from './site-publisher.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SITE_PUBLISHER_RELATION_KEYS = ['site', ] as const satisfies readonly SitePublisherKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SITE_PUBLISHER_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly SitePublisherKey[];

export const SITE_PUBLISHER_SEARCHABLE_FIELDS = [] as const satisfies readonly SitePublisherKey[];

export const SITE_PUBLISHER_FILTERABLE_FIELDS = ['id', 'publisherId', 'role', 'siteId', 'version', ] as const satisfies readonly SitePublisherKey[];

export const SITE_PUBLISHER_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly SitePublisherKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SITE_PUBLISHER_SELECTABLE_FIELDS = ['createdAt', 'id', 'publisherId', 'role', 'siteId', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly SitePublisherKey[];

export const SITE_PUBLISHER_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly SitePublisherSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SITE_PUBLISHER_EDITABLE_FIELDS = ['publisherId', 'role', 'siteId', 'validFrom', 'validTo', ] as const satisfies readonly SitePublisherKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SITE_PUBLISHER_AS_ONE_RELATION_CONFIG = {
  relation: 'sitePublisher',
  type: ERelationType.One,
  selectableFields: SITE_PUBLISHER_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_PUBLISHER_DEFAULT_SELECT_FIELDS
} as const satisfies ISitePublisherAsOneRelationConfig;

export const SITE_PUBLISHER_AS_MANY_RELATION_CONFIG = {
  relation: 'sitePublishers',
  type: ERelationType.Many,
  selectableFields: SITE_PUBLISHER_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_PUBLISHER_DEFAULT_SELECT_FIELDS,
  sortableFields: SITE_PUBLISHER_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ISitePublisherAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SITE_PUBLISHER_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<SitePublisherRelationKey>().one(SiteConfig.SITE_AS_ONE_RELATION_CONFIG, 'site'),
] as const;

export const SITE_PUBLISHER_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SITE_PUBLISHER_QUERY_OPTIONS = {
  searchableFields: SITE_PUBLISHER_SEARCHABLE_FIELDS,
  selectableFields: SITE_PUBLISHER_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_PUBLISHER_DEFAULT_SELECT_FIELDS,
  sortableFields: SITE_PUBLISHER_SORTABLE_FIELDS,
  filterFields: SITE_PUBLISHER_FILTERABLE_FIELDS,
  dateRangeFields: SITE_PUBLISHER_DATE_RANGE_FIELDS,
  oneRelations: SITE_PUBLISHER_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SITE_PUBLISHER_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ISitePublisher,
  SitePublisherSortableField,
  SitePublisherSelectableField,
  SitePublisherFilterableField,
  SitePublisherDateRangeField,
  SitePublisherRelationKey,
  typeof SITE_PUBLISHER_ONE_RELATION_QUERY_OPTIONS,
  typeof SITE_PUBLISHER_MANY_RELATION_QUERY_OPTIONS
>;