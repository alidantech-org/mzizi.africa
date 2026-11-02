// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as JurisdictionConfig from '#/modules/reference/types/jurisdiction.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IStatisticsTable,
  StatisticsTableKey,
  StatisticsTableRelationKey,
  StatisticsTableSortableField,
  StatisticsTableFilterableField,
  StatisticsTableDateRangeField,
  StatisticsTableSelectableField,
  IStatisticsTableAsOneRelationConfig,
  IStatisticsTableAsManyRelationConfig
} from './statistics-table.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const STATISTICS_TABLE_RELATION_KEYS = ['jurisdiction', ] as const satisfies readonly StatisticsTableKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const STATISTICS_TABLE_SORTABLE_FIELDS = ['code', 'createdAt', 'title', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly StatisticsTableKey[];

export const STATISTICS_TABLE_SEARCHABLE_FIELDS = ['code', 'title', ] as const satisfies readonly StatisticsTableKey[];

export const STATISTICS_TABLE_FILTERABLE_FIELDS = ['code', 'geoUnitId', 'id', 'indicatorId', 'isCurrent', 'jurisdictionId', 'method', 'publisherInstitutionId', 'title', 'verificationState', 'version', ] as const satisfies readonly StatisticsTableKey[];

export const STATISTICS_TABLE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly StatisticsTableKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const STATISTICS_TABLE_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'code', 'collector', 'confidence', 'createdAt', 'geoUnitId', 'id', 'indicatorId', 'isCurrent', 'jurisdictionId', 'licence', 'method', 'methodology', 'publisherInstitutionId', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'title', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly StatisticsTableKey[];

export const STATISTICS_TABLE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly StatisticsTableSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const STATISTICS_TABLE_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'code', 'collector', 'confidence', 'geoUnitId', 'indicatorId', 'isCurrent', 'jurisdictionId', 'licence', 'method', 'methodology', 'publisherInstitutionId', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'title', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly StatisticsTableKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const STATISTICS_TABLE_AS_ONE_RELATION_CONFIG = {
  relation: 'statisticsTable',
  type: ERelationType.One,
  selectableFields: STATISTICS_TABLE_SELECTABLE_FIELDS,
  defaultSelectFields: STATISTICS_TABLE_DEFAULT_SELECT_FIELDS
} as const satisfies IStatisticsTableAsOneRelationConfig;

export const STATISTICS_TABLE_AS_MANY_RELATION_CONFIG = {
  relation: 'statisticsTables',
  type: ERelationType.Many,
  selectableFields: STATISTICS_TABLE_SELECTABLE_FIELDS,
  defaultSelectFields: STATISTICS_TABLE_DEFAULT_SELECT_FIELDS,
  sortableFields: STATISTICS_TABLE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IStatisticsTableAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const STATISTICS_TABLE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<StatisticsTableRelationKey>().one(JurisdictionConfig.JURISDICTION_AS_ONE_RELATION_CONFIG, 'jurisdiction'),
] as const;

export const STATISTICS_TABLE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const STATISTICS_TABLE_QUERY_OPTIONS = {
  searchableFields: STATISTICS_TABLE_SEARCHABLE_FIELDS,
  selectableFields: STATISTICS_TABLE_SELECTABLE_FIELDS,
  defaultSelectFields: STATISTICS_TABLE_DEFAULT_SELECT_FIELDS,
  sortableFields: STATISTICS_TABLE_SORTABLE_FIELDS,
  filterFields: STATISTICS_TABLE_FILTERABLE_FIELDS,
  dateRangeFields: STATISTICS_TABLE_DATE_RANGE_FIELDS,
  oneRelations: STATISTICS_TABLE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: STATISTICS_TABLE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IStatisticsTable,
  StatisticsTableSortableField,
  StatisticsTableSelectableField,
  StatisticsTableFilterableField,
  StatisticsTableDateRangeField,
  StatisticsTableRelationKey,
  typeof STATISTICS_TABLE_ONE_RELATION_QUERY_OPTIONS,
  typeof STATISTICS_TABLE_MANY_RELATION_QUERY_OPTIONS
>;