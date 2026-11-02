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
  ILedgerEntry,
  LedgerEntryKey,
  LedgerEntryRelationKey,
  LedgerEntrySortableField,
  LedgerEntryFilterableField,
  LedgerEntryDateRangeField,
  LedgerEntrySelectableField,
  ILedgerEntryAsOneRelationConfig,
  ILedgerEntryAsManyRelationConfig
} from './ledger-entry.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const LEDGER_ENTRY_RELATION_KEYS = ['budgetaryUnit', ] as const satisfies readonly LedgerEntryKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const LEDGER_ENTRY_SORTABLE_FIELDS = ['createdAt', 'postedOn', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly LedgerEntryKey[];

export const LEDGER_ENTRY_SEARCHABLE_FIELDS = [] as const satisfies readonly LedgerEntryKey[];

export const LEDGER_ENTRY_FILTERABLE_FIELDS = ['accountCode', 'creditAmount', 'debitAmount', 'id', 'isCurrent', 'referenceId', 'referenceKind', 'unitId', 'version', ] as const satisfies readonly LedgerEntryKey[];

export const LEDGER_ENTRY_DATE_RANGE_FIELDS = ['createdAt', 'postedOn', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly LedgerEntryKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const LEDGER_ENTRY_SELECTABLE_FIELDS = ['accountCode', 'createdAt', 'creditAmount', 'currencyCode', 'debitAmount', 'id', 'isCurrent', 'postedOn', 'referenceId', 'referenceKind', 'unitId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly LedgerEntryKey[];

export const LEDGER_ENTRY_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly LedgerEntrySelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const LEDGER_ENTRY_EDITABLE_FIELDS = ['accountCode', 'creditAmount', 'currencyCode', 'debitAmount', 'isCurrent', 'postedOn', 'referenceId', 'referenceKind', 'unitId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly LedgerEntryKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const LEDGER_ENTRY_AS_ONE_RELATION_CONFIG = {
  relation: 'ledgerEntry',
  type: ERelationType.One,
  selectableFields: LEDGER_ENTRY_SELECTABLE_FIELDS,
  defaultSelectFields: LEDGER_ENTRY_DEFAULT_SELECT_FIELDS
} as const satisfies ILedgerEntryAsOneRelationConfig;

export const LEDGER_ENTRY_AS_MANY_RELATION_CONFIG = {
  relation: 'ledgerEntrys',
  type: ERelationType.Many,
  selectableFields: LEDGER_ENTRY_SELECTABLE_FIELDS,
  defaultSelectFields: LEDGER_ENTRY_DEFAULT_SELECT_FIELDS,
  sortableFields: LEDGER_ENTRY_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ILedgerEntryAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const LEDGER_ENTRY_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<LedgerEntryRelationKey>().one(BudgetaryUnitConfig.BUDGETARY_UNIT_AS_ONE_RELATION_CONFIG, 'budgetaryUnit'),
] as const;

export const LEDGER_ENTRY_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const LEDGER_ENTRY_QUERY_OPTIONS = {
  searchableFields: LEDGER_ENTRY_SEARCHABLE_FIELDS,
  selectableFields: LEDGER_ENTRY_SELECTABLE_FIELDS,
  defaultSelectFields: LEDGER_ENTRY_DEFAULT_SELECT_FIELDS,
  sortableFields: LEDGER_ENTRY_SORTABLE_FIELDS,
  filterFields: LEDGER_ENTRY_FILTERABLE_FIELDS,
  dateRangeFields: LEDGER_ENTRY_DATE_RANGE_FIELDS,
  oneRelations: LEDGER_ENTRY_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: LEDGER_ENTRY_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ILedgerEntry,
  LedgerEntrySortableField,
  LedgerEntrySelectableField,
  LedgerEntryFilterableField,
  LedgerEntryDateRangeField,
  LedgerEntryRelationKey,
  typeof LEDGER_ENTRY_ONE_RELATION_QUERY_OPTIONS,
  typeof LEDGER_ENTRY_MANY_RELATION_QUERY_OPTIONS
>;