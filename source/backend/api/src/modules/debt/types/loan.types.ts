// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { LoanStatus } from '#/types/debt/loan-status.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as BudgetaryUnitTypes from '#/modules/finance/types/budgetary-unit.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  LOAN_RELATION_KEYS,
  LOAN_SORTABLE_FIELDS,
  LOAN_SEARCHABLE_FIELDS,
  LOAN_FILTERABLE_FIELDS,
  LOAN_DATE_RANGE_FIELDS,
  LOAN_SELECTABLE_FIELDS,
  LOAN_DEFAULT_SELECT_FIELDS,
  LOAN_EDITABLE_FIELDS
} from './loan.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Loan */
export interface ILoan extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  borrowerUnitId: string;
  code: string;
  confidence: number | null;
  currencyCode: string;
  interestRate: number | null;
  isCurrent: boolean;
  legalBasisId: string | null;
  lenderEntityId: string | null;
  licence: string | null;
  method: ProvenanceMethod;
  principalAmount: number;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  status: LoanStatus;
  termMonths: number | null;
  toolOrModel: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly budgetaryUnit?: BudgetaryUnitTypes.IBudgetaryUnit;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type LoanKey = keyof ILoan;

export type LoanRelationKey = (typeof LOAN_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ILoanReadonlyFields = B.IBaseReadonlyFields;

export type ILoanContextualFields = never;

export type ILoanSensitiveFields = never;

export type ILoanTransitionFields = never;

export type ILoanImmutableFields =
  | ILoanReadonlyFields
  | ILoanContextualFields
  | ILoanSensitiveFields
  | ILoanTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ILoanCreatable = Omit<ILoan, ILoanImmutableFields | LoanRelationKey>;

export type ILoanSystemWritable = Omit<ILoan, B.IBaseReadonlyFields | LoanRelationKey>;

export type ILoanUpdatable = Partial<Omit<ILoan, ILoanImmutableFields | LoanRelationKey>>;

export interface ILoanTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type LoanSortableField = (typeof LOAN_SORTABLE_FIELDS)[number];

export type LoanSearchableField = (typeof LOAN_SEARCHABLE_FIELDS)[number];

export type LoanFilterableField = (typeof LOAN_FILTERABLE_FIELDS)[number];

export type LoanDateRangeField = (typeof LOAN_DATE_RANGE_FIELDS)[number];

export type LoanSelectableField = (typeof LOAN_SELECTABLE_FIELDS)[number];

export type LoanDefaultSelectField = (typeof LOAN_DEFAULT_SELECT_FIELDS)[number];

export type LoanEditableField = (typeof LOAN_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ILoanAsOneRelationConfig = Q.IOneRelationConfig<'loan', LoanSelectableField>;

export type ILoanAsManyRelationConfig = Q.IManyRelationConfig<'loans', LoanSelectableField, LoanSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ILoanAsOneRelationQuery = Q.IAsOneRelationQuery<ILoan, LoanSelectableField>;

export type ILoanAsManyRelationQuery = Q.IAsManyRelationQuery<ILoan, LoanSelectableField, LoanSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ILoanRelationMap extends Record<LoanRelationKey, unknown> {
  budgetaryUnit: BudgetaryUnitTypes.IBudgetaryUnitAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ILoanRelationQueries = Q.IBaseRelationQueries<ILoan, LoanRelationKey, ILoanRelationMap>;

export type ILoanItemQuery = Q.IBaseItemQuery<
  ILoan,
  LoanRelationKey,
  LoanSelectableField,
  LoanRelationKey,
  LoanSelectableField,
  ILoanRelationMap,
  ILoanRelationQueries
>;

export type ILoanListQuery = Q.IBaseListQuery<
  ILoan,
  LoanRelationKey,
  LoanSelectableField,
  LoanSortableField,
  LoanRelationKey,
  LoanSelectableField,
  LoanSortableField,
  LoanDateRangeField,
  LoanFilterableField,
  ILoanRelationMap,
  ILoanRelationQueries,
  ILoanItemQuery
>;