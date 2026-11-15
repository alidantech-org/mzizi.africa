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

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IPlaces,
  PlacesKey,
  PlacesRelationKey,
  PlacesSortableField,
  PlacesFilterableField,
  PlacesDateRangeField,
  PlacesSelectableField,
  IPlacesAsOneRelationConfig,
  IPlacesAsManyRelationConfig,
} from "./places.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PLACES_RELATION_KEYS = ["feature"] as const satisfies readonly PlacesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PLACES_SORTABLE_FIELDS = [
  "featureId",
  "isInhabited",
] as const satisfies readonly PlacesKey[];

export const PLACES_SEARCHABLE_FIELDS = [] as const satisfies readonly PlacesKey[];

export const PLACES_FILTERABLE_FIELDS = [
  "featureId",
  "isInhabited",
] as const satisfies readonly PlacesKey[];

export const PLACES_DATE_RANGE_FIELDS = [] as const satisfies readonly PlacesKey[];

export const PLACES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IPlaces> = {
  searchableFields: [...PLACES_SEARCHABLE_FIELDS],
  filterFields: [...PLACES_FILTERABLE_FIELDS],
  dateRangeFields: [...PLACES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PLACES_SELECTABLE_FIELDS = [
  "featureId",
  "isInhabited",
] as const satisfies readonly PlacesKey[];

export const PLACES_DEFAULT_SELECT_FIELDS = [
  "featureId",
  "isInhabited",
] as const satisfies readonly PlacesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PLACES_EDITABLE_FIELDS = [
  "featureId",
  "isInhabited",
] as const satisfies readonly PlacesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PLACES_AS_ONE_RELATION_CONFIG = {
  relation: "places",
  type: ERelationType.One,
  selectableFields: PLACES_SELECTABLE_FIELDS,
  defaultSelectFields: PLACES_DEFAULT_SELECT_FIELDS,
} as const satisfies IPlacesAsOneRelationConfig;

export const PLACES_AS_MANY_RELATION_CONFIG = {
  relation: "places",
  type: ERelationType.Many,
  selectableFields: PLACES_SELECTABLE_FIELDS,
  defaultSelectFields: PLACES_DEFAULT_SELECT_FIELDS,
  sortableFields: PLACES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IPlacesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PLACES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<PlacesRelationKey>().one(
    FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "feature",
  ),
] as const;

export const PLACES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PLACES_QUERY_OPTIONS = {
  searchableFields: PLACES_SEARCHABLE_FIELDS,
  selectableFields: PLACES_SELECTABLE_FIELDS,
  defaultSelectFields: PLACES_DEFAULT_SELECT_FIELDS,
  sortableFields: PLACES_SORTABLE_FIELDS,
  filterFields: PLACES_FILTERABLE_FIELDS,
  dateRangeFields: PLACES_DATE_RANGE_FIELDS,
  relationKeys: PLACES_RELATION_KEYS,
  editableFields: PLACES_EDITABLE_FIELDS,
  asOne: PLACES_AS_ONE_RELATION_CONFIG,
  asMany: PLACES_AS_MANY_RELATION_CONFIG,
  oneRelations: PLACES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PLACES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IPlaces,
  PlacesSortableField,
  PlacesSelectableField,
  PlacesFilterableField,
  PlacesDateRangeField,
  PlacesRelationKey,
  typeof PLACES_ONE_RELATION_QUERY_OPTIONS,
  typeof PLACES_MANY_RELATION_QUERY_OPTIONS
>;
