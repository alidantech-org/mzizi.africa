// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as PlaceConfig from '#/modules/place/types/place.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IOccupancy,
  OccupancyKey,
  OccupancyRelationKey,
  OccupancySortableField,
  OccupancyFilterableField,
  OccupancyDateRangeField,
  OccupancySelectableField,
  IOccupancyAsOneRelationConfig,
  IOccupancyAsManyRelationConfig
} from './occupancy.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const OCCUPANCY_RELATION_KEYS = ['place', ] as const satisfies readonly OccupancyKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const OCCUPANCY_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly OccupancyKey[];

export const OCCUPANCY_SEARCHABLE_FIELDS = [] as const satisfies readonly OccupancyKey[];

export const OCCUPANCY_FILTERABLE_FIELDS = ['id', 'isCurrent', 'placeId', 'roleId', 'status', 'subjectId', 'subjectKind', 'version', ] as const satisfies readonly OccupancyKey[];

export const OCCUPANCY_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly OccupancyKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const OCCUPANCY_SELECTABLE_FIELDS = ['createdAt', 'id', 'isCurrent', 'placeId', 'roleId', 'status', 'subjectId', 'subjectKind', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly OccupancyKey[];

export const OCCUPANCY_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly OccupancySelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const OCCUPANCY_EDITABLE_FIELDS = ['isCurrent', 'placeId', 'roleId', 'status', 'subjectId', 'subjectKind', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly OccupancyKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const OCCUPANCY_AS_ONE_RELATION_CONFIG = {
  relation: 'occupancy',
  type: ERelationType.One,
  selectableFields: OCCUPANCY_SELECTABLE_FIELDS,
  defaultSelectFields: OCCUPANCY_DEFAULT_SELECT_FIELDS
} as const satisfies IOccupancyAsOneRelationConfig;

export const OCCUPANCY_AS_MANY_RELATION_CONFIG = {
  relation: 'occupancys',
  type: ERelationType.Many,
  selectableFields: OCCUPANCY_SELECTABLE_FIELDS,
  defaultSelectFields: OCCUPANCY_DEFAULT_SELECT_FIELDS,
  sortableFields: OCCUPANCY_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IOccupancyAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const OCCUPANCY_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<OccupancyRelationKey>().one(PlaceConfig.PLACE_AS_ONE_RELATION_CONFIG, 'place'),
] as const;

export const OCCUPANCY_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const OCCUPANCY_QUERY_OPTIONS = {
  searchableFields: OCCUPANCY_SEARCHABLE_FIELDS,
  selectableFields: OCCUPANCY_SELECTABLE_FIELDS,
  defaultSelectFields: OCCUPANCY_DEFAULT_SELECT_FIELDS,
  sortableFields: OCCUPANCY_SORTABLE_FIELDS,
  filterFields: OCCUPANCY_FILTERABLE_FIELDS,
  dateRangeFields: OCCUPANCY_DATE_RANGE_FIELDS,
  oneRelations: OCCUPANCY_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: OCCUPANCY_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IOccupancy,
  OccupancySortableField,
  OccupancySelectableField,
  OccupancyFilterableField,
  OccupancyDateRangeField,
  OccupancyRelationKey,
  typeof OCCUPANCY_ONE_RELATION_QUERY_OPTIONS,
  typeof OCCUPANCY_MANY_RELATION_QUERY_OPTIONS
>;