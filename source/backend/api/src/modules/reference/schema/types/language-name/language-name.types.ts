// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { LanguageNameKind } from "#/modules/reference/schema/enum/language-name-kind.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as LanguageTypes from "#/modules/reference/schema/types/language/language.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  LANGUAGE_NAME_RELATION_KEYS,
  LANGUAGE_NAME_SORTABLE_FIELDS,
  LANGUAGE_NAME_SEARCHABLE_FIELDS,
  LANGUAGE_NAME_FILTERABLE_FIELDS,
  LANGUAGE_NAME_DATE_RANGE_FIELDS,
  LANGUAGE_NAME_SELECTABLE_FIELDS,
  LANGUAGE_NAME_DEFAULT_SELECT_FIELDS,
  LANGUAGE_NAME_EDITABLE_FIELDS,
} from "./language-name.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A name of a language written in a language, such as Kiswahili (endonym) and Swahili (exonym). */
export interface ILanguageName extends B.IBase {
  inLanguageId: string;
  languageId: string;
  name: string;
  nameKind: LanguageNameKind;
  readonly inLanguage?: LanguageTypes.ILanguage;
  readonly language?: LanguageTypes.ILanguage;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type LanguageNameKey = keyof ILanguageName;

export type LanguageNameRelationKey = (typeof LANGUAGE_NAME_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ILanguageNameReadonlyFields = B.IBaseReadonlyFields;

export type ILanguageNameContextualFields = never;

export type ILanguageNameSensitiveFields = never;

export type ILanguageNameTransitionFields = never;

export type ILanguageNameImmutableFields =
  | ILanguageNameReadonlyFields
  | ILanguageNameContextualFields
  | ILanguageNameSensitiveFields
  | ILanguageNameTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ILanguageNameCreatable = Omit<
  ILanguageName,
  ILanguageNameImmutableFields | LanguageNameRelationKey
>;

export type ILanguageNameSystemWritable = Omit<
  ILanguageName,
  B.IBaseReadonlyFields | LanguageNameRelationKey
>;

export type ILanguageNameUpdatable = Partial<
  Omit<ILanguageName, ILanguageNameImmutableFields | LanguageNameRelationKey>
>;

export interface ILanguageNameTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type LanguageNameSortableField = (typeof LANGUAGE_NAME_SORTABLE_FIELDS)[number];

export type LanguageNameSearchableField = (typeof LANGUAGE_NAME_SEARCHABLE_FIELDS)[number];

export type LanguageNameFilterableField = (typeof LANGUAGE_NAME_FILTERABLE_FIELDS)[number];

export type LanguageNameDateRangeField = (typeof LANGUAGE_NAME_DATE_RANGE_FIELDS)[number];

export type LanguageNameSelectableField = (typeof LANGUAGE_NAME_SELECTABLE_FIELDS)[number];

export type LanguageNameDefaultSelectField = (typeof LANGUAGE_NAME_DEFAULT_SELECT_FIELDS)[number];

export type LanguageNameEditableField = (typeof LANGUAGE_NAME_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ILanguageNameAsOneRelationConfig = Q.IOneRelationConfig<
  "languageName",
  LanguageNameSelectableField
>;

export type ILanguageNameAsManyRelationConfig = Q.IManyRelationConfig<
  "languageNames",
  LanguageNameSelectableField,
  LanguageNameSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ILanguageNameAsOneRelationQuery = Q.IAsOneRelationQuery<
  ILanguageName,
  LanguageNameSelectableField
>;

export type ILanguageNameAsManyRelationQuery = Q.IAsManyRelationQuery<
  ILanguageName,
  LanguageNameSelectableField,
  LanguageNameSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ILanguageNameRelationMap extends Record<LanguageNameRelationKey, unknown> {
  inLanguage: LanguageTypes.ILanguageAsOneRelationQuery;
  language: LanguageTypes.ILanguageAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ILanguageNameRelationQueries = Q.IBaseRelationQueries<
  ILanguageName,
  LanguageNameRelationKey,
  ILanguageNameRelationMap
>;

export type ILanguageNameItemQuery = Q.IBaseItemQuery<
  ILanguageName,
  LanguageNameRelationKey,
  LanguageNameSelectableField,
  LanguageNameRelationKey,
  LanguageNameSelectableField,
  ILanguageNameRelationMap,
  ILanguageNameRelationQueries
>;

export type ILanguageNameListQuery = Q.IBaseListQuery<
  ILanguageName,
  LanguageNameRelationKey,
  LanguageNameSelectableField,
  LanguageNameSortableField,
  LanguageNameRelationKey,
  LanguageNameSelectableField,
  LanguageNameSortableField,
  LanguageNameDateRangeField,
  LanguageNameFilterableField,
  ILanguageNameRelationMap,
  ILanguageNameRelationQueries,
  ILanguageNameItemQuery
>;
