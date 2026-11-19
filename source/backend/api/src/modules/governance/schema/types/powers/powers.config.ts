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
import * as InstitutionsConfig from "#/modules/governance/schema/types/institutions/institutions.config";
import * as PositionsConfig from "#/modules/governance/schema/types/positions/positions.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as ProceduresConfig from "#/modules/governance/schema/types/procedures/procedures.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IPowers,
  PowersKey,
  PowersRelationKey,
  PowersSortableField,
  PowersFilterableField,
  PowersDateRangeField,
  PowersSelectableField,
  IPowersAsOneRelationConfig,
  IPowersAsManyRelationConfig,
} from "./powers.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const POWERS_RELATION_KEYS = [
  "basisProvision",
  "holderInstitution",
  "holderPosition",
  "kind",
  "procedure",
  "sourceCitation",
  "targetInstitution",
  "targetPosition",
  "threshold",
] as const satisfies readonly PowersKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const POWERS_SORTABLE_FIELDS = [
  "basisProvisionId",
  "code",
  "createdAt",
  "deletedAt",
  "fromToPrecision",
  "fromYear",
  "holderInstitutionId",
  "holderPositionId",
  "id",
  "isBinding",
  "kindId",
  "procedureId",
  "sourceCitationId",
  "stepOrder",
  "targetInstitutionId",
  "targetPositionId",
  "thresholdId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly PowersKey[];

export const POWERS_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly PowersKey[];

export const POWERS_FILTERABLE_FIELDS = [
  "basisProvisionId",
  "fromToPrecision",
  "holderInstitutionId",
  "holderPositionId",
  "id",
  "isBinding",
  "kindId",
  "procedureId",
  "sourceCitationId",
  "targetInstitutionId",
  "targetPositionId",
  "thresholdId",
] as const satisfies readonly PowersKey[];

export const POWERS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly PowersKey[];

export const POWERS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IPowers> = {
  searchableFields: [...POWERS_SEARCHABLE_FIELDS],
  filterFields: [...POWERS_FILTERABLE_FIELDS],
  dateRangeFields: [...POWERS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const POWERS_SELECTABLE_FIELDS = [
  "basisProvisionId",
  "code",
  "createdAt",
  "deletedAt",
  "fromToPrecision",
  "fromYear",
  "holderInstitutionId",
  "holderPositionId",
  "id",
  "isBinding",
  "kindId",
  "procedureId",
  "sourceCitationId",
  "stepOrder",
  "targetInstitutionId",
  "targetPositionId",
  "thresholdId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly PowersKey[];

export const POWERS_DEFAULT_SELECT_FIELDS = [
  "basisProvisionId",
  "code",
  "createdAt",
  "deletedAt",
  "fromToPrecision",
  "fromYear",
  "holderInstitutionId",
  "holderPositionId",
  "id",
  "isBinding",
  "kindId",
  "procedureId",
  "sourceCitationId",
  "stepOrder",
  "targetInstitutionId",
  "targetPositionId",
  "thresholdId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly PowersSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const POWERS_EDITABLE_FIELDS = [
  "basisProvisionId",
  "code",
  "fromToPrecision",
  "fromYear",
  "holderInstitutionId",
  "holderPositionId",
  "isBinding",
  "kindId",
  "procedureId",
  "sourceCitationId",
  "stepOrder",
  "targetInstitutionId",
  "targetPositionId",
  "thresholdId",
  "toYear",
] as const satisfies readonly PowersKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const POWERS_AS_ONE_RELATION_CONFIG = {
  relation: "powers",
  type: ERelationType.One,
  selectableFields: POWERS_SELECTABLE_FIELDS,
  defaultSelectFields: POWERS_DEFAULT_SELECT_FIELDS,
} as const satisfies IPowersAsOneRelationConfig;

export const POWERS_AS_MANY_RELATION_CONFIG = {
  relation: "powers",
  type: ERelationType.Many,
  selectableFields: POWERS_SELECTABLE_FIELDS,
  defaultSelectFields: POWERS_DEFAULT_SELECT_FIELDS,
  sortableFields: POWERS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IPowersAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const POWERS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<PowersRelationKey>().one(
    () => ProvisionsConfig.PROVISIONS_AS_ONE_RELATION_CONFIG,
    "basisProvision",
  ),
  Q.createRelationKeyMapper<PowersRelationKey>().one(
    () => InstitutionsConfig.INSTITUTIONS_AS_ONE_RELATION_CONFIG,
    "holderInstitution",
  ),
  Q.createRelationKeyMapper<PowersRelationKey>().one(
    () => PositionsConfig.POSITIONS_AS_ONE_RELATION_CONFIG,
    "holderPosition",
  ),
  Q.createRelationKeyMapper<PowersRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "kind",
  ),
  Q.createRelationKeyMapper<PowersRelationKey>().one(
    () => ProceduresConfig.PROCEDURES_AS_ONE_RELATION_CONFIG,
    "procedure",
  ),
  Q.createRelationKeyMapper<PowersRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<PowersRelationKey>().one(
    () => InstitutionsConfig.INSTITUTIONS_AS_ONE_RELATION_CONFIG,
    "targetInstitution",
  ),
  Q.createRelationKeyMapper<PowersRelationKey>().one(
    () => PositionsConfig.POSITIONS_AS_ONE_RELATION_CONFIG,
    "targetPosition",
  ),
  Q.createRelationKeyMapper<PowersRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "threshold",
  ),
] as const;

export const POWERS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const POWERS_QUERY_OPTIONS = {
  searchableFields: POWERS_SEARCHABLE_FIELDS,
  selectableFields: POWERS_SELECTABLE_FIELDS,
  defaultSelectFields: POWERS_DEFAULT_SELECT_FIELDS,
  sortableFields: POWERS_SORTABLE_FIELDS,
  filterFields: POWERS_FILTERABLE_FIELDS,
  dateRangeFields: POWERS_DATE_RANGE_FIELDS,
  relationKeys: POWERS_RELATION_KEYS,
  editableFields: POWERS_EDITABLE_FIELDS,
  asOne: POWERS_AS_ONE_RELATION_CONFIG,
  asMany: POWERS_AS_MANY_RELATION_CONFIG,
  oneRelations: POWERS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: POWERS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IPowers,
  PowersSortableField,
  PowersSelectableField,
  PowersFilterableField,
  PowersDateRangeField,
  PowersRelationKey,
  typeof POWERS_ONE_RELATION_QUERY_OPTIONS,
  typeof POWERS_MANY_RELATION_QUERY_OPTIONS
>;
