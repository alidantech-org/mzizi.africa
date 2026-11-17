// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as LanguageConfig from "#/modules/reference/schema/types/language/language.config";
import * as ProductsConfig from "#/modules/source/schema/types/products/products.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IEditions,
  EditionsKey,
  EditionsRelationKey,
  EditionsSortableField,
  EditionsFilterableField,
  EditionsDateRangeField,
  EditionsSelectableField,
  IEditionsAsOneRelationConfig,
  IEditionsAsManyRelationConfig,
} from "./editions.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const EDITIONS_RELATION_KEYS = [
  "language",
  "product",
] as const satisfies readonly EditionsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const EDITIONS_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "description",
  "designation",
  "id",
  "languageId",
  "productId",
  "publishedOn",
  "updatedAt",
  "version",
] as const satisfies readonly EditionsKey[];

export const EDITIONS_SEARCHABLE_FIELDS = [
  "code",
  "description",
  "designation",
] as const satisfies readonly EditionsKey[];

export const EDITIONS_FILTERABLE_FIELDS = [
  "id",
  "languageId",
  "productId",
] as const satisfies readonly EditionsKey[];

export const EDITIONS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "publishedOn",
  "updatedAt",
] as const satisfies readonly EditionsKey[];

export const EDITIONS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IEditions> = {
  searchableFields: [...EDITIONS_SEARCHABLE_FIELDS],
  filterFields: [...EDITIONS_FILTERABLE_FIELDS],
  dateRangeFields: [...EDITIONS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const EDITIONS_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "description",
  "designation",
  "id",
  "languageId",
  "productId",
  "publishedOn",
  "updatedAt",
  "version",
] as const satisfies readonly EditionsKey[];

export const EDITIONS_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "description",
  "designation",
  "id",
  "languageId",
  "productId",
  "publishedOn",
  "updatedAt",
  "version",
] as const satisfies readonly EditionsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const EDITIONS_EDITABLE_FIELDS = [
  "code",
  "description",
  "designation",
  "languageId",
  "productId",
  "publishedOn",
] as const satisfies readonly EditionsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const EDITIONS_AS_ONE_RELATION_CONFIG = {
  relation: "editions",
  type: ERelationType.One,
  selectableFields: EDITIONS_SELECTABLE_FIELDS,
  defaultSelectFields: EDITIONS_DEFAULT_SELECT_FIELDS,
} as const satisfies IEditionsAsOneRelationConfig;

export const EDITIONS_AS_MANY_RELATION_CONFIG = {
  relation: "editions",
  type: ERelationType.Many,
  selectableFields: EDITIONS_SELECTABLE_FIELDS,
  defaultSelectFields: EDITIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: EDITIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IEditionsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const EDITIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<EditionsRelationKey>().one(
    () => LanguageConfig.LANGUAGE_AS_ONE_RELATION_CONFIG,
    "language",
  ),
  Q.createRelationKeyMapper<EditionsRelationKey>().one(
    () => ProductsConfig.PRODUCTS_AS_ONE_RELATION_CONFIG,
    "product",
  ),
] as const;

export const EDITIONS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const EDITIONS_QUERY_OPTIONS = {
  searchableFields: EDITIONS_SEARCHABLE_FIELDS,
  selectableFields: EDITIONS_SELECTABLE_FIELDS,
  defaultSelectFields: EDITIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: EDITIONS_SORTABLE_FIELDS,
  filterFields: EDITIONS_FILTERABLE_FIELDS,
  dateRangeFields: EDITIONS_DATE_RANGE_FIELDS,
  relationKeys: EDITIONS_RELATION_KEYS,
  editableFields: EDITIONS_EDITABLE_FIELDS,
  asOne: EDITIONS_AS_ONE_RELATION_CONFIG,
  asMany: EDITIONS_AS_MANY_RELATION_CONFIG,
  oneRelations: EDITIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: EDITIONS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IEditions,
  EditionsSortableField,
  EditionsSelectableField,
  EditionsFilterableField,
  EditionsDateRangeField,
  EditionsRelationKey,
  typeof EDITIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof EDITIONS_MANY_RELATION_QUERY_OPTIONS
>;
