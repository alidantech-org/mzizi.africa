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
  IFiscalYear,
  FiscalYearKey,
  FiscalYearRelationKey,
  FiscalYearSortableField,
  FiscalYearFilterableField,
  FiscalYearDateRangeField,
  FiscalYearSelectableField,
  IFiscalYearAsOneRelationConfig,
  IFiscalYearAsManyRelationConfig
} from './fiscal-year.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const FISCAL_YEAR_RELATION_KEYS = ['jurisdiction', ] as const satisfies readonly FiscalYearKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const FISCAL_YEAR_SORTABLE_FIELDS = ['code', 'createdAt', 'endsOn', 'startsOn', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly FiscalYearKey[];

export const FISCAL_YEAR_SEARCHABLE_FIELDS = ['code', ] as const satisfies readonly FiscalYearKey[];

export const FISCAL_YEAR_FILTERABLE_FIELDS = ['code', 'id', 'isCurrent', 'jurisdictionId', 'method', 'verificationState', 'version', ] as const satisfies readonly FiscalYearKey[];

export const FISCAL_YEAR_DATE_RANGE_FIELDS = ['createdAt', 'endsOn', 'startsOn', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly FiscalYearKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const FISCAL_YEAR_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'code', 'confidence', 'createdAt', 'endsOn', 'id', 'isCurrent', 'jurisdictionId', 'licence', 'method', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'startsOn', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly FiscalYearKey[];

export const FISCAL_YEAR_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly FiscalYearSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const FISCAL_YEAR_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'code', 'confidence', 'endsOn', 'isCurrent', 'jurisdictionId', 'licence', 'method', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'startsOn', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly FiscalYearKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const FISCAL_YEAR_AS_ONE_RELATION_CONFIG = {
  relation: 'fiscalYear',
  type: ERelationType.One,
  selectableFields: FISCAL_YEAR_SELECTABLE_FIELDS,
  defaultSelectFields: FISCAL_YEAR_DEFAULT_SELECT_FIELDS
} as const satisfies IFiscalYearAsOneRelationConfig;

export const FISCAL_YEAR_AS_MANY_RELATION_CONFIG = {
  relation: 'fiscalYears',
  type: ERelationType.Many,
  selectableFields: FISCAL_YEAR_SELECTABLE_FIELDS,
  defaultSelectFields: FISCAL_YEAR_DEFAULT_SELECT_FIELDS,
  sortableFields: FISCAL_YEAR_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IFiscalYearAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const FISCAL_YEAR_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<FiscalYearRelationKey>().one(JurisdictionConfig.JURISDICTION_AS_ONE_RELATION_CONFIG, 'jurisdiction'),
] as const;

export const FISCAL_YEAR_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const FISCAL_YEAR_QUERY_OPTIONS = {
  searchableFields: FISCAL_YEAR_SEARCHABLE_FIELDS,
  selectableFields: FISCAL_YEAR_SELECTABLE_FIELDS,
  defaultSelectFields: FISCAL_YEAR_DEFAULT_SELECT_FIELDS,
  sortableFields: FISCAL_YEAR_SORTABLE_FIELDS,
  filterFields: FISCAL_YEAR_FILTERABLE_FIELDS,
  dateRangeFields: FISCAL_YEAR_DATE_RANGE_FIELDS,
  oneRelations: FISCAL_YEAR_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: FISCAL_YEAR_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IFiscalYear,
  FiscalYearSortableField,
  FiscalYearSelectableField,
  FiscalYearFilterableField,
  FiscalYearDateRangeField,
  FiscalYearRelationKey,
  typeof FISCAL_YEAR_ONE_RELATION_QUERY_OPTIONS,
  typeof FISCAL_YEAR_MANY_RELATION_QUERY_OPTIONS
>;