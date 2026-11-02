// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as BudgetTypes from '#/modules/finance/types/budget.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  EXPENDITURE_RELATION_KEYS,
  EXPENDITURE_SORTABLE_FIELDS,
  EXPENDITURE_SEARCHABLE_FIELDS,
  EXPENDITURE_FILTERABLE_FIELDS,
  EXPENDITURE_DATE_RANGE_FIELDS,
  EXPENDITURE_SELECTABLE_FIELDS,
  EXPENDITURE_DEFAULT_SELECT_FIELDS,
  EXPENDITURE_EDITABLE_FIELDS
} from './expenditure.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Expenditure */
export interface IExpenditure extends B.IBase {
  amount: number;
  approverPersonId: string | null;
  artifactChecksum: string | null;
  artifactId: string | null;
  budgetId: string;
  confidence: number | null;
  contractId: string | null;
  currencyCode: string;
  isCurrent: boolean;
  licence: string | null;
  method: ProvenanceMethod;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  stageId: string;
  stageOrder: number;
  toolOrModel: string | null;
  unitId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly budget?: BudgetTypes.IBudget;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ExpenditureKey = keyof IExpenditure;

export type ExpenditureRelationKey = (typeof EXPENDITURE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IExpenditureReadonlyFields = B.IBaseReadonlyFields;

export type IExpenditureContextualFields = never;

export type IExpenditureSensitiveFields = never;

export type IExpenditureTransitionFields = never;

export type IExpenditureImmutableFields =
  | IExpenditureReadonlyFields
  | IExpenditureContextualFields
  | IExpenditureSensitiveFields
  | IExpenditureTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IExpenditureCreatable = Omit<IExpenditure, IExpenditureImmutableFields | ExpenditureRelationKey>;

export type IExpenditureSystemWritable = Omit<IExpenditure, B.IBaseReadonlyFields | ExpenditureRelationKey>;

export type IExpenditureUpdatable = Partial<Omit<IExpenditure, IExpenditureImmutableFields | ExpenditureRelationKey>>;

export interface IExpenditureTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ExpenditureSortableField = (typeof EXPENDITURE_SORTABLE_FIELDS)[number];

export type ExpenditureSearchableField = (typeof EXPENDITURE_SEARCHABLE_FIELDS)[number];

export type ExpenditureFilterableField = (typeof EXPENDITURE_FILTERABLE_FIELDS)[number];

export type ExpenditureDateRangeField = (typeof EXPENDITURE_DATE_RANGE_FIELDS)[number];

export type ExpenditureSelectableField = (typeof EXPENDITURE_SELECTABLE_FIELDS)[number];

export type ExpenditureDefaultSelectField = (typeof EXPENDITURE_DEFAULT_SELECT_FIELDS)[number];

export type ExpenditureEditableField = (typeof EXPENDITURE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IExpenditureAsOneRelationConfig = Q.IOneRelationConfig<'expenditure', ExpenditureSelectableField>;

export type IExpenditureAsManyRelationConfig = Q.IManyRelationConfig<'expenditures', ExpenditureSelectableField, ExpenditureSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IExpenditureAsOneRelationQuery = Q.IAsOneRelationQuery<IExpenditure, ExpenditureSelectableField>;

export type IExpenditureAsManyRelationQuery = Q.IAsManyRelationQuery<IExpenditure, ExpenditureSelectableField, ExpenditureSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IExpenditureRelationMap extends Record<ExpenditureRelationKey, unknown> {
  budget: BudgetTypes.IBudgetAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IExpenditureRelationQueries = Q.IBaseRelationQueries<IExpenditure, ExpenditureRelationKey, IExpenditureRelationMap>;

export type IExpenditureItemQuery = Q.IBaseItemQuery<
  IExpenditure,
  ExpenditureRelationKey,
  ExpenditureSelectableField,
  ExpenditureRelationKey,
  ExpenditureSelectableField,
  IExpenditureRelationMap,
  IExpenditureRelationQueries
>;

export type IExpenditureListQuery = Q.IBaseListQuery<
  IExpenditure,
  ExpenditureRelationKey,
  ExpenditureSelectableField,
  ExpenditureSortableField,
  ExpenditureRelationKey,
  ExpenditureSelectableField,
  ExpenditureSortableField,
  ExpenditureDateRangeField,
  ExpenditureFilterableField,
  IExpenditureRelationMap,
  IExpenditureRelationQueries,
  IExpenditureItemQuery
>;