// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as BillsConfig from "#/modules/governance/schema/types/bills/bills.config";
import * as BudgetVersionsConfig from "#/modules/finance/schema/types/budget-versions/budget-versions.config";
import * as FiscalPeriodsConfig from "#/modules/finance/schema/types/fiscal-periods/fiscal-periods.config";
import * as InstrumentsConfig from "#/modules/legal/schema/types/instruments/instruments.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as HoldersConfig from "#/modules/governance/schema/types/holders/holders.config";
import * as ProvisionsConfig from "#/modules/legal/schema/types/provisions/provisions.config";
import * as SittingsConfig from "#/modules/governance/schema/types/sittings/sittings.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IMotions,
  MotionsKey,
  MotionsRelationKey,
  MotionsSortableField,
  MotionsFilterableField,
  MotionsDateRangeField,
  MotionsSelectableField,
  IMotionsAsOneRelationConfig,
  IMotionsAsManyRelationConfig,
} from "./motions.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const MOTIONS_RELATION_KEYS = [
  "bill",
  "budgetVersion",
  "fiscalPeriod",
  "instrument",
  "motionKind",
  "movedByHolder",
  "outcome",
  "provision",
  "sitting",
  "sourceCitation",
] as const satisfies readonly MotionsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const MOTIONS_SORTABLE_FIELDS = [
  "billId",
  "budgetVersionId",
  "code",
  "createdAt",
  "deletedAt",
  "fiscalPeriodId",
  "id",
  "instrumentId",
  "motionKindId",
  "movedByHolderId",
  "outcomeId",
  "provisionId",
  "sittingId",
  "sourceCitationId",
  "summary",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly MotionsKey[];

export const MOTIONS_SEARCHABLE_FIELDS = [
  "code",
  "summary",
  "title",
] as const satisfies readonly MotionsKey[];

export const MOTIONS_FILTERABLE_FIELDS = [
  "billId",
  "budgetVersionId",
  "fiscalPeriodId",
  "id",
  "instrumentId",
  "motionKindId",
  "movedByHolderId",
  "outcomeId",
  "provisionId",
  "sittingId",
  "sourceCitationId",
] as const satisfies readonly MotionsKey[];

export const MOTIONS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly MotionsKey[];

export const MOTIONS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IMotions> = {
  searchableFields: [...MOTIONS_SEARCHABLE_FIELDS],
  filterFields: [...MOTIONS_FILTERABLE_FIELDS],
  dateRangeFields: [...MOTIONS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const MOTIONS_SELECTABLE_FIELDS = [
  "billId",
  "budgetVersionId",
  "code",
  "createdAt",
  "deletedAt",
  "fiscalPeriodId",
  "id",
  "instrumentId",
  "motionKindId",
  "movedByHolderId",
  "outcomeId",
  "provisionId",
  "sittingId",
  "sourceCitationId",
  "summary",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly MotionsKey[];

export const MOTIONS_DEFAULT_SELECT_FIELDS = [
  "billId",
  "budgetVersionId",
  "code",
  "createdAt",
  "deletedAt",
  "fiscalPeriodId",
  "id",
  "instrumentId",
  "motionKindId",
  "movedByHolderId",
  "outcomeId",
  "provisionId",
  "sittingId",
  "sourceCitationId",
  "summary",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly MotionsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const MOTIONS_EDITABLE_FIELDS = [
  "billId",
  "budgetVersionId",
  "code",
  "fiscalPeriodId",
  "instrumentId",
  "motionKindId",
  "movedByHolderId",
  "outcomeId",
  "provisionId",
  "sittingId",
  "sourceCitationId",
  "summary",
  "title",
] as const satisfies readonly MotionsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const MOTIONS_AS_ONE_RELATION_CONFIG = {
  relation: "motions",
  type: ERelationType.One,
  selectableFields: MOTIONS_SELECTABLE_FIELDS,
  defaultSelectFields: MOTIONS_DEFAULT_SELECT_FIELDS,
} as const satisfies IMotionsAsOneRelationConfig;

export const MOTIONS_AS_MANY_RELATION_CONFIG = {
  relation: "motions",
  type: ERelationType.Many,
  selectableFields: MOTIONS_SELECTABLE_FIELDS,
  defaultSelectFields: MOTIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: MOTIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IMotionsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const MOTIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<MotionsRelationKey>().one(
    () => BillsConfig.BILLS_AS_ONE_RELATION_CONFIG,
    "bill",
  ),
  Q.createRelationKeyMapper<MotionsRelationKey>().one(
    () => BudgetVersionsConfig.BUDGET_VERSIONS_AS_ONE_RELATION_CONFIG,
    "budgetVersion",
  ),
  Q.createRelationKeyMapper<MotionsRelationKey>().one(
    () => FiscalPeriodsConfig.FISCAL_PERIODS_AS_ONE_RELATION_CONFIG,
    "fiscalPeriod",
  ),
  Q.createRelationKeyMapper<MotionsRelationKey>().one(
    () => InstrumentsConfig.INSTRUMENTS_AS_ONE_RELATION_CONFIG,
    "instrument",
  ),
  Q.createRelationKeyMapper<MotionsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "motionKind",
  ),
  Q.createRelationKeyMapper<MotionsRelationKey>().one(
    () => HoldersConfig.HOLDERS_AS_ONE_RELATION_CONFIG,
    "movedByHolder",
  ),
  Q.createRelationKeyMapper<MotionsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "outcome",
  ),
  Q.createRelationKeyMapper<MotionsRelationKey>().one(
    () => ProvisionsConfig.PROVISIONS_AS_ONE_RELATION_CONFIG,
    "provision",
  ),
  Q.createRelationKeyMapper<MotionsRelationKey>().one(
    () => SittingsConfig.SITTINGS_AS_ONE_RELATION_CONFIG,
    "sitting",
  ),
  Q.createRelationKeyMapper<MotionsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const MOTIONS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const MOTIONS_QUERY_OPTIONS = {
  searchableFields: MOTIONS_SEARCHABLE_FIELDS,
  selectableFields: MOTIONS_SELECTABLE_FIELDS,
  defaultSelectFields: MOTIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: MOTIONS_SORTABLE_FIELDS,
  filterFields: MOTIONS_FILTERABLE_FIELDS,
  dateRangeFields: MOTIONS_DATE_RANGE_FIELDS,
  relationKeys: MOTIONS_RELATION_KEYS,
  editableFields: MOTIONS_EDITABLE_FIELDS,
  asOne: MOTIONS_AS_ONE_RELATION_CONFIG,
  asMany: MOTIONS_AS_MANY_RELATION_CONFIG,
  oneRelations: MOTIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: MOTIONS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IMotions,
  MotionsSortableField,
  MotionsSelectableField,
  MotionsFilterableField,
  MotionsDateRangeField,
  MotionsRelationKey,
  typeof MOTIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof MOTIONS_MANY_RELATION_QUERY_OPTIONS
>;
