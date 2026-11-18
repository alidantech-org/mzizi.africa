// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";
import * as EditionsConfig from "#/modules/legal/schema/types/editions/editions.config";
import * as InstrumentsConfig from "#/modules/legal/schema/types/instruments/instruments.config";
import * as LanguageConfig from "#/modules/reference/schema/types/language/language.config";
import * as ProvisionsConfig from "#/modules/legal/schema/types/provisions/provisions.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IWordings,
  WordingsKey,
  WordingsRelationKey,
  WordingsSortableField,
  WordingsFilterableField,
  WordingsDateRangeField,
  WordingsSelectableField,
  IWordingsAsOneRelationConfig,
  IWordingsAsManyRelationConfig,
} from "./wordings.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const WORDINGS_RELATION_KEYS = [
  "citation",
  "edition",
  "instrument",
  "language",
  "provision",
  "supersedes",
] as const satisfies readonly WordingsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const WORDINGS_SORTABLE_FIELDS = [
  "citationId",
  "code",
  "createdAt",
  "deletedAt",
  "editionId",
  "endsOn",
  "fromToPrecision",
  "fromYear",
  "id",
  "instrumentId",
  "languageId",
  "observedAt",
  "provisionId",
  "startsOn",
  "supersedesId",
  "text",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly WordingsKey[];

export const WORDINGS_SEARCHABLE_FIELDS = [
  "code",
  "text",
] as const satisfies readonly WordingsKey[];

export const WORDINGS_FILTERABLE_FIELDS = [
  "citationId",
  "editionId",
  "fromToPrecision",
  "id",
  "instrumentId",
  "languageId",
  "provisionId",
  "supersedesId",
] as const satisfies readonly WordingsKey[];

export const WORDINGS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "endsOn",
  "observedAt",
  "startsOn",
  "updatedAt",
] as const satisfies readonly WordingsKey[];

export const WORDINGS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IWordings> = {
  searchableFields: [...WORDINGS_SEARCHABLE_FIELDS],
  filterFields: [...WORDINGS_FILTERABLE_FIELDS],
  dateRangeFields: [...WORDINGS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const WORDINGS_SELECTABLE_FIELDS = [
  "citationId",
  "code",
  "createdAt",
  "deletedAt",
  "editionId",
  "endsOn",
  "fromToPrecision",
  "fromYear",
  "id",
  "instrumentId",
  "languageId",
  "observedAt",
  "provisionId",
  "startsOn",
  "supersedesId",
  "text",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly WordingsKey[];

export const WORDINGS_DEFAULT_SELECT_FIELDS = [
  "citationId",
  "code",
  "createdAt",
  "deletedAt",
  "editionId",
  "endsOn",
  "fromToPrecision",
  "fromYear",
  "id",
  "instrumentId",
  "languageId",
  "observedAt",
  "provisionId",
  "startsOn",
  "supersedesId",
  "text",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly WordingsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const WORDINGS_EDITABLE_FIELDS = [
  "citationId",
  "code",
  "editionId",
  "endsOn",
  "fromToPrecision",
  "fromYear",
  "instrumentId",
  "languageId",
  "observedAt",
  "provisionId",
  "startsOn",
  "supersedesId",
  "text",
  "toYear",
] as const satisfies readonly WordingsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const WORDINGS_AS_ONE_RELATION_CONFIG = {
  relation: "wordings",
  type: ERelationType.One,
  selectableFields: WORDINGS_SELECTABLE_FIELDS,
  defaultSelectFields: WORDINGS_DEFAULT_SELECT_FIELDS,
} as const satisfies IWordingsAsOneRelationConfig;

export const WORDINGS_AS_MANY_RELATION_CONFIG = {
  relation: "wordings",
  type: ERelationType.Many,
  selectableFields: WORDINGS_SELECTABLE_FIELDS,
  defaultSelectFields: WORDINGS_DEFAULT_SELECT_FIELDS,
  sortableFields: WORDINGS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IWordingsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const WORDINGS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<WordingsRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "citation",
  ),
  Q.createRelationKeyMapper<WordingsRelationKey>().one(
    () => EditionsConfig.EDITIONS_AS_ONE_RELATION_CONFIG,
    "edition",
  ),
  Q.createRelationKeyMapper<WordingsRelationKey>().one(
    () => InstrumentsConfig.INSTRUMENTS_AS_ONE_RELATION_CONFIG,
    "instrument",
  ),
  Q.createRelationKeyMapper<WordingsRelationKey>().one(
    () => LanguageConfig.LANGUAGE_AS_ONE_RELATION_CONFIG,
    "language",
  ),
  Q.createRelationKeyMapper<WordingsRelationKey>().one(
    () => ProvisionsConfig.PROVISIONS_AS_ONE_RELATION_CONFIG,
    "provision",
  ),
] as const;

export const WORDINGS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const WORDINGS_QUERY_OPTIONS = {
  searchableFields: WORDINGS_SEARCHABLE_FIELDS,
  selectableFields: WORDINGS_SELECTABLE_FIELDS,
  defaultSelectFields: WORDINGS_DEFAULT_SELECT_FIELDS,
  sortableFields: WORDINGS_SORTABLE_FIELDS,
  filterFields: WORDINGS_FILTERABLE_FIELDS,
  dateRangeFields: WORDINGS_DATE_RANGE_FIELDS,
  relationKeys: WORDINGS_RELATION_KEYS,
  editableFields: WORDINGS_EDITABLE_FIELDS,
  asOne: WORDINGS_AS_ONE_RELATION_CONFIG,
  asMany: WORDINGS_AS_MANY_RELATION_CONFIG,
  oneRelations: WORDINGS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: WORDINGS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IWordings,
  WordingsSortableField,
  WordingsSelectableField,
  WordingsFilterableField,
  WordingsDateRangeField,
  WordingsRelationKey,
  typeof WORDINGS_ONE_RELATION_QUERY_OPTIONS,
  typeof WORDINGS_MANY_RELATION_QUERY_OPTIONS
>;
