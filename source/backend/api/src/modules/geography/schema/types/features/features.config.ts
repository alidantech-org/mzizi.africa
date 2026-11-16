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

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IFeatures,
  FeaturesKey,
  FeaturesRelationKey,
  FeaturesSortableField,
  FeaturesFilterableField,
  FeaturesDateRangeField,
  FeaturesSelectableField,
  IFeaturesAsOneRelationConfig,
  IFeaturesAsManyRelationConfig,
} from "./features.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const FEATURES_RELATION_KEYS = ["featureType"] as const satisfies readonly FeaturesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const FEATURES_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "featureTypeId",
  "id",
  "updatedAt",
  "version",
] as const satisfies readonly FeaturesKey[];

export const FEATURES_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly FeaturesKey[];

export const FEATURES_FILTERABLE_FIELDS = [
  "featureTypeId",
  "id",
] as const satisfies readonly FeaturesKey[];

export const FEATURES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly FeaturesKey[];

export const FEATURES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IFeatures> = {
  searchableFields: [...FEATURES_SEARCHABLE_FIELDS],
  filterFields: [...FEATURES_FILTERABLE_FIELDS],
  dateRangeFields: [...FEATURES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const FEATURES_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "featureTypeId",
  "id",
  "updatedAt",
  "version",
] as const satisfies readonly FeaturesKey[];

export const FEATURES_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "featureTypeId",
  "id",
  "updatedAt",
  "version",
] as const satisfies readonly FeaturesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const FEATURES_EDITABLE_FIELDS = [
  "code",
  "featureTypeId",
] as const satisfies readonly FeaturesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const FEATURES_AS_ONE_RELATION_CONFIG = {
  relation: "features",
  type: ERelationType.One,
  selectableFields: FEATURES_SELECTABLE_FIELDS,
  defaultSelectFields: FEATURES_DEFAULT_SELECT_FIELDS,
} as const satisfies IFeaturesAsOneRelationConfig;

export const FEATURES_AS_MANY_RELATION_CONFIG = {
  relation: "features",
  type: ERelationType.Many,
  selectableFields: FEATURES_SELECTABLE_FIELDS,
  defaultSelectFields: FEATURES_DEFAULT_SELECT_FIELDS,
  sortableFields: FEATURES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IFeaturesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const FEATURES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<FeaturesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "featureType",
  ),
] as const;

export const FEATURES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const FEATURES_QUERY_OPTIONS = {
  searchableFields: FEATURES_SEARCHABLE_FIELDS,
  selectableFields: FEATURES_SELECTABLE_FIELDS,
  defaultSelectFields: FEATURES_DEFAULT_SELECT_FIELDS,
  sortableFields: FEATURES_SORTABLE_FIELDS,
  filterFields: FEATURES_FILTERABLE_FIELDS,
  dateRangeFields: FEATURES_DATE_RANGE_FIELDS,
  relationKeys: FEATURES_RELATION_KEYS,
  editableFields: FEATURES_EDITABLE_FIELDS,
  asOne: FEATURES_AS_ONE_RELATION_CONFIG,
  asMany: FEATURES_AS_MANY_RELATION_CONFIG,
  oneRelations: FEATURES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: FEATURES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IFeatures,
  FeaturesSortableField,
  FeaturesSelectableField,
  FeaturesFilterableField,
  FeaturesDateRangeField,
  FeaturesRelationKey,
  typeof FEATURES_ONE_RELATION_QUERY_OPTIONS,
  typeof FEATURES_MANY_RELATION_QUERY_OPTIONS
>;
