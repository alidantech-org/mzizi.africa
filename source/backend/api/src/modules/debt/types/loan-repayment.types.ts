// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as LoanTypes from '#/modules/debt/types/loan.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  LOAN_REPAYMENT_RELATION_KEYS,
  LOAN_REPAYMENT_SORTABLE_FIELDS,
  LOAN_REPAYMENT_SEARCHABLE_FIELDS,
  LOAN_REPAYMENT_FILTERABLE_FIELDS,
  LOAN_REPAYMENT_DATE_RANGE_FIELDS,
  LOAN_REPAYMENT_SELECTABLE_FIELDS,
  LOAN_REPAYMENT_DEFAULT_SELECT_FIELDS,
  LOAN_REPAYMENT_EDITABLE_FIELDS
} from './loan-repayment.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Loan Repayment */
export interface ILoanRepayment extends B.IBase {
  currencyCode: string;
  feesPaid: number | null;
  interestPaid: number;
  isCurrent: boolean;
  ledgerEntryId: string | null;
  loanId: string;
  paidOn: Date;
  principalPaid: number;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  readonly loan?: LoanTypes.ILoan;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type LoanRepaymentKey = keyof ILoanRepayment;

export type LoanRepaymentRelationKey = (typeof LOAN_REPAYMENT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ILoanRepaymentReadonlyFields = B.IBaseReadonlyFields;

export type ILoanRepaymentContextualFields = never;

export type ILoanRepaymentSensitiveFields = never;

export type ILoanRepaymentTransitionFields = never;

export type ILoanRepaymentImmutableFields =
  | ILoanRepaymentReadonlyFields
  | ILoanRepaymentContextualFields
  | ILoanRepaymentSensitiveFields
  | ILoanRepaymentTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ILoanRepaymentCreatable = Omit<ILoanRepayment, ILoanRepaymentImmutableFields | LoanRepaymentRelationKey>;

export type ILoanRepaymentSystemWritable = Omit<ILoanRepayment, B.IBaseReadonlyFields | LoanRepaymentRelationKey>;

export type ILoanRepaymentUpdatable = Partial<Omit<ILoanRepayment, ILoanRepaymentImmutableFields | LoanRepaymentRelationKey>>;

export interface ILoanRepaymentTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type LoanRepaymentSortableField = (typeof LOAN_REPAYMENT_SORTABLE_FIELDS)[number];

export type LoanRepaymentSearchableField = (typeof LOAN_REPAYMENT_SEARCHABLE_FIELDS)[number];

export type LoanRepaymentFilterableField = (typeof LOAN_REPAYMENT_FILTERABLE_FIELDS)[number];

export type LoanRepaymentDateRangeField = (typeof LOAN_REPAYMENT_DATE_RANGE_FIELDS)[number];

export type LoanRepaymentSelectableField = (typeof LOAN_REPAYMENT_SELECTABLE_FIELDS)[number];

export type LoanRepaymentDefaultSelectField = (typeof LOAN_REPAYMENT_DEFAULT_SELECT_FIELDS)[number];

export type LoanRepaymentEditableField = (typeof LOAN_REPAYMENT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ILoanRepaymentAsOneRelationConfig = Q.IOneRelationConfig<'loanRepayment', LoanRepaymentSelectableField>;

export type ILoanRepaymentAsManyRelationConfig = Q.IManyRelationConfig<'loanRepayments', LoanRepaymentSelectableField, LoanRepaymentSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ILoanRepaymentAsOneRelationQuery = Q.IAsOneRelationQuery<ILoanRepayment, LoanRepaymentSelectableField>;

export type ILoanRepaymentAsManyRelationQuery = Q.IAsManyRelationQuery<ILoanRepayment, LoanRepaymentSelectableField, LoanRepaymentSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ILoanRepaymentRelationMap extends Record<LoanRepaymentRelationKey, unknown> {
  loan: LoanTypes.ILoanAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ILoanRepaymentRelationQueries = Q.IBaseRelationQueries<ILoanRepayment, LoanRepaymentRelationKey, ILoanRepaymentRelationMap>;

export type ILoanRepaymentItemQuery = Q.IBaseItemQuery<
  ILoanRepayment,
  LoanRepaymentRelationKey,
  LoanRepaymentSelectableField,
  LoanRepaymentRelationKey,
  LoanRepaymentSelectableField,
  ILoanRepaymentRelationMap,
  ILoanRepaymentRelationQueries
>;

export type ILoanRepaymentListQuery = Q.IBaseListQuery<
  ILoanRepayment,
  LoanRepaymentRelationKey,
  LoanRepaymentSelectableField,
  LoanRepaymentSortableField,
  LoanRepaymentRelationKey,
  LoanRepaymentSelectableField,
  LoanRepaymentSortableField,
  LoanRepaymentDateRangeField,
  LoanRepaymentFilterableField,
  ILoanRepaymentRelationMap,
  ILoanRepaymentRelationQueries,
  ILoanRepaymentItemQuery
>;