// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ISite,
  SiteKey,
  SiteRelationKey,
  SiteSortableField,
  SiteFilterableField,
  SiteDateRangeField,
  SiteSelectableField,
  ISiteAsOneRelationConfig,
  ISiteAsManyRelationConfig
} from './site.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SITE_RELATION_KEYS = [] as const satisfies readonly SiteKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SITE_SORTABLE_FIELDS = ['code', 'createdAt', 'name', 'updatedAt', 'version', ] as const satisfies readonly SiteKey[];

export const SITE_SEARCHABLE_FIELDS = ['code', 'name', ] as const satisfies readonly SiteKey[];

export const SITE_FILTERABLE_FIELDS = ['code', 'id', 'jurisdictionId', 'kind', 'name', 'status', 'version', ] as const satisfies readonly SiteKey[];

export const SITE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly SiteKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SITE_SELECTABLE_FIELDS = ['code', 'createdAt', 'description', 'firstSeenAt', 'id', 'jurisdictionId', 'kind', 'lastSeenAt', 'name', 'status', 'updatedAt', ] as const satisfies readonly SiteKey[];

export const SITE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly SiteSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SITE_EDITABLE_FIELDS = ['code', 'description', 'firstSeenAt', 'jurisdictionId', 'kind', 'lastSeenAt', 'name', 'status', ] as const satisfies readonly SiteKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SITE_AS_ONE_RELATION_CONFIG = {
  relation: 'site',
  type: ERelationType.One,
  selectableFields: SITE_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_DEFAULT_SELECT_FIELDS
} as const satisfies ISiteAsOneRelationConfig;

export const SITE_AS_MANY_RELATION_CONFIG = {
  relation: 'sites',
  type: ERelationType.Many,
  selectableFields: SITE_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_DEFAULT_SELECT_FIELDS,
  sortableFields: SITE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ISiteAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SITE_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const SITE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SITE_QUERY_OPTIONS = {
  searchableFields: SITE_SEARCHABLE_FIELDS,
  selectableFields: SITE_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_DEFAULT_SELECT_FIELDS,
  sortableFields: SITE_SORTABLE_FIELDS,
  filterFields: SITE_FILTERABLE_FIELDS,
  dateRangeFields: SITE_DATE_RANGE_FIELDS,
  oneRelations: SITE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SITE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ISite,
  SiteSortableField,
  SiteSelectableField,
  SiteFilterableField,
  SiteDateRangeField,
  SiteRelationKey,
  typeof SITE_ONE_RELATION_QUERY_OPTIONS,
  typeof SITE_MANY_RELATION_QUERY_OPTIONS
>;