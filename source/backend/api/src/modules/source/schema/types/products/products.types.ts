// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as PublishersTypes from "#/modules/source/schema/types/publishers/publishers.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PRODUCTS_RELATION_KEYS,
  PRODUCTS_SORTABLE_FIELDS,
  PRODUCTS_SEARCHABLE_FIELDS,
  PRODUCTS_FILTERABLE_FIELDS,
  PRODUCTS_DATE_RANGE_FIELDS,
  PRODUCTS_SELECTABLE_FIELDS,
  PRODUCTS_DEFAULT_SELECT_FIELDS,
  PRODUCTS_EDITABLE_FIELDS,
} from "./products.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One logical document or dataset, independent of who served it, in what format or how many times it was downloaded. */
export interface IProducts extends B.IBase {
  code: string;
  description: string | null;
  kindId: string;
  publisherId: string | null;
  title: string;
  readonly kind?: ValueTypes.IValue;
  readonly publisher?: PublishersTypes.IPublishers;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ProductsKey = keyof IProducts;

export type ProductsRelationKey = (typeof PRODUCTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IProductsReadonlyFields = B.IBaseReadonlyFields;

export type IProductsContextualFields = never;

export type IProductsSensitiveFields = never;

export type IProductsTransitionFields = never;

export type IProductsImmutableFields =
  | IProductsReadonlyFields
  | IProductsContextualFields
  | IProductsSensitiveFields
  | IProductsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IProductsCreatable = Omit<IProducts, IProductsImmutableFields | ProductsRelationKey>;

export type IProductsSystemWritable = Omit<IProducts, B.IBaseReadonlyFields | ProductsRelationKey>;

export type IProductsUpdatable = Partial<
  Omit<IProducts, IProductsImmutableFields | ProductsRelationKey>
>;

export interface IProductsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ProductsSortableField = (typeof PRODUCTS_SORTABLE_FIELDS)[number];

export type ProductsSearchableField = (typeof PRODUCTS_SEARCHABLE_FIELDS)[number];

export type ProductsFilterableField = (typeof PRODUCTS_FILTERABLE_FIELDS)[number];

export type ProductsDateRangeField = (typeof PRODUCTS_DATE_RANGE_FIELDS)[number];

export type ProductsSelectableField = (typeof PRODUCTS_SELECTABLE_FIELDS)[number];

export type ProductsDefaultSelectField = (typeof PRODUCTS_DEFAULT_SELECT_FIELDS)[number];

export type ProductsEditableField = (typeof PRODUCTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IProductsAsOneRelationConfig = Q.IOneRelationConfig<
  "products",
  ProductsSelectableField
>;

export type IProductsAsManyRelationConfig = Q.IManyRelationConfig<
  "products",
  ProductsSelectableField,
  ProductsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IProductsAsOneRelationQuery = Q.IAsOneRelationQuery<IProducts, ProductsSelectableField>;

export type IProductsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IProducts,
  ProductsSelectableField,
  ProductsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IProductsRelationMap extends Record<ProductsRelationKey, unknown> {
  kind: ValueTypes.IValueAsOneRelationQuery;
  publisher: PublishersTypes.IPublishersAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IProductsRelationQueries = Q.IBaseRelationQueries<
  IProducts,
  ProductsRelationKey,
  IProductsRelationMap
>;

export type IProductsItemQuery = Q.IBaseItemQuery<
  IProducts,
  ProductsRelationKey,
  ProductsSelectableField,
  ProductsRelationKey,
  ProductsSelectableField,
  IProductsRelationMap,
  IProductsRelationQueries
>;

export type IProductsListQuery = Q.IBaseListQuery<
  IProducts,
  ProductsRelationKey,
  ProductsSelectableField,
  ProductsSortableField,
  ProductsRelationKey,
  ProductsSelectableField,
  ProductsSortableField,
  ProductsDateRangeField,
  ProductsFilterableField,
  IProductsRelationMap,
  IProductsRelationQueries,
  IProductsItemQuery
>;
