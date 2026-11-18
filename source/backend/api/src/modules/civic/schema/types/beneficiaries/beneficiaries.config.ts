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
import * as ContractsConfig from "#/modules/civic/schema/types/contracts/contracts.config";
import * as ProcurementsConfig from "#/modules/civic/schema/types/procurements/procurements.config";
import * as ProjectsConfig from "#/modules/civic/schema/types/projects/projects.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IBeneficiaries,
  BeneficiariesKey,
  BeneficiariesRelationKey,
  BeneficiariesSortableField,
  BeneficiariesFilterableField,
  BeneficiariesDateRangeField,
  BeneficiariesSelectableField,
  IBeneficiariesAsOneRelationConfig,
  IBeneficiariesAsManyRelationConfig,
} from "./beneficiaries.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const BENEFICIARIES_RELATION_KEYS = [
  "benefitKind",
  "contract",
  "procurement",
  "project",
  "sourceCitation",
] as const satisfies readonly BeneficiariesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const BENEFICIARIES_SORTABLE_FIELDS = [
  "benefitKindId",
  "code",
  "contractId",
  "createdAt",
  "deletedAt",
  "id",
  "procurementId",
  "projectId",
  "sharePercent",
  "sourceCitationId",
  "subjectId",
  "subjectTable",
  "updatedAt",
  "version",
] as const satisfies readonly BeneficiariesKey[];

export const BENEFICIARIES_SEARCHABLE_FIELDS = [
  "code",
] as const satisfies readonly BeneficiariesKey[];

export const BENEFICIARIES_FILTERABLE_FIELDS = [
  "benefitKindId",
  "contractId",
  "id",
  "procurementId",
  "projectId",
  "sourceCitationId",
  "subjectId",
  "subjectTable",
] as const satisfies readonly BeneficiariesKey[];

export const BENEFICIARIES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly BeneficiariesKey[];

export const BENEFICIARIES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IBeneficiaries> = {
  searchableFields: [...BENEFICIARIES_SEARCHABLE_FIELDS],
  filterFields: [...BENEFICIARIES_FILTERABLE_FIELDS],
  dateRangeFields: [...BENEFICIARIES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const BENEFICIARIES_SELECTABLE_FIELDS = [
  "benefitKindId",
  "code",
  "contractId",
  "createdAt",
  "deletedAt",
  "id",
  "procurementId",
  "projectId",
  "sharePercent",
  "sourceCitationId",
  "subjectId",
  "subjectTable",
  "updatedAt",
  "version",
] as const satisfies readonly BeneficiariesKey[];

export const BENEFICIARIES_DEFAULT_SELECT_FIELDS = [
  "benefitKindId",
  "code",
  "contractId",
  "createdAt",
  "deletedAt",
  "id",
  "procurementId",
  "projectId",
  "sharePercent",
  "sourceCitationId",
  "subjectId",
  "subjectTable",
  "updatedAt",
  "version",
] as const satisfies readonly BeneficiariesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const BENEFICIARIES_EDITABLE_FIELDS = [
  "benefitKindId",
  "code",
  "contractId",
  "procurementId",
  "projectId",
  "sharePercent",
  "sourceCitationId",
  "subjectId",
  "subjectTable",
] as const satisfies readonly BeneficiariesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const BENEFICIARIES_AS_ONE_RELATION_CONFIG = {
  relation: "beneficiaries",
  type: ERelationType.One,
  selectableFields: BENEFICIARIES_SELECTABLE_FIELDS,
  defaultSelectFields: BENEFICIARIES_DEFAULT_SELECT_FIELDS,
} as const satisfies IBeneficiariesAsOneRelationConfig;

export const BENEFICIARIES_AS_MANY_RELATION_CONFIG = {
  relation: "beneficiaries",
  type: ERelationType.Many,
  selectableFields: BENEFICIARIES_SELECTABLE_FIELDS,
  defaultSelectFields: BENEFICIARIES_DEFAULT_SELECT_FIELDS,
  sortableFields: BENEFICIARIES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IBeneficiariesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const BENEFICIARIES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<BeneficiariesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "benefitKind",
  ),
  Q.createRelationKeyMapper<BeneficiariesRelationKey>().one(
    () => ContractsConfig.CONTRACTS_AS_ONE_RELATION_CONFIG,
    "contract",
  ),
  Q.createRelationKeyMapper<BeneficiariesRelationKey>().one(
    () => ProcurementsConfig.PROCUREMENTS_AS_ONE_RELATION_CONFIG,
    "procurement",
  ),
  Q.createRelationKeyMapper<BeneficiariesRelationKey>().one(
    () => ProjectsConfig.PROJECTS_AS_ONE_RELATION_CONFIG,
    "project",
  ),
  Q.createRelationKeyMapper<BeneficiariesRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const BENEFICIARIES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const BENEFICIARIES_QUERY_OPTIONS = {
  searchableFields: BENEFICIARIES_SEARCHABLE_FIELDS,
  selectableFields: BENEFICIARIES_SELECTABLE_FIELDS,
  defaultSelectFields: BENEFICIARIES_DEFAULT_SELECT_FIELDS,
  sortableFields: BENEFICIARIES_SORTABLE_FIELDS,
  filterFields: BENEFICIARIES_FILTERABLE_FIELDS,
  dateRangeFields: BENEFICIARIES_DATE_RANGE_FIELDS,
  relationKeys: BENEFICIARIES_RELATION_KEYS,
  editableFields: BENEFICIARIES_EDITABLE_FIELDS,
  asOne: BENEFICIARIES_AS_ONE_RELATION_CONFIG,
  asMany: BENEFICIARIES_AS_MANY_RELATION_CONFIG,
  oneRelations: BENEFICIARIES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: BENEFICIARIES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IBeneficiaries,
  BeneficiariesSortableField,
  BeneficiariesSelectableField,
  BeneficiariesFilterableField,
  BeneficiariesDateRangeField,
  BeneficiariesRelationKey,
  typeof BENEFICIARIES_ONE_RELATION_QUERY_OPTIONS,
  typeof BENEFICIARIES_MANY_RELATION_QUERY_OPTIONS
>;
