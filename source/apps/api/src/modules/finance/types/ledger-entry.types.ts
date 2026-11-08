// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { LedgerReferenceKind } from '#/types/finance/ledger-reference-kind.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as BudgetaryUnitTypes from '#/modules/finance/types/budgetary-unit.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  LEDGER_ENTRY_RELATION_KEYS,
  LEDGER_ENTRY_SORTABLE_FIELDS,
  LEDGER_ENTRY_SEARCHABLE_FIELDS,
  LEDGER_ENTRY_FILTERABLE_FIELDS,
  LEDGER_ENTRY_DATE_RANGE_FIELDS,
  LEDGER_ENTRY_SELECTABLE_FIELDS,
  LEDGER_ENTRY_DEFAULT_SELECT_FIELDS,
  LEDGER_ENTRY_EDITABLE_FIELDS
} from './ledger-entry.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Ledger Entry */
export interface ILedgerEntry extends B.IBase {
  accountCode: string;
  creditAmount: number;
  currencyCode: string;
  debitAmount: number;
  isCurrent: boolean;
  postedOn: Date;
  referenceId: string | null;
  referenceKind: LedgerReferenceKind;
  unitId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly budgetaryUnit?: BudgetaryUnitTypes.IBudgetaryUnit;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type LedgerEntryKey = keyof ILedgerEntry;

export type LedgerEntryRelationKey = (typeof LEDGER_ENTRY_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ILedgerEntryReadonlyFields = B.IBaseReadonlyFields;

export type ILedgerEntryContextualFields = never;

export type ILedgerEntrySensitiveFields = never;

export type ILedgerEntryTransitionFields = never;

export type ILedgerEntryImmutableFields =
  | ILedgerEntryReadonlyFields
  | ILedgerEntryContextualFields
  | ILedgerEntrySensitiveFields
  | ILedgerEntryTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ILedgerEntryCreatable = Omit<ILedgerEntry, ILedgerEntryImmutableFields | LedgerEntryRelationKey>;

export type ILedgerEntrySystemWritable = Omit<ILedgerEntry, B.IBaseReadonlyFields | LedgerEntryRelationKey>;

export type ILedgerEntryUpdatable = Partial<Omit<ILedgerEntry, ILedgerEntryImmutableFields | LedgerEntryRelationKey>>;

export interface ILedgerEntryTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type LedgerEntrySortableField = (typeof LEDGER_ENTRY_SORTABLE_FIELDS)[number];

export type LedgerEntrySearchableField = (typeof LEDGER_ENTRY_SEARCHABLE_FIELDS)[number];

export type LedgerEntryFilterableField = (typeof LEDGER_ENTRY_FILTERABLE_FIELDS)[number];

export type LedgerEntryDateRangeField = (typeof LEDGER_ENTRY_DATE_RANGE_FIELDS)[number];

export type LedgerEntrySelectableField = (typeof LEDGER_ENTRY_SELECTABLE_FIELDS)[number];

export type LedgerEntryDefaultSelectField = (typeof LEDGER_ENTRY_DEFAULT_SELECT_FIELDS)[number];

export type LedgerEntryEditableField = (typeof LEDGER_ENTRY_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ILedgerEntryAsOneRelationConfig = Q.IOneRelationConfig<'ledgerEntry', LedgerEntrySelectableField>;

export type ILedgerEntryAsManyRelationConfig = Q.IManyRelationConfig<'ledgerEntrys', LedgerEntrySelectableField, LedgerEntrySortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ILedgerEntryAsOneRelationQuery = Q.IAsOneRelationQuery<ILedgerEntry, LedgerEntrySelectableField>;

export type ILedgerEntryAsManyRelationQuery = Q.IAsManyRelationQuery<ILedgerEntry, LedgerEntrySelectableField, LedgerEntrySortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ILedgerEntryRelationMap extends Record<LedgerEntryRelationKey, unknown> {
  budgetaryUnit: BudgetaryUnitTypes.IBudgetaryUnitAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ILedgerEntryRelationQueries = Q.IBaseRelationQueries<ILedgerEntry, LedgerEntryRelationKey, ILedgerEntryRelationMap>;

export type ILedgerEntryItemQuery = Q.IBaseItemQuery<
  ILedgerEntry,
  LedgerEntryRelationKey,
  LedgerEntrySelectableField,
  LedgerEntryRelationKey,
  LedgerEntrySelectableField,
  ILedgerEntryRelationMap,
  ILedgerEntryRelationQueries
>;

export type ILedgerEntryListQuery = Q.IBaseListQuery<
  ILedgerEntry,
  LedgerEntryRelationKey,
  LedgerEntrySelectableField,
  LedgerEntrySortableField,
  LedgerEntryRelationKey,
  LedgerEntrySelectableField,
  LedgerEntrySortableField,
  LedgerEntryDateRangeField,
  LedgerEntryFilterableField,
  ILedgerEntryRelationMap,
  ILedgerEntryRelationQueries,
  ILedgerEntryItemQuery
>;