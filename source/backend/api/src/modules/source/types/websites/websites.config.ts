// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as SourcesConfig from '#/modules/source/types/sources/sources.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IWebsites,
  WebsitesKey,
  WebsitesRelationKey,
  WebsitesSortableField,
  WebsitesFilterableField,
  WebsitesDateRangeField,
  WebsitesSelectableField,
  IWebsitesAsOneRelationConfig,
  IWebsitesAsManyRelationConfig
} from './websites.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const WEBSITES_RELATION_KEYS = ['source', ] as const satisfies readonly WebsitesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const WEBSITES_SORTABLE_FIELDS = [] as const satisfies readonly WebsitesKey[];

export const WEBSITES_SEARCHABLE_FIELDS = [] as const satisfies readonly WebsitesKey[];

export const WEBSITES_FILTERABLE_FIELDS = [] as const satisfies readonly WebsitesKey[];

export const WEBSITES_DATE_RANGE_FIELDS = [] as const satisfies readonly WebsitesKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const WEBSITES_SELECTABLE_FIELDS = ['canonicalUrl', 'createdAt', 'deletedAt', 'id', 'sourceId', 'title', 'updatedAt', 'version', ] as const satisfies readonly WebsitesKey[];

export const WEBSITES_DEFAULT_SELECT_FIELDS = ['canonicalUrl', 'createdAt', 'deletedAt', 'id', 'sourceId', 'title', 'updatedAt', 'version', ] as const satisfies readonly WebsitesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const WEBSITES_EDITABLE_FIELDS = ['canonicalUrl', 'sourceId', 'title', ] as const satisfies readonly WebsitesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const WEBSITES_AS_ONE_RELATION_CONFIG = {
  relation: 'websites',
  type: ERelationType.One,
  selectableFields: WEBSITES_SELECTABLE_FIELDS,
  defaultSelectFields: WEBSITES_DEFAULT_SELECT_FIELDS
} as const satisfies IWebsitesAsOneRelationConfig;

export const WEBSITES_AS_MANY_RELATION_CONFIG = {
  relation: 'websitess',
  type: ERelationType.Many,
  selectableFields: WEBSITES_SELECTABLE_FIELDS,
  defaultSelectFields: WEBSITES_DEFAULT_SELECT_FIELDS,
  sortableFields: WEBSITES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IWebsitesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const WEBSITES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<WebsitesRelationKey>().one(SourcesConfig.SOURCES_AS_ONE_RELATION_CONFIG, 'source'),
] as const;

export const WEBSITES_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const WEBSITES_QUERY_OPTIONS = {
  searchableFields: WEBSITES_SEARCHABLE_FIELDS,
  selectableFields: WEBSITES_SELECTABLE_FIELDS,
  defaultSelectFields: WEBSITES_DEFAULT_SELECT_FIELDS,
  sortableFields: WEBSITES_SORTABLE_FIELDS,
  filterFields: WEBSITES_FILTERABLE_FIELDS,
  dateRangeFields: WEBSITES_DATE_RANGE_FIELDS,
  oneRelations: WEBSITES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: WEBSITES_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IWebsites,
  WebsitesSortableField,
  WebsitesSelectableField,
  WebsitesFilterableField,
  WebsitesDateRangeField,
  WebsitesRelationKey,
  typeof WEBSITES_ONE_RELATION_QUERY_OPTIONS,
  typeof WEBSITES_MANY_RELATION_QUERY_OPTIONS
>;