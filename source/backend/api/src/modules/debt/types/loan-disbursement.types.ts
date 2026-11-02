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
import type * as LoanTypes from '#/modules/debt/types/loan.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  LOAN_DISBURSEMENT_RELATION_KEYS,
  LOAN_DISBURSEMENT_SORTABLE_FIELDS,
  LOAN_DISBURSEMENT_SEARCHABLE_FIELDS,
  LOAN_DISBURSEMENT_FILTERABLE_FIELDS,
  LOAN_DISBURSEMENT_DATE_RANGE_FIELDS,
  LOAN_DISBURSEMENT_SELECTABLE_FIELDS,
  LOAN_DISBURSEMENT_DEFAULT_SELECT_FIELDS,
  LOAN_DISBURSEMENT_EDITABLE_FIELDS
} from './loan-disbursement.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Loan Disbursement */
export interface ILoanDisbursement extends B.IBase {
  amount: number;
  artifactChecksum: string | null;
  artifactId: string | null;
  confidence: number | null;
  currencyCode: string;
  disbursedOn: Date;
  isCurrent: boolean;
  ledgerEntryId: string | null;
  licence: string | null;
  loanId: string;
  method: ProvenanceMethod;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  toolOrModel: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly loan?: LoanTypes.ILoan;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type LoanDisbursementKey = keyof ILoanDisbursement;

export type LoanDisbursementRelationKey = (typeof LOAN_DISBURSEMENT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ILoanDisbursementReadonlyFields = B.IBaseReadonlyFields;

export type ILoanDisbursementContextualFields = never;

export type ILoanDisbursementSensitiveFields = never;

export type ILoanDisbursementTransitionFields = never;

export type ILoanDisbursementImmutableFields =
  | ILoanDisbursementReadonlyFields
  | ILoanDisbursementContextualFields
  | ILoanDisbursementSensitiveFields
  | ILoanDisbursementTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ILoanDisbursementCreatable = Omit<ILoanDisbursement, ILoanDisbursementImmutableFields | LoanDisbursementRelationKey>;

export type ILoanDisbursementSystemWritable = Omit<ILoanDisbursement, B.IBaseReadonlyFields | LoanDisbursementRelationKey>;

export type ILoanDisbursementUpdatable = Partial<Omit<ILoanDisbursement, ILoanDisbursementImmutableFields | LoanDisbursementRelationKey>>;

export interface ILoanDisbursementTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type LoanDisbursementSortableField = (typeof LOAN_DISBURSEMENT_SORTABLE_FIELDS)[number];

export type LoanDisbursementSearchableField = (typeof LOAN_DISBURSEMENT_SEARCHABLE_FIELDS)[number];

export type LoanDisbursementFilterableField = (typeof LOAN_DISBURSEMENT_FILTERABLE_FIELDS)[number];

export type LoanDisbursementDateRangeField = (typeof LOAN_DISBURSEMENT_DATE_RANGE_FIELDS)[number];

export type LoanDisbursementSelectableField = (typeof LOAN_DISBURSEMENT_SELECTABLE_FIELDS)[number];

export type LoanDisbursementDefaultSelectField = (typeof LOAN_DISBURSEMENT_DEFAULT_SELECT_FIELDS)[number];

export type LoanDisbursementEditableField = (typeof LOAN_DISBURSEMENT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ILoanDisbursementAsOneRelationConfig = Q.IOneRelationConfig<'loanDisbursement', LoanDisbursementSelectableField>;

export type ILoanDisbursementAsManyRelationConfig = Q.IManyRelationConfig<'loanDisbursements', LoanDisbursementSelectableField, LoanDisbursementSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ILoanDisbursementAsOneRelationQuery = Q.IAsOneRelationQuery<ILoanDisbursement, LoanDisbursementSelectableField>;

export type ILoanDisbursementAsManyRelationQuery = Q.IAsManyRelationQuery<ILoanDisbursement, LoanDisbursementSelectableField, LoanDisbursementSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ILoanDisbursementRelationMap extends Record<LoanDisbursementRelationKey, unknown> {
  loan: LoanTypes.ILoanAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ILoanDisbursementRelationQueries = Q.IBaseRelationQueries<ILoanDisbursement, LoanDisbursementRelationKey, ILoanDisbursementRelationMap>;

export type ILoanDisbursementItemQuery = Q.IBaseItemQuery<
  ILoanDisbursement,
  LoanDisbursementRelationKey,
  LoanDisbursementSelectableField,
  LoanDisbursementRelationKey,
  LoanDisbursementSelectableField,
  ILoanDisbursementRelationMap,
  ILoanDisbursementRelationQueries
>;

export type ILoanDisbursementListQuery = Q.IBaseListQuery<
  ILoanDisbursement,
  LoanDisbursementRelationKey,
  LoanDisbursementSelectableField,
  LoanDisbursementSortableField,
  LoanDisbursementRelationKey,
  LoanDisbursementSelectableField,
  LoanDisbursementSortableField,
  LoanDisbursementDateRangeField,
  LoanDisbursementFilterableField,
  ILoanDisbursementRelationMap,
  ILoanDisbursementRelationQueries,
  ILoanDisbursementItemQuery
>;