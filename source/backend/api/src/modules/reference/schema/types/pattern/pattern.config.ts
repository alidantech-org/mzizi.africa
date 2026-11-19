// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as CountryConfig from "#/modules/reference/schema/types/country/country.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IPattern,
  PatternKey,
  PatternRelationKey,
  PatternSortableField,
  PatternFilterableField,
  PatternDateRangeField,
  PatternSelectableField,
  IPatternAsOneRelationConfig,
  IPatternAsManyRelationConfig,
} from "./pattern.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PATTERN_RELATION_KEYS = ["country", "kind"] as const satisfies readonly PatternKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PATTERN_SORTABLE_FIELDS = [
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "description",
  "id",
  "kindId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly PatternKey[];

export const PATTERN_SEARCHABLE_FIELDS = [
  "code",
  "description",
  "title",
] as const satisfies readonly PatternKey[];

export const PATTERN_FILTERABLE_FIELDS = [
  "countryId",
  "id",
  "kindId",
] as const satisfies readonly PatternKey[];

export const PATTERN_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly PatternKey[];

export const PATTERN_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IPattern> = {
  searchableFields: [...PATTERN_SEARCHABLE_FIELDS],
  filterFields: [...PATTERN_FILTERABLE_FIELDS],
  dateRangeFields: [...PATTERN_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PATTERN_SELECTABLE_FIELDS = [
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "description",
  "id",
  "kindId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly PatternKey[];

export const PATTERN_DEFAULT_SELECT_FIELDS = [
  "code",
  "countryId",
  "createdAt",
  "deletedAt",
  "description",
  "id",
  "kindId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly PatternSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PATTERN_EDITABLE_FIELDS = [
  "code",
  "countryId",
  "description",
  "kindId",
  "title",
] as const satisfies readonly PatternKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PATTERN_AS_ONE_RELATION_CONFIG = {
  relation: "pattern",
  type: ERelationType.One,
  selectableFields: PATTERN_SELECTABLE_FIELDS,
  defaultSelectFields: PATTERN_DEFAULT_SELECT_FIELDS,
} as const satisfies IPatternAsOneRelationConfig;

export const PATTERN_AS_MANY_RELATION_CONFIG = {
  relation: "patterns",
  type: ERelationType.Many,
  selectableFields: PATTERN_SELECTABLE_FIELDS,
  defaultSelectFields: PATTERN_DEFAULT_SELECT_FIELDS,
  sortableFields: PATTERN_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IPatternAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PATTERN_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<PatternRelationKey>().one(
    () => CountryConfig.COUNTRY_AS_ONE_RELATION_CONFIG,
    "country",
  ),
  Q.createRelationKeyMapper<PatternRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "kind",
  ),
] as const;

export const PATTERN_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PATTERN_QUERY_OPTIONS = {
  searchableFields: PATTERN_SEARCHABLE_FIELDS,
  selectableFields: PATTERN_SELECTABLE_FIELDS,
  defaultSelectFields: PATTERN_DEFAULT_SELECT_FIELDS,
  sortableFields: PATTERN_SORTABLE_FIELDS,
  filterFields: PATTERN_FILTERABLE_FIELDS,
  dateRangeFields: PATTERN_DATE_RANGE_FIELDS,
  relationKeys: PATTERN_RELATION_KEYS,
  editableFields: PATTERN_EDITABLE_FIELDS,
  asOne: PATTERN_AS_ONE_RELATION_CONFIG,
  asMany: PATTERN_AS_MANY_RELATION_CONFIG,
  oneRelations: PATTERN_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PATTERN_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IPattern,
  PatternSortableField,
  PatternSelectableField,
  PatternFilterableField,
  PatternDateRangeField,
  PatternRelationKey,
  typeof PATTERN_ONE_RELATION_QUERY_OPTIONS,
  typeof PATTERN_MANY_RELATION_QUERY_OPTIONS
>;
