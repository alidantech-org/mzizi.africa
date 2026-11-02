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
  IBudgetaryUnit,
  BudgetaryUnitKey,
  BudgetaryUnitRelationKey,
  BudgetaryUnitSortableField,
  BudgetaryUnitFilterableField,
  BudgetaryUnitDateRangeField,
  BudgetaryUnitSelectableField,
  IBudgetaryUnitAsOneRelationConfig,
  IBudgetaryUnitAsManyRelationConfig
} from './budgetary-unit.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const BUDGETARY_UNIT_RELATION_KEYS = ['jurisdiction', ] as const satisfies readonly BudgetaryUnitKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const BUDGETARY_UNIT_SORTABLE_FIELDS = ['code', 'createdAt', 'name', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly BudgetaryUnitKey[];

export const BUDGETARY_UNIT_SEARCHABLE_FIELDS = ['code', 'name', ] as const satisfies readonly BudgetaryUnitKey[];

export const BUDGETARY_UNIT_FILTERABLE_FIELDS = ['code', 'geoUnitId', 'id', 'institutionId', 'isCurrent', 'jurisdictionId', 'legalEntityId', 'levelId', 'method', 'name', 'parentUnitId', 'verificationState', 'version', ] as const satisfies readonly BudgetaryUnitKey[];

export const BUDGETARY_UNIT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly BudgetaryUnitKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const BUDGETARY_UNIT_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'code', 'confidence', 'createdAt', 'geoUnitId', 'id', 'institutionId', 'isCurrent', 'jurisdictionId', 'legalEntityId', 'levelId', 'licence', 'method', 'name', 'parentUnitId', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly BudgetaryUnitKey[];

export const BUDGETARY_UNIT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly BudgetaryUnitSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const BUDGETARY_UNIT_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'code', 'confidence', 'geoUnitId', 'institutionId', 'isCurrent', 'jurisdictionId', 'legalEntityId', 'levelId', 'licence', 'method', 'name', 'parentUnitId', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly BudgetaryUnitKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const BUDGETARY_UNIT_AS_ONE_RELATION_CONFIG = {
  relation: 'budgetaryUnit',
  type: ERelationType.One,
  selectableFields: BUDGETARY_UNIT_SELECTABLE_FIELDS,
  defaultSelectFields: BUDGETARY_UNIT_DEFAULT_SELECT_FIELDS
} as const satisfies IBudgetaryUnitAsOneRelationConfig;

export const BUDGETARY_UNIT_AS_MANY_RELATION_CONFIG = {
  relation: 'budgetaryUnits',
  type: ERelationType.Many,
  selectableFields: BUDGETARY_UNIT_SELECTABLE_FIELDS,
  defaultSelectFields: BUDGETARY_UNIT_DEFAULT_SELECT_FIELDS,
  sortableFields: BUDGETARY_UNIT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IBudgetaryUnitAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const BUDGETARY_UNIT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<BudgetaryUnitRelationKey>().one(JurisdictionConfig.JURISDICTION_AS_ONE_RELATION_CONFIG, 'jurisdiction'),
] as const;

export const BUDGETARY_UNIT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const BUDGETARY_UNIT_QUERY_OPTIONS = {
  searchableFields: BUDGETARY_UNIT_SEARCHABLE_FIELDS,
  selectableFields: BUDGETARY_UNIT_SELECTABLE_FIELDS,
  defaultSelectFields: BUDGETARY_UNIT_DEFAULT_SELECT_FIELDS,
  sortableFields: BUDGETARY_UNIT_SORTABLE_FIELDS,
  filterFields: BUDGETARY_UNIT_FILTERABLE_FIELDS,
  dateRangeFields: BUDGETARY_UNIT_DATE_RANGE_FIELDS,
  oneRelations: BUDGETARY_UNIT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: BUDGETARY_UNIT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IBudgetaryUnit,
  BudgetaryUnitSortableField,
  BudgetaryUnitSelectableField,
  BudgetaryUnitFilterableField,
  BudgetaryUnitDateRangeField,
  BudgetaryUnitRelationKey,
  typeof BUDGETARY_UNIT_ONE_RELATION_QUERY_OPTIONS,
  typeof BUDGETARY_UNIT_MANY_RELATION_QUERY_OPTIONS
>;