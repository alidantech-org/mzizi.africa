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

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ILanguage,
  LanguageKey,
  LanguageRelationKey,
  LanguageSortableField,
  LanguageFilterableField,
  LanguageDateRangeField,
  LanguageSelectableField,
  ILanguageAsOneRelationConfig,
  ILanguageAsManyRelationConfig,
} from "./language.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const LANGUAGE_RELATION_KEYS = [
  "direction",
  "family",
  "kind",
  "parent",
  "script",
  "status",
] as const satisfies readonly LanguageKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const LANGUAGE_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "directionId",
  "familyId",
  "glottocode",
  "id",
  "iso6391",
  "iso6392",
  "iso6393",
  "kindId",
  "name",
  "parentId",
  "scriptId",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly LanguageKey[];

export const LANGUAGE_SEARCHABLE_FIELDS = [
  "code",
  "glottocode",
  "iso6391",
  "iso6392",
  "iso6393",
  "name",
] as const satisfies readonly LanguageKey[];

export const LANGUAGE_FILTERABLE_FIELDS = [
  "directionId",
  "familyId",
  "id",
  "kindId",
  "parentId",
  "scriptId",
  "statusId",
] as const satisfies readonly LanguageKey[];

export const LANGUAGE_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly LanguageKey[];

export const LANGUAGE_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<ILanguage> = {
  searchableFields: [...LANGUAGE_SEARCHABLE_FIELDS],
  filterFields: [...LANGUAGE_FILTERABLE_FIELDS],
  dateRangeFields: [...LANGUAGE_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const LANGUAGE_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "directionId",
  "familyId",
  "glottocode",
  "id",
  "iso6391",
  "iso6392",
  "iso6393",
  "kindId",
  "name",
  "parentId",
  "scriptId",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly LanguageKey[];

export const LANGUAGE_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "directionId",
  "familyId",
  "glottocode",
  "id",
  "iso6391",
  "iso6392",
  "iso6393",
  "kindId",
  "name",
  "parentId",
  "scriptId",
  "statusId",
  "updatedAt",
  "version",
] as const satisfies readonly LanguageSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const LANGUAGE_EDITABLE_FIELDS = [
  "code",
  "directionId",
  "familyId",
  "glottocode",
  "iso6391",
  "iso6392",
  "iso6393",
  "kindId",
  "name",
  "parentId",
  "scriptId",
  "statusId",
] as const satisfies readonly LanguageKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const LANGUAGE_AS_ONE_RELATION_CONFIG = {
  relation: "language",
  type: ERelationType.One,
  selectableFields: LANGUAGE_SELECTABLE_FIELDS,
  defaultSelectFields: LANGUAGE_DEFAULT_SELECT_FIELDS,
} as const satisfies ILanguageAsOneRelationConfig;

export const LANGUAGE_AS_MANY_RELATION_CONFIG = {
  relation: "languages",
  type: ERelationType.Many,
  selectableFields: LANGUAGE_SELECTABLE_FIELDS,
  defaultSelectFields: LANGUAGE_DEFAULT_SELECT_FIELDS,
  sortableFields: LANGUAGE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies ILanguageAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const LANGUAGE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<LanguageRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "direction",
  ),
  Q.createRelationKeyMapper<LanguageRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "family",
  ),
  Q.createRelationKeyMapper<LanguageRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "kind",
  ),
  Q.createRelationKeyMapper<LanguageRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "script",
  ),
  Q.createRelationKeyMapper<LanguageRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "status",
  ),
] as const;

export const LANGUAGE_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const LANGUAGE_QUERY_OPTIONS = {
  searchableFields: LANGUAGE_SEARCHABLE_FIELDS,
  selectableFields: LANGUAGE_SELECTABLE_FIELDS,
  defaultSelectFields: LANGUAGE_DEFAULT_SELECT_FIELDS,
  sortableFields: LANGUAGE_SORTABLE_FIELDS,
  filterFields: LANGUAGE_FILTERABLE_FIELDS,
  dateRangeFields: LANGUAGE_DATE_RANGE_FIELDS,
  relationKeys: LANGUAGE_RELATION_KEYS,
  editableFields: LANGUAGE_EDITABLE_FIELDS,
  asOne: LANGUAGE_AS_ONE_RELATION_CONFIG,
  asMany: LANGUAGE_AS_MANY_RELATION_CONFIG,
  oneRelations: LANGUAGE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: LANGUAGE_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  ILanguage,
  LanguageSortableField,
  LanguageSelectableField,
  LanguageFilterableField,
  LanguageDateRangeField,
  LanguageRelationKey,
  typeof LANGUAGE_ONE_RELATION_QUERY_OPTIONS,
  typeof LANGUAGE_MANY_RELATION_QUERY_OPTIONS
>;
