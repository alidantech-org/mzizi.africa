// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as CountryTypes from "#/modules/reference/schema/types/country/country.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as ProductsTypes from "#/modules/source/schema/types/products/products.types";
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";
import type * as SourcesTypes from "#/modules/source/schema/types/sources/sources.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  COVERAGE_RELATION_KEYS,
  COVERAGE_SORTABLE_FIELDS,
  COVERAGE_SEARCHABLE_FIELDS,
  COVERAGE_FILTERABLE_FIELDS,
  COVERAGE_DATE_RANGE_FIELDS,
  COVERAGE_SELECTABLE_FIELDS,
  COVERAGE_DEFAULT_SELECT_FIELDS,
  COVERAGE_EDITABLE_FIELDS,
} from "./coverage.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** What a source or product covers, for which place, years and kind of record, how completely, and when that was checked. It makes every 'none recorded' honest: the page says which sources were checked, and a gap is never read as zero. */
export interface ICoverage extends B.IBase {
  checkedOn: Date;
  code: string;
  countryId: string;
  coverageSubjectId: string;
  expectedPublicationUrl: string | null;
  levelId: string;
  note: string | null;
  periodFrom: Date | null;
  periodUntil: Date | null;
  productId: string | null;
  publisherEntityId: string | null;
  scopeUnitFeatureId: string | null;
  sourceId: string | null;
  readonly country?: CountryTypes.ICountry;
  readonly coverageSubject?: ValueTypes.IValue;
  readonly level?: ValueTypes.IValue;
  readonly product?: ProductsTypes.IProducts;
  readonly publisherEntity?: EntitiesTypes.IEntities;
  readonly scopeUnitFeature?: FeaturesTypes.IFeatures;
  readonly source?: SourcesTypes.ISources;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type CoverageKey = keyof ICoverage;

export type CoverageRelationKey = (typeof COVERAGE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ICoverageReadonlyFields = B.IBaseReadonlyFields;

export type ICoverageContextualFields = never;

export type ICoverageSensitiveFields = never;

export type ICoverageTransitionFields = never;

export type ICoverageImmutableFields =
  | ICoverageReadonlyFields
  | ICoverageContextualFields
  | ICoverageSensitiveFields
  | ICoverageTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ICoverageCreatable = Omit<ICoverage, ICoverageImmutableFields | CoverageRelationKey>;

export type ICoverageSystemWritable = Omit<ICoverage, B.IBaseReadonlyFields | CoverageRelationKey>;

export type ICoverageUpdatable = Partial<
  Omit<ICoverage, ICoverageImmutableFields | CoverageRelationKey>
>;

export interface ICoverageTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type CoverageSortableField = (typeof COVERAGE_SORTABLE_FIELDS)[number];

export type CoverageSearchableField = (typeof COVERAGE_SEARCHABLE_FIELDS)[number];

export type CoverageFilterableField = (typeof COVERAGE_FILTERABLE_FIELDS)[number];

export type CoverageDateRangeField = (typeof COVERAGE_DATE_RANGE_FIELDS)[number];

export type CoverageSelectableField = (typeof COVERAGE_SELECTABLE_FIELDS)[number];

export type CoverageDefaultSelectField = (typeof COVERAGE_DEFAULT_SELECT_FIELDS)[number];

export type CoverageEditableField = (typeof COVERAGE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ICoverageAsOneRelationConfig = Q.IOneRelationConfig<
  "coverage",
  CoverageSelectableField
>;

export type ICoverageAsManyRelationConfig = Q.IManyRelationConfig<
  "coverages",
  CoverageSelectableField,
  CoverageSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ICoverageAsOneRelationQuery = Q.IAsOneRelationQuery<ICoverage, CoverageSelectableField>;

export type ICoverageAsManyRelationQuery = Q.IAsManyRelationQuery<
  ICoverage,
  CoverageSelectableField,
  CoverageSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ICoverageRelationMap extends Record<CoverageRelationKey, unknown> {
  country: CountryTypes.ICountryAsOneRelationQuery;
  coverageSubject: ValueTypes.IValueAsOneRelationQuery;
  level: ValueTypes.IValueAsOneRelationQuery;
  product: ProductsTypes.IProductsAsOneRelationQuery;
  publisherEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  scopeUnitFeature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  source: SourcesTypes.ISourcesAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ICoverageRelationQueries = Q.IBaseRelationQueries<
  ICoverage,
  CoverageRelationKey,
  ICoverageRelationMap
>;

export type ICoverageItemQuery = Q.IBaseItemQuery<
  ICoverage,
  CoverageRelationKey,
  CoverageSelectableField,
  CoverageRelationKey,
  CoverageSelectableField,
  ICoverageRelationMap,
  ICoverageRelationQueries
>;

export type ICoverageListQuery = Q.IBaseListQuery<
  ICoverage,
  CoverageRelationKey,
  CoverageSelectableField,
  CoverageSortableField,
  CoverageRelationKey,
  CoverageSelectableField,
  CoverageSortableField,
  CoverageDateRangeField,
  CoverageFilterableField,
  ICoverageRelationMap,
  ICoverageRelationQueries,
  ICoverageItemQuery
>;
