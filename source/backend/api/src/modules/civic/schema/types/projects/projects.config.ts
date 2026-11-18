// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as CountryConfig from "#/modules/reference/schema/types/country/country.config";
import * as EntitiesConfig from "#/modules/official/schema/types/entities/entities.config";
import * as InstitutionsConfig from "#/modules/governance/schema/types/institutions/institutions.config";
import * as FeaturesConfig from "#/modules/geography/schema/types/features/features.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IProjects,
  ProjectsKey,
  ProjectsRelationKey,
  ProjectsSortableField,
  ProjectsFilterableField,
  ProjectsDateRangeField,
  ProjectsSelectableField,
  IProjectsAsOneRelationConfig,
  IProjectsAsManyRelationConfig,
} from "./projects.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PROJECTS_RELATION_KEYS = [
  "country",
  "implementingEntity",
  "responsibleInstitution",
  "scopeUnitFeature",
  "sourceCitation",
  "sponsorEntity",
  "status",
] as const satisfies readonly ProjectsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PROJECTS_SORTABLE_FIELDS = [
  "code",
  "completedOn",
  "countryId",
  "createdAt",
  "deletedAt",
  "description",
  "id",
  "implementingEntityId",
  "name",
  "responsibleInstitutionId",
  "scopeUnitFeatureId",
  "sourceCitationId",
  "sponsorEntityId",
  "startedOn",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly ProjectsKey[];

export const PROJECTS_SEARCHABLE_FIELDS = [
  "code",
  "description",
  "name",
] as const satisfies readonly ProjectsKey[];

export const PROJECTS_FILTERABLE_FIELDS = [
  "countryId",
  "id",
  "implementingEntityId",
  "responsibleInstitutionId",
  "scopeUnitFeatureId",
  "sourceCitationId",
  "sponsorEntityId",
  "statusId",
] as const satisfies readonly ProjectsKey[];

export const PROJECTS_DATE_RANGE_FIELDS = [
  "completedOn",
  "createdAt",
  "deletedAt",
  "startedOn",
  "updatedAt",
] as const satisfies readonly ProjectsKey[];

export const PROJECTS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IProjects> = {
  searchableFields: [...PROJECTS_SEARCHABLE_FIELDS],
  filterFields: [...PROJECTS_FILTERABLE_FIELDS],
  dateRangeFields: [...PROJECTS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PROJECTS_SELECTABLE_FIELDS = [
  "code",
  "completedOn",
  "countryId",
  "createdAt",
  "deletedAt",
  "description",
  "id",
  "implementingEntityId",
  "location",
  "name",
  "responsibleInstitutionId",
  "scopeUnitFeatureId",
  "sourceCitationId",
  "sponsorEntityId",
  "startedOn",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly ProjectsKey[];

export const PROJECTS_DEFAULT_SELECT_FIELDS = [
  "code",
  "completedOn",
  "countryId",
  "createdAt",
  "deletedAt",
  "description",
  "id",
  "implementingEntityId",
  "location",
  "name",
  "responsibleInstitutionId",
  "scopeUnitFeatureId",
  "sourceCitationId",
  "sponsorEntityId",
  "startedOn",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly ProjectsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PROJECTS_EDITABLE_FIELDS = [
  "code",
  "completedOn",
  "countryId",
  "description",
  "implementingEntityId",
  "location",
  "name",
  "responsibleInstitutionId",
  "scopeUnitFeatureId",
  "sourceCitationId",
  "sponsorEntityId",
  "startedOn",
  "statusId",
] as const satisfies readonly ProjectsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PROJECTS_AS_ONE_RELATION_CONFIG = {
  relation: "projects",
  type: ERelationType.One,
  selectableFields: PROJECTS_SELECTABLE_FIELDS,
  defaultSelectFields: PROJECTS_DEFAULT_SELECT_FIELDS,
} as const satisfies IProjectsAsOneRelationConfig;

export const PROJECTS_AS_MANY_RELATION_CONFIG = {
  relation: "projects",
  type: ERelationType.Many,
  selectableFields: PROJECTS_SELECTABLE_FIELDS,
  defaultSelectFields: PROJECTS_DEFAULT_SELECT_FIELDS,
  sortableFields: PROJECTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IProjectsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PROJECTS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ProjectsRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<ProjectsRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "implementingEntity",
  ),
  Q.createRelationKeyMapper<ProjectsRelationKey>().one(
    () => InstitutionsConfig.INSTITUTIONS_AS_ONE_RELATION_CONFIG,
    "responsibleInstitution",
  ),
  Q.createRelationKeyMapper<ProjectsRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "scopeUnitFeature",
  ),
  Q.createRelationKeyMapper<ProjectsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<ProjectsRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "sponsorEntity",
  ),
  Q.createRelationKeyMapper<ProjectsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "status",
  ),
] as const;

export const PROJECTS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PROJECTS_QUERY_OPTIONS = {
  searchableFields: PROJECTS_SEARCHABLE_FIELDS,
  selectableFields: PROJECTS_SELECTABLE_FIELDS,
  defaultSelectFields: PROJECTS_DEFAULT_SELECT_FIELDS,
  sortableFields: PROJECTS_SORTABLE_FIELDS,
  filterFields: PROJECTS_FILTERABLE_FIELDS,
  dateRangeFields: PROJECTS_DATE_RANGE_FIELDS,
  relationKeys: PROJECTS_RELATION_KEYS,
  editableFields: PROJECTS_EDITABLE_FIELDS,
  asOne: PROJECTS_AS_ONE_RELATION_CONFIG,
  asMany: PROJECTS_AS_MANY_RELATION_CONFIG,
  oneRelations: PROJECTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PROJECTS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IProjects,
  ProjectsSortableField,
  ProjectsSelectableField,
  ProjectsFilterableField,
  ProjectsDateRangeField,
  ProjectsRelationKey,
  typeof PROJECTS_ONE_RELATION_QUERY_OPTIONS,
  typeof PROJECTS_MANY_RELATION_QUERY_OPTIONS
>;
