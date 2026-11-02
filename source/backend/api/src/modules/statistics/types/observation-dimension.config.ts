// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ObservationConfig from '#/modules/statistics/types/observation.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IObservationDimension,
  ObservationDimensionKey,
  ObservationDimensionRelationKey,
  ObservationDimensionSortableField,
  ObservationDimensionFilterableField,
  ObservationDimensionDateRangeField,
  ObservationDimensionSelectableField,
  IObservationDimensionAsOneRelationConfig,
  IObservationDimensionAsManyRelationConfig
} from './observation-dimension.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const OBSERVATION_DIMENSION_RELATION_KEYS = ['observation', ] as const satisfies readonly ObservationDimensionKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const OBSERVATION_DIMENSION_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly ObservationDimensionKey[];

export const OBSERVATION_DIMENSION_SEARCHABLE_FIELDS = [] as const satisfies readonly ObservationDimensionKey[];

export const OBSERVATION_DIMENSION_FILTERABLE_FIELDS = ['dimensionId', 'id', 'isCurrent', 'memberId', 'observationId', 'version', ] as const satisfies readonly ObservationDimensionKey[];

export const OBSERVATION_DIMENSION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly ObservationDimensionKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const OBSERVATION_DIMENSION_SELECTABLE_FIELDS = ['createdAt', 'dimensionId', 'id', 'isCurrent', 'memberId', 'observationId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly ObservationDimensionKey[];

export const OBSERVATION_DIMENSION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ObservationDimensionSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const OBSERVATION_DIMENSION_EDITABLE_FIELDS = ['dimensionId', 'isCurrent', 'memberId', 'observationId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly ObservationDimensionKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const OBSERVATION_DIMENSION_AS_ONE_RELATION_CONFIG = {
  relation: 'observationDimension',
  type: ERelationType.One,
  selectableFields: OBSERVATION_DIMENSION_SELECTABLE_FIELDS,
  defaultSelectFields: OBSERVATION_DIMENSION_DEFAULT_SELECT_FIELDS
} as const satisfies IObservationDimensionAsOneRelationConfig;

export const OBSERVATION_DIMENSION_AS_MANY_RELATION_CONFIG = {
  relation: 'observationDimensions',
  type: ERelationType.Many,
  selectableFields: OBSERVATION_DIMENSION_SELECTABLE_FIELDS,
  defaultSelectFields: OBSERVATION_DIMENSION_DEFAULT_SELECT_FIELDS,
  sortableFields: OBSERVATION_DIMENSION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IObservationDimensionAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const OBSERVATION_DIMENSION_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ObservationDimensionRelationKey>().one(ObservationConfig.OBSERVATION_AS_ONE_RELATION_CONFIG, 'observation'),
] as const;

export const OBSERVATION_DIMENSION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const OBSERVATION_DIMENSION_QUERY_OPTIONS = {
  searchableFields: OBSERVATION_DIMENSION_SEARCHABLE_FIELDS,
  selectableFields: OBSERVATION_DIMENSION_SELECTABLE_FIELDS,
  defaultSelectFields: OBSERVATION_DIMENSION_DEFAULT_SELECT_FIELDS,
  sortableFields: OBSERVATION_DIMENSION_SORTABLE_FIELDS,
  filterFields: OBSERVATION_DIMENSION_FILTERABLE_FIELDS,
  dateRangeFields: OBSERVATION_DIMENSION_DATE_RANGE_FIELDS,
  oneRelations: OBSERVATION_DIMENSION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: OBSERVATION_DIMENSION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IObservationDimension,
  ObservationDimensionSortableField,
  ObservationDimensionSelectableField,
  ObservationDimensionFilterableField,
  ObservationDimensionDateRangeField,
  ObservationDimensionRelationKey,
  typeof OBSERVATION_DIMENSION_ONE_RELATION_QUERY_OPTIONS,
  typeof OBSERVATION_DIMENSION_MANY_RELATION_QUERY_OPTIONS
>;