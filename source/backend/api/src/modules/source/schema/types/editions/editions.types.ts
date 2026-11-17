// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as LanguageTypes from "#/modules/reference/schema/types/language/language.types";
import type * as ProductsTypes from "#/modules/source/schema/types/products/products.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  EDITIONS_RELATION_KEYS,
  EDITIONS_SORTABLE_FIELDS,
  EDITIONS_SEARCHABLE_FIELDS,
  EDITIONS_FILTERABLE_FIELDS,
  EDITIONS_DATE_RANGE_FIELDS,
  EDITIONS_SELECTABLE_FIELDS,
  EDITIONS_DEFAULT_SELECT_FIELDS,
  EDITIONS_EDITABLE_FIELDS,
} from "./editions.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A meaningfully distinct release of a product. Another format or scan of the same wording is an artifact, not an edition. */
export interface IEditions extends B.IBase {
  code: string;
  description: string | null;
  designation: string;
  languageId: string | null;
  productId: string;
  publishedOn: Date | null;
  readonly language?: LanguageTypes.ILanguage;
  readonly product?: ProductsTypes.IProducts;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type EditionsKey = keyof IEditions;

export type EditionsRelationKey = (typeof EDITIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IEditionsReadonlyFields = B.IBaseReadonlyFields;

export type IEditionsContextualFields = never;

export type IEditionsSensitiveFields = never;

export type IEditionsTransitionFields = never;

export type IEditionsImmutableFields =
  | IEditionsReadonlyFields
  | IEditionsContextualFields
  | IEditionsSensitiveFields
  | IEditionsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IEditionsCreatable = Omit<IEditions, IEditionsImmutableFields | EditionsRelationKey>;

export type IEditionsSystemWritable = Omit<IEditions, B.IBaseReadonlyFields | EditionsRelationKey>;

export type IEditionsUpdatable = Partial<
  Omit<IEditions, IEditionsImmutableFields | EditionsRelationKey>
>;

export interface IEditionsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type EditionsSortableField = (typeof EDITIONS_SORTABLE_FIELDS)[number];

export type EditionsSearchableField = (typeof EDITIONS_SEARCHABLE_FIELDS)[number];

export type EditionsFilterableField = (typeof EDITIONS_FILTERABLE_FIELDS)[number];

export type EditionsDateRangeField = (typeof EDITIONS_DATE_RANGE_FIELDS)[number];

export type EditionsSelectableField = (typeof EDITIONS_SELECTABLE_FIELDS)[number];

export type EditionsDefaultSelectField = (typeof EDITIONS_DEFAULT_SELECT_FIELDS)[number];

export type EditionsEditableField = (typeof EDITIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IEditionsAsOneRelationConfig = Q.IOneRelationConfig<
  "editions",
  EditionsSelectableField
>;

export type IEditionsAsManyRelationConfig = Q.IManyRelationConfig<
  "editions",
  EditionsSelectableField,
  EditionsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IEditionsAsOneRelationQuery = Q.IAsOneRelationQuery<IEditions, EditionsSelectableField>;

export type IEditionsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IEditions,
  EditionsSelectableField,
  EditionsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IEditionsRelationMap extends Record<EditionsRelationKey, unknown> {
  language: LanguageTypes.ILanguageAsOneRelationQuery;
  product: ProductsTypes.IProductsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IEditionsRelationQueries = Q.IBaseRelationQueries<
  IEditions,
  EditionsRelationKey,
  IEditionsRelationMap
>;

export type IEditionsItemQuery = Q.IBaseItemQuery<
  IEditions,
  EditionsRelationKey,
  EditionsSelectableField,
  EditionsRelationKey,
  EditionsSelectableField,
  IEditionsRelationMap,
  IEditionsRelationQueries
>;

export type IEditionsListQuery = Q.IBaseListQuery<
  IEditions,
  EditionsRelationKey,
  EditionsSelectableField,
  EditionsSortableField,
  EditionsRelationKey,
  EditionsSelectableField,
  EditionsSortableField,
  EditionsDateRangeField,
  EditionsFilterableField,
  IEditionsRelationMap,
  IEditionsRelationQueries,
  IEditionsItemQuery
>;
