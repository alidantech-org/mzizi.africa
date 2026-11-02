// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as BudgetaryUnitConfig from '#/modules/finance/types/budgetary-unit.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ITransfer,
  TransferKey,
  TransferRelationKey,
  TransferSortableField,
  TransferFilterableField,
  TransferDateRangeField,
  TransferSelectableField,
  ITransferAsOneRelationConfig,
  ITransferAsManyRelationConfig
} from './transfer.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const TRANSFER_RELATION_KEYS = ['budgetaryUnit', ] as const satisfies readonly TransferKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const TRANSFER_SORTABLE_FIELDS = ['amount', 'createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly TransferKey[];

export const TRANSFER_SEARCHABLE_FIELDS = [] as const satisfies readonly TransferKey[];

export const TRANSFER_FILTERABLE_FIELDS = ['amount', 'fiscalYearId', 'fromUnitId', 'id', 'isCurrent', 'legalBasisId', 'method', 'restriction', 'status', 'toUnitId', 'transferTypeId', 'verificationState', 'version', ] as const satisfies readonly TransferKey[];

export const TRANSFER_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly TransferKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const TRANSFER_SELECTABLE_FIELDS = ['amount', 'artifactChecksum', 'artifactId', 'confidence', 'createdAt', 'currencyCode', 'fiscalYearId', 'fromUnitId', 'id', 'isCurrent', 'legalBasisId', 'licence', 'method', 'restriction', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'status', 'toUnitId', 'toolOrModel', 'transferTypeId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly TransferKey[];

export const TRANSFER_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly TransferSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const TRANSFER_EDITABLE_FIELDS = ['amount', 'artifactChecksum', 'artifactId', 'confidence', 'currencyCode', 'fiscalYearId', 'fromUnitId', 'isCurrent', 'legalBasisId', 'licence', 'method', 'restriction', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'status', 'toUnitId', 'toolOrModel', 'transferTypeId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly TransferKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const TRANSFER_AS_ONE_RELATION_CONFIG = {
  relation: 'transfer',
  type: ERelationType.One,
  selectableFields: TRANSFER_SELECTABLE_FIELDS,
  defaultSelectFields: TRANSFER_DEFAULT_SELECT_FIELDS
} as const satisfies ITransferAsOneRelationConfig;

export const TRANSFER_AS_MANY_RELATION_CONFIG = {
  relation: 'transfers',
  type: ERelationType.Many,
  selectableFields: TRANSFER_SELECTABLE_FIELDS,
  defaultSelectFields: TRANSFER_DEFAULT_SELECT_FIELDS,
  sortableFields: TRANSFER_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ITransferAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const TRANSFER_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<TransferRelationKey>().one(BudgetaryUnitConfig.BUDGETARY_UNIT_AS_ONE_RELATION_CONFIG, 'budgetaryUnit'),
] as const;

export const TRANSFER_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const TRANSFER_QUERY_OPTIONS = {
  searchableFields: TRANSFER_SEARCHABLE_FIELDS,
  selectableFields: TRANSFER_SELECTABLE_FIELDS,
  defaultSelectFields: TRANSFER_DEFAULT_SELECT_FIELDS,
  sortableFields: TRANSFER_SORTABLE_FIELDS,
  filterFields: TRANSFER_FILTERABLE_FIELDS,
  dateRangeFields: TRANSFER_DATE_RANGE_FIELDS,
  oneRelations: TRANSFER_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: TRANSFER_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ITransfer,
  TransferSortableField,
  TransferSelectableField,
  TransferFilterableField,
  TransferDateRangeField,
  TransferRelationKey,
  typeof TRANSFER_ONE_RELATION_QUERY_OPTIONS,
  typeof TRANSFER_MANY_RELATION_QUERY_OPTIONS
>;