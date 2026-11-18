// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as BudgetsConfig from "#/modules/finance/schema/types/budgets/budgets.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IBudgetVersions,
  BudgetVersionsKey,
  BudgetVersionsRelationKey,
  BudgetVersionsSortableField,
  BudgetVersionsFilterableField,
  BudgetVersionsDateRangeField,
  BudgetVersionsSelectableField,
  IBudgetVersionsAsOneRelationConfig,
  IBudgetVersionsAsManyRelationConfig,
} from "./budget-versions.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const BUDGET_VERSIONS_RELATION_KEYS = [
  "budget",
  "sourceCitation",
  "status",
] as const satisfies readonly BudgetVersionsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const BUDGET_VERSIONS_SORTABLE_FIELDS = [
  "budgetId",
  "createdAt",
  "deletedAt",
  "id",
  "releasedOn",
  "revision",
  "sourceCitationId",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly BudgetVersionsKey[];

export const BUDGET_VERSIONS_SEARCHABLE_FIELDS = [] as const satisfies readonly BudgetVersionsKey[];

export const BUDGET_VERSIONS_FILTERABLE_FIELDS = [
  "budgetId",
  "id",
  "sourceCitationId",
  "statusId",
] as const satisfies readonly BudgetVersionsKey[];

export const BUDGET_VERSIONS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "releasedOn",
  "updatedAt",
] as const satisfies readonly BudgetVersionsKey[];

export const BUDGET_VERSIONS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IBudgetVersions> = {
  searchableFields: [...BUDGET_VERSIONS_SEARCHABLE_FIELDS],
  filterFields: [...BUDGET_VERSIONS_FILTERABLE_FIELDS],
  dateRangeFields: [...BUDGET_VERSIONS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const BUDGET_VERSIONS_SELECTABLE_FIELDS = [
  "budgetId",
  "createdAt",
  "deletedAt",
  "id",
  "releasedOn",
  "revision",
  "sourceCitationId",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly BudgetVersionsKey[];

export const BUDGET_VERSIONS_DEFAULT_SELECT_FIELDS = [
  "budgetId",
  "createdAt",
  "deletedAt",
  "id",
  "releasedOn",
  "revision",
  "sourceCitationId",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly BudgetVersionsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const BUDGET_VERSIONS_EDITABLE_FIELDS = [
  "budgetId",
  "releasedOn",
  "revision",
  "sourceCitationId",
  "statusId",
] as const satisfies readonly BudgetVersionsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const BUDGET_VERSIONS_AS_ONE_RELATION_CONFIG = {
  relation: "budgetVersions",
  type: ERelationType.One,
  selectableFields: BUDGET_VERSIONS_SELECTABLE_FIELDS,
  defaultSelectFields: BUDGET_VERSIONS_DEFAULT_SELECT_FIELDS,
} as const satisfies IBudgetVersionsAsOneRelationConfig;

export const BUDGET_VERSIONS_AS_MANY_RELATION_CONFIG = {
  relation: "budgetVersions",
  type: ERelationType.Many,
  selectableFields: BUDGET_VERSIONS_SELECTABLE_FIELDS,
  defaultSelectFields: BUDGET_VERSIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: BUDGET_VERSIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IBudgetVersionsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const BUDGET_VERSIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<BudgetVersionsRelationKey>().one(
    () => BudgetsConfig.BUDGETS_AS_ONE_RELATION_CONFIG,
    "budget",
  ),
  Q.createRelationKeyMapper<BudgetVersionsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<BudgetVersionsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "status",
  ),
] as const;

export const BUDGET_VERSIONS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const BUDGET_VERSIONS_QUERY_OPTIONS = {
  searchableFields: BUDGET_VERSIONS_SEARCHABLE_FIELDS,
  selectableFields: BUDGET_VERSIONS_SELECTABLE_FIELDS,
  defaultSelectFields: BUDGET_VERSIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: BUDGET_VERSIONS_SORTABLE_FIELDS,
  filterFields: BUDGET_VERSIONS_FILTERABLE_FIELDS,
  dateRangeFields: BUDGET_VERSIONS_DATE_RANGE_FIELDS,
  relationKeys: BUDGET_VERSIONS_RELATION_KEYS,
  editableFields: BUDGET_VERSIONS_EDITABLE_FIELDS,
  asOne: BUDGET_VERSIONS_AS_ONE_RELATION_CONFIG,
  asMany: BUDGET_VERSIONS_AS_MANY_RELATION_CONFIG,
  oneRelations: BUDGET_VERSIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: BUDGET_VERSIONS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IBudgetVersions,
  BudgetVersionsSortableField,
  BudgetVersionsSelectableField,
  BudgetVersionsFilterableField,
  BudgetVersionsDateRangeField,
  BudgetVersionsRelationKey,
  typeof BUDGET_VERSIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof BUDGET_VERSIONS_MANY_RELATION_QUERY_OPTIONS
>;
