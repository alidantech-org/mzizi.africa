// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as LoanConfig from '#/modules/debt/types/loan.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ILoanRepayment,
  LoanRepaymentKey,
  LoanRepaymentRelationKey,
  LoanRepaymentSortableField,
  LoanRepaymentFilterableField,
  LoanRepaymentDateRangeField,
  LoanRepaymentSelectableField,
  ILoanRepaymentAsOneRelationConfig,
  ILoanRepaymentAsManyRelationConfig
} from './loan-repayment.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const LOAN_REPAYMENT_RELATION_KEYS = ['loan', ] as const satisfies readonly LoanRepaymentKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const LOAN_REPAYMENT_SORTABLE_FIELDS = ['createdAt', 'paidOn', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly LoanRepaymentKey[];

export const LOAN_REPAYMENT_SEARCHABLE_FIELDS = [] as const satisfies readonly LoanRepaymentKey[];

export const LOAN_REPAYMENT_FILTERABLE_FIELDS = ['id', 'isCurrent', 'ledgerEntryId', 'loanId', 'version', ] as const satisfies readonly LoanRepaymentKey[];

export const LOAN_REPAYMENT_DATE_RANGE_FIELDS = ['createdAt', 'paidOn', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly LoanRepaymentKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const LOAN_REPAYMENT_SELECTABLE_FIELDS = ['createdAt', 'currencyCode', 'feesPaid', 'id', 'interestPaid', 'isCurrent', 'ledgerEntryId', 'loanId', 'paidOn', 'principalPaid', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly LoanRepaymentKey[];

export const LOAN_REPAYMENT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly LoanRepaymentSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const LOAN_REPAYMENT_EDITABLE_FIELDS = ['currencyCode', 'feesPaid', 'interestPaid', 'isCurrent', 'ledgerEntryId', 'loanId', 'paidOn', 'principalPaid', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly LoanRepaymentKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const LOAN_REPAYMENT_AS_ONE_RELATION_CONFIG = {
  relation: 'loanRepayment',
  type: ERelationType.One,
  selectableFields: LOAN_REPAYMENT_SELECTABLE_FIELDS,
  defaultSelectFields: LOAN_REPAYMENT_DEFAULT_SELECT_FIELDS
} as const satisfies ILoanRepaymentAsOneRelationConfig;

export const LOAN_REPAYMENT_AS_MANY_RELATION_CONFIG = {
  relation: 'loanRepayments',
  type: ERelationType.Many,
  selectableFields: LOAN_REPAYMENT_SELECTABLE_FIELDS,
  defaultSelectFields: LOAN_REPAYMENT_DEFAULT_SELECT_FIELDS,
  sortableFields: LOAN_REPAYMENT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ILoanRepaymentAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const LOAN_REPAYMENT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<LoanRepaymentRelationKey>().one(LoanConfig.LOAN_AS_ONE_RELATION_CONFIG, 'loan'),
] as const;

export const LOAN_REPAYMENT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const LOAN_REPAYMENT_QUERY_OPTIONS = {
  searchableFields: LOAN_REPAYMENT_SEARCHABLE_FIELDS,
  selectableFields: LOAN_REPAYMENT_SELECTABLE_FIELDS,
  defaultSelectFields: LOAN_REPAYMENT_DEFAULT_SELECT_FIELDS,
  sortableFields: LOAN_REPAYMENT_SORTABLE_FIELDS,
  filterFields: LOAN_REPAYMENT_FILTERABLE_FIELDS,
  dateRangeFields: LOAN_REPAYMENT_DATE_RANGE_FIELDS,
  oneRelations: LOAN_REPAYMENT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: LOAN_REPAYMENT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ILoanRepayment,
  LoanRepaymentSortableField,
  LoanRepaymentSelectableField,
  LoanRepaymentFilterableField,
  LoanRepaymentDateRangeField,
  LoanRepaymentRelationKey,
  typeof LOAN_REPAYMENT_ONE_RELATION_QUERY_OPTIONS,
  typeof LOAN_REPAYMENT_MANY_RELATION_QUERY_OPTIONS
>;