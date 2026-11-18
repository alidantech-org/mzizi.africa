// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as FiscalPeriodsTypes from "#/modules/finance/schema/types/fiscal-periods/fiscal-periods.types";
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  BUDGETS_RELATION_KEYS,
  BUDGETS_SORTABLE_FIELDS,
  BUDGETS_SEARCHABLE_FIELDS,
  BUDGETS_FILTERABLE_FIELDS,
  BUDGETS_DATE_RANGE_FIELDS,
  BUDGETS_SELECTABLE_FIELDS,
  BUDGETS_DEFAULT_SELECT_FIELDS,
  BUDGETS_EDITABLE_FIELDS,
} from "./budgets.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One institutional/country budget identity for a fiscal period and budget classification. */
export interface IBudgets extends B.IBase {
  budgetKindId: string;
  code: string;
  countryId: string | null;
  fiscalPeriodId: string;
  governmentEntityId: string | null;
  sourceCitationId: string | null;
  readonly budgetKind?: ValueTypes.IValue;
  readonly country?: CountryTypes.ICountry;
  readonly fiscalPeriod?: FiscalPeriodsTypes.IFiscalPeriods;
  readonly governmentEntity?: EntitiesTypes.IEntities;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type BudgetsKey = keyof IBudgets;

export type BudgetsRelationKey = (typeof BUDGETS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IBudgetsReadonlyFields = B.IBaseReadonlyFields;

export type IBudgetsContextualFields = never;

export type IBudgetsSensitiveFields = never;

export type IBudgetsTransitionFields = never;

export type IBudgetsImmutableFields =
  | IBudgetsReadonlyFields
  | IBudgetsContextualFields
  | IBudgetsSensitiveFields
  | IBudgetsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IBudgetsCreatable = Omit<IBudgets, IBudgetsImmutableFields | BudgetsRelationKey>;

export type IBudgetsSystemWritable = Omit<IBudgets, B.IBaseReadonlyFields | BudgetsRelationKey>;

export type IBudgetsUpdatable = Partial<
  Omit<IBudgets, IBudgetsImmutableFields | BudgetsRelationKey>
>;

export interface IBudgetsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type BudgetsSortableField = (typeof BUDGETS_SORTABLE_FIELDS)[number];

export type BudgetsSearchableField = (typeof BUDGETS_SEARCHABLE_FIELDS)[number];

export type BudgetsFilterableField = (typeof BUDGETS_FILTERABLE_FIELDS)[number];

export type BudgetsDateRangeField = (typeof BUDGETS_DATE_RANGE_FIELDS)[number];

export type BudgetsSelectableField = (typeof BUDGETS_SELECTABLE_FIELDS)[number];

export type BudgetsDefaultSelectField = (typeof BUDGETS_DEFAULT_SELECT_FIELDS)[number];

export type BudgetsEditableField = (typeof BUDGETS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IBudgetsAsOneRelationConfig = Q.IOneRelationConfig<"budgets", BudgetsSelectableField>;

export type IBudgetsAsManyRelationConfig = Q.IManyRelationConfig<
  "budgets",
  BudgetsSelectableField,
  BudgetsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IBudgetsAsOneRelationQuery = Q.IAsOneRelationQuery<IBudgets, BudgetsSelectableField>;

export type IBudgetsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IBudgets,
  BudgetsSelectableField,
  BudgetsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IBudgetsRelationMap extends Record<BudgetsRelationKey, unknown> {
  budgetKind: ValueTypes.IValueAsOneRelationQuery;
  country: CountryTypes.ICountryAsOneRelationQuery;
  fiscalPeriod: FiscalPeriodsTypes.IFiscalPeriodsAsOneRelationQuery;
  governmentEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IBudgetsRelationQueries = Q.IBaseRelationQueries<
  IBudgets,
  BudgetsRelationKey,
  IBudgetsRelationMap
>;

export type IBudgetsItemQuery = Q.IBaseItemQuery<
  IBudgets,
  BudgetsRelationKey,
  BudgetsSelectableField,
  BudgetsRelationKey,
  BudgetsSelectableField,
  IBudgetsRelationMap,
  IBudgetsRelationQueries
>;

export type IBudgetsListQuery = Q.IBaseListQuery<
  IBudgets,
  BudgetsRelationKey,
  BudgetsSelectableField,
  BudgetsSortableField,
  BudgetsRelationKey,
  BudgetsSelectableField,
  BudgetsSortableField,
  BudgetsDateRangeField,
  BudgetsFilterableField,
  IBudgetsRelationMap,
  IBudgetsRelationQueries,
  IBudgetsItemQuery
>;
