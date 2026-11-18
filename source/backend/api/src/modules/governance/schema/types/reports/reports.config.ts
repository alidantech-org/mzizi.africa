// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ArtifactsConfig from "#/modules/source/schema/types/artifacts/artifacts.config";
import * as ObligationsConfig from "#/modules/governance/schema/types/obligations/obligations.config";
import * as EntitiesConfig from "#/modules/official/schema/types/entities/entities.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IReports,
  ReportsKey,
  ReportsRelationKey,
  ReportsSortableField,
  ReportsFilterableField,
  ReportsDateRangeField,
  ReportsSelectableField,
  IReportsAsOneRelationConfig,
  IReportsAsManyRelationConfig,
} from "./reports.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const REPORTS_RELATION_KEYS = [
  "artifact",
  "obligation",
  "reporterEntity",
  "sourceCitation",
  "status",
] as const satisfies readonly ReportsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const REPORTS_SORTABLE_FIELDS = [
  "artifactId",
  "code",
  "createdAt",
  "deletedAt",
  "dueOn",
  "filedOn",
  "id",
  "obligationId",
  "periodFrom",
  "periodUntil",
  "reporterEntityId",
  "sourceCitationId",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly ReportsKey[];

export const REPORTS_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly ReportsKey[];

export const REPORTS_FILTERABLE_FIELDS = [
  "artifactId",
  "id",
  "obligationId",
  "reporterEntityId",
  "sourceCitationId",
  "statusId",
] as const satisfies readonly ReportsKey[];

export const REPORTS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "dueOn",
  "filedOn",
  "periodFrom",
  "periodUntil",
  "updatedAt",
] as const satisfies readonly ReportsKey[];

export const REPORTS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IReports> = {
  searchableFields: [...REPORTS_SEARCHABLE_FIELDS],
  filterFields: [...REPORTS_FILTERABLE_FIELDS],
  dateRangeFields: [...REPORTS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const REPORTS_SELECTABLE_FIELDS = [
  "artifactId",
  "code",
  "createdAt",
  "deletedAt",
  "dueOn",
  "filedOn",
  "id",
  "obligationId",
  "periodFrom",
  "periodUntil",
  "reporterEntityId",
  "sourceCitationId",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly ReportsKey[];

export const REPORTS_DEFAULT_SELECT_FIELDS = [
  "artifactId",
  "code",
  "createdAt",
  "deletedAt",
  "dueOn",
  "filedOn",
  "id",
  "obligationId",
  "periodFrom",
  "periodUntil",
  "reporterEntityId",
  "sourceCitationId",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly ReportsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const REPORTS_EDITABLE_FIELDS = [
  "artifactId",
  "code",
  "dueOn",
  "filedOn",
  "obligationId",
  "periodFrom",
  "periodUntil",
  "reporterEntityId",
  "sourceCitationId",
  "statusId",
] as const satisfies readonly ReportsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const REPORTS_AS_ONE_RELATION_CONFIG = {
  relation: "reports",
  type: ERelationType.One,
  selectableFields: REPORTS_SELECTABLE_FIELDS,
  defaultSelectFields: REPORTS_DEFAULT_SELECT_FIELDS,
} as const satisfies IReportsAsOneRelationConfig;

export const REPORTS_AS_MANY_RELATION_CONFIG = {
  relation: "reports",
  type: ERelationType.Many,
  selectableFields: REPORTS_SELECTABLE_FIELDS,
  defaultSelectFields: REPORTS_DEFAULT_SELECT_FIELDS,
  sortableFields: REPORTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IReportsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const REPORTS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ReportsRelationKey>().one(
    () => ArtifactsConfig.ARTIFACTS_AS_ONE_RELATION_CONFIG,
    "artifact",
  ),
  Q.createRelationKeyMapper<ReportsRelationKey>().one(
    () => ObligationsConfig.OBLIGATIONS_AS_ONE_RELATION_CONFIG,
    "obligation",
  ),
  Q.createRelationKeyMapper<ReportsRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "reporterEntity",
  ),
  Q.createRelationKeyMapper<ReportsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<ReportsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "status",
  ),
] as const;

export const REPORTS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const REPORTS_QUERY_OPTIONS = {
  searchableFields: REPORTS_SEARCHABLE_FIELDS,
  selectableFields: REPORTS_SELECTABLE_FIELDS,
  defaultSelectFields: REPORTS_DEFAULT_SELECT_FIELDS,
  sortableFields: REPORTS_SORTABLE_FIELDS,
  filterFields: REPORTS_FILTERABLE_FIELDS,
  dateRangeFields: REPORTS_DATE_RANGE_FIELDS,
  relationKeys: REPORTS_RELATION_KEYS,
  editableFields: REPORTS_EDITABLE_FIELDS,
  asOne: REPORTS_AS_ONE_RELATION_CONFIG,
  asMany: REPORTS_AS_MANY_RELATION_CONFIG,
  oneRelations: REPORTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: REPORTS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IReports,
  ReportsSortableField,
  ReportsSelectableField,
  ReportsFilterableField,
  ReportsDateRangeField,
  ReportsRelationKey,
  typeof REPORTS_ONE_RELATION_QUERY_OPTIONS,
  typeof REPORTS_MANY_RELATION_QUERY_OPTIONS
>;
