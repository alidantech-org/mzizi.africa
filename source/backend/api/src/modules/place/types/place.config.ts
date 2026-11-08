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
  IPlace,
  PlaceKey,
  PlaceRelationKey,
  PlaceSortableField,
  PlaceFilterableField,
  PlaceDateRangeField,
  PlaceSelectableField,
  IPlaceAsOneRelationConfig,
  IPlaceAsManyRelationConfig
} from './place.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PLACE_RELATION_KEYS = [] as const satisfies readonly PlaceKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PLACE_SORTABLE_FIELDS = ['createdAt', 'name', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly PlaceKey[];

export const PLACE_SEARCHABLE_FIELDS = ['name', ] as const satisfies readonly PlaceKey[];

export const PLACE_FILTERABLE_FIELDS = ['buildingTypeId', 'id', 'isCurrent', 'kind', 'locatedInUnitId', 'name', 'parentId', 'status', 'version', ] as const satisfies readonly PlaceKey[];

export const PLACE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly PlaceKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PLACE_SELECTABLE_FIELDS = ['addressText', 'availableFrom', 'buildingTypeId', 'createdAt', 'id', 'isCurrent', 'kind', 'latitude', 'locatedInUnitId', 'longitude', 'name', 'parentId', 'status', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly PlaceKey[];

export const PLACE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly PlaceSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PLACE_EDITABLE_FIELDS = ['addressText', 'availableFrom', 'buildingTypeId', 'isCurrent', 'kind', 'latitude', 'locatedInUnitId', 'longitude', 'name', 'parentId', 'status', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly PlaceKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PLACE_AS_ONE_RELATION_CONFIG = {
  relation: 'place',
  type: ERelationType.One,
  selectableFields: PLACE_SELECTABLE_FIELDS,
  defaultSelectFields: PLACE_DEFAULT_SELECT_FIELDS
} as const satisfies IPlaceAsOneRelationConfig;

export const PLACE_AS_MANY_RELATION_CONFIG = {
  relation: 'places',
  type: ERelationType.Many,
  selectableFields: PLACE_SELECTABLE_FIELDS,
  defaultSelectFields: PLACE_DEFAULT_SELECT_FIELDS,
  sortableFields: PLACE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IPlaceAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PLACE_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const PLACE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PLACE_QUERY_OPTIONS = {
  searchableFields: PLACE_SEARCHABLE_FIELDS,
  selectableFields: PLACE_SELECTABLE_FIELDS,
  defaultSelectFields: PLACE_DEFAULT_SELECT_FIELDS,
  sortableFields: PLACE_SORTABLE_FIELDS,
  filterFields: PLACE_FILTERABLE_FIELDS,
  dateRangeFields: PLACE_DATE_RANGE_FIELDS,
  oneRelations: PLACE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PLACE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IPlace,
  PlaceSortableField,
  PlaceSelectableField,
  PlaceFilterableField,
  PlaceDateRangeField,
  PlaceRelationKey,
  typeof PLACE_ONE_RELATION_QUERY_OPTIONS,
  typeof PLACE_MANY_RELATION_QUERY_OPTIONS
>;