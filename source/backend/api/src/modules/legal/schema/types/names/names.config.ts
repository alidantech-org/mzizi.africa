// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as InstrumentsConfig from "#/modules/legal/schema/types/instruments/instruments.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as LanguageConfig from "#/modules/reference/schema/types/language/language.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  INames,
  NamesKey,
  NamesRelationKey,
  NamesSortableField,
  NamesFilterableField,
  NamesDateRangeField,
  NamesSelectableField,
  INamesAsOneRelationConfig,
  INamesAsManyRelationConfig,
} from "./names.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const NAMES_RELATION_KEYS = [
  "instrument",
  "kind",
  "language",
] as const satisfies readonly NamesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const NAMES_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "instrumentId",
  "isPreferred",
  "kindId",
  "languageId",
  "name",
  "updatedAt",
  "version",
] as const satisfies readonly NamesKey[];

export const NAMES_SEARCHABLE_FIELDS = ["code", "name"] as const satisfies readonly NamesKey[];

export const NAMES_FILTERABLE_FIELDS = [
  "id",
  "instrumentId",
  "isPreferred",
  "kindId",
  "languageId",
] as const satisfies readonly NamesKey[];

export const NAMES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly NamesKey[];

export const NAMES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<INames> = {
  searchableFields: [...NAMES_SEARCHABLE_FIELDS],
  filterFields: [...NAMES_FILTERABLE_FIELDS],
  dateRangeFields: [...NAMES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const NAMES_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "instrumentId",
  "isPreferred",
  "kindId",
  "languageId",
  "name",
  "updatedAt",
  "version",
] as const satisfies readonly NamesKey[];

export const NAMES_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "instrumentId",
  "isPreferred",
  "kindId",
  "languageId",
  "name",
  "updatedAt",
  "version",
] as const satisfies readonly NamesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const NAMES_EDITABLE_FIELDS = [
  "code",
  "instrumentId",
  "isPreferred",
  "kindId",
  "languageId",
  "name",
] as const satisfies readonly NamesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const NAMES_AS_ONE_RELATION_CONFIG = {
  relation: "names",
  type: ERelationType.One,
  selectableFields: NAMES_SELECTABLE_FIELDS,
  defaultSelectFields: NAMES_DEFAULT_SELECT_FIELDS,
} as const satisfies INamesAsOneRelationConfig;

export const NAMES_AS_MANY_RELATION_CONFIG = {
  relation: "names",
  type: ERelationType.Many,
  selectableFields: NAMES_SELECTABLE_FIELDS,
  defaultSelectFields: NAMES_DEFAULT_SELECT_FIELDS,
  sortableFields: NAMES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies INamesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const NAMES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<NamesRelationKey>().one(
    () => InstrumentsConfig.INSTRUMENTS_AS_ONE_RELATION_CONFIG,
    "instrument",
  ),
  Q.createRelationKeyMapper<NamesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "kind",
  ),
  Q.createRelationKeyMapper<NamesRelationKey>().one(
    () => LanguageConfig.LANGUAGE_AS_ONE_RELATION_CONFIG,
    "language",
  ),
] as const;

export const NAMES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const NAMES_QUERY_OPTIONS = {
  searchableFields: NAMES_SEARCHABLE_FIELDS,
  selectableFields: NAMES_SELECTABLE_FIELDS,
  defaultSelectFields: NAMES_DEFAULT_SELECT_FIELDS,
  sortableFields: NAMES_SORTABLE_FIELDS,
  filterFields: NAMES_FILTERABLE_FIELDS,
  dateRangeFields: NAMES_DATE_RANGE_FIELDS,
  relationKeys: NAMES_RELATION_KEYS,
  editableFields: NAMES_EDITABLE_FIELDS,
  asOne: NAMES_AS_ONE_RELATION_CONFIG,
  asMany: NAMES_AS_MANY_RELATION_CONFIG,
  oneRelations: NAMES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: NAMES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  INames,
  NamesSortableField,
  NamesSelectableField,
  NamesFilterableField,
  NamesDateRangeField,
  NamesRelationKey,
  typeof NAMES_ONE_RELATION_QUERY_OPTIONS,
  typeof NAMES_MANY_RELATION_QUERY_OPTIONS
>;
