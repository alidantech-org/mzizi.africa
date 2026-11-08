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
  IGeoUnit,
  GeoUnitKey,
  GeoUnitRelationKey,
  GeoUnitSortableField,
  GeoUnitFilterableField,
  GeoUnitDateRangeField,
  GeoUnitSelectableField,
  IGeoUnitAsOneRelationConfig,
  IGeoUnitAsManyRelationConfig
} from './geo-unit.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const GEO_UNIT_RELATION_KEYS = [] as const satisfies readonly GeoUnitKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const GEO_UNIT_SORTABLE_FIELDS = ['code', 'createdAt', 'name', 'parentId', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly GeoUnitKey[];

export const GEO_UNIT_SEARCHABLE_FIELDS = ['code', 'name', ] as const satisfies readonly GeoUnitKey[];

export const GEO_UNIT_FILTERABLE_FIELDS = ['code', 'emblemMarker', 'flagMarker', 'id', 'isActive', 'isCurrent', 'jurisdictionId', 'kind', 'levelId', 'name', 'parentId', 'version', 'wikidataId', ] as const satisfies readonly GeoUnitKey[];

export const GEO_UNIT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly GeoUnitKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const GEO_UNIT_SELECTABLE_FIELDS = ['code', 'createdAt', 'emblemMarker', 'flagMarker', 'id', 'isActive', 'isCurrent', 'jurisdictionId', 'kind', 'levelId', 'name', 'parentId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'wikidataId', ] as const satisfies readonly GeoUnitKey[];

export const GEO_UNIT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly GeoUnitSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const GEO_UNIT_EDITABLE_FIELDS = ['code', 'emblemMarker', 'flagMarker', 'isActive', 'isCurrent', 'jurisdictionId', 'kind', 'levelId', 'name', 'parentId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'wikidataId', ] as const satisfies readonly GeoUnitKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const GEO_UNIT_AS_ONE_RELATION_CONFIG = {
  relation: 'geoUnit',
  type: ERelationType.One,
  selectableFields: GEO_UNIT_SELECTABLE_FIELDS,
  defaultSelectFields: GEO_UNIT_DEFAULT_SELECT_FIELDS
} as const satisfies IGeoUnitAsOneRelationConfig;

export const GEO_UNIT_AS_MANY_RELATION_CONFIG = {
  relation: 'geoUnits',
  type: ERelationType.Many,
  selectableFields: GEO_UNIT_SELECTABLE_FIELDS,
  defaultSelectFields: GEO_UNIT_DEFAULT_SELECT_FIELDS,
  sortableFields: GEO_UNIT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IGeoUnitAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const GEO_UNIT_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const GEO_UNIT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const GEO_UNIT_QUERY_OPTIONS = {
  searchableFields: GEO_UNIT_SEARCHABLE_FIELDS,
  selectableFields: GEO_UNIT_SELECTABLE_FIELDS,
  defaultSelectFields: GEO_UNIT_DEFAULT_SELECT_FIELDS,
  sortableFields: GEO_UNIT_SORTABLE_FIELDS,
  filterFields: GEO_UNIT_FILTERABLE_FIELDS,
  dateRangeFields: GEO_UNIT_DATE_RANGE_FIELDS,
  oneRelations: GEO_UNIT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: GEO_UNIT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IGeoUnit,
  GeoUnitSortableField,
  GeoUnitSelectableField,
  GeoUnitFilterableField,
  GeoUnitDateRangeField,
  GeoUnitRelationKey,
  typeof GEO_UNIT_ONE_RELATION_QUERY_OPTIONS,
  typeof GEO_UNIT_MANY_RELATION_QUERY_OPTIONS
>;