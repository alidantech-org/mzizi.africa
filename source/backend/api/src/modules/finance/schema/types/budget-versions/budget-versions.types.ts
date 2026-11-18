// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as BudgetsTypes from "#/modules/finance/schema/types/budgets/budgets.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  BUDGET_VERSIONS_RELATION_KEYS,
  BUDGET_VERSIONS_SORTABLE_FIELDS,
  BUDGET_VERSIONS_SEARCHABLE_FIELDS,
  BUDGET_VERSIONS_FILTERABLE_FIELDS,
  BUDGET_VERSIONS_DATE_RANGE_FIELDS,
  BUDGET_VERSIONS_SELECTABLE_FIELDS,
  BUDGET_VERSIONS_DEFAULT_SELECT_FIELDS,
  BUDGET_VERSIONS_EDITABLE_FIELDS,
} from "./budget-versions.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One ordered release or revision of a budget, preserving original and supplementary versions separately. */
export interface IBudgetVersions extends B.IBase {
  budgetId: string;
  releasedOn: Date | null;
  revision: number;
  sourceCitationId: string | null;
  statusId: string;
  readonly budget?: BudgetsTypes.IBudgets;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly status?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type BudgetVersionsKey = keyof IBudgetVersions;

export type BudgetVersionsRelationKey = (typeof BUDGET_VERSIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IBudgetVersionsReadonlyFields = B.IBaseReadonlyFields;

export type IBudgetVersionsContextualFields = never;

export type IBudgetVersionsSensitiveFields = never;

export type IBudgetVersionsTransitionFields = never;

export type IBudgetVersionsImmutableFields =
  | IBudgetVersionsReadonlyFields
  | IBudgetVersionsContextualFields
  | IBudgetVersionsSensitiveFields
  | IBudgetVersionsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IBudgetVersionsCreatable = Omit<
  IBudgetVersions,
  IBudgetVersionsImmutableFields | BudgetVersionsRelationKey
>;

export type IBudgetVersionsSystemWritable = Omit<
  IBudgetVersions,
  B.IBaseReadonlyFields | BudgetVersionsRelationKey
>;

export type IBudgetVersionsUpdatable = Partial<
  Omit<IBudgetVersions, IBudgetVersionsImmutableFields | BudgetVersionsRelationKey>
>;

export interface IBudgetVersionsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type BudgetVersionsSortableField = (typeof BUDGET_VERSIONS_SORTABLE_FIELDS)[number];

export type BudgetVersionsSearchableField = (typeof BUDGET_VERSIONS_SEARCHABLE_FIELDS)[number];

export type BudgetVersionsFilterableField = (typeof BUDGET_VERSIONS_FILTERABLE_FIELDS)[number];

export type BudgetVersionsDateRangeField = (typeof BUDGET_VERSIONS_DATE_RANGE_FIELDS)[number];

export type BudgetVersionsSelectableField = (typeof BUDGET_VERSIONS_SELECTABLE_FIELDS)[number];

export type BudgetVersionsDefaultSelectField =
  (typeof BUDGET_VERSIONS_DEFAULT_SELECT_FIELDS)[number];

export type BudgetVersionsEditableField = (typeof BUDGET_VERSIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IBudgetVersionsAsOneRelationConfig = Q.IOneRelationConfig<
  "budgetVersions",
  BudgetVersionsSelectableField
>;

export type IBudgetVersionsAsManyRelationConfig = Q.IManyRelationConfig<
  "budgetVersions",
  BudgetVersionsSelectableField,
  BudgetVersionsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IBudgetVersionsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IBudgetVersions,
  BudgetVersionsSelectableField
>;

export type IBudgetVersionsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IBudgetVersions,
  BudgetVersionsSelectableField,
  BudgetVersionsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IBudgetVersionsRelationMap extends Record<BudgetVersionsRelationKey, unknown> {
  budget: BudgetsTypes.IBudgetsAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  status: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IBudgetVersionsRelationQueries = Q.IBaseRelationQueries<
  IBudgetVersions,
  BudgetVersionsRelationKey,
  IBudgetVersionsRelationMap
>;

export type IBudgetVersionsItemQuery = Q.IBaseItemQuery<
  IBudgetVersions,
  BudgetVersionsRelationKey,
  BudgetVersionsSelectableField,
  BudgetVersionsRelationKey,
  BudgetVersionsSelectableField,
  IBudgetVersionsRelationMap,
  IBudgetVersionsRelationQueries
>;

export type IBudgetVersionsListQuery = Q.IBaseListQuery<
  IBudgetVersions,
  BudgetVersionsRelationKey,
  BudgetVersionsSelectableField,
  BudgetVersionsSortableField,
  BudgetVersionsRelationKey,
  BudgetVersionsSelectableField,
  BudgetVersionsSortableField,
  BudgetVersionsDateRangeField,
  BudgetVersionsFilterableField,
  IBudgetVersionsRelationMap,
  IBudgetVersionsRelationQueries,
  IBudgetVersionsItemQuery
>;
