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
  ISiteRelation,
  SiteRelationKey,
  SiteRelationRelationKey,
  SiteRelationSortableField,
  SiteRelationFilterableField,
  SiteRelationDateRangeField,
  SiteRelationSelectableField,
  ISiteRelationAsOneRelationConfig,
  ISiteRelationAsManyRelationConfig
} from './site-relation.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SITE_RELATION_RELATION_KEYS = [] as const satisfies readonly SiteRelationKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SITE_RELATION_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'version', ] as const satisfies readonly SiteRelationKey[];

export const SITE_RELATION_SEARCHABLE_FIELDS = [] as const satisfies readonly SiteRelationKey[];

export const SITE_RELATION_FILTERABLE_FIELDS = ['fromId', 'id', 'relation', 'toId', 'version', ] as const satisfies readonly SiteRelationKey[];

export const SITE_RELATION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly SiteRelationKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SITE_RELATION_SELECTABLE_FIELDS = ['basis', 'createdAt', 'evidence', 'fromId', 'fromKind', 'id', 'relation', 'score', 'toId', 'toKind', 'updatedAt', ] as const satisfies readonly SiteRelationKey[];

export const SITE_RELATION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly SiteRelationSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SITE_RELATION_EDITABLE_FIELDS = ['basis', 'evidence', 'fromId', 'fromKind', 'relation', 'score', 'toId', 'toKind', ] as const satisfies readonly SiteRelationKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SITE_RELATION_AS_ONE_RELATION_CONFIG = {
  relation: 'siteRelation',
  type: ERelationType.One,
  selectableFields: SITE_RELATION_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_RELATION_DEFAULT_SELECT_FIELDS
} as const satisfies ISiteRelationAsOneRelationConfig;

export const SITE_RELATION_AS_MANY_RELATION_CONFIG = {
  relation: 'siteRelations',
  type: ERelationType.Many,
  selectableFields: SITE_RELATION_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_RELATION_DEFAULT_SELECT_FIELDS,
  sortableFields: SITE_RELATION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ISiteRelationAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SITE_RELATION_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const SITE_RELATION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SITE_RELATION_QUERY_OPTIONS = {
  searchableFields: SITE_RELATION_SEARCHABLE_FIELDS,
  selectableFields: SITE_RELATION_SELECTABLE_FIELDS,
  defaultSelectFields: SITE_RELATION_DEFAULT_SELECT_FIELDS,
  sortableFields: SITE_RELATION_SORTABLE_FIELDS,
  filterFields: SITE_RELATION_FILTERABLE_FIELDS,
  dateRangeFields: SITE_RELATION_DATE_RANGE_FIELDS,
  oneRelations: SITE_RELATION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SITE_RELATION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ISiteRelation,
  SiteRelationSortableField,
  SiteRelationSelectableField,
  SiteRelationFilterableField,
  SiteRelationDateRangeField,
  SiteRelationRelationKey,
  typeof SITE_RELATION_ONE_RELATION_QUERY_OPTIONS,
  typeof SITE_RELATION_MANY_RELATION_QUERY_OPTIONS
>;