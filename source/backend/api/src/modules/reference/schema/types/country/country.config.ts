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
  ICountry,
  CountryKey,
  CountryRelationKey,
  CountrySortableField,
  CountryFilterableField,
  CountryDateRangeField,
  CountrySelectableField,
  ICountryAsOneRelationConfig,
  ICountryAsManyRelationConfig,
} from "./country.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const COUNTRY_RELATION_KEYS = [
  "continent",
  "currency",
  "designation",
  "recognitionStatus",
  "subregion",
] as const satisfies readonly CountryKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const COUNTRY_SORTABLE_FIELDS = [
  "callingCode",
  "code",
  "continentId",
  "createdAt",
  "currencyId",
  "deletedAt",
  "designationId",
  "establishedOn",
  "id",
  "isoAlpha2",
  "isoAlpha3",
  "isoNumeric",
  "name",
  "officialName",
  "recognitionStatusId",
  "subregionId",
  "updatedAt",
  "version",
] as const satisfies readonly CountryKey[];

export const COUNTRY_SEARCHABLE_FIELDS = [
  "callingCode",
  "code",
  "isoAlpha2",
  "isoAlpha3",
  "isoNumeric",
  "name",
  "officialName",
] as const satisfies readonly CountryKey[];

export const COUNTRY_FILTERABLE_FIELDS = [
  "continentId",
  "currencyId",
  "designationId",
  "id",
  "recognitionStatusId",
  "subregionId",
] as const satisfies readonly CountryKey[];

export const COUNTRY_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "establishedOn",
  "updatedAt",
] as const satisfies readonly CountryKey[];

export const COUNTRY_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<ICountry> = {
  searchableFields: [...COUNTRY_SEARCHABLE_FIELDS],
  filterFields: [...COUNTRY_FILTERABLE_FIELDS],
  dateRangeFields: [...COUNTRY_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const COUNTRY_SELECTABLE_FIELDS = [
  "callingCode",
  "code",
  "continentId",
  "createdAt",
  "currencyId",
  "deletedAt",
  "designationId",
  "establishedOn",
  "id",
  "isoAlpha2",
  "isoAlpha3",
  "isoNumeric",
  "name",
  "officialName",
  "recognitionStatusId",
  "subregionId",
  "updatedAt",
  "version",
] as const satisfies readonly CountryKey[];

export const COUNTRY_DEFAULT_SELECT_FIELDS = [
  "callingCode",
  "code",
  "continentId",
  "createdAt",
  "currencyId",
  "deletedAt",
  "designationId",
  "establishedOn",
  "id",
  "isoAlpha2",
  "isoAlpha3",
  "isoNumeric",
  "name",
  "officialName",
  "recognitionStatusId",
  "subregionId",
  "updatedAt",
  "version",
] as const satisfies readonly CountrySelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const COUNTRY_EDITABLE_FIELDS = [
  "callingCode",
  "code",
  "continentId",
  "currencyId",
  "designationId",
  "establishedOn",
  "isoAlpha2",
  "isoAlpha3",
  "isoNumeric",
  "name",
  "officialName",
  "recognitionStatusId",
  "subregionId",
] as const satisfies readonly CountryKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const COUNTRY_AS_ONE_RELATION_CONFIG = {
  relation: "country",
  type: ERelationType.One,
  selectableFields: COUNTRY_SELECTABLE_FIELDS,
  defaultSelectFields: COUNTRY_DEFAULT_SELECT_FIELDS,
} as const satisfies ICountryAsOneRelationConfig;

export const COUNTRY_AS_MANY_RELATION_CONFIG = {
  relation: "countrys",
  type: ERelationType.Many,
  selectableFields: COUNTRY_SELECTABLE_FIELDS,
  defaultSelectFields: COUNTRY_DEFAULT_SELECT_FIELDS,
  sortableFields: COUNTRY_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies ICountryAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const COUNTRY_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<CountryRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "continent",
  ),
  Q.createRelationKeyMapper<CountryRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "currency",
  ),
  Q.createRelationKeyMapper<CountryRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "designation",
  ),
  Q.createRelationKeyMapper<CountryRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "recognitionStatus",
  ),
  Q.createRelationKeyMapper<CountryRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "subregion",
  ),
] as const;

export const COUNTRY_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const COUNTRY_QUERY_OPTIONS = {
  searchableFields: COUNTRY_SEARCHABLE_FIELDS,
  selectableFields: COUNTRY_SELECTABLE_FIELDS,
  defaultSelectFields: COUNTRY_DEFAULT_SELECT_FIELDS,
  sortableFields: COUNTRY_SORTABLE_FIELDS,
  filterFields: COUNTRY_FILTERABLE_FIELDS,
  dateRangeFields: COUNTRY_DATE_RANGE_FIELDS,
  relationKeys: COUNTRY_RELATION_KEYS,
  editableFields: COUNTRY_EDITABLE_FIELDS,
  asOne: COUNTRY_AS_ONE_RELATION_CONFIG,
  asMany: COUNTRY_AS_MANY_RELATION_CONFIG,
  oneRelations: COUNTRY_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: COUNTRY_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  ICountry,
  CountrySortableField,
  CountrySelectableField,
  CountryFilterableField,
  CountryDateRangeField,
  CountryRelationKey,
  typeof COUNTRY_ONE_RELATION_QUERY_OPTIONS,
  typeof COUNTRY_MANY_RELATION_QUERY_OPTIONS
>;
