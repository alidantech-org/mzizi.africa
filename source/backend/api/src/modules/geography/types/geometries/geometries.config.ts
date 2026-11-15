// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as FeaturesConfig from '#/modules/geography/types/features/features.config';
import * as ValueConfig from '#/modules/reference/types/value/value.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IGeometries,
  GeometriesKey,
  GeometriesRelationKey,
  GeometriesSortableField,
  GeometriesFilterableField,
  GeometriesDateRangeField,
  GeometriesSelectableField,
  IGeometriesAsOneRelationConfig,
  IGeometriesAsManyRelationConfig
} from './geometries.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const GEOMETRIES_RELATION_KEYS = ['feature', 'geometryRole', ] as const satisfies readonly GeometriesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const GEOMETRIES_SORTABLE_FIELDS = [] as const satisfies readonly GeometriesKey[];

export const GEOMETRIES_SEARCHABLE_FIELDS = [] as const satisfies readonly GeometriesKey[];

export const GEOMETRIES_FILTERABLE_FIELDS = [] as const satisfies readonly GeometriesKey[];

export const GEOMETRIES_DATE_RANGE_FIELDS = [] as const satisfies readonly GeometriesKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const GEOMETRIES_SELECTABLE_FIELDS = ['createdAt', 'deletedAt', 'featureId', 'fileVersionRefId', 'geometry', 'geometryRoleId', 'id', 'observedAt', 'sourceRefId', 'srid', 'updatedAt', 'validFrom', 'validUntil', 'version', ] as const satisfies readonly GeometriesKey[];

export const GEOMETRIES_DEFAULT_SELECT_FIELDS = ['createdAt', 'deletedAt', 'featureId', 'fileVersionRefId', 'geometry', 'geometryRoleId', 'id', 'observedAt', 'sourceRefId', 'srid', 'updatedAt', 'validFrom', 'validUntil', 'version', ] as const satisfies readonly GeometriesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const GEOMETRIES_EDITABLE_FIELDS = ['featureId', 'fileVersionRefId', 'geometry', 'geometryRoleId', 'observedAt', 'sourceRefId', 'srid', 'validFrom', 'validUntil', ] as const satisfies readonly GeometriesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const GEOMETRIES_AS_ONE_RELATION_CONFIG = {
  relation: 'geometries',
  type: ERelationType.One,
  selectableFields: GEOMETRIES_SELECTABLE_FIELDS,
  defaultSelectFields: GEOMETRIES_DEFAULT_SELECT_FIELDS
} as const satisfies IGeometriesAsOneRelationConfig;

export const GEOMETRIES_AS_MANY_RELATION_CONFIG = {
  relation: 'geometriess',
  type: ERelationType.Many,
  selectableFields: GEOMETRIES_SELECTABLE_FIELDS,
  defaultSelectFields: GEOMETRIES_DEFAULT_SELECT_FIELDS,
  sortableFields: GEOMETRIES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IGeometriesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const GEOMETRIES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<GeometriesRelationKey>().one(FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG, 'feature'),
  Q.createRelationKeyMapper<GeometriesRelationKey>().one(ValueConfig.VALUE_AS_ONE_RELATION_CONFIG, 'geometryRole'),
] as const;

export const GEOMETRIES_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const GEOMETRIES_QUERY_OPTIONS = {
  searchableFields: GEOMETRIES_SEARCHABLE_FIELDS,
  selectableFields: GEOMETRIES_SELECTABLE_FIELDS,
  defaultSelectFields: GEOMETRIES_DEFAULT_SELECT_FIELDS,
  sortableFields: GEOMETRIES_SORTABLE_FIELDS,
  filterFields: GEOMETRIES_FILTERABLE_FIELDS,
  dateRangeFields: GEOMETRIES_DATE_RANGE_FIELDS,
  oneRelations: GEOMETRIES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: GEOMETRIES_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IGeometries,
  GeometriesSortableField,
  GeometriesSelectableField,
  GeometriesFilterableField,
  GeometriesDateRangeField,
  GeometriesRelationKey,
  typeof GEOMETRIES_ONE_RELATION_QUERY_OPTIONS,
  typeof GEOMETRIES_MANY_RELATION_QUERY_OPTIONS
>;