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
  IGeoUnitNameVersion,
  GeoUnitNameVersionKey,
  GeoUnitNameVersionRelationKey,
  GeoUnitNameVersionSortableField,
  GeoUnitNameVersionFilterableField,
  GeoUnitNameVersionDateRangeField,
  GeoUnitNameVersionSelectableField,
  IGeoUnitNameVersionAsOneRelationConfig,
  IGeoUnitNameVersionAsManyRelationConfig
} from './geo-unit-name-version.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const GEO_UNIT_NAME_VERSION_RELATION_KEYS = ['geoUnit', ] as const satisfies readonly GeoUnitNameVersionKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const GEO_UNIT_NAME_VERSION_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly GeoUnitNameVersionKey[];

export const GEO_UNIT_NAME_VERSION_SEARCHABLE_FIELDS = ['name', ] as const satisfies readonly GeoUnitNameVersionKey[];

export const GEO_UNIT_NAME_VERSION_FILTERABLE_FIELDS = ['id', 'isCurrent', 'method', 'name', 'unitId', 'verificationState', 'version', ] as const satisfies readonly GeoUnitNameVersionKey[];

export const GEO_UNIT_NAME_VERSION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly GeoUnitNameVersionKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const GEO_UNIT_NAME_VERSION_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'confidence', 'createdAt', 'id', 'isCurrent', 'language', 'licence', 'method', 'name', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'unitId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly GeoUnitNameVersionKey[];

export const GEO_UNIT_NAME_VERSION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly GeoUnitNameVersionSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const GEO_UNIT_NAME_VERSION_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'confidence', 'isCurrent', 'language', 'licence', 'method', 'name', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'unitId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly GeoUnitNameVersionKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const GEO_UNIT_NAME_VERSION_AS_ONE_RELATION_CONFIG = {
  relation: 'geoUnitNameVersion',
  type: ERelationType.One,
  selectableFields: GEO_UNIT_NAME_VERSION_SELECTABLE_FIELDS,
  defaultSelectFields: GEO_UNIT_NAME_VERSION_DEFAULT_SELECT_FIELDS
} as const satisfies IGeoUnitNameVersionAsOneRelationConfig;

export const GEO_UNIT_NAME_VERSION_AS_MANY_RELATION_CONFIG = {
  relation: 'geoUnitNameVersions',
  type: ERelationType.Many,
  selectableFields: GEO_UNIT_NAME_VERSION_SELECTABLE_FIELDS,
  defaultSelectFields: GEO_UNIT_NAME_VERSION_DEFAULT_SELECT_FIELDS,
  sortableFields: GEO_UNIT_NAME_VERSION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IGeoUnitNameVersionAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const GEO_UNIT_NAME_VERSION_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<GeoUnitNameVersionRelationKey>().one(GeoUnitConfig.GEO_UNIT_AS_ONE_RELATION_CONFIG, 'geoUnit'),
] as const;

export const GEO_UNIT_NAME_VERSION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const GEO_UNIT_NAME_VERSION_QUERY_OPTIONS = {
  searchableFields: GEO_UNIT_NAME_VERSION_SEARCHABLE_FIELDS,
  selectableFields: GEO_UNIT_NAME_VERSION_SELECTABLE_FIELDS,
  defaultSelectFields: GEO_UNIT_NAME_VERSION_DEFAULT_SELECT_FIELDS,
  sortableFields: GEO_UNIT_NAME_VERSION_SORTABLE_FIELDS,
  filterFields: GEO_UNIT_NAME_VERSION_FILTERABLE_FIELDS,
  dateRangeFields: GEO_UNIT_NAME_VERSION_DATE_RANGE_FIELDS,
  oneRelations: GEO_UNIT_NAME_VERSION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: GEO_UNIT_NAME_VERSION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IGeoUnitNameVersion,
  GeoUnitNameVersionSortableField,
  GeoUnitNameVersionSelectableField,
  GeoUnitNameVersionFilterableField,
  GeoUnitNameVersionDateRangeField,
  GeoUnitNameVersionRelationKey,
  typeof GEO_UNIT_NAME_VERSION_ONE_RELATION_QUERY_OPTIONS,
  typeof GEO_UNIT_NAME_VERSION_MANY_RELATION_QUERY_OPTIONS
>;