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
  IPeriod,
  PeriodKey,
  PeriodRelationKey,
  PeriodSortableField,
  PeriodFilterableField,
  PeriodDateRangeField,
  PeriodSelectableField,
  IPeriodAsOneRelationConfig,
  IPeriodAsManyRelationConfig
} from './period.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PERIOD_RELATION_KEYS = [] as const satisfies readonly PeriodKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PERIOD_SORTABLE_FIELDS = ['code', 'createdAt', 'endsOn', 'startsOn', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly PeriodKey[];

export const PERIOD_SEARCHABLE_FIELDS = ['code', ] as const satisfies readonly PeriodKey[];

export const PERIOD_FILTERABLE_FIELDS = ['code', 'granularity', 'id', 'isCurrent', 'method', 'verificationState', 'version', ] as const satisfies readonly PeriodKey[];

export const PERIOD_DATE_RANGE_FIELDS = ['createdAt', 'endsOn', 'startsOn', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly PeriodKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PERIOD_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'code', 'confidence', 'createdAt', 'endsOn', 'granularity', 'id', 'isCurrent', 'licence', 'method', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'startsOn', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly PeriodKey[];

export const PERIOD_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly PeriodSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PERIOD_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'code', 'confidence', 'endsOn', 'granularity', 'isCurrent', 'licence', 'method', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'startsOn', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly PeriodKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PERIOD_AS_ONE_RELATION_CONFIG = {
  relation: 'period',
  type: ERelationType.One,
  selectableFields: PERIOD_SELECTABLE_FIELDS,
  defaultSelectFields: PERIOD_DEFAULT_SELECT_FIELDS
} as const satisfies IPeriodAsOneRelationConfig;

export const PERIOD_AS_MANY_RELATION_CONFIG = {
  relation: 'periods',
  type: ERelationType.Many,
  selectableFields: PERIOD_SELECTABLE_FIELDS,
  defaultSelectFields: PERIOD_DEFAULT_SELECT_FIELDS,
  sortableFields: PERIOD_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IPeriodAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PERIOD_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const PERIOD_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PERIOD_QUERY_OPTIONS = {
  searchableFields: PERIOD_SEARCHABLE_FIELDS,
  selectableFields: PERIOD_SELECTABLE_FIELDS,
  defaultSelectFields: PERIOD_DEFAULT_SELECT_FIELDS,
  sortableFields: PERIOD_SORTABLE_FIELDS,
  filterFields: PERIOD_FILTERABLE_FIELDS,
  dateRangeFields: PERIOD_DATE_RANGE_FIELDS,
  oneRelations: PERIOD_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PERIOD_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IPeriod,
  PeriodSortableField,
  PeriodSelectableField,
  PeriodFilterableField,
  PeriodDateRangeField,
  PeriodRelationKey,
  typeof PERIOD_ONE_RELATION_QUERY_OPTIONS,
  typeof PERIOD_MANY_RELATION_QUERY_OPTIONS
>;