// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as FeaturesConfig from "#/modules/geography/schema/types/features/features.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as ProjectsConfig from "#/modules/civic/schema/types/projects/projects.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IProjectFeatures,
  ProjectFeaturesKey,
  ProjectFeaturesRelationKey,
  ProjectFeaturesSortableField,
  ProjectFeaturesFilterableField,
  ProjectFeaturesDateRangeField,
  ProjectFeaturesSelectableField,
  IProjectFeaturesAsOneRelationConfig,
  IProjectFeaturesAsManyRelationConfig,
} from "./project-features.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PROJECT_FEATURES_RELATION_KEYS = [
  "feature",
  "featureKind",
  "project",
  "sourceCitation",
] as const satisfies readonly ProjectFeaturesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PROJECT_FEATURES_SORTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "featureId",
  "featureKindId",
  "id",
  "projectId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly ProjectFeaturesKey[];

export const PROJECT_FEATURES_SEARCHABLE_FIELDS =
  [] as const satisfies readonly ProjectFeaturesKey[];

export const PROJECT_FEATURES_FILTERABLE_FIELDS = [
  "featureId",
  "featureKindId",
  "id",
  "projectId",
  "sourceCitationId",
] as const satisfies readonly ProjectFeaturesKey[];

export const PROJECT_FEATURES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly ProjectFeaturesKey[];

export const PROJECT_FEATURES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IProjectFeatures> =
  {
    searchableFields: [...PROJECT_FEATURES_SEARCHABLE_FIELDS],
    filterFields: [...PROJECT_FEATURES_FILTERABLE_FIELDS],
    dateRangeFields: [...PROJECT_FEATURES_DATE_RANGE_FIELDS],
  };

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PROJECT_FEATURES_SELECTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "featureId",
  "featureKindId",
  "id",
  "projectId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly ProjectFeaturesKey[];

export const PROJECT_FEATURES_DEFAULT_SELECT_FIELDS = [
  "createdAt",
  "deletedAt",
  "featureId",
  "featureKindId",
  "id",
  "projectId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly ProjectFeaturesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PROJECT_FEATURES_EDITABLE_FIELDS = [
  "featureId",
  "featureKindId",
  "projectId",
  "sourceCitationId",
] as const satisfies readonly ProjectFeaturesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PROJECT_FEATURES_AS_ONE_RELATION_CONFIG = {
  relation: "projectFeatures",
  type: ERelationType.One,
  selectableFields: PROJECT_FEATURES_SELECTABLE_FIELDS,
  defaultSelectFields: PROJECT_FEATURES_DEFAULT_SELECT_FIELDS,
} as const satisfies IProjectFeaturesAsOneRelationConfig;

export const PROJECT_FEATURES_AS_MANY_RELATION_CONFIG = {
  relation: "projectFeatures",
  type: ERelationType.Many,
  selectableFields: PROJECT_FEATURES_SELECTABLE_FIELDS,
  defaultSelectFields: PROJECT_FEATURES_DEFAULT_SELECT_FIELDS,
  sortableFields: PROJECT_FEATURES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IProjectFeaturesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PROJECT_FEATURES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ProjectFeaturesRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "feature",
  ),
  Q.createRelationKeyMapper<ProjectFeaturesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "featureKind",
  ),
  Q.createRelationKeyMapper<ProjectFeaturesRelationKey>().one(
    () => ProjectsConfig.PROJECTS_AS_ONE_RELATION_CONFIG,
    "project",
  ),
  Q.createRelationKeyMapper<ProjectFeaturesRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const PROJECT_FEATURES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PROJECT_FEATURES_QUERY_OPTIONS = {
  searchableFields: PROJECT_FEATURES_SEARCHABLE_FIELDS,
  selectableFields: PROJECT_FEATURES_SELECTABLE_FIELDS,
  defaultSelectFields: PROJECT_FEATURES_DEFAULT_SELECT_FIELDS,
  sortableFields: PROJECT_FEATURES_SORTABLE_FIELDS,
  filterFields: PROJECT_FEATURES_FILTERABLE_FIELDS,
  dateRangeFields: PROJECT_FEATURES_DATE_RANGE_FIELDS,
  relationKeys: PROJECT_FEATURES_RELATION_KEYS,
  editableFields: PROJECT_FEATURES_EDITABLE_FIELDS,
  asOne: PROJECT_FEATURES_AS_ONE_RELATION_CONFIG,
  asMany: PROJECT_FEATURES_AS_MANY_RELATION_CONFIG,
  oneRelations: PROJECT_FEATURES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PROJECT_FEATURES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IProjectFeatures,
  ProjectFeaturesSortableField,
  ProjectFeaturesSelectableField,
  ProjectFeaturesFilterableField,
  ProjectFeaturesDateRangeField,
  ProjectFeaturesRelationKey,
  typeof PROJECT_FEATURES_ONE_RELATION_QUERY_OPTIONS,
  typeof PROJECT_FEATURES_MANY_RELATION_QUERY_OPTIONS
>;
