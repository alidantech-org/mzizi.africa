// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ILoan,
  LoanKey,
  LoanRelationKey,
  LoanSortableField,
  LoanFilterableField,
  LoanDateRangeField,
  LoanSelectableField,
  ILoanAsOneRelationConfig,
  ILoanAsManyRelationConfig
} from './loan.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const LOAN_RELATION_KEYS = [] as const satisfies readonly LoanKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const LOAN_SORTABLE_FIELDS = ['code', 'createdAt', 'principalAmount', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly LoanKey[];

export const LOAN_SEARCHABLE_FIELDS = ['code', ] as const satisfies readonly LoanKey[];

export const LOAN_FILTERABLE_FIELDS = ['borrowerUnitId', 'code', 'id', 'isCurrent', 'legalBasisId', 'lenderEntityId', 'principalAmount', 'status', 'version', ] as const satisfies readonly LoanKey[];

export const LOAN_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly LoanKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const LOAN_SELECTABLE_FIELDS = ['borrowerUnitId', 'code', 'createdAt', 'currencyCode', 'id', 'interestRate', 'isCurrent', 'legalBasisId', 'lenderEntityId', 'principalAmount', 'status', 'termMonths', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly LoanKey[];

export const LOAN_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly LoanSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const LOAN_EDITABLE_FIELDS = ['borrowerUnitId', 'code', 'currencyCode', 'interestRate', 'isCurrent', 'legalBasisId', 'lenderEntityId', 'principalAmount', 'status', 'termMonths', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', ] as const satisfies readonly LoanKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const LOAN_AS_ONE_RELATION_CONFIG = {
  relation: 'loan',
  type: ERelationType.One,
  selectableFields: LOAN_SELECTABLE_FIELDS,
  defaultSelectFields: LOAN_DEFAULT_SELECT_FIELDS
} as const satisfies ILoanAsOneRelationConfig;

export const LOAN_AS_MANY_RELATION_CONFIG = {
  relation: 'loans',
  type: ERelationType.Many,
  selectableFields: LOAN_SELECTABLE_FIELDS,
  defaultSelectFields: LOAN_DEFAULT_SELECT_FIELDS,
  sortableFields: LOAN_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies ILoanAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const LOAN_ONE_RELATION_QUERY_OPTIONS = [
] as const;

export const LOAN_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const LOAN_QUERY_OPTIONS = {
  searchableFields: LOAN_SEARCHABLE_FIELDS,
  selectableFields: LOAN_SELECTABLE_FIELDS,
  defaultSelectFields: LOAN_DEFAULT_SELECT_FIELDS,
  sortableFields: LOAN_SORTABLE_FIELDS,
  filterFields: LOAN_FILTERABLE_FIELDS,
  dateRangeFields: LOAN_DATE_RANGE_FIELDS,
  oneRelations: LOAN_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: LOAN_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  ILoan,
  LoanSortableField,
  LoanSelectableField,
  LoanFilterableField,
  LoanDateRangeField,
  LoanRelationKey,
  typeof LOAN_ONE_RELATION_QUERY_OPTIONS,
  typeof LOAN_MANY_RELATION_QUERY_OPTIONS
>;