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
import * as LanguageConfig from "#/modules/reference/schema/types/language/language.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ICopy,
  CopyKey,
  CopyRelationKey,
  CopySortableField,
  CopyFilterableField,
  CopyDateRangeField,
  CopySelectableField,
  ICopyAsOneRelationConfig,
  ICopyAsManyRelationConfig,
} from "./copy.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const COPY_RELATION_KEYS = ["country", "language"] as const satisfies readonly CopyKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const COPY_SORTABLE_FIELDS = [
  "countryId",
  "createdAt",
  "deletedAt",
  "id",
  "isDevelopmentText",
  "key",
  "languageId",
  "text",
  "updatedAt",
  "version",
] as const satisfies readonly CopyKey[];

export const COPY_SEARCHABLE_FIELDS = ["key", "text"] as const satisfies readonly CopyKey[];

export const COPY_FILTERABLE_FIELDS = [
  "countryId",
  "id",
  "isDevelopmentText",
  "languageId",
] as const satisfies readonly CopyKey[];

export const COPY_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly CopyKey[];

export const COPY_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<ICopy> = {
  searchableFields: [...COPY_SEARCHABLE_FIELDS],
  filterFields: [...COPY_FILTERABLE_FIELDS],
  dateRangeFields: [...COPY_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const COPY_SELECTABLE_FIELDS = [
  "countryId",
  "createdAt",
  "deletedAt",
  "id",
  "isDevelopmentText",
  "key",
  "languageId",
  "text",
  "updatedAt",
  "version",
] as const satisfies readonly CopyKey[];

export const COPY_DEFAULT_SELECT_FIELDS = [
  "countryId",
  "createdAt",
  "deletedAt",
  "id",
  "isDevelopmentText",
  "key",
  "languageId",
  "text",
  "updatedAt",
  "version",
] as const satisfies readonly CopySelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const COPY_EDITABLE_FIELDS = [
  "countryId",
  "isDevelopmentText",
  "key",
  "languageId",
  "text",
] as const satisfies readonly CopyKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const COPY_AS_ONE_RELATION_CONFIG = {
  relation: "copy",
  type: ERelationType.One,
  selectableFields: COPY_SELECTABLE_FIELDS,
  defaultSelectFields: COPY_DEFAULT_SELECT_FIELDS,
} as const satisfies ICopyAsOneRelationConfig;

export const COPY_AS_MANY_RELATION_CONFIG = {
  relation: "copys",
  type: ERelationType.Many,
  selectableFields: COPY_SELECTABLE_FIELDS,
  defaultSelectFields: COPY_DEFAULT_SELECT_FIELDS,
  sortableFields: COPY_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies ICopyAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const COPY_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<CopyRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<CopyRelationKey>().one(
    () => LanguageConfig.LANGUAGE_AS_ONE_RELATION_CONFIG,
    "language",
  ),
] as const;

export const COPY_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const COPY_QUERY_OPTIONS = {
  searchableFields: COPY_SEARCHABLE_FIELDS,
  selectableFields: COPY_SELECTABLE_FIELDS,
  defaultSelectFields: COPY_DEFAULT_SELECT_FIELDS,
  sortableFields: COPY_SORTABLE_FIELDS,
  filterFields: COPY_FILTERABLE_FIELDS,
  dateRangeFields: COPY_DATE_RANGE_FIELDS,
  relationKeys: COPY_RELATION_KEYS,
  editableFields: COPY_EDITABLE_FIELDS,
  asOne: COPY_AS_ONE_RELATION_CONFIG,
  asMany: COPY_AS_MANY_RELATION_CONFIG,
  oneRelations: COPY_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: COPY_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  ICopy,
  CopySortableField,
  CopySelectableField,
  CopyFilterableField,
  CopyDateRangeField,
  CopyRelationKey,
  typeof COPY_ONE_RELATION_QUERY_OPTIONS,
  typeof COPY_MANY_RELATION_QUERY_OPTIONS
>;
