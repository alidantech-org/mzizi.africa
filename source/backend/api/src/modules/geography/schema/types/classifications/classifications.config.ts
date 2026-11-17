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

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IClassifications,
  ClassificationsKey,
  ClassificationsRelationKey,
  ClassificationsSortableField,
  ClassificationsFilterableField,
  ClassificationsDateRangeField,
  ClassificationsSelectableField,
  IClassificationsAsOneRelationConfig,
  IClassificationsAsManyRelationConfig,
} from "./classifications.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const CLASSIFICATIONS_RELATION_KEYS = [
  "feature",
  "value",
] as const satisfies readonly ClassificationsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const CLASSIFICATIONS_SORTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "featureId",
  "fromToPrecision",
  "fromYear",
  "id",
  "toYear",
  "updatedAt",
  "valueId",
  "version",
] as const satisfies readonly ClassificationsKey[];

export const CLASSIFICATIONS_SEARCHABLE_FIELDS =
  [] as const satisfies readonly ClassificationsKey[];

export const CLASSIFICATIONS_FILTERABLE_FIELDS = [
  "featureId",
  "fromToPrecision",
  "id",
  "valueId",
] as const satisfies readonly ClassificationsKey[];

export const CLASSIFICATIONS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly ClassificationsKey[];

export const CLASSIFICATIONS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IClassifications> = {
  searchableFields: [...CLASSIFICATIONS_SEARCHABLE_FIELDS],
  filterFields: [...CLASSIFICATIONS_FILTERABLE_FIELDS],
  dateRangeFields: [...CLASSIFICATIONS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const CLASSIFICATIONS_SELECTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "featureId",
  "fromToPrecision",
  "fromYear",
  "id",
  "toYear",
  "updatedAt",
  "valueId",
  "version",
] as const satisfies readonly ClassificationsKey[];

export const CLASSIFICATIONS_DEFAULT_SELECT_FIELDS = [
  "createdAt",
  "deletedAt",
  "featureId",
  "fromToPrecision",
  "fromYear",
  "id",
  "toYear",
  "updatedAt",
  "valueId",
  "version",
] as const satisfies readonly ClassificationsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const CLASSIFICATIONS_EDITABLE_FIELDS = [
  "featureId",
  "fromToPrecision",
  "fromYear",
  "toYear",
  "valueId",
] as const satisfies readonly ClassificationsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const CLASSIFICATIONS_AS_ONE_RELATION_CONFIG = {
  relation: "classifications",
  type: ERelationType.One,
  selectableFields: CLASSIFICATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: CLASSIFICATIONS_DEFAULT_SELECT_FIELDS,
} as const satisfies IClassificationsAsOneRelationConfig;

export const CLASSIFICATIONS_AS_MANY_RELATION_CONFIG = {
  relation: "classifications",
  type: ERelationType.Many,
  selectableFields: CLASSIFICATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: CLASSIFICATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: CLASSIFICATIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IClassificationsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const CLASSIFICATIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ClassificationsRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "feature",
  ),
  Q.createRelationKeyMapper<ClassificationsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "value",
  ),
] as const;

export const CLASSIFICATIONS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const CLASSIFICATIONS_QUERY_OPTIONS = {
  searchableFields: CLASSIFICATIONS_SEARCHABLE_FIELDS,
  selectableFields: CLASSIFICATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: CLASSIFICATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: CLASSIFICATIONS_SORTABLE_FIELDS,
  filterFields: CLASSIFICATIONS_FILTERABLE_FIELDS,
  dateRangeFields: CLASSIFICATIONS_DATE_RANGE_FIELDS,
  relationKeys: CLASSIFICATIONS_RELATION_KEYS,
  editableFields: CLASSIFICATIONS_EDITABLE_FIELDS,
  asOne: CLASSIFICATIONS_AS_ONE_RELATION_CONFIG,
  asMany: CLASSIFICATIONS_AS_MANY_RELATION_CONFIG,
  oneRelations: CLASSIFICATIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: CLASSIFICATIONS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IClassifications,
  ClassificationsSortableField,
  ClassificationsSelectableField,
  ClassificationsFilterableField,
  ClassificationsDateRangeField,
  ClassificationsRelationKey,
  typeof CLASSIFICATIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof CLASSIFICATIONS_MANY_RELATION_QUERY_OPTIONS
>;
