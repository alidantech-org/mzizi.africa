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
import * as WordingsConfig from "#/modules/legal/schema/types/wordings/wordings.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ITranslations,
  TranslationsKey,
  TranslationsRelationKey,
  TranslationsSortableField,
  TranslationsFilterableField,
  TranslationsDateRangeField,
  TranslationsSelectableField,
  ITranslationsAsOneRelationConfig,
  ITranslationsAsManyRelationConfig,
} from "./translations.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const TRANSLATIONS_RELATION_KEYS = [
  "language",
  "wording",
] as const satisfies readonly TranslationsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const TRANSLATIONS_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "languageId",
  "method",
  "notes",
  "producedAt",
  "producedBy",
  "reviewStatus",
  "reviewedAt",
  "reviewedBySnapshot",
  "text",
  "updatedAt",
  "version",
  "wordingId",
] as const satisfies readonly TranslationsKey[];

export const TRANSLATIONS_SEARCHABLE_FIELDS = [
  "code",
  "notes",
  "text",
] as const satisfies readonly TranslationsKey[];

export const TRANSLATIONS_FILTERABLE_FIELDS = [
  "id",
  "languageId",
  "method",
  "reviewStatus",
  "wordingId",
] as const satisfies readonly TranslationsKey[];

export const TRANSLATIONS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "producedAt",
  "reviewedAt",
  "updatedAt",
] as const satisfies readonly TranslationsKey[];

export const TRANSLATIONS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<ITranslations> = {
  searchableFields: [...TRANSLATIONS_SEARCHABLE_FIELDS],
  filterFields: [...TRANSLATIONS_FILTERABLE_FIELDS],
  dateRangeFields: [...TRANSLATIONS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const TRANSLATIONS_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "languageId",
  "method",
  "notes",
  "producedAt",
  "producedBy",
  "reviewStatus",
  "reviewedAt",
  "reviewedBySnapshot",
  "text",
  "updatedAt",
  "version",
  "wordingId",
] as const satisfies readonly TranslationsKey[];

export const TRANSLATIONS_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "languageId",
  "method",
  "notes",
  "producedAt",
  "producedBy",
  "reviewStatus",
  "reviewedAt",
  "reviewedBySnapshot",
  "text",
  "updatedAt",
  "version",
  "wordingId",
] as const satisfies readonly TranslationsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const TRANSLATIONS_EDITABLE_FIELDS = [
  "code",
  "languageId",
  "method",
  "notes",
  "producedAt",
  "producedBy",
  "reviewStatus",
  "reviewedAt",
  "reviewedBySnapshot",
  "text",
  "wordingId",
] as const satisfies readonly TranslationsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const TRANSLATIONS_AS_ONE_RELATION_CONFIG = {
  relation: "translations",
  type: ERelationType.One,
  selectableFields: TRANSLATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: TRANSLATIONS_DEFAULT_SELECT_FIELDS,
} as const satisfies ITranslationsAsOneRelationConfig;

export const TRANSLATIONS_AS_MANY_RELATION_CONFIG = {
  relation: "translations",
  type: ERelationType.Many,
  selectableFields: TRANSLATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: TRANSLATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: TRANSLATIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies ITranslationsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const TRANSLATIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<TranslationsRelationKey>().one(
    () => LanguageConfig.LANGUAGE_AS_ONE_RELATION_CONFIG,
    "language",
  ),
  Q.createRelationKeyMapper<TranslationsRelationKey>().one(
    () => WordingsConfig.WORDINGS_AS_ONE_RELATION_CONFIG,
    "wording",
  ),
] as const;

export const TRANSLATIONS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const TRANSLATIONS_QUERY_OPTIONS = {
  searchableFields: TRANSLATIONS_SEARCHABLE_FIELDS,
  selectableFields: TRANSLATIONS_SELECTABLE_FIELDS,
  defaultSelectFields: TRANSLATIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: TRANSLATIONS_SORTABLE_FIELDS,
  filterFields: TRANSLATIONS_FILTERABLE_FIELDS,
  dateRangeFields: TRANSLATIONS_DATE_RANGE_FIELDS,
  relationKeys: TRANSLATIONS_RELATION_KEYS,
  editableFields: TRANSLATIONS_EDITABLE_FIELDS,
  asOne: TRANSLATIONS_AS_ONE_RELATION_CONFIG,
  asMany: TRANSLATIONS_AS_MANY_RELATION_CONFIG,
  oneRelations: TRANSLATIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: TRANSLATIONS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  ITranslations,
  TranslationsSortableField,
  TranslationsSelectableField,
  TranslationsFilterableField,
  TranslationsDateRangeField,
  TranslationsRelationKey,
  typeof TRANSLATIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof TRANSLATIONS_MANY_RELATION_QUERY_OPTIONS
>;
