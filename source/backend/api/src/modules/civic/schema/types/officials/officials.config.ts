// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ContractsConfig from "#/modules/civic/schema/types/contracts/contracts.config";
import * as IndividualsConfig from "#/modules/official/schema/types/individuals/individuals.config";
import * as OfficesConfig from "#/modules/governance/schema/types/offices/offices.config";
import * as ProcurementsConfig from "#/modules/civic/schema/types/procurements/procurements.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IOfficials,
  OfficialsKey,
  OfficialsRelationKey,
  OfficialsSortableField,
  OfficialsFilterableField,
  OfficialsDateRangeField,
  OfficialsSelectableField,
  IOfficialsAsOneRelationConfig,
  IOfficialsAsManyRelationConfig,
} from "./officials.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const OFFICIALS_RELATION_KEYS = [
  "contract",
  "individual",
  "office",
  "procurement",
  "role",
  "sourceCitation",
] as const satisfies readonly OfficialsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const OFFICIALS_SORTABLE_FIELDS = [
  "actedOn",
  "contractId",
  "createdAt",
  "deletedAt",
  "id",
  "individualId",
  "officeId",
  "procurementId",
  "roleId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly OfficialsKey[];

export const OFFICIALS_SEARCHABLE_FIELDS = [] as const satisfies readonly OfficialsKey[];

export const OFFICIALS_FILTERABLE_FIELDS = [
  "contractId",
  "id",
  "individualId",
  "officeId",
  "procurementId",
  "roleId",
  "sourceCitationId",
] as const satisfies readonly OfficialsKey[];

export const OFFICIALS_DATE_RANGE_FIELDS = [
  "actedOn",
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly OfficialsKey[];

export const OFFICIALS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IOfficials> = {
  searchableFields: [...OFFICIALS_SEARCHABLE_FIELDS],
  filterFields: [...OFFICIALS_FILTERABLE_FIELDS],
  dateRangeFields: [...OFFICIALS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const OFFICIALS_SELECTABLE_FIELDS = [
  "actedOn",
  "contractId",
  "createdAt",
  "deletedAt",
  "id",
  "individualId",
  "officeId",
  "procurementId",
  "roleId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly OfficialsKey[];

export const OFFICIALS_DEFAULT_SELECT_FIELDS = [
  "actedOn",
  "contractId",
  "createdAt",
  "deletedAt",
  "id",
  "individualId",
  "officeId",
  "procurementId",
  "roleId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly OfficialsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const OFFICIALS_EDITABLE_FIELDS = [
  "actedOn",
  "contractId",
  "individualId",
  "officeId",
  "procurementId",
  "roleId",
  "sourceCitationId",
] as const satisfies readonly OfficialsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const OFFICIALS_AS_ONE_RELATION_CONFIG = {
  relation: "officials",
  type: ERelationType.One,
  selectableFields: OFFICIALS_SELECTABLE_FIELDS,
  defaultSelectFields: OFFICIALS_DEFAULT_SELECT_FIELDS,
} as const satisfies IOfficialsAsOneRelationConfig;

export const OFFICIALS_AS_MANY_RELATION_CONFIG = {
  relation: "officials",
  type: ERelationType.Many,
  selectableFields: OFFICIALS_SELECTABLE_FIELDS,
  defaultSelectFields: OFFICIALS_DEFAULT_SELECT_FIELDS,
  sortableFields: OFFICIALS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IOfficialsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const OFFICIALS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<OfficialsRelationKey>().one(
    () => ContractsConfig.CONTRACTS_AS_ONE_RELATION_CONFIG,
    "contract",
  ),
  Q.createRelationKeyMapper<OfficialsRelationKey>().one(
    () => IndividualsConfig.INDIVIDUALS_AS_ONE_RELATION_CONFIG,
    "individual",
  ),
  Q.createRelationKeyMapper<OfficialsRelationKey>().one(
    () => OfficesConfig.OFFICES_AS_ONE_RELATION_CONFIG,
    "office",
  ),
  Q.createRelationKeyMapper<OfficialsRelationKey>().one(
    () => ProcurementsConfig.PROCUREMENTS_AS_ONE_RELATION_CONFIG,
    "procurement",
  ),
  Q.createRelationKeyMapper<OfficialsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "role",
  ),
  Q.createRelationKeyMapper<OfficialsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const OFFICIALS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const OFFICIALS_QUERY_OPTIONS = {
  searchableFields: OFFICIALS_SEARCHABLE_FIELDS,
  selectableFields: OFFICIALS_SELECTABLE_FIELDS,
  defaultSelectFields: OFFICIALS_DEFAULT_SELECT_FIELDS,
  sortableFields: OFFICIALS_SORTABLE_FIELDS,
  filterFields: OFFICIALS_FILTERABLE_FIELDS,
  dateRangeFields: OFFICIALS_DATE_RANGE_FIELDS,
  relationKeys: OFFICIALS_RELATION_KEYS,
  editableFields: OFFICIALS_EDITABLE_FIELDS,
  asOne: OFFICIALS_AS_ONE_RELATION_CONFIG,
  asMany: OFFICIALS_AS_MANY_RELATION_CONFIG,
  oneRelations: OFFICIALS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: OFFICIALS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IOfficials,
  OfficialsSortableField,
  OfficialsSelectableField,
  OfficialsFilterableField,
  OfficialsDateRangeField,
  OfficialsRelationKey,
  typeof OFFICIALS_ONE_RELATION_QUERY_OPTIONS,
  typeof OFFICIALS_MANY_RELATION_QUERY_OPTIONS
>;
