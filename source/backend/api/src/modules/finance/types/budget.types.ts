// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { BudgetKind } from '#/types/finance/budget-kind.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as BudgetaryUnitTypes from '#/modules/finance/types/budgetary-unit.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  BUDGET_RELATION_KEYS,
  BUDGET_SORTABLE_FIELDS,
  BUDGET_SEARCHABLE_FIELDS,
  BUDGET_FILTERABLE_FIELDS,
  BUDGET_DATE_RANGE_FIELDS,
  BUDGET_SELECTABLE_FIELDS,
  BUDGET_DEFAULT_SELECT_FIELDS,
  BUDGET_EDITABLE_FIELDS
} from './budget.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Budget */
export interface IBudget extends B.IBase {
  approvedAmount: number;
  currencyCode: string;
  fiscalYearId: string;
  isCurrent: boolean;
  kind: BudgetKind;
  legalBasisId: string | null;
  programCode: string | null;
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

export type BudgetKey = keyof IBudget;

export type BudgetRelationKey = (typeof BUDGET_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IBudgetReadonlyFields = B.IBaseReadonlyFields;

export type IBudgetContextualFields = never;

export type IBudgetSensitiveFields = never;

export type IBudgetTransitionFields = never;

export type IBudgetImmutableFields =
  | IBudgetReadonlyFields
  | IBudgetContextualFields
  | IBudgetSensitiveFields
  | IBudgetTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IBudgetCreatable = Omit<IBudget, IBudgetImmutableFields | BudgetRelationKey>;

export type IBudgetSystemWritable = Omit<IBudget, B.IBaseReadonlyFields | BudgetRelationKey>;

export type IBudgetUpdatable = Partial<Omit<IBudget, IBudgetImmutableFields | BudgetRelationKey>>;

export interface IBudgetTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type BudgetSortableField = (typeof BUDGET_SORTABLE_FIELDS)[number];

export type BudgetSearchableField = (typeof BUDGET_SEARCHABLE_FIELDS)[number];

export type BudgetFilterableField = (typeof BUDGET_FILTERABLE_FIELDS)[number];

export type BudgetDateRangeField = (typeof BUDGET_DATE_RANGE_FIELDS)[number];

export type BudgetSelectableField = (typeof BUDGET_SELECTABLE_FIELDS)[number];

export type BudgetDefaultSelectField = (typeof BUDGET_DEFAULT_SELECT_FIELDS)[number];

export type BudgetEditableField = (typeof BUDGET_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IBudgetAsOneRelationConfig = Q.IOneRelationConfig<'budget', BudgetSelectableField>;

export type IBudgetAsManyRelationConfig = Q.IManyRelationConfig<'budgets', BudgetSelectableField, BudgetSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IBudgetAsOneRelationQuery = Q.IAsOneRelationQuery<IBudget, BudgetSelectableField>;

export type IBudgetAsManyRelationQuery = Q.IAsManyRelationQuery<IBudget, BudgetSelectableField, BudgetSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IBudgetRelationMap extends Record<BudgetRelationKey, unknown> {
  budgetaryUnit: BudgetaryUnitTypes.IBudgetaryUnitAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IBudgetRelationQueries = Q.IBaseRelationQueries<IBudget, BudgetRelationKey, IBudgetRelationMap>;

export type IBudgetItemQuery = Q.IBaseItemQuery<
  IBudget,
  BudgetRelationKey,
  BudgetSelectableField,
  BudgetRelationKey,
  BudgetSelectableField,
  IBudgetRelationMap,
  IBudgetRelationQueries
>;

export type IBudgetListQuery = Q.IBaseListQuery<
  IBudget,
  BudgetRelationKey,
  BudgetSelectableField,
  BudgetSortableField,
  BudgetRelationKey,
  BudgetSelectableField,
  BudgetSortableField,
  BudgetDateRangeField,
  BudgetFilterableField,
  IBudgetRelationMap,
  IBudgetRelationQueries,
  IBudgetItemQuery
>;