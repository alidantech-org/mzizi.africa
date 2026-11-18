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
import * as MotionsConfig from "#/modules/governance/schema/types/motions/motions.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as SittingsConfig from "#/modules/governance/schema/types/sittings/sittings.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IStages,
  StagesKey,
  StagesRelationKey,
  StagesSortableField,
  StagesFilterableField,
  StagesDateRangeField,
  StagesSelectableField,
  IStagesAsOneRelationConfig,
  IStagesAsManyRelationConfig,
} from "./stages.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const STAGES_RELATION_KEYS = [
  "bill",
  "motion",
  "outcome",
  "sitting",
  "sourceCitation",
  "stageKind",
] as const satisfies readonly StagesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const STAGES_SORTABLE_FIELDS = [
  "billId",
  "createdAt",
  "deletedAt",
  "id",
  "motionId",
  "onDate",
  "outcomeId",
  "sequenceNumber",
  "sittingId",
  "sourceCitationId",
  "stageKindId",
  "updatedAt",
  "version",
] as const satisfies readonly StagesKey[];

export const STAGES_SEARCHABLE_FIELDS = [] as const satisfies readonly StagesKey[];

export const STAGES_FILTERABLE_FIELDS = [
  "billId",
  "id",
  "motionId",
  "outcomeId",
  "sittingId",
  "sourceCitationId",
  "stageKindId",
] as const satisfies readonly StagesKey[];

export const STAGES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "onDate",
  "updatedAt",
] as const satisfies readonly StagesKey[];

export const STAGES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IStages> = {
  searchableFields: [...STAGES_SEARCHABLE_FIELDS],
  filterFields: [...STAGES_FILTERABLE_FIELDS],
  dateRangeFields: [...STAGES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const STAGES_SELECTABLE_FIELDS = [
  "billId",
  "createdAt",
  "deletedAt",
  "id",
  "motionId",
  "onDate",
  "outcomeId",
  "sequenceNumber",
  "sittingId",
  "sourceCitationId",
  "stageKindId",
  "updatedAt",
  "version",
] as const satisfies readonly StagesKey[];

export const STAGES_DEFAULT_SELECT_FIELDS = [
  "billId",
  "createdAt",
  "deletedAt",
  "id",
  "motionId",
  "onDate",
  "outcomeId",
  "sequenceNumber",
  "sittingId",
  "sourceCitationId",
  "stageKindId",
  "updatedAt",
  "version",
] as const satisfies readonly StagesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const STAGES_EDITABLE_FIELDS = [
  "billId",
  "motionId",
  "onDate",
  "outcomeId",
  "sequenceNumber",
  "sittingId",
  "sourceCitationId",
  "stageKindId",
] as const satisfies readonly StagesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const STAGES_AS_ONE_RELATION_CONFIG = {
  relation: "stages",
  type: ERelationType.One,
  selectableFields: STAGES_SELECTABLE_FIELDS,
  defaultSelectFields: STAGES_DEFAULT_SELECT_FIELDS,
} as const satisfies IStagesAsOneRelationConfig;

export const STAGES_AS_MANY_RELATION_CONFIG = {
  relation: "stages",
  type: ERelationType.Many,
  selectableFields: STAGES_SELECTABLE_FIELDS,
  defaultSelectFields: STAGES_DEFAULT_SELECT_FIELDS,
  sortableFields: STAGES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IStagesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const STAGES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<StagesRelationKey>().one(
    () => BillsConfig.BILLS_AS_ONE_RELATION_CONFIG,
    "bill",
  ),
  Q.createRelationKeyMapper<StagesRelationKey>().one(
    () => MotionsConfig.MOTIONS_AS_ONE_RELATION_CONFIG,
    "motion",
  ),
  Q.createRelationKeyMapper<StagesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "outcome",
  ),
  Q.createRelationKeyMapper<StagesRelationKey>().one(
    () => SittingsConfig.SITTINGS_AS_ONE_RELATION_CONFIG,
    "sitting",
  ),
  Q.createRelationKeyMapper<StagesRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<StagesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "stageKind",
  ),
] as const;

export const STAGES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const STAGES_QUERY_OPTIONS = {
  searchableFields: STAGES_SEARCHABLE_FIELDS,
  selectableFields: STAGES_SELECTABLE_FIELDS,
  defaultSelectFields: STAGES_DEFAULT_SELECT_FIELDS,
  sortableFields: STAGES_SORTABLE_FIELDS,
  filterFields: STAGES_FILTERABLE_FIELDS,
  dateRangeFields: STAGES_DATE_RANGE_FIELDS,
  relationKeys: STAGES_RELATION_KEYS,
  editableFields: STAGES_EDITABLE_FIELDS,
  asOne: STAGES_AS_ONE_RELATION_CONFIG,
  asMany: STAGES_AS_MANY_RELATION_CONFIG,
  oneRelations: STAGES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: STAGES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IStages,
  StagesSortableField,
  StagesSelectableField,
  StagesFilterableField,
  StagesDateRangeField,
  StagesRelationKey,
  typeof STAGES_ONE_RELATION_QUERY_OPTIONS,
  typeof STAGES_MANY_RELATION_QUERY_OPTIONS
>;
