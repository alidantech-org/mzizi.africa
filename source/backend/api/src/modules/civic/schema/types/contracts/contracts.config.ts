// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as EntitiesConfig from "#/modules/official/schema/types/entities/entities.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as ProcurementsConfig from "#/modules/civic/schema/types/procurements/procurements.config";
import * as ProjectsConfig from "#/modules/civic/schema/types/projects/projects.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IContracts,
  ContractsKey,
  ContractsRelationKey,
  ContractsSortableField,
  ContractsFilterableField,
  ContractsDateRangeField,
  ContractsSelectableField,
  IContractsAsOneRelationConfig,
  IContractsAsManyRelationConfig,
} from "./contracts.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const CONTRACTS_RELATION_KEYS = [
  "contractorEntity",
  "currency",
  "nature",
  "procurement",
  "project",
  "sourceCitation",
  "status",
] as const satisfies readonly ContractsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const CONTRACTS_SORTABLE_FIELDS = [
  "amountMinorUnits",
  "code",
  "contractorEntityId",
  "createdAt",
  "currencyId",
  "deletedAt",
  "id",
  "natureId",
  "procurementId",
  "projectId",
  "signedOn",
  "sourceCitationId",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly ContractsKey[];

export const CONTRACTS_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly ContractsKey[];

export const CONTRACTS_FILTERABLE_FIELDS = [
  "contractorEntityId",
  "currencyId",
  "id",
  "natureId",
  "procurementId",
  "projectId",
  "sourceCitationId",
  "statusId",
] as const satisfies readonly ContractsKey[];

export const CONTRACTS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "signedOn",
  "updatedAt",
] as const satisfies readonly ContractsKey[];

export const CONTRACTS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IContracts> = {
  searchableFields: [...CONTRACTS_SEARCHABLE_FIELDS],
  filterFields: [...CONTRACTS_FILTERABLE_FIELDS],
  dateRangeFields: [...CONTRACTS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const CONTRACTS_SELECTABLE_FIELDS = [
  "amountMinorUnits",
  "code",
  "contractorEntityId",
  "createdAt",
  "currencyId",
  "deletedAt",
  "id",
  "natureId",
  "procurementId",
  "projectId",
  "signedOn",
  "sourceCitationId",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly ContractsKey[];

export const CONTRACTS_DEFAULT_SELECT_FIELDS = [
  "amountMinorUnits",
  "code",
  "contractorEntityId",
  "createdAt",
  "currencyId",
  "deletedAt",
  "id",
  "natureId",
  "procurementId",
  "projectId",
  "signedOn",
  "sourceCitationId",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly ContractsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const CONTRACTS_EDITABLE_FIELDS = [
  "amountMinorUnits",
  "code",
  "contractorEntityId",
  "currencyId",
  "natureId",
  "procurementId",
  "projectId",
  "signedOn",
  "sourceCitationId",
  "statusId",
] as const satisfies readonly ContractsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const CONTRACTS_AS_ONE_RELATION_CONFIG = {
  relation: "contracts",
  type: ERelationType.One,
  selectableFields: CONTRACTS_SELECTABLE_FIELDS,
  defaultSelectFields: CONTRACTS_DEFAULT_SELECT_FIELDS,
} as const satisfies IContractsAsOneRelationConfig;

export const CONTRACTS_AS_MANY_RELATION_CONFIG = {
  relation: "contracts",
  type: ERelationType.Many,
  selectableFields: CONTRACTS_SELECTABLE_FIELDS,
  defaultSelectFields: CONTRACTS_DEFAULT_SELECT_FIELDS,
  sortableFields: CONTRACTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IContractsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const CONTRACTS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ContractsRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "contractorEntity",
  ),
  Q.createRelationKeyMapper<ContractsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "currency",
  ),
  Q.createRelationKeyMapper<ContractsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "nature",
  ),
  Q.createRelationKeyMapper<ContractsRelationKey>().one(
    () => ProcurementsConfig.PROCUREMENTS_AS_ONE_RELATION_CONFIG,
    "procurement",
  ),
  Q.createRelationKeyMapper<ContractsRelationKey>().one(
    () => ProjectsConfig.PROJECTS_AS_ONE_RELATION_CONFIG,
    "project",
  ),
  Q.createRelationKeyMapper<ContractsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<ContractsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "status",
  ),
] as const;

export const CONTRACTS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const CONTRACTS_QUERY_OPTIONS = {
  searchableFields: CONTRACTS_SEARCHABLE_FIELDS,
  selectableFields: CONTRACTS_SELECTABLE_FIELDS,
  defaultSelectFields: CONTRACTS_DEFAULT_SELECT_FIELDS,
  sortableFields: CONTRACTS_SORTABLE_FIELDS,
  filterFields: CONTRACTS_FILTERABLE_FIELDS,
  dateRangeFields: CONTRACTS_DATE_RANGE_FIELDS,
  relationKeys: CONTRACTS_RELATION_KEYS,
  editableFields: CONTRACTS_EDITABLE_FIELDS,
  asOne: CONTRACTS_AS_ONE_RELATION_CONFIG,
  asMany: CONTRACTS_AS_MANY_RELATION_CONFIG,
  oneRelations: CONTRACTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: CONTRACTS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IContracts,
  ContractsSortableField,
  ContractsSelectableField,
  ContractsFilterableField,
  ContractsDateRangeField,
  ContractsRelationKey,
  typeof CONTRACTS_ONE_RELATION_QUERY_OPTIONS,
  typeof CONTRACTS_MANY_RELATION_QUERY_OPTIONS
>;
