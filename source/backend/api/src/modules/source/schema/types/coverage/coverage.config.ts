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
import * as ProductsConfig from "#/modules/source/schema/types/products/products.config";
import * as EntitiesConfig from "#/modules/official/schema/types/entities/entities.config";
import * as FeaturesConfig from "#/modules/geography/schema/types/features/features.config";
import * as SourcesConfig from "#/modules/source/schema/types/sources/sources.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ICoverage,
  CoverageKey,
  CoverageRelationKey,
  CoverageSortableField,
  CoverageFilterableField,
  CoverageDateRangeField,
  CoverageSelectableField,
  ICoverageAsOneRelationConfig,
  ICoverageAsManyRelationConfig,
} from "./coverage.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const COVERAGE_RELATION_KEYS = [
  "country",
  "coverageSubject",
  "level",
  "product",
  "publisherEntity",
  "scopeUnitFeature",
  "source",
] as const satisfies readonly CoverageKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const COVERAGE_SORTABLE_FIELDS = [
  "checkedOn",
  "code",
  "countryId",
  "coverageSubjectId",
  "createdAt",
  "deletedAt",
  "expectedPublicationUrl",
  "id",
  "levelId",
  "note",
  "periodFrom",
  "periodUntil",
  "productId",
  "publisherEntityId",
  "scopeUnitFeatureId",
  "sourceId",
  "updatedAt",
  "version",
] as const satisfies readonly CoverageKey[];

export const COVERAGE_SEARCHABLE_FIELDS = [
  "code",
  "note",
] as const satisfies readonly CoverageKey[];

export const COVERAGE_FILTERABLE_FIELDS = [
  "countryId",
  "coverageSubjectId",
  "id",
  "levelId",
  "productId",
  "publisherEntityId",
  "scopeUnitFeatureId",
  "sourceId",
] as const satisfies readonly CoverageKey[];

export const COVERAGE_DATE_RANGE_FIELDS = [
  "checkedOn",
  "createdAt",
  "deletedAt",
  "periodFrom",
  "periodUntil",
  "updatedAt",
] as const satisfies readonly CoverageKey[];

export const COVERAGE_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<ICoverage> = {
  searchableFields: [...COVERAGE_SEARCHABLE_FIELDS],
  filterFields: [...COVERAGE_FILTERABLE_FIELDS],
  dateRangeFields: [...COVERAGE_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const COVERAGE_SELECTABLE_FIELDS = [
  "checkedOn",
  "code",
  "countryId",
  "coverageSubjectId",
  "createdAt",
  "deletedAt",
  "expectedPublicationUrl",
  "id",
  "levelId",
  "note",
  "periodFrom",
  "periodUntil",
  "productId",
  "publisherEntityId",
  "scopeUnitFeatureId",
  "sourceId",
  "updatedAt",
  "version",
] as const satisfies readonly CoverageKey[];

export const COVERAGE_DEFAULT_SELECT_FIELDS = [
  "checkedOn",
  "code",
  "countryId",
  "coverageSubjectId",
  "createdAt",
  "deletedAt",
  "expectedPublicationUrl",
  "id",
  "levelId",
  "note",
  "periodFrom",
  "periodUntil",
  "productId",
  "publisherEntityId",
  "scopeUnitFeatureId",
  "sourceId",
  "updatedAt",
  "version",
] as const satisfies readonly CoverageSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const COVERAGE_EDITABLE_FIELDS = [
  "checkedOn",
  "code",
  "countryId",
  "coverageSubjectId",
  "expectedPublicationUrl",
  "levelId",
  "note",
  "periodFrom",
  "periodUntil",
  "productId",
  "publisherEntityId",
  "scopeUnitFeatureId",
  "sourceId",
] as const satisfies readonly CoverageKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const COVERAGE_AS_ONE_RELATION_CONFIG = {
  relation: "coverage",
  type: ERelationType.One,
  selectableFields: COVERAGE_SELECTABLE_FIELDS,
  defaultSelectFields: COVERAGE_DEFAULT_SELECT_FIELDS,
} as const satisfies ICoverageAsOneRelationConfig;

export const COVERAGE_AS_MANY_RELATION_CONFIG = {
  relation: "coverages",
  type: ERelationType.Many,
  selectableFields: COVERAGE_SELECTABLE_FIELDS,
  defaultSelectFields: COVERAGE_DEFAULT_SELECT_FIELDS,
  sortableFields: COVERAGE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies ICoverageAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const COVERAGE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<CoverageRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<CoverageRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "coverageSubject",
  ),
  Q.createRelationKeyMapper<CoverageRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "level",
  ),
  Q.createRelationKeyMapper<CoverageRelationKey>().one(
    () => ProductsConfig.PRODUCTS_AS_ONE_RELATION_CONFIG,
    "product",
  ),
  Q.createRelationKeyMapper<CoverageRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "publisherEntity",
  ),
  Q.createRelationKeyMapper<CoverageRelationKey>().one(
    () => FeaturesConfig.FEATURES_AS_ONE_RELATION_CONFIG,
    "scopeUnitFeature",
  ),
  Q.createRelationKeyMapper<CoverageRelationKey>().one(
    () => SourcesConfig.SOURCES_AS_ONE_RELATION_CONFIG,
    "source",
  ),
] as const;

export const COVERAGE_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const COVERAGE_QUERY_OPTIONS = {
  searchableFields: COVERAGE_SEARCHABLE_FIELDS,
  selectableFields: COVERAGE_SELECTABLE_FIELDS,
  defaultSelectFields: COVERAGE_DEFAULT_SELECT_FIELDS,
  sortableFields: COVERAGE_SORTABLE_FIELDS,
  filterFields: COVERAGE_FILTERABLE_FIELDS,
  dateRangeFields: COVERAGE_DATE_RANGE_FIELDS,
  relationKeys: COVERAGE_RELATION_KEYS,
  editableFields: COVERAGE_EDITABLE_FIELDS,
  asOne: COVERAGE_AS_ONE_RELATION_CONFIG,
  asMany: COVERAGE_AS_MANY_RELATION_CONFIG,
  oneRelations: COVERAGE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: COVERAGE_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  ICoverage,
  CoverageSortableField,
  CoverageSelectableField,
  CoverageFilterableField,
  CoverageDateRangeField,
  CoverageRelationKey,
  typeof COVERAGE_ONE_RELATION_QUERY_OPTIONS,
  typeof COVERAGE_MANY_RELATION_QUERY_OPTIONS
>;
