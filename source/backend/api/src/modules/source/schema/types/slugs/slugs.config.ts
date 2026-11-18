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
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ISlugs,
  SlugsKey,
  SlugsRelationKey,
  SlugsSortableField,
  SlugsFilterableField,
  SlugsDateRangeField,
  SlugsSelectableField,
  ISlugsAsOneRelationConfig,
  ISlugsAsManyRelationConfig,
} from "./slugs.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SLUGS_RELATION_KEYS = [
  "canonicalSlug",
  "country",
  "language",
  "namespace",
  "parentSlug",
] as const satisfies readonly SlugsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SLUGS_SORTABLE_FIELDS = [
  "canonicalSlugId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "fromToPrecision",
  "fromYear",
  "id",
  "languageId",
  "namespaceId",
  "parentSlugId",
  "slug",
  "subjectId",
  "subjectTable",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly SlugsKey[];

export const SLUGS_SEARCHABLE_FIELDS = ["code", "slug"] as const satisfies readonly SlugsKey[];

export const SLUGS_FILTERABLE_FIELDS = [
  "canonicalSlugId",
  "countryId",
  "fromToPrecision",
  "id",
  "languageId",
  "namespaceId",
  "parentSlugId",
  "subjectId",
  "subjectTable",
] as const satisfies readonly SlugsKey[];

export const SLUGS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly SlugsKey[];

export const SLUGS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<ISlugs> = {
  searchableFields: [...SLUGS_SEARCHABLE_FIELDS],
  filterFields: [...SLUGS_FILTERABLE_FIELDS],
  dateRangeFields: [...SLUGS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SLUGS_SELECTABLE_FIELDS = [
  "canonicalSlugId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "fromToPrecision",
  "fromYear",
  "id",
  "languageId",
  "namespaceId",
  "parentSlugId",
  "slug",
  "subjectId",
  "subjectTable",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly SlugsKey[];

export const SLUGS_DEFAULT_SELECT_FIELDS = [
  "canonicalSlugId",
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "fromToPrecision",
  "fromYear",
  "id",
  "languageId",
  "namespaceId",
  "parentSlugId",
  "slug",
  "subjectId",
  "subjectTable",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly SlugsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SLUGS_EDITABLE_FIELDS = [
  "canonicalSlugId",
  "code",
  "countryId",
  "fromToPrecision",
  "fromYear",
  "languageId",
  "namespaceId",
  "parentSlugId",
  "slug",
  "subjectId",
  "subjectTable",
  "toYear",
] as const satisfies readonly SlugsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SLUGS_AS_ONE_RELATION_CONFIG = {
  relation: "slugs",
  type: ERelationType.One,
  selectableFields: SLUGS_SELECTABLE_FIELDS,
  defaultSelectFields: SLUGS_DEFAULT_SELECT_FIELDS,
} as const satisfies ISlugsAsOneRelationConfig;

export const SLUGS_AS_MANY_RELATION_CONFIG = {
  relation: "slugs",
  type: ERelationType.Many,
  selectableFields: SLUGS_SELECTABLE_FIELDS,
  defaultSelectFields: SLUGS_DEFAULT_SELECT_FIELDS,
  sortableFields: SLUGS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies ISlugsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SLUGS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<SlugsRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<SlugsRelationKey>().one(
    () => LanguageConfig.LANGUAGE_AS_ONE_RELATION_CONFIG,
    "language",
  ),
  Q.createRelationKeyMapper<SlugsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "namespace",
  ),
] as const;

export const SLUGS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SLUGS_QUERY_OPTIONS = {
  searchableFields: SLUGS_SEARCHABLE_FIELDS,
  selectableFields: SLUGS_SELECTABLE_FIELDS,
  defaultSelectFields: SLUGS_DEFAULT_SELECT_FIELDS,
  sortableFields: SLUGS_SORTABLE_FIELDS,
  filterFields: SLUGS_FILTERABLE_FIELDS,
  dateRangeFields: SLUGS_DATE_RANGE_FIELDS,
  relationKeys: SLUGS_RELATION_KEYS,
  editableFields: SLUGS_EDITABLE_FIELDS,
  asOne: SLUGS_AS_ONE_RELATION_CONFIG,
  asMany: SLUGS_AS_MANY_RELATION_CONFIG,
  oneRelations: SLUGS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SLUGS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  ISlugs,
  SlugsSortableField,
  SlugsSelectableField,
  SlugsFilterableField,
  SlugsDateRangeField,
  SlugsRelationKey,
  typeof SLUGS_ONE_RELATION_QUERY_OPTIONS,
  typeof SLUGS_MANY_RELATION_QUERY_OPTIONS
>;
