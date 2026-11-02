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
  IGeoUnitChange,
  GeoUnitChangeKey,
  GeoUnitChangeRelationKey,
  GeoUnitChangeSortableField,
  GeoUnitChangeFilterableField,
  GeoUnitChangeDateRangeField,
  GeoUnitChangeSelectableField,
  IGeoUnitChangeAsOneRelationConfig,
  IGeoUnitChangeAsManyRelationConfig
} from './geo-unit-change.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const GEO_UNIT_CHANGE_RELATION_KEYS = ['geoUnit', ] as const satisfies readonly GeoUnitChangeKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const GEO_UNIT_CHANGE_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly GeoUnitChangeKey[];

export const GEO_UNIT_CHANGE_SEARCHABLE_FIELDS = [] as const satisfies readonly GeoUnitChangeKey[];

export const GEO_UNIT_CHANGE_FILTERABLE_FIELDS = ['id', 'isCurrent', 'kind', 'method', 'sourceUnitId', 'targetUnitId', 'verificationState', 'version', ] as const satisfies readonly GeoUnitChangeKey[];

export const GEO_UNIT_CHANGE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly GeoUnitChangeKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const GEO_UNIT_CHANGE_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'confidence', 'createdAt', 'id', 'isCurrent', 'kind', 'licence', 'method', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUnitId', 'sourceUrl', 'targetUnitId', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly GeoUnitChangeKey[];

export const GEO_UNIT_CHANGE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly GeoUnitChangeSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const GEO_UNIT_CHANGE_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'confidence', 'isCurrent', 'kind', 'licence', 'method', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUnitId', 'sourceUrl', 'targetUnitId', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly GeoUnitChangeKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const GEO_UNIT_CHANGE_AS_ONE_RELATION_CONFIG = {
  relation: 'geoUnitChange',
  type: ERelationType.One,
  selectableFields: GEO_UNIT_CHANGE_SELECTABLE_FIELDS,
  defaultSelectFields: GEO_UNIT_CHANGE_DEFAULT_SELECT_FIELDS
} as const satisfies IGeoUnitChangeAsOneRelationConfig;

export const GEO_UNIT_CHANGE_AS_MANY_RELATION_CONFIG = {
  relation: 'geoUnitChanges',
  type: ERelationType.Many,
  selectableFields: GEO_UNIT_CHANGE_SELECTABLE_FIELDS,
  defaultSelectFields: GEO_UNIT_CHANGE_DEFAULT_SELECT_FIELDS,
  sortableFields: GEO_UNIT_CHANGE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IGeoUnitChangeAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const GEO_UNIT_CHANGE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<GeoUnitChangeRelationKey>().one(GeoUnitConfig.GEO_UNIT_AS_ONE_RELATION_CONFIG, 'geoUnit'),
] as const;

export const GEO_UNIT_CHANGE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const GEO_UNIT_CHANGE_QUERY_OPTIONS = {
  searchableFields: GEO_UNIT_CHANGE_SEARCHABLE_FIELDS,
  selectableFields: GEO_UNIT_CHANGE_SELECTABLE_FIELDS,
  defaultSelectFields: GEO_UNIT_CHANGE_DEFAULT_SELECT_FIELDS,
  sortableFields: GEO_UNIT_CHANGE_SORTABLE_FIELDS,
  filterFields: GEO_UNIT_CHANGE_FILTERABLE_FIELDS,
  dateRangeFields: GEO_UNIT_CHANGE_DATE_RANGE_FIELDS,
  oneRelations: GEO_UNIT_CHANGE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: GEO_UNIT_CHANGE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IGeoUnitChange,
  GeoUnitChangeSortableField,
  GeoUnitChangeSelectableField,
  GeoUnitChangeFilterableField,
  GeoUnitChangeDateRangeField,
  GeoUnitChangeRelationKey,
  typeof GEO_UNIT_CHANGE_ONE_RELATION_QUERY_OPTIONS,
  typeof GEO_UNIT_CHANGE_MANY_RELATION_QUERY_OPTIONS
>;