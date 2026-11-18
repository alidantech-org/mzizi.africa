// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { ReviewStatus } from "#/modules/legal/schema/enum/review-status.enum";
import type { TranslationMethod } from "#/modules/legal/schema/enum/translation-method.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as LanguageTypes from "#/modules/reference/schema/types/language/language.types";
import type * as WordingsTypes from "#/modules/legal/schema/types/wordings/wordings.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  TRANSLATIONS_RELATION_KEYS,
  TRANSLATIONS_SORTABLE_FIELDS,
  TRANSLATIONS_SEARCHABLE_FIELDS,
  TRANSLATIONS_FILTERABLE_FIELDS,
  TRANSLATIONS_DATE_RANGE_FIELDS,
  TRANSLATIONS_SELECTABLE_FIELDS,
  TRANSLATIONS_DEFAULT_SELECT_FIELDS,
  TRANSLATIONS_EDITABLE_FIELDS,
} from "./translations.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A translated representation of one exact wording. Several translations into one language are valid; review never makes a translation legal authority. */
export interface ITranslations extends B.IBase {
  code: string;
  languageId: string;
  method: TranslationMethod;
  notes: string | null;
  producedAt: Date | null;
  producedBy: string | null;
  reviewStatus: ReviewStatus;
  reviewedAt: Date | null;
  reviewedBySnapshot: string | null;
  text: string;
  wordingId: string;
  readonly language?: LanguageTypes.ILanguage;
  readonly wording?: WordingsTypes.IWordings;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type TranslationsKey = keyof ITranslations;

export type TranslationsRelationKey = (typeof TRANSLATIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ITranslationsReadonlyFields = B.IBaseReadonlyFields;

export type ITranslationsContextualFields = never;

export type ITranslationsSensitiveFields = never;

export type ITranslationsTransitionFields = never;

export type ITranslationsImmutableFields =
  | ITranslationsReadonlyFields
  | ITranslationsContextualFields
  | ITranslationsSensitiveFields
  | ITranslationsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ITranslationsCreatable = Omit<
  ITranslations,
  ITranslationsImmutableFields | TranslationsRelationKey
>;

export type ITranslationsSystemWritable = Omit<
  ITranslations,
  B.IBaseReadonlyFields | TranslationsRelationKey
>;

export type ITranslationsUpdatable = Partial<
  Omit<ITranslations, ITranslationsImmutableFields | TranslationsRelationKey>
>;

export interface ITranslationsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type TranslationsSortableField = (typeof TRANSLATIONS_SORTABLE_FIELDS)[number];

export type TranslationsSearchableField = (typeof TRANSLATIONS_SEARCHABLE_FIELDS)[number];

export type TranslationsFilterableField = (typeof TRANSLATIONS_FILTERABLE_FIELDS)[number];

export type TranslationsDateRangeField = (typeof TRANSLATIONS_DATE_RANGE_FIELDS)[number];

export type TranslationsSelectableField = (typeof TRANSLATIONS_SELECTABLE_FIELDS)[number];

export type TranslationsDefaultSelectField = (typeof TRANSLATIONS_DEFAULT_SELECT_FIELDS)[number];

export type TranslationsEditableField = (typeof TRANSLATIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ITranslationsAsOneRelationConfig = Q.IOneRelationConfig<
  "translations",
  TranslationsSelectableField
>;

export type ITranslationsAsManyRelationConfig = Q.IManyRelationConfig<
  "translations",
  TranslationsSelectableField,
  TranslationsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ITranslationsAsOneRelationQuery = Q.IAsOneRelationQuery<
  ITranslations,
  TranslationsSelectableField
>;

export type ITranslationsAsManyRelationQuery = Q.IAsManyRelationQuery<
  ITranslations,
  TranslationsSelectableField,
  TranslationsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ITranslationsRelationMap extends Record<TranslationsRelationKey, unknown> {
  language: LanguageTypes.ILanguageAsOneRelationQuery;
  wording: WordingsTypes.IWordingsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ITranslationsRelationQueries = Q.IBaseRelationQueries<
  ITranslations,
  TranslationsRelationKey,
  ITranslationsRelationMap
>;

export type ITranslationsItemQuery = Q.IBaseItemQuery<
  ITranslations,
  TranslationsRelationKey,
  TranslationsSelectableField,
  TranslationsRelationKey,
  TranslationsSelectableField,
  ITranslationsRelationMap,
  ITranslationsRelationQueries
>;

export type ITranslationsListQuery = Q.IBaseListQuery<
  ITranslations,
  TranslationsRelationKey,
  TranslationsSelectableField,
  TranslationsSortableField,
  TranslationsRelationKey,
  TranslationsSelectableField,
  TranslationsSortableField,
  TranslationsDateRangeField,
  TranslationsFilterableField,
  ITranslationsRelationMap,
  ITranslationsRelationQueries,
  ITranslationsItemQuery
>;
