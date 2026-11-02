// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as OccupancyConfig from '#/modules/place/types/occupancy.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IOccupancyLink,
  OccupancyLinkKey,
  OccupancyLinkRelationKey,
  OccupancyLinkSortableField,
  OccupancyLinkFilterableField,
  OccupancyLinkDateRangeField,
  OccupancyLinkSelectableField,
  IOccupancyLinkAsOneRelationConfig,
  IOccupancyLinkAsManyRelationConfig
} from './occupancy-link.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const OCCUPANCY_LINK_RELATION_KEYS = ['occupancy', ] as const satisfies readonly OccupancyLinkKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const OCCUPANCY_LINK_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly OccupancyLinkKey[];

export const OCCUPANCY_LINK_SEARCHABLE_FIELDS = [] as const satisfies readonly OccupancyLinkKey[];

export const OCCUPANCY_LINK_FILTERABLE_FIELDS = ['id', 'isCurrent', 'kind', 'predecessorId', 'successorId', 'version', ] as const satisfies readonly OccupancyLinkKey[];

export const OCCUPANCY_LINK_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly OccupancyLinkKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const OCCUPANCY_LINK_SELECTABLE_FIELDS = ['createdAt', 'id', 'isCurrent', 'kind', 'predecessorId', 'successorId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly OccupancyLinkKey[];

export const OCCUPANCY_LINK_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly OccupancyLinkSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const OCCUPANCY_LINK_EDITABLE_FIELDS = ['isCurrent', 'kind', 'predecessorId', 'successorId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly OccupancyLinkKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const OCCUPANCY_LINK_AS_ONE_RELATION_CONFIG = {
  relation: 'occupancyLink',
  type: ERelationType.One,
  selectableFields: OCCUPANCY_LINK_SELECTABLE_FIELDS,
  defaultSelectFields: OCCUPANCY_LINK_DEFAULT_SELECT_FIELDS
} as const satisfies IOccupancyLinkAsOneRelationConfig;

export const OCCUPANCY_LINK_AS_MANY_RELATION_CONFIG = {
  relation: 'occupancyLinks',
  type: ERelationType.Many,
  selectableFields: OCCUPANCY_LINK_SELECTABLE_FIELDS,
  defaultSelectFields: OCCUPANCY_LINK_DEFAULT_SELECT_FIELDS,
  sortableFields: OCCUPANCY_LINK_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IOccupancyLinkAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const OCCUPANCY_LINK_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<OccupancyLinkRelationKey>().one(OccupancyConfig.OCCUPANCY_AS_ONE_RELATION_CONFIG, 'occupancy'),
] as const;

export const OCCUPANCY_LINK_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const OCCUPANCY_LINK_QUERY_OPTIONS = {
  searchableFields: OCCUPANCY_LINK_SEARCHABLE_FIELDS,
  selectableFields: OCCUPANCY_LINK_SELECTABLE_FIELDS,
  defaultSelectFields: OCCUPANCY_LINK_DEFAULT_SELECT_FIELDS,
  sortableFields: OCCUPANCY_LINK_SORTABLE_FIELDS,
  filterFields: OCCUPANCY_LINK_FILTERABLE_FIELDS,
  dateRangeFields: OCCUPANCY_LINK_DATE_RANGE_FIELDS,
  oneRelations: OCCUPANCY_LINK_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: OCCUPANCY_LINK_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IOccupancyLink,
  OccupancyLinkSortableField,
  OccupancyLinkSelectableField,
  OccupancyLinkFilterableField,
  OccupancyLinkDateRangeField,
  OccupancyLinkRelationKey,
  typeof OCCUPANCY_LINK_ONE_RELATION_QUERY_OPTIONS,
  typeof OCCUPANCY_LINK_MANY_RELATION_QUERY_OPTIONS
>;