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
import * as FeaturesConfig from "#/modules/geography/schema/types/features/features.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ISeasons,
  SeasonsKey,
  SeasonsRelationKey,
  SeasonsSortableField,
  SeasonsFilterableField,
  SeasonsDateRangeField,
  SeasonsSelectableField,
  ISeasonsAsOneRelationConfig,
  ISeasonsAsManyRelationConfig,
} from "./seasons.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SEASONS_RELATION_KEYS = [
  "country",
  "scopeFeature",
  "seasonKind",
  "sourceCitation",
] as const satisfies readonly SeasonsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SEASONS_SORTABLE_FIELDS = [
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "description",
  "endDay",
  "endMonth",
  "fromToPrecision",
  "fromYear",
  "id",
  "isNatural",
  "scopeFeatureId",
  "seasonKindId",
  "sourceCitationId",
  "startDay",
  "startMonth",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly SeasonsKey[];

export const SEASONS_SEARCHABLE_FIELDS = [
  "code",
  "description",
] as const satisfies readonly SeasonsKey[];

export const SEASONS_FILTERABLE_FIELDS = [
  "countryId",
  "fromToPrecision",
  "id",
  "isNatural",
  "scopeFeatureId",
  "seasonKindId",
  "sourceCitationId",
] as const satisfies readonly SeasonsKey[];

export const SEASONS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly SeasonsKey[];

export const SEASONS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<ISeasons> = {
  searchableFields: [...SEASONS_SEARCHABLE_FIELDS],
  filterFields: [...SEASONS_FILTERABLE_FIELDS],
  dateRangeFields: [...SEASONS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SEASONS_SELECTABLE_FIELDS = [
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "description",
  "endDay",
  "endMonth",
  "fromToPrecision",
  "fromYear",
  "id",
  "isNatural",
  "scopeFeatureId",
  "seasonKindId",
  "sourceCitationId",
  "startDay",
  "startMonth",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly SeasonsKey[];

export const SEASONS_DEFAULT_SELECT_FIELDS = [
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "description",
  "endDay",
  "endMonth",
  "fromToPrecision",
  "fromYear",
  "id",
  "isNatural",
  "scopeFeatureId",
  "seasonKindId",
  "sourceCitationId",
  "startDay",
  "startMonth",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly SeasonsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SEASONS_EDITABLE_FIELDS = [
  "code",
  "countryId",
  "description",
  "endDay",
  "endMonth",
  "fromToPrecision",
  "fromYear",
  "isNatural",
  "scopeFeatureId",
  "seasonKindId",
  "sourceCitationId",
  "startDay",
  "startMonth",
  "toYear",
] as const satisfies readonly SeasonsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SEASONS_AS_ONE_RELATION_CONFIG = {
  relation: "seasons",
  type: ERelationType.One,
  selectableFields: SEASONS_SELECTABLE_FIELDS,
  defaultSelectFields: SEASONS_DEFAULT_SELECT_FIELDS,
} as const satisfies ISeasonsAsOneRelationConfig;

export const SEASONS_AS_MANY_RELATION_CONFIG = {
  relation: "seasons",
  type: ERelationType.Many,
  selectableFields: SEASONS_SELECTABLE_FIELDS,
  defaultSelectFields: SEASONS_DEFAULT_SELECT_FIELDS,
  sortableFields: SEASONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies ISeasonsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SEASONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<SeasonsRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<SeasonsRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "scopeFeature",
  ),
  Q.createRelationKeyMapper<SeasonsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "seasonKind",
  ),
  Q.createRelationKeyMapper<SeasonsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const SEASONS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SEASONS_QUERY_OPTIONS = {
  searchableFields: SEASONS_SEARCHABLE_FIELDS,
  selectableFields: SEASONS_SELECTABLE_FIELDS,
  defaultSelectFields: SEASONS_DEFAULT_SELECT_FIELDS,
  sortableFields: SEASONS_SORTABLE_FIELDS,
  filterFields: SEASONS_FILTERABLE_FIELDS,
  dateRangeFields: SEASONS_DATE_RANGE_FIELDS,
  relationKeys: SEASONS_RELATION_KEYS,
  editableFields: SEASONS_EDITABLE_FIELDS,
  asOne: SEASONS_AS_ONE_RELATION_CONFIG,
  asMany: SEASONS_AS_MANY_RELATION_CONFIG,
  oneRelations: SEASONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SEASONS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  ISeasons,
  SeasonsSortableField,
  SeasonsSelectableField,
  SeasonsFilterableField,
  SeasonsDateRangeField,
  SeasonsRelationKey,
  typeof SEASONS_ONE_RELATION_QUERY_OPTIONS,
  typeof SEASONS_MANY_RELATION_QUERY_OPTIONS
>;
