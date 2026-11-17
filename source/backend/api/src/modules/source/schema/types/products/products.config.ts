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
import * as PublishersConfig from "#/modules/source/schema/types/publishers/publishers.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IProducts,
  ProductsKey,
  ProductsRelationKey,
  ProductsSortableField,
  ProductsFilterableField,
  ProductsDateRangeField,
  ProductsSelectableField,
  IProductsAsOneRelationConfig,
  IProductsAsManyRelationConfig,
} from "./products.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PRODUCTS_RELATION_KEYS = [
  "kind",
  "publisher",
] as const satisfies readonly ProductsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PRODUCTS_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "description",
  "id",
  "kindId",
  "publisherId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly ProductsKey[];

export const PRODUCTS_SEARCHABLE_FIELDS = [
  "code",
  "description",
  "title",
] as const satisfies readonly ProductsKey[];

export const PRODUCTS_FILTERABLE_FIELDS = [
  "id",
  "kindId",
  "publisherId",
] as const satisfies readonly ProductsKey[];

export const PRODUCTS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly ProductsKey[];

export const PRODUCTS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IProducts> = {
  searchableFields: [...PRODUCTS_SEARCHABLE_FIELDS],
  filterFields: [...PRODUCTS_FILTERABLE_FIELDS],
  dateRangeFields: [...PRODUCTS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PRODUCTS_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "description",
  "id",
  "kindId",
  "publisherId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly ProductsKey[];

export const PRODUCTS_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "description",
  "id",
  "kindId",
  "publisherId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly ProductsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PRODUCTS_EDITABLE_FIELDS = [
  "code",
  "description",
  "kindId",
  "publisherId",
  "title",
] as const satisfies readonly ProductsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PRODUCTS_AS_ONE_RELATION_CONFIG = {
  relation: "products",
  type: ERelationType.One,
  selectableFields: PRODUCTS_SELECTABLE_FIELDS,
  defaultSelectFields: PRODUCTS_DEFAULT_SELECT_FIELDS,
} as const satisfies IProductsAsOneRelationConfig;

export const PRODUCTS_AS_MANY_RELATION_CONFIG = {
  relation: "products",
  type: ERelationType.Many,
  selectableFields: PRODUCTS_SELECTABLE_FIELDS,
  defaultSelectFields: PRODUCTS_DEFAULT_SELECT_FIELDS,
  sortableFields: PRODUCTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IProductsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PRODUCTS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ProductsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "kind",
  ),
  Q.createRelationKeyMapper<ProductsRelationKey>().one(
    () => PublishersConfig.PUBLISHERS_AS_ONE_RELATION_CONFIG,
    "publisher",
  ),
] as const;

export const PRODUCTS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PRODUCTS_QUERY_OPTIONS = {
  searchableFields: PRODUCTS_SEARCHABLE_FIELDS,
  selectableFields: PRODUCTS_SELECTABLE_FIELDS,
  defaultSelectFields: PRODUCTS_DEFAULT_SELECT_FIELDS,
  sortableFields: PRODUCTS_SORTABLE_FIELDS,
  filterFields: PRODUCTS_FILTERABLE_FIELDS,
  dateRangeFields: PRODUCTS_DATE_RANGE_FIELDS,
  relationKeys: PRODUCTS_RELATION_KEYS,
  editableFields: PRODUCTS_EDITABLE_FIELDS,
  asOne: PRODUCTS_AS_ONE_RELATION_CONFIG,
  asMany: PRODUCTS_AS_MANY_RELATION_CONFIG,
  oneRelations: PRODUCTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PRODUCTS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IProducts,
  ProductsSortableField,
  ProductsSelectableField,
  ProductsFilterableField,
  ProductsDateRangeField,
  ProductsRelationKey,
  typeof PRODUCTS_ONE_RELATION_QUERY_OPTIONS,
  typeof PRODUCTS_MANY_RELATION_QUERY_OPTIONS
>;
