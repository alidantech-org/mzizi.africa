// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as GeoUnitConfig from '#/modules/geography/types/geo-unit.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IGeoBoundaryVersion,
  GeoBoundaryVersionKey,
  GeoBoundaryVersionRelationKey,
  GeoBoundaryVersionSortableField,
  GeoBoundaryVersionFilterableField,
  GeoBoundaryVersionDateRangeField,
  GeoBoundaryVersionSelectableField,
  IGeoBoundaryVersionAsOneRelationConfig,
  IGeoBoundaryVersionAsManyRelationConfig
} from './geo-boundary-version.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const GEO_BOUNDARY_VERSION_RELATION_KEYS = ['geoUnit', ] as const satisfies readonly GeoBoundaryVersionKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const GEO_BOUNDARY_VERSION_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', 'versionNumber', ] as const satisfies readonly GeoBoundaryVersionKey[];

export const GEO_BOUNDARY_VERSION_SEARCHABLE_FIELDS = [] as const satisfies readonly GeoBoundaryVersionKey[];

export const GEO_BOUNDARY_VERSION_FILTERABLE_FIELDS = ['id', 'isCurrent', 'unitId', 'version', 'versionNumber', ] as const satisfies readonly GeoBoundaryVersionKey[];

export const GEO_BOUNDARY_VERSION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly GeoBoundaryVersionKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const GEO_BOUNDARY_VERSION_SELECTABLE_FIELDS = ['createdAt', 'id', 'isCurrent', 'referenceYear', 'unitId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'versionNumber', ] as const satisfies readonly GeoBoundaryVersionKey[];

export const GEO_BOUNDARY_VERSION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly GeoBoundaryVersionSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const GEO_BOUNDARY_VERSION_EDITABLE_FIELDS = ['geometry', 'isCurrent', 'labelPoint', 'referenceYear', 'unitId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'versionNumber', ] as const satisfies readonly GeoBoundaryVersionKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const GEO_BOUNDARY_VERSION_AS_ONE_RELATION_CONFIG = {
  relation: 'geoBoundaryVersion',
  type: ERelationType.One,
  selectableFields: GEO_BOUNDARY_VERSION_SELECTABLE_FIELDS,
  defaultSelectFields: GEO_BOUNDARY_VERSION_DEFAULT_SELECT_FIELDS
} as const satisfies IGeoBoundaryVersionAsOneRelationConfig;

export const GEO_BOUNDARY_VERSION_AS_MANY_RELATION_CONFIG = {
  relation: 'geoBoundaryVersions',
  type: ERelationType.Many,
  selectableFields: GEO_BOUNDARY_VERSION_SELECTABLE_FIELDS,
  defaultSelectFields: GEO_BOUNDARY_VERSION_DEFAULT_SELECT_FIELDS,
  sortableFields: GEO_BOUNDARY_VERSION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IGeoBoundaryVersionAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const GEO_BOUNDARY_VERSION_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<GeoBoundaryVersionRelationKey>().one(GeoUnitConfig.GEO_UNIT_AS_ONE_RELATION_CONFIG, 'geoUnit'),
] as const;

export const GEO_BOUNDARY_VERSION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const GEO_BOUNDARY_VERSION_QUERY_OPTIONS = {
  searchableFields: GEO_BOUNDARY_VERSION_SEARCHABLE_FIELDS,
  selectableFields: GEO_BOUNDARY_VERSION_SELECTABLE_FIELDS,
  defaultSelectFields: GEO_BOUNDARY_VERSION_DEFAULT_SELECT_FIELDS,
  sortableFields: GEO_BOUNDARY_VERSION_SORTABLE_FIELDS,
  filterFields: GEO_BOUNDARY_VERSION_FILTERABLE_FIELDS,
  dateRangeFields: GEO_BOUNDARY_VERSION_DATE_RANGE_FIELDS,
  oneRelations: GEO_BOUNDARY_VERSION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: GEO_BOUNDARY_VERSION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IGeoBoundaryVersion,
  GeoBoundaryVersionSortableField,
  GeoBoundaryVersionSelectableField,
  GeoBoundaryVersionFilterableField,
  GeoBoundaryVersionDateRangeField,
  GeoBoundaryVersionRelationKey,
  typeof GEO_BOUNDARY_VERSION_ONE_RELATION_QUERY_OPTIONS,
  typeof GEO_BOUNDARY_VERSION_MANY_RELATION_QUERY_OPTIONS
>;