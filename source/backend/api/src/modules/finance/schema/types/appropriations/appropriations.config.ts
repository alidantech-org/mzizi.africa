// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as BudgetVersionsConfig from "#/modules/finance/schema/types/budget-versions/budget-versions.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as ProjectsConfig from "#/modules/civic/schema/types/projects/projects.config";
import * as EntitiesConfig from "#/modules/official/schema/types/entities/entities.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";
import * as FeaturesConfig from "#/modules/geography/schema/types/features/features.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IAppropriations,
  AppropriationsKey,
  AppropriationsRelationKey,
  AppropriationsSortableField,
  AppropriationsFilterableField,
  AppropriationsDateRangeField,
  AppropriationsSelectableField,
  IAppropriationsAsOneRelationConfig,
  IAppropriationsAsManyRelationConfig,
} from "./appropriations.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const APPROPRIATIONS_RELATION_KEYS = [
  "budgetVersion",
  "classification",
  "currency",
  "parentAppropriation",
  "project",
  "recipientEntity",
  "sourceCitation",
  "unitFeature",
] as const satisfies readonly AppropriationsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const APPROPRIATIONS_SORTABLE_FIELDS = [
  "amountMinorUnits",
  "budgetVersionId",
  "classificationId",
  "code",
  "createdAt",
  "currencyId",
  "deletedAt",
  "id",
  "parentAppropriationId",
  "projectId",
  "recipientEntityId",
  "sourceCitationId",
  "unitFeatureId",
  "updatedAt",
  "version",
] as const satisfies readonly AppropriationsKey[];

export const APPROPRIATIONS_SEARCHABLE_FIELDS = [
  "code",
] as const satisfies readonly AppropriationsKey[];

export const APPROPRIATIONS_FILTERABLE_FIELDS = [
  "budgetVersionId",
  "classificationId",
  "currencyId",
  "id",
  "parentAppropriationId",
  "projectId",
  "recipientEntityId",
  "sourceCitationId",
  "unitFeatureId",
] as const satisfies readonly AppropriationsKey[];

export const APPROPRIATIONS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly AppropriationsKey[];

export const APPROPRIATIONS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IAppropriations> = {
  searchableFields: [...APPROPRIATIONS_SEARCHABLE_FIELDS],
  filterFields: [...APPROPRIATIONS_FILTERABLE_FIELDS],
  dateRangeFields: [...APPROPRIATIONS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const APPROPRIATIONS_SELECTABLE_FIELDS = [
  "amountMinorUnits",
  "budgetVersionId",
  "classificationId",
  "code",
  "createdAt",
  "currencyId",
  "deletedAt",
  "id",
  "parentAppropriationId",
  "projectId",
  "recipientEntityId",
  "sourceCitationId",
  "unitFeatureId",
  "updatedAt",
  "version",
] as const satisfies readonly AppropriationsKey[];

export const APPROPRIATIONS_DEFAULT_SELECT_FIELDS = [
  "amountMinorUnits",
  "budgetVersionId",
  "classificationId",
  "code",
  "createdAt",
  "currencyId",
  "deletedAt",
  "id",
  "parentAppropriationId",
  "projectId",
  "recipientEntityId",
  "sourceCitationId",
  "unitFeatureId",
  "updatedAt",
  "version",
] as const satisfies readonly AppropriationsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const APPROPRIATIONS_EDITABLE_FIELDS = [
  "amountMinorUnits",
  "budgetVersionId",
  "classificationId",
  "code",
  "currencyId",
  "parentAppropriationId",
  "projectId",
  "recipientEntityId",
  "sourceCitationId",
  "unitFeatureId",
] as const satisfies readonly AppropriationsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const APPROPRIATIONS_AS_ONE_RELATION_CONFIG = {
  relation: "appropriations",
  type: ERelationType.One,
  selectableFields: APPROPRIATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: APPROPRIATIONS_DEFAULT_SELECT_FIELDS,
} as const satisfies IAppropriationsAsOneRelationConfig;

export const APPROPRIATIONS_AS_MANY_RELATION_CONFIG = {
  relation: "appropriations",
  type: ERelationType.Many,
  selectableFields: APPROPRIATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: APPROPRIATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: APPROPRIATIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IAppropriationsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const APPROPRIATIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<AppropriationsRelationKey>().one(
    () => BudgetVersionsConfig.BUDGET_VERSIONS_AS_ONE_RELATION_CONFIG,
    "budgetVersion",
  ),
  Q.createRelationKeyMapper<AppropriationsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "classification",
  ),
  Q.createRelationKeyMapper<AppropriationsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "currency",
  ),
  Q.createRelationKeyMapper<AppropriationsRelationKey>().one(
    () => ProjectsConfig.PROJECTS_AS_ONE_RELATION_CONFIG,
    "project",
  ),
  Q.createRelationKeyMapper<AppropriationsRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "recipientEntity",
  ),
  Q.createRelationKeyMapper<AppropriationsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
  Q.createRelationKeyMapper<AppropriationsRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "unitFeature",
  ),
] as const;

export const APPROPRIATIONS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const APPROPRIATIONS_QUERY_OPTIONS = {
  searchableFields: APPROPRIATIONS_SEARCHABLE_FIELDS,
  selectableFields: APPROPRIATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: APPROPRIATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: APPROPRIATIONS_SORTABLE_FIELDS,
  filterFields: APPROPRIATIONS_FILTERABLE_FIELDS,
  dateRangeFields: APPROPRIATIONS_DATE_RANGE_FIELDS,
  relationKeys: APPROPRIATIONS_RELATION_KEYS,
  editableFields: APPROPRIATIONS_EDITABLE_FIELDS,
  asOne: APPROPRIATIONS_AS_ONE_RELATION_CONFIG,
  asMany: APPROPRIATIONS_AS_MANY_RELATION_CONFIG,
  oneRelations: APPROPRIATIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: APPROPRIATIONS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IAppropriations,
  AppropriationsSortableField,
  AppropriationsSelectableField,
  AppropriationsFilterableField,
  AppropriationsDateRangeField,
  AppropriationsRelationKey,
  typeof APPROPRIATIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof APPROPRIATIONS_MANY_RELATION_QUERY_OPTIONS
>;
