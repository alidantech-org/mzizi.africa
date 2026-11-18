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
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ILevels,
  LevelsKey,
  LevelsRelationKey,
  LevelsSortableField,
  LevelsFilterableField,
  LevelsDateRangeField,
  LevelsSelectableField,
  ILevelsAsOneRelationConfig,
  ILevelsAsManyRelationConfig,
} from "./levels.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const LEVELS_RELATION_KEYS = [
  "country",
  "featureKind",
  "hierarchyKind",
] as const satisfies readonly LevelsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const LEVELS_SORTABLE_FIELDS = [
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "depth",
  "featureKindId",
  "hierarchyKindId",
  "id",
  "isRoutingHierarchy",
  "updatedAt",
  "version",
] as const satisfies readonly LevelsKey[];

export const LEVELS_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly LevelsKey[];

export const LEVELS_FILTERABLE_FIELDS = [
  "countryId",
  "featureKindId",
  "hierarchyKindId",
  "id",
  "isRoutingHierarchy",
] as const satisfies readonly LevelsKey[];

export const LEVELS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly LevelsKey[];

export const LEVELS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<ILevels> = {
  searchableFields: [...LEVELS_SEARCHABLE_FIELDS],
  filterFields: [...LEVELS_FILTERABLE_FIELDS],
  dateRangeFields: [...LEVELS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const LEVELS_SELECTABLE_FIELDS = [
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "depth",
  "featureKindId",
  "hierarchyKindId",
  "id",
  "isRoutingHierarchy",
  "updatedAt",
  "version",
] as const satisfies readonly LevelsKey[];

export const LEVELS_DEFAULT_SELECT_FIELDS = [
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "depth",
  "featureKindId",
  "hierarchyKindId",
  "id",
  "isRoutingHierarchy",
  "updatedAt",
  "version",
] as const satisfies readonly LevelsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const LEVELS_EDITABLE_FIELDS = [
  "code",
  "countryId",
  "depth",
  "featureKindId",
  "hierarchyKindId",
  "isRoutingHierarchy",
] as const satisfies readonly LevelsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const LEVELS_AS_ONE_RELATION_CONFIG = {
  relation: "levels",
  type: ERelationType.One,
  selectableFields: LEVELS_SELECTABLE_FIELDS,
  defaultSelectFields: LEVELS_DEFAULT_SELECT_FIELDS,
} as const satisfies ILevelsAsOneRelationConfig;

export const LEVELS_AS_MANY_RELATION_CONFIG = {
  relation: "levels",
  type: ERelationType.Many,
  selectableFields: LEVELS_SELECTABLE_FIELDS,
  defaultSelectFields: LEVELS_DEFAULT_SELECT_FIELDS,
  sortableFields: LEVELS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies ILevelsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const LEVELS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<LevelsRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<LevelsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "featureKind",
  ),
  Q.createRelationKeyMapper<LevelsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "hierarchyKind",
  ),
] as const;

export const LEVELS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const LEVELS_QUERY_OPTIONS = {
  searchableFields: LEVELS_SEARCHABLE_FIELDS,
  selectableFields: LEVELS_SELECTABLE_FIELDS,
  defaultSelectFields: LEVELS_DEFAULT_SELECT_FIELDS,
  sortableFields: LEVELS_SORTABLE_FIELDS,
  filterFields: LEVELS_FILTERABLE_FIELDS,
  dateRangeFields: LEVELS_DATE_RANGE_FIELDS,
  relationKeys: LEVELS_RELATION_KEYS,
  editableFields: LEVELS_EDITABLE_FIELDS,
  asOne: LEVELS_AS_ONE_RELATION_CONFIG,
  asMany: LEVELS_AS_MANY_RELATION_CONFIG,
  oneRelations: LEVELS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: LEVELS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  ILevels,
  LevelsSortableField,
  LevelsSelectableField,
  LevelsFilterableField,
  LevelsDateRangeField,
  LevelsRelationKey,
  typeof LEVELS_ONE_RELATION_QUERY_OPTIONS,
  typeof LEVELS_MANY_RELATION_QUERY_OPTIONS
>;
