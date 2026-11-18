// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ProvisionsConfig from "#/modules/legal/schema/types/provisions/provisions.config";
import * as WordingsConfig from "#/modules/legal/schema/types/wordings/wordings.config";
import * as TranslationsConfig from "#/modules/legal/schema/types/translations/translations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IReferences,
  ReferencesKey,
  ReferencesRelationKey,
  ReferencesSortableField,
  ReferencesFilterableField,
  ReferencesDateRangeField,
  ReferencesSelectableField,
  IReferencesAsOneRelationConfig,
  IReferencesAsManyRelationConfig,
} from "./references.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const REFERENCES_RELATION_KEYS = [
  "targetProvision",
  "targetWording",
  "translation",
  "wording",
] as const satisfies readonly ReferencesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const REFERENCES_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "method",
  "relation",
  "reviewStatus",
  "spanEnd",
  "spanStart",
  "spanText",
  "targetProvisionId",
  "targetWordingId",
  "translationId",
  "updatedAt",
  "version",
  "wordingId",
] as const satisfies readonly ReferencesKey[];

export const REFERENCES_SEARCHABLE_FIELDS = [
  "code",
  "spanText",
] as const satisfies readonly ReferencesKey[];

export const REFERENCES_FILTERABLE_FIELDS = [
  "id",
  "method",
  "relation",
  "reviewStatus",
  "targetProvisionId",
  "targetWordingId",
  "translationId",
  "wordingId",
] as const satisfies readonly ReferencesKey[];

export const REFERENCES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly ReferencesKey[];

export const REFERENCES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IReferences> = {
  searchableFields: [...REFERENCES_SEARCHABLE_FIELDS],
  filterFields: [...REFERENCES_FILTERABLE_FIELDS],
  dateRangeFields: [...REFERENCES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const REFERENCES_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "method",
  "relation",
  "reviewStatus",
  "spanEnd",
  "spanStart",
  "spanText",
  "targetProvisionId",
  "targetWordingId",
  "translationId",
  "updatedAt",
  "version",
  "wordingId",
] as const satisfies readonly ReferencesKey[];

export const REFERENCES_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "method",
  "relation",
  "reviewStatus",
  "spanEnd",
  "spanStart",
  "spanText",
  "targetProvisionId",
  "targetWordingId",
  "translationId",
  "updatedAt",
  "version",
  "wordingId",
] as const satisfies readonly ReferencesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const REFERENCES_EDITABLE_FIELDS = [
  "code",
  "method",
  "relation",
  "reviewStatus",
  "spanEnd",
  "spanStart",
  "spanText",
  "targetProvisionId",
  "targetWordingId",
  "translationId",
  "wordingId",
] as const satisfies readonly ReferencesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const REFERENCES_AS_ONE_RELATION_CONFIG = {
  relation: "references",
  type: ERelationType.One,
  selectableFields: REFERENCES_SELECTABLE_FIELDS,
  defaultSelectFields: REFERENCES_DEFAULT_SELECT_FIELDS,
} as const satisfies IReferencesAsOneRelationConfig;

export const REFERENCES_AS_MANY_RELATION_CONFIG = {
  relation: "references",
  type: ERelationType.Many,
  selectableFields: REFERENCES_SELECTABLE_FIELDS,
  defaultSelectFields: REFERENCES_DEFAULT_SELECT_FIELDS,
  sortableFields: REFERENCES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IReferencesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const REFERENCES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ReferencesRelationKey>().one(
    () => ProvisionsConfig.PROVISIONS_AS_ONE_RELATION_CONFIG,
    "targetProvision",
  ),
  Q.createRelationKeyMapper<ReferencesRelationKey>().one(
    () => WordingsConfig.WORDINGS_AS_ONE_RELATION_CONFIG,
    "targetWording",
  ),
  Q.createRelationKeyMapper<ReferencesRelationKey>().one(
    () => TranslationsConfig.TRANSLATIONS_AS_ONE_RELATION_CONFIG,
    "translation",
  ),
  Q.createRelationKeyMapper<ReferencesRelationKey>().one(
    () => WordingsConfig.WORDINGS_AS_ONE_RELATION_CONFIG,
    "wording",
  ),
] as const;

export const REFERENCES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const REFERENCES_QUERY_OPTIONS = {
  searchableFields: REFERENCES_SEARCHABLE_FIELDS,
  selectableFields: REFERENCES_SELECTABLE_FIELDS,
  defaultSelectFields: REFERENCES_DEFAULT_SELECT_FIELDS,
  sortableFields: REFERENCES_SORTABLE_FIELDS,
  filterFields: REFERENCES_FILTERABLE_FIELDS,
  dateRangeFields: REFERENCES_DATE_RANGE_FIELDS,
  relationKeys: REFERENCES_RELATION_KEYS,
  editableFields: REFERENCES_EDITABLE_FIELDS,
  asOne: REFERENCES_AS_ONE_RELATION_CONFIG,
  asMany: REFERENCES_AS_MANY_RELATION_CONFIG,
  oneRelations: REFERENCES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: REFERENCES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IReferences,
  ReferencesSortableField,
  ReferencesSelectableField,
  ReferencesFilterableField,
  ReferencesDateRangeField,
  ReferencesRelationKey,
  typeof REFERENCES_ONE_RELATION_QUERY_OPTIONS,
  typeof REFERENCES_MANY_RELATION_QUERY_OPTIONS
>;
