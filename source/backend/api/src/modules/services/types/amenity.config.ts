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
  IAmenity,
  AmenityKey,
  AmenityRelationKey,
  AmenitySortableField,
  AmenityFilterableField,
  AmenityDateRangeField,
  AmenitySelectableField,
  IAmenityAsOneRelationConfig,
  IAmenityAsManyRelationConfig
} from './amenity.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const AMENITY_RELATION_KEYS = [] as const satisfies readonly AmenityKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const AMENITY_SORTABLE_FIELDS = ['code', 'createdAt', 'name', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly AmenityKey[];

export const AMENITY_SEARCHABLE_FIELDS = ['code', 'name', ] as const satisfies readonly AmenityKey[];

export const AMENITY_FILTERABLE_FIELDS = ['code', 'id', 'isActive', 'isCurrent', 'jurisdictionId', 'name', 'sectorId', 'version', ] as const satisfies readonly AmenityKey[];

export const AMENITY_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly AmenityKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const AMENITY_SELECTABLE_FIELDS = ['code', 'createdAt', 'id', 'isActive', 'isCurrent', 'jurisdictionId', 'name', 'sectorId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly AmenityKey[];

export const AMENITY_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly AmenitySelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const AMENITY_EDITABLE_FIELDS = ['code', 'isActive', 'isCurrent', 'jurisdictionId', 'name', 'sectorId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly AmenityKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const AMENITY_AS_ONE_RELATION_CONFIG = {
  relation: 'amenity',
  type: ERelationType.One,
  selectableFields: AMENITY_SELECTABLE_FIELDS,
  defaultSelectFields: AMENITY_DEFAULT_SELECT_FIELDS
} as const satisfies IAmenityAsOneRelationConfig;

export const AMENITY_AS_MANY_RELATION_CONFIG = {
  relation: 'amenitys',
  type: ERelationType.Many,
  selectableFields: AMENITY_SELECTABLE_FIELDS,
  defaultSelectFields: AMENITY_DEFAULT_SELECT_FIELDS,
  sortableFields: AMENITY_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IAmenityAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const AMENITY_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const AMENITY_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const AMENITY_QUERY_OPTIONS = {
  searchableFields: AMENITY_SEARCHABLE_FIELDS,
  selectableFields: AMENITY_SELECTABLE_FIELDS,
  defaultSelectFields: AMENITY_DEFAULT_SELECT_FIELDS,
  sortableFields: AMENITY_SORTABLE_FIELDS,
  filterFields: AMENITY_FILTERABLE_FIELDS,
  dateRangeFields: AMENITY_DATE_RANGE_FIELDS,
  oneRelations: AMENITY_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: AMENITY_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IAmenity,
  AmenitySortableField,
  AmenitySelectableField,
  AmenityFilterableField,
  AmenityDateRangeField,
  AmenityRelationKey,
  typeof AMENITY_ONE_RELATION_QUERY_OPTIONS,
  typeof AMENITY_MANY_RELATION_QUERY_OPTIONS
>;