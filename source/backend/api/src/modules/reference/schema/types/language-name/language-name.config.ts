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

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ILanguageName,
  LanguageNameKey,
  LanguageNameRelationKey,
  LanguageNameSortableField,
  LanguageNameFilterableField,
  LanguageNameDateRangeField,
  LanguageNameSelectableField,
  ILanguageNameAsOneRelationConfig,
  ILanguageNameAsManyRelationConfig,
} from "./language-name.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const LANGUAGE_NAME_RELATION_KEYS = [
  "inLanguage",
  "language",
] as const satisfies readonly LanguageNameKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const LANGUAGE_NAME_SORTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "id",
  "inLanguageId",
  "languageId",
  "name",
  "nameKind",
  "updatedAt",
  "validFrom",
  "validUntil",
  "version",
] as const satisfies readonly LanguageNameKey[];

export const LANGUAGE_NAME_SEARCHABLE_FIELDS = [
  "name",
] as const satisfies readonly LanguageNameKey[];

export const LANGUAGE_NAME_FILTERABLE_FIELDS = [
  "id",
  "inLanguageId",
  "languageId",
  "nameKind",
] as const satisfies readonly LanguageNameKey[];

export const LANGUAGE_NAME_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
  "validFrom",
  "validUntil",
] as const satisfies readonly LanguageNameKey[];

export const LANGUAGE_NAME_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<ILanguageName> = {
  searchableFields: [...LANGUAGE_NAME_SEARCHABLE_FIELDS],
  filterFields: [...LANGUAGE_NAME_FILTERABLE_FIELDS],
  dateRangeFields: [...LANGUAGE_NAME_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const LANGUAGE_NAME_SELECTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "id",
  "inLanguageId",
  "languageId",
  "name",
  "nameKind",
  "updatedAt",
  "validFrom",
  "validUntil",
  "version",
] as const satisfies readonly LanguageNameKey[];

export const LANGUAGE_NAME_DEFAULT_SELECT_FIELDS = [
  "createdAt",
  "deletedAt",
  "id",
  "inLanguageId",
  "languageId",
  "name",
  "nameKind",
  "updatedAt",
  "validFrom",
  "validUntil",
  "version",
] as const satisfies readonly LanguageNameSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const LANGUAGE_NAME_EDITABLE_FIELDS = [
  "inLanguageId",
  "languageId",
  "name",
  "nameKind",
  "validFrom",
  "validUntil",
] as const satisfies readonly LanguageNameKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const LANGUAGE_NAME_AS_ONE_RELATION_CONFIG = {
  relation: "languageName",
  type: ERelationType.One,
  selectableFields: LANGUAGE_NAME_SELECTABLE_FIELDS,
  defaultSelectFields: LANGUAGE_NAME_DEFAULT_SELECT_FIELDS,
} as const satisfies ILanguageNameAsOneRelationConfig;

export const LANGUAGE_NAME_AS_MANY_RELATION_CONFIG = {
  relation: "languageNames",
  type: ERelationType.Many,
  selectableFields: LANGUAGE_NAME_SELECTABLE_FIELDS,
  defaultSelectFields: LANGUAGE_NAME_DEFAULT_SELECT_FIELDS,
  sortableFields: LANGUAGE_NAME_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies ILanguageNameAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const LANGUAGE_NAME_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<LanguageNameRelationKey>().one(
    () => LanguageConfig.LANGUAGE_AS_ONE_RELATION_CONFIG,
    "inLanguage",
  ),
  Q.createRelationKeyMapper<LanguageNameRelationKey>().one(
    () => LanguageConfig.LANGUAGE_AS_ONE_RELATION_CONFIG,
    "language",
  ),
] as const;

export const LANGUAGE_NAME_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const LANGUAGE_NAME_QUERY_OPTIONS = {
  searchableFields: LANGUAGE_NAME_SEARCHABLE_FIELDS,
  selectableFields: LANGUAGE_NAME_SELECTABLE_FIELDS,
  defaultSelectFields: LANGUAGE_NAME_DEFAULT_SELECT_FIELDS,
  sortableFields: LANGUAGE_NAME_SORTABLE_FIELDS,
  filterFields: LANGUAGE_NAME_FILTERABLE_FIELDS,
  dateRangeFields: LANGUAGE_NAME_DATE_RANGE_FIELDS,
  relationKeys: LANGUAGE_NAME_RELATION_KEYS,
  editableFields: LANGUAGE_NAME_EDITABLE_FIELDS,
  asOne: LANGUAGE_NAME_AS_ONE_RELATION_CONFIG,
  asMany: LANGUAGE_NAME_AS_MANY_RELATION_CONFIG,
  oneRelations: LANGUAGE_NAME_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: LANGUAGE_NAME_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  ILanguageName,
  LanguageNameSortableField,
  LanguageNameSelectableField,
  LanguageNameFilterableField,
  LanguageNameDateRangeField,
  LanguageNameRelationKey,
  typeof LANGUAGE_NAME_ONE_RELATION_QUERY_OPTIONS,
  typeof LANGUAGE_NAME_MANY_RELATION_QUERY_OPTIONS
>;
