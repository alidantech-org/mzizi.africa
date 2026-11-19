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
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as InstitutionsConfig from "#/modules/governance/schema/types/institutions/institutions.config";
import * as LevelsConfig from "#/modules/geography/schema/types/levels/levels.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IPositions,
  PositionsKey,
  PositionsRelationKey,
  PositionsSortableField,
  PositionsFilterableField,
  PositionsDateRangeField,
  PositionsSelectableField,
  IPositionsAsOneRelationConfig,
  IPositionsAsManyRelationConfig,
} from "./positions.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const POSITIONS_RELATION_KEYS = [
  "basisProvision",
  "exposure",
  "institution",
  "jurisdictionLevel",
  "role",
  "seatBasis",
  "seatUnitLevel",
  "selectionMethod",
  "sourceCitation",
  "title",
] as const satisfies readonly PositionsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const POSITIONS_SORTABLE_FIELDS = [
  "basisProvisionId",
  "code",
  "createdAt",
  "deletedAt",
  "displayOrder",
  "exposureId",
  "fromToPrecision",
  "fromYear",
  "id",
  "institutionId",
  "jurisdictionLevelId",
  "roleId",
  "seatBasisId",
  "seatCount",
  "seatUnitLevelId",
  "selectionMethodId",
  "sourceCitationId",
  "termLimit",
  "termYears",
  "titleId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly PositionsKey[];

export const POSITIONS_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly PositionsKey[];

export const POSITIONS_FILTERABLE_FIELDS = [
  "basisProvisionId",
  "exposureId",
  "fromToPrecision",
  "id",
  "institutionId",
  "jurisdictionLevelId",
  "roleId",
  "seatBasisId",
  "seatUnitLevelId",
  "selectionMethodId",
  "sourceCitationId",
  "titleId",
] as const satisfies readonly PositionsKey[];

export const POSITIONS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly PositionsKey[];

export const POSITIONS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IPositions> = {
  searchableFields: [...POSITIONS_SEARCHABLE_FIELDS],
  filterFields: [...POSITIONS_FILTERABLE_FIELDS],
  dateRangeFields: [...POSITIONS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const POSITIONS_SELECTABLE_FIELDS = [
  "basisProvisionId",
  "code",
  "createdAt",
  "deletedAt",
  "displayOrder",
  "exposureId",
  "fromToPrecision",
  "fromYear",
  "id",
  "institutionId",
  "jurisdictionLevelId",
  "roleId",
  "seatBasisId",
  "seatCount",
  "seatUnitLevelId",
  "selectionMethodId",
  "sourceCitationId",
  "termLimit",
  "termYears",
  "titleId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly PositionsKey[];

export const POSITIONS_DEFAULT_SELECT_FIELDS = [
  "basisProvisionId",
  "code",
  "createdAt",
  "deletedAt",
  "displayOrder",
  "exposureId",
  "fromToPrecision",
  "fromYear",
  "id",
  "institutionId",
  "jurisdictionLevelId",
  "roleId",
  "seatBasisId",
  "seatCount",
  "seatUnitLevelId",
  "selectionMethodId",
  "sourceCitationId",
  "termLimit",
  "termYears",
  "titleId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly PositionsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const POSITIONS_EDITABLE_FIELDS = [
  "basisProvisionId",
  "code",
  "displayOrder",
  "exposureId",
  "fromToPrecision",
  "fromYear",
  "institutionId",
  "jurisdictionLevelId",
  "roleId",
  "seatBasisId",
  "seatCount",
  "seatUnitLevelId",
  "selectionMethodId",
  "sourceCitationId",
  "termLimit",
  "termYears",
  "titleId",
  "toYear",
] as const satisfies readonly PositionsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const POSITIONS_AS_ONE_RELATION_CONFIG = {
  relation: "positions",
  type: ERelationType.One,
  selectableFields: POSITIONS_SELECTABLE_FIELDS,
  defaultSelectFields: POSITIONS_DEFAULT_SELECT_FIELDS,
} as const satisfies IPositionsAsOneRelationConfig;

export const POSITIONS_AS_MANY_RELATION_CONFIG = {
  relation: "positions",
  type: ERelationType.Many,
  selectableFields: POSITIONS_SELECTABLE_FIELDS,
  defaultSelectFields: POSITIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: POSITIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IPositionsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const POSITIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<PositionsRelationKey>().one(
    () => ProvisionsConfig.PROVISIONS_AS_ONE_RELATION_CONFIG,
    "basisProvision",
  ),
  Q.createRelationKeyMapper<PositionsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "exposure",
  ),
  Q.createRelationKeyMapper<PositionsRelationKey>().one(
    () => InstitutionsConfig.INSTITUTIONS_AS_ONE_RELATION_CONFIG,
    "institution",
  ),
  Q.createRelationKeyMapper<PositionsRelationKey>().one(
    () => LevelsConfig.LEVELS_AS_ONE_RELATION_CONFIG,
    "jurisdictionLevel",
  ),
  Q.createRelationKeyMapper<PositionsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "role",
  ),
  Q.createRelationKeyMapper<PositionsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "seatBasis",
  ),
  Q.createRelationKeyMapper<PositionsRelationKey>().one(
    () => LevelsConfig.LEVELS_AS_ONE_RELATION_CONFIG,
    "seatUnitLevel",
  ),
  Q.createRelationKeyMapper<PositionsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "selectionMethod",
  ),
  Q.createRelationKeyMapper<PositionsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<PositionsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "title",
  ),
] as const;

export const POSITIONS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const POSITIONS_QUERY_OPTIONS = {
  searchableFields: POSITIONS_SEARCHABLE_FIELDS,
  selectableFields: POSITIONS_SELECTABLE_FIELDS,
  defaultSelectFields: POSITIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: POSITIONS_SORTABLE_FIELDS,
  filterFields: POSITIONS_FILTERABLE_FIELDS,
  dateRangeFields: POSITIONS_DATE_RANGE_FIELDS,
  relationKeys: POSITIONS_RELATION_KEYS,
  editableFields: POSITIONS_EDITABLE_FIELDS,
  asOne: POSITIONS_AS_ONE_RELATION_CONFIG,
  asMany: POSITIONS_AS_MANY_RELATION_CONFIG,
  oneRelations: POSITIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: POSITIONS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IPositions,
  PositionsSortableField,
  PositionsSelectableField,
  PositionsFilterableField,
  PositionsDateRangeField,
  PositionsRelationKey,
  typeof POSITIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof POSITIONS_MANY_RELATION_QUERY_OPTIONS
>;
