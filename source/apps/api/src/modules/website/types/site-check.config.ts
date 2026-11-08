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
  ISiteCheck,
  SiteCheckKey,
  SiteCheckRelationKey,
  SiteCheckSortableField,
  SiteCheckFilterableField,
  SiteCheckDateRangeField,
  SiteCheckSelectableField,
  ISiteCheckAsOneRelationConfig,
  ISiteCheckAsManyRelationConfig
} from './site-check.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SITE_CHECK_RELATION_KEYS = ['site', ] as const satisfies readonly SiteCheckKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SITE_CHECK_SORTABLE_FIELDS = ['checkedAt', 'createdAt', 'updatedAt', 'version', ] as const satisfies readonly SiteCheckKey[];

export const SITE_CHECK_SEARCHABLE_FIELDS = [] as const satisfies readonly SiteCheckKey[];

export const SITE_CHECK_FILTERABLE_FIELDS = ['id', 'kind', 'outcome', 'siteId', 'structureVersionId', 'version', ] as const satisfies readonly SiteCheckKey[];

export const SITE_CHECK_DATE_RANGE_FIELDS = ['checkedAt', 'createdAt', 'updatedAt', ] as const satisfies readonly SiteCheckKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SITE_CHECK_SELECTABLE_FIELDS = ['checkedAt', 'createdAt', 'detail', 'id', 'kind', 'outcome', 'siteId', 'structureVersionId', 'updatedAt', ] as const satisfies readonly SiteCheckKey[];

export const SITE_CHECK_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly SiteCheckSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SITE_CHECK_EDITABLE_FIELDS = ['checkedAt', 'detail', 'kind', 'outcome', 'siteId', 'structureVersionId', ] as const satisfies readonly SiteCheckKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SITE_CHECK_AS_ONE_RELATION_CONFIG = {
  relation: 'siteCheck',
  type: ERelationType.One,
  selectableFields: SITE_CHECK_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_CHECK_DEFAULT_SELECT_FIELDS
} as const satisfies ISiteCheckAsOneRelationConfig;

export const SITE_CHECK_AS_MANY_RELATION_CONFIG = {
  relation: 'siteChecks',
  type: ERelationType.Many,
  selectableFields: SITE_CHECK_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_CHECK_DEFAULT_SELECT_FIELDS,
  sortableFields: SITE_CHECK_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ISiteCheckAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SITE_CHECK_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<SiteCheckRelationKey>().one(SiteConfig.SITE_AS_ONE_RELATION_CONFIG, 'site'),
] as const;

export const SITE_CHECK_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SITE_CHECK_QUERY_OPTIONS = {
  searchableFields: SITE_CHECK_SEARCHABLE_FIELDS,
  selectableFields: SITE_CHECK_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_CHECK_DEFAULT_SELECT_FIELDS,
  sortableFields: SITE_CHECK_SORTABLE_FIELDS,
  filterFields: SITE_CHECK_FILTERABLE_FIELDS,
  dateRangeFields: SITE_CHECK_DATE_RANGE_FIELDS,
  oneRelations: SITE_CHECK_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SITE_CHECK_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ISiteCheck,
  SiteCheckSortableField,
  SiteCheckSelectableField,
  SiteCheckFilterableField,
  SiteCheckDateRangeField,
  SiteCheckRelationKey,
  typeof SITE_CHECK_ONE_RELATION_QUERY_OPTIONS,
  typeof SITE_CHECK_MANY_RELATION_QUERY_OPTIONS
>;