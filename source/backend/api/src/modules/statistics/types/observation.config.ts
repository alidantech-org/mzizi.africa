// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as StatisticsTableConfig from '#/modules/statistics/types/statistics-table.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IObservation,
  ObservationKey,
  ObservationRelationKey,
  ObservationSortableField,
  ObservationFilterableField,
  ObservationDateRangeField,
  ObservationSelectableField,
  IObservationAsOneRelationConfig,
  IObservationAsManyRelationConfig
} from './observation.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const OBSERVATION_RELATION_KEYS = ['statisticsTable', ] as const satisfies readonly ObservationKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const OBSERVATION_SORTABLE_FIELDS = ['createdAt', 'numericValue', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly ObservationKey[];

export const OBSERVATION_SEARCHABLE_FIELDS = [] as const satisfies readonly ObservationKey[];

export const OBSERVATION_FILTERABLE_FIELDS = ['columnId', 'confidenceLevel', 'geoUnitId', 'id', 'indicatorId', 'isCurrent', 'numericValue', 'periodId', 'tableId', 'version', ] as const satisfies readonly ObservationKey[];

export const OBSERVATION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly ObservationKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const OBSERVATION_SELECTABLE_FIELDS = ['columnId', 'confidenceLevel', 'createdAt', 'geoUnitId', 'id', 'indicatorId', 'isCurrent', 'numericValue', 'periodId', 'tableId', 'textValue', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly ObservationKey[];

export const OBSERVATION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ObservationSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const OBSERVATION_EDITABLE_FIELDS = ['columnId', 'confidenceLevel', 'geoUnitId', 'indicatorId', 'isCurrent', 'numericValue', 'periodId', 'tableId', 'textValue', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly ObservationKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const OBSERVATION_AS_ONE_RELATION_CONFIG = {
  relation: 'observation',
  type: ERelationType.One,
  selectableFields: OBSERVATION_SELECTABLE_FIELDS,
  defaultSelectFields: OBSERVATION_DEFAULT_SELECT_FIELDS
} as const satisfies IObservationAsOneRelationConfig;

export const OBSERVATION_AS_MANY_RELATION_CONFIG = {
  relation: 'observations',
  type: ERelationType.Many,
  selectableFields: OBSERVATION_SELECTABLE_FIELDS,
  defaultSelectFields: OBSERVATION_DEFAULT_SELECT_FIELDS,
  sortableFields: OBSERVATION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IObservationAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const OBSERVATION_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ObservationRelationKey>().one(StatisticsTableConfig.STATISTICS_TABLE_AS_ONE_RELATION_CONFIG, 'statisticsTable'),
] as const;

export const OBSERVATION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const OBSERVATION_QUERY_OPTIONS = {
  searchableFields: OBSERVATION_SEARCHABLE_FIELDS,
  selectableFields: OBSERVATION_SELECTABLE_FIELDS,
  defaultSelectFields: OBSERVATION_DEFAULT_SELECT_FIELDS,
  sortableFields: OBSERVATION_SORTABLE_FIELDS,
  filterFields: OBSERVATION_FILTERABLE_FIELDS,
  dateRangeFields: OBSERVATION_DATE_RANGE_FIELDS,
  oneRelations: OBSERVATION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: OBSERVATION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IObservation,
  ObservationSortableField,
  ObservationSelectableField,
  ObservationFilterableField,
  ObservationDateRangeField,
  ObservationRelationKey,
  typeof OBSERVATION_ONE_RELATION_QUERY_OPTIONS,
  typeof OBSERVATION_MANY_RELATION_QUERY_OPTIONS
>;