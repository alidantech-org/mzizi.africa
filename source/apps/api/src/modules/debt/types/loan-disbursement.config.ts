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
  ILoanDisbursement,
  LoanDisbursementKey,
  LoanDisbursementRelationKey,
  LoanDisbursementSortableField,
  LoanDisbursementFilterableField,
  LoanDisbursementDateRangeField,
  LoanDisbursementSelectableField,
  ILoanDisbursementAsOneRelationConfig,
  ILoanDisbursementAsManyRelationConfig
} from './loan-disbursement.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const LOAN_DISBURSEMENT_RELATION_KEYS = ['loan', ] as const satisfies readonly LoanDisbursementKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const LOAN_DISBURSEMENT_SORTABLE_FIELDS = ['createdAt', 'disbursedOn', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly LoanDisbursementKey[];

export const LOAN_DISBURSEMENT_SEARCHABLE_FIELDS = [] as const satisfies readonly LoanDisbursementKey[];

export const LOAN_DISBURSEMENT_FILTERABLE_FIELDS = ['amount', 'id', 'isCurrent', 'ledgerEntryId', 'loanId', 'version', ] as const satisfies readonly LoanDisbursementKey[];

export const LOAN_DISBURSEMENT_DATE_RANGE_FIELDS = ['createdAt', 'disbursedOn', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly LoanDisbursementKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const LOAN_DISBURSEMENT_SELECTABLE_FIELDS = ['amount', 'createdAt', 'currencyCode', 'disbursedOn', 'id', 'isCurrent', 'ledgerEntryId', 'loanId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly LoanDisbursementKey[];

export const LOAN_DISBURSEMENT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly LoanDisbursementSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const LOAN_DISBURSEMENT_EDITABLE_FIELDS = ['amount', 'currencyCode', 'disbursedOn', 'isCurrent', 'ledgerEntryId', 'loanId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly LoanDisbursementKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const LOAN_DISBURSEMENT_AS_ONE_RELATION_CONFIG = {
  relation: 'loanDisbursement',
  type: ERelationType.One,
  selectableFields: LOAN_DISBURSEMENT_SELECTABLE_FIELDS,
  defaultSelectFields: LOAN_DISBURSEMENT_DEFAULT_SELECT_FIELDS
} as const satisfies ILoanDisbursementAsOneRelationConfig;

export const LOAN_DISBURSEMENT_AS_MANY_RELATION_CONFIG = {
  relation: 'loanDisbursements',
  type: ERelationType.Many,
  selectableFields: LOAN_DISBURSEMENT_SELECTABLE_FIELDS,
  defaultSelectFields: LOAN_DISBURSEMENT_DEFAULT_SELECT_FIELDS,
  sortableFields: LOAN_DISBURSEMENT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ILoanDisbursementAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const LOAN_DISBURSEMENT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<LoanDisbursementRelationKey>().one(LoanConfig.LOAN_AS_ONE_RELATION_CONFIG, 'loan'),
] as const;

export const LOAN_DISBURSEMENT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const LOAN_DISBURSEMENT_QUERY_OPTIONS = {
  searchableFields: LOAN_DISBURSEMENT_SEARCHABLE_FIELDS,
  selectableFields: LOAN_DISBURSEMENT_SELECTABLE_FIELDS,
  defaultSelectFields: LOAN_DISBURSEMENT_DEFAULT_SELECT_FIELDS,
  sortableFields: LOAN_DISBURSEMENT_SORTABLE_FIELDS,
  filterFields: LOAN_DISBURSEMENT_FILTERABLE_FIELDS,
  dateRangeFields: LOAN_DISBURSEMENT_DATE_RANGE_FIELDS,
  oneRelations: LOAN_DISBURSEMENT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: LOAN_DISBURSEMENT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ILoanDisbursement,
  LoanDisbursementSortableField,
  LoanDisbursementSelectableField,
  LoanDisbursementFilterableField,
  LoanDisbursementDateRangeField,
  LoanDisbursementRelationKey,
  typeof LOAN_DISBURSEMENT_ONE_RELATION_QUERY_OPTIONS,
  typeof LOAN_DISBURSEMENT_MANY_RELATION_QUERY_OPTIONS
>;