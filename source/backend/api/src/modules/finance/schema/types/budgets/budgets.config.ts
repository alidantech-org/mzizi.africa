// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as CountryConfig from "#/modules/reference/schema/types/country/country.config";
import * as FiscalPeriodsConfig from "#/modules/finance/schema/types/fiscal-periods/fiscal-periods.config";
import * as EntitiesConfig from "#/modules/official/schema/types/entities/entities.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IBudgets,
  BudgetsKey,
  BudgetsRelationKey,
  BudgetsSortableField,
  BudgetsFilterableField,
  BudgetsDateRangeField,
  BudgetsSelectableField,
  IBudgetsAsOneRelationConfig,
  IBudgetsAsManyRelationConfig,
} from "./budgets.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const BUDGETS_RELATION_KEYS = [
  "budgetKind",
  "country",
  "fiscalPeriod",
  "governmentEntity",
  "sourceCitation",
] as const satisfies readonly BudgetsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const BUDGETS_SORTABLE_FIELDS = [
  "budgetKindId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "fiscalPeriodId",
  "governmentEntityId",
  "id",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly BudgetsKey[];

export const BUDGETS_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly BudgetsKey[];

export const BUDGETS_FILTERABLE_FIELDS = [
  "budgetKindId",
  "countryId",
  "fiscalPeriodId",
  "governmentEntityId",
  "id",
  "sourceCitationId",
] as const satisfies readonly BudgetsKey[];

export const BUDGETS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly BudgetsKey[];

export const BUDGETS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IBudgets> = {
  searchableFields: [...BUDGETS_SEARCHABLE_FIELDS],
  filterFields: [...BUDGETS_FILTERABLE_FIELDS],
  dateRangeFields: [...BUDGETS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const BUDGETS_SELECTABLE_FIELDS = [
  "budgetKindId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "fiscalPeriodId",
  "governmentEntityId",
  "id",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly BudgetsKey[];

export const BUDGETS_DEFAULT_SELECT_FIELDS = [
  "budgetKindId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "fiscalPeriodId",
  "governmentEntityId",
  "id",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly BudgetsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const BUDGETS_EDITABLE_FIELDS = [
  "budgetKindId",
  "code",
  "countryId",
  "fiscalPeriodId",
  "governmentEntityId",
  "sourceCitationId",
] as const satisfies readonly BudgetsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const BUDGETS_AS_ONE_RELATION_CONFIG = {
  relation: "budgets",
  type: ERelationType.One,
  selectableFields: BUDGETS_SELECTABLE_FIELDS,
  defaultSelectFields: BUDGETS_DEFAULT_SELECT_FIELDS,
} as const satisfies IBudgetsAsOneRelationConfig;

export const BUDGETS_AS_MANY_RELATION_CONFIG = {
  relation: "budgets",
  type: ERelationType.Many,
  selectableFields: BUDGETS_SELECTABLE_FIELDS,
  defaultSelectFields: BUDGETS_DEFAULT_SELECT_FIELDS,
  sortableFields: BUDGETS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IBudgetsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const BUDGETS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<BudgetsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "budgetKind",
  ),
  Q.createRelationKeyMapper<BudgetsRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<BudgetsRelationKey>().one(
    () => FiscalPeriodsConfig.FISCAL_PERIODS_AS_ONE_RELATION_CONFIG,
    "fiscalPeriod",
  ),
  Q.createRelationKeyMapper<BudgetsRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "governmentEntity",
  ),
  Q.createRelationKeyMapper<BudgetsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const BUDGETS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const BUDGETS_QUERY_OPTIONS = {
  searchableFields: BUDGETS_SEARCHABLE_FIELDS,
  selectableFields: BUDGETS_SELECTABLE_FIELDS,
  defaultSelectFields: BUDGETS_DEFAULT_SELECT_FIELDS,
  sortableFields: BUDGETS_SORTABLE_FIELDS,
  filterFields: BUDGETS_FILTERABLE_FIELDS,
  dateRangeFields: BUDGETS_DATE_RANGE_FIELDS,
  relationKeys: BUDGETS_RELATION_KEYS,
  editableFields: BUDGETS_EDITABLE_FIELDS,
  asOne: BUDGETS_AS_ONE_RELATION_CONFIG,
  asMany: BUDGETS_AS_MANY_RELATION_CONFIG,
  oneRelations: BUDGETS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: BUDGETS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IBudgets,
  BudgetsSortableField,
  BudgetsSelectableField,
  BudgetsFilterableField,
  BudgetsDateRangeField,
  BudgetsRelationKey,
  typeof BUDGETS_ONE_RELATION_QUERY_OPTIONS,
  typeof BUDGETS_MANY_RELATION_QUERY_OPTIONS
>;
