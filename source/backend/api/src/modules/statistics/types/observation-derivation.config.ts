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
  IObservationDerivation,
  ObservationDerivationKey,
  ObservationDerivationRelationKey,
  ObservationDerivationSortableField,
  ObservationDerivationFilterableField,
  ObservationDerivationDateRangeField,
  ObservationDerivationSelectableField,
  IObservationDerivationAsOneRelationConfig,
  IObservationDerivationAsManyRelationConfig
} from './observation-derivation.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const OBSERVATION_DERIVATION_RELATION_KEYS = ['observation', ] as const satisfies readonly ObservationDerivationKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const OBSERVATION_DERIVATION_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly ObservationDerivationKey[];

export const OBSERVATION_DERIVATION_SEARCHABLE_FIELDS = [] as const satisfies readonly ObservationDerivationKey[];

export const OBSERVATION_DERIVATION_FILTERABLE_FIELDS = ['id', 'inputObservationId', 'isCurrent', 'observationId', 'version', ] as const satisfies readonly ObservationDerivationKey[];

export const OBSERVATION_DERIVATION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly ObservationDerivationKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const OBSERVATION_DERIVATION_SELECTABLE_FIELDS = ['computation', 'createdAt', 'id', 'inputObservationId', 'inputRole', 'isCurrent', 'observationId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly ObservationDerivationKey[];

export const OBSERVATION_DERIVATION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ObservationDerivationSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const OBSERVATION_DERIVATION_EDITABLE_FIELDS = ['computation', 'inputObservationId', 'inputRole', 'isCurrent', 'observationId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly ObservationDerivationKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const OBSERVATION_DERIVATION_AS_ONE_RELATION_CONFIG = {
  relation: 'observationDerivation',
  type: ERelationType.One,
  selectableFields: OBSERVATION_DERIVATION_SELECTABLE_FIELDS,
  defaultSelectFields: OBSERVATION_DERIVATION_DEFAULT_SELECT_FIELDS
} as const satisfies IObservationDerivationAsOneRelationConfig;

export const OBSERVATION_DERIVATION_AS_MANY_RELATION_CONFIG = {
  relation: 'observationDerivations',
  type: ERelationType.Many,
  selectableFields: OBSERVATION_DERIVATION_SELECTABLE_FIELDS,
  defaultSelectFields: OBSERVATION_DERIVATION_DEFAULT_SELECT_FIELDS,
  sortableFields: OBSERVATION_DERIVATION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IObservationDerivationAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const OBSERVATION_DERIVATION_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ObservationDerivationRelationKey>().one(ObservationConfig.OBSERVATION_AS_ONE_RELATION_CONFIG, 'observation'),
] as const;

export const OBSERVATION_DERIVATION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const OBSERVATION_DERIVATION_QUERY_OPTIONS = {
  searchableFields: OBSERVATION_DERIVATION_SEARCHABLE_FIELDS,
  selectableFields: OBSERVATION_DERIVATION_SELECTABLE_FIELDS,
  defaultSelectFields: OBSERVATION_DERIVATION_DEFAULT_SELECT_FIELDS,
  sortableFields: OBSERVATION_DERIVATION_SORTABLE_FIELDS,
  filterFields: OBSERVATION_DERIVATION_FILTERABLE_FIELDS,
  dateRangeFields: OBSERVATION_DERIVATION_DATE_RANGE_FIELDS,
  oneRelations: OBSERVATION_DERIVATION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: OBSERVATION_DERIVATION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IObservationDerivation,
  ObservationDerivationSortableField,
  ObservationDerivationSelectableField,
  ObservationDerivationFilterableField,
  ObservationDerivationDateRangeField,
  ObservationDerivationRelationKey,
  typeof OBSERVATION_DERIVATION_ONE_RELATION_QUERY_OPTIONS,
  typeof OBSERVATION_DERIVATION_MANY_RELATION_QUERY_OPTIONS
>;