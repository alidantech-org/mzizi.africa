// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ProvisionsConfig from "#/modules/legal/schema/types/provisions/provisions.config";
import * as FunctionsConfig from "#/modules/governance/schema/types/functions/functions.config";
import * as InstitutionsConfig from "#/modules/governance/schema/types/institutions/institutions.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";
import * as PositionsConfig from "#/modules/governance/schema/types/positions/positions.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IAssignments,
  AssignmentsKey,
  AssignmentsRelationKey,
  AssignmentsSortableField,
  AssignmentsFilterableField,
  AssignmentsDateRangeField,
  AssignmentsSelectableField,
  IAssignmentsAsOneRelationConfig,
  IAssignmentsAsManyRelationConfig,
} from "./assignments.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const ASSIGNMENTS_RELATION_KEYS = [
  "basisProvision",
  "function",
  "institution",
  "obligorKind",
  "share",
  "sourceCitation",
  "startInstitution",
  "startPosition",
] as const satisfies readonly AssignmentsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const ASSIGNMENTS_SORTABLE_FIELDS = [
  "basisProvisionId",
  "code",
  "createdAt",
  "deletedAt",
  "fromToPrecision",
  "fromYear",
  "functionId",
  "id",
  "institutionId",
  "obligorKindId",
  "shareId",
  "sourceCitationId",
  "startInstitutionId",
  "startPositionId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly AssignmentsKey[];

export const ASSIGNMENTS_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly AssignmentsKey[];

export const ASSIGNMENTS_FILTERABLE_FIELDS = [
  "basisProvisionId",
  "fromToPrecision",
  "functionId",
  "id",
  "institutionId",
  "obligorKindId",
  "shareId",
  "sourceCitationId",
  "startInstitutionId",
  "startPositionId",
] as const satisfies readonly AssignmentsKey[];

export const ASSIGNMENTS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly AssignmentsKey[];

export const ASSIGNMENTS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IAssignments> = {
  searchableFields: [...ASSIGNMENTS_SEARCHABLE_FIELDS],
  filterFields: [...ASSIGNMENTS_FILTERABLE_FIELDS],
  dateRangeFields: [...ASSIGNMENTS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const ASSIGNMENTS_SELECTABLE_FIELDS = [
  "basisProvisionId",
  "code",
  "createdAt",
  "deletedAt",
  "fromToPrecision",
  "fromYear",
  "functionId",
  "id",
  "institutionId",
  "obligorKindId",
  "shareId",
  "sourceCitationId",
  "startInstitutionId",
  "startPositionId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly AssignmentsKey[];

export const ASSIGNMENTS_DEFAULT_SELECT_FIELDS = [
  "basisProvisionId",
  "code",
  "createdAt",
  "deletedAt",
  "fromToPrecision",
  "fromYear",
  "functionId",
  "id",
  "institutionId",
  "obligorKindId",
  "shareId",
  "sourceCitationId",
  "startInstitutionId",
  "startPositionId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly AssignmentsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const ASSIGNMENTS_EDITABLE_FIELDS = [
  "basisProvisionId",
  "code",
  "fromToPrecision",
  "fromYear",
  "functionId",
  "institutionId",
  "obligorKindId",
  "shareId",
  "sourceCitationId",
  "startInstitutionId",
  "startPositionId",
  "toYear",
] as const satisfies readonly AssignmentsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const ASSIGNMENTS_AS_ONE_RELATION_CONFIG = {
  relation: "assignments",
  type: ERelationType.One,
  selectableFields: ASSIGNMENTS_SELECTABLE_FIELDS,
  defaultSelectFields: ASSIGNMENTS_DEFAULT_SELECT_FIELDS,
} as const satisfies IAssignmentsAsOneRelationConfig;

export const ASSIGNMENTS_AS_MANY_RELATION_CONFIG = {
  relation: "assignments",
  type: ERelationType.Many,
  selectableFields: ASSIGNMENTS_SELECTABLE_FIELDS,
  defaultSelectFields: ASSIGNMENTS_DEFAULT_SELECT_FIELDS,
  sortableFields: ASSIGNMENTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IAssignmentsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const ASSIGNMENTS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<AssignmentsRelationKey>().one(
    () => ProvisionsConfig.PROVISIONS_AS_ONE_RELATION_CONFIG,
    "basisProvision",
  ),
  Q.createRelationKeyMapper<AssignmentsRelationKey>().one(
    () => FunctionsConfig.FUNCTIONS_AS_ONE_RELATION_CONFIG,
    "function",
  ),
  Q.createRelationKeyMapper<AssignmentsRelationKey>().one(
    () => InstitutionsConfig.INSTITUTIONS_AS_ONE_RELATION_CONFIG,
    "institution",
  ),
  Q.createRelationKeyMapper<AssignmentsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "obligorKind",
  ),
  Q.createRelationKeyMapper<AssignmentsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "share",
  ),
  Q.createRelationKeyMapper<AssignmentsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<AssignmentsRelationKey>().one(
    () => InstitutionsConfig.INSTITUTIONS_AS_ONE_RELATION_CONFIG,
    "startInstitution",
  ),
  Q.createRelationKeyMapper<AssignmentsRelationKey>().one(
    () => PositionsConfig.POSITIONS_AS_ONE_RELATION_CONFIG,
    "startPosition",
  ),
] as const;

export const ASSIGNMENTS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const ASSIGNMENTS_QUERY_OPTIONS = {
  searchableFields: ASSIGNMENTS_SEARCHABLE_FIELDS,
  selectableFields: ASSIGNMENTS_SELECTABLE_FIELDS,
  defaultSelectFields: ASSIGNMENTS_DEFAULT_SELECT_FIELDS,
  sortableFields: ASSIGNMENTS_SORTABLE_FIELDS,
  filterFields: ASSIGNMENTS_FILTERABLE_FIELDS,
  dateRangeFields: ASSIGNMENTS_DATE_RANGE_FIELDS,
  relationKeys: ASSIGNMENTS_RELATION_KEYS,
  editableFields: ASSIGNMENTS_EDITABLE_FIELDS,
  asOne: ASSIGNMENTS_AS_ONE_RELATION_CONFIG,
  asMany: ASSIGNMENTS_AS_MANY_RELATION_CONFIG,
  oneRelations: ASSIGNMENTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: ASSIGNMENTS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IAssignments,
  AssignmentsSortableField,
  AssignmentsSelectableField,
  AssignmentsFilterableField,
  AssignmentsDateRangeField,
  AssignmentsRelationKey,
  typeof ASSIGNMENTS_ONE_RELATION_QUERY_OPTIONS,
  typeof ASSIGNMENTS_MANY_RELATION_QUERY_OPTIONS
>;
