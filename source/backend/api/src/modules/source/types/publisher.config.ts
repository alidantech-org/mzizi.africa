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
  IPublisher,
  PublisherKey,
  PublisherRelationKey,
  PublisherSortableField,
  PublisherFilterableField,
  PublisherDateRangeField,
  PublisherSelectableField,
  IPublisherAsOneRelationConfig,
  IPublisherAsManyRelationConfig
} from './publisher.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PUBLISHER_RELATION_KEYS = [] as const satisfies readonly PublisherKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PUBLISHER_SORTABLE_FIELDS = ['code', 'createdAt', 'name', 'updatedAt', 'version', ] as const satisfies readonly PublisherKey[];

export const PUBLISHER_SEARCHABLE_FIELDS = ['code', 'name', ] as const satisfies readonly PublisherKey[];

export const PUBLISHER_FILTERABLE_FIELDS = ['code', 'id', 'jurisdictionId', 'kindId', 'name', 'version', ] as const satisfies readonly PublisherKey[];

export const PUBLISHER_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', ] as const satisfies readonly PublisherKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PUBLISHER_SELECTABLE_FIELDS = ['code', 'createdAt', 'id', 'jurisdictionId', 'kindId', 'name', 'reliability', 'updatedAt', 'websiteUrl', ] as const satisfies readonly PublisherKey[];

export const PUBLISHER_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly PublisherSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PUBLISHER_EDITABLE_FIELDS = ['code', 'jurisdictionId', 'kindId', 'name', 'reliability', 'websiteUrl', ] as const satisfies readonly PublisherKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PUBLISHER_AS_ONE_RELATION_CONFIG = {
  relation: 'publisher',
  type: ERelationType.One,
  selectableFields: PUBLISHER_SELECTABLE_FIELDS,
  defaultSelectFields: PUBLISHER_DEFAULT_SELECT_FIELDS
} as const satisfies IPublisherAsOneRelationConfig;

export const PUBLISHER_AS_MANY_RELATION_CONFIG = {
  relation: 'publishers',
  type: ERelationType.Many,
  selectableFields: PUBLISHER_SELECTABLE_FIELDS,
  defaultSelectFields: PUBLISHER_DEFAULT_SELECT_FIELDS,
  sortableFields: PUBLISHER_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IPublisherAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PUBLISHER_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const PUBLISHER_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PUBLISHER_QUERY_OPTIONS = {
  searchableFields: PUBLISHER_SEARCHABLE_FIELDS,
  selectableFields: PUBLISHER_SELECTABLE_FIELDS,
  defaultSelectFields: PUBLISHER_DEFAULT_SELECT_FIELDS,
  sortableFields: PUBLISHER_SORTABLE_FIELDS,
  filterFields: PUBLISHER_FILTERABLE_FIELDS,
  dateRangeFields: PUBLISHER_DATE_RANGE_FIELDS,
  oneRelations: PUBLISHER_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PUBLISHER_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IPublisher,
  PublisherSortableField,
  PublisherSelectableField,
  PublisherFilterableField,
  PublisherDateRangeField,
  PublisherRelationKey,
  typeof PUBLISHER_ONE_RELATION_QUERY_OPTIONS,
  typeof PUBLISHER_MANY_RELATION_QUERY_OPTIONS
>;