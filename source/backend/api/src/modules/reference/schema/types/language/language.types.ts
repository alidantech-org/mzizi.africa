// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  LANGUAGE_RELATION_KEYS,
  LANGUAGE_SORTABLE_FIELDS,
  LANGUAGE_SEARCHABLE_FIELDS,
  LANGUAGE_FILTERABLE_FIELDS,
  LANGUAGE_DATE_RANGE_FIELDS,
  LANGUAGE_SELECTABLE_FIELDS,
  LANGUAGE_DEFAULT_SELECT_FIELDS,
  LANGUAGE_EDITABLE_FIELDS,
} from "./language.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A language, macrolanguage, variety or one of the special no-language codes, with its ISO 639 and Glottolog identifiers and its classification as scheme values. */
export interface ILanguage extends B.IBase {
  code: string;
  directionId: string | null;
  familyId: string | null;
  glottocode: string | null;
  iso6391: string | null;
  iso6392: string | null;
  iso6393: string | null;
  kindId: string;
  name: string;
  parentId: string | null;
  scriptId: string | null;
  statusId: string | null;
  readonly direction?: ValueTypes.IValue;
  readonly family?: ValueTypes.IValue;
  readonly kind?: ValueTypes.IValue;
  readonly parent?: ILanguage;
  readonly script?: ValueTypes.IValue;
  readonly status?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type LanguageKey = keyof ILanguage;

export type LanguageRelationKey = (typeof LANGUAGE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ILanguageReadonlyFields = B.IBaseReadonlyFields;

export type ILanguageContextualFields = never;

export type ILanguageSensitiveFields = never;

export type ILanguageTransitionFields = never;

export type ILanguageImmutableFields =
  | ILanguageReadonlyFields
  | ILanguageContextualFields
  | ILanguageSensitiveFields
  | ILanguageTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ILanguageCreatable = Omit<ILanguage, ILanguageImmutableFields | LanguageRelationKey>;

export type ILanguageSystemWritable = Omit<ILanguage, B.IBaseReadonlyFields | LanguageRelationKey>;

export type ILanguageUpdatable = Partial<
  Omit<ILanguage, ILanguageImmutableFields | LanguageRelationKey>
>;

export interface ILanguageTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type LanguageSortableField = (typeof LANGUAGE_SORTABLE_FIELDS)[number];

export type LanguageSearchableField = (typeof LANGUAGE_SEARCHABLE_FIELDS)[number];

export type LanguageFilterableField = (typeof LANGUAGE_FILTERABLE_FIELDS)[number];

export type LanguageDateRangeField = (typeof LANGUAGE_DATE_RANGE_FIELDS)[number];

export type LanguageSelectableField = (typeof LANGUAGE_SELECTABLE_FIELDS)[number];

export type LanguageDefaultSelectField = (typeof LANGUAGE_DEFAULT_SELECT_FIELDS)[number];

export type LanguageEditableField = (typeof LANGUAGE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ILanguageAsOneRelationConfig = Q.IOneRelationConfig<
  "language",
  LanguageSelectableField
>;

export type ILanguageAsManyRelationConfig = Q.IManyRelationConfig<
  "languages",
  LanguageSelectableField,
  LanguageSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ILanguageAsOneRelationQuery = Q.IAsOneRelationQuery<ILanguage, LanguageSelectableField>;

export type ILanguageAsManyRelationQuery = Q.IAsManyRelationQuery<
  ILanguage,
  LanguageSelectableField,
  LanguageSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ILanguageRelationMap extends Record<LanguageRelationKey, unknown> {
  direction: ValueTypes.IValueAsOneRelationQuery;
  family: ValueTypes.IValueAsOneRelationQuery;
  kind: ValueTypes.IValueAsOneRelationQuery;
  parent: ILanguageAsOneRelationQuery;
  script: ValueTypes.IValueAsOneRelationQuery;
  status: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ILanguageRelationQueries = Q.IBaseRelationQueries<
  ILanguage,
  LanguageRelationKey,
  ILanguageRelationMap
>;

export type ILanguageItemQuery = Q.IBaseItemQuery<
  ILanguage,
  LanguageRelationKey,
  LanguageSelectableField,
  LanguageRelationKey,
  LanguageSelectableField,
  ILanguageRelationMap,
  ILanguageRelationQueries
>;

export type ILanguageListQuery = Q.IBaseListQuery<
  ILanguage,
  LanguageRelationKey,
  LanguageSelectableField,
  LanguageSortableField,
  LanguageRelationKey,
  LanguageSelectableField,
  LanguageSortableField,
  LanguageDateRangeField,
  LanguageFilterableField,
  ILanguageRelationMap,
  ILanguageRelationQueries,
  ILanguageItemQuery
>;
