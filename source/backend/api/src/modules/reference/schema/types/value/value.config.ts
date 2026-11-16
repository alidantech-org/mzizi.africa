// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as SchemeConfig from "#/modules/reference/schema/types/scheme/scheme.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IValue,
  ValueKey,
  ValueRelationKey,
  ValueSortableField,
  ValueFilterableField,
  ValueDateRangeField,
  ValueSelectableField,
  IValueAsOneRelationConfig,
  IValueAsManyRelationConfig,
} from "./value.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const VALUE_RELATION_KEYS = ["scheme", "supersedes"] as const satisfies readonly ValueKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const VALUE_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "label",
  "schemeId",
  "supersedesId",
  "updatedAt",
  "version",
] as const satisfies readonly ValueKey[];

export const VALUE_SEARCHABLE_FIELDS = ["code", "label"] as const satisfies readonly ValueKey[];

export const VALUE_FILTERABLE_FIELDS = [
  "id",
  "schemeId",
  "supersedesId",
] as const satisfies readonly ValueKey[];

export const VALUE_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly ValueKey[];

export const VALUE_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IValue> = {
  searchableFields: [...VALUE_SEARCHABLE_FIELDS],
  filterFields: [...VALUE_FILTERABLE_FIELDS],
  dateRangeFields: [...VALUE_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const VALUE_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "label",
  "schemeId",
  "supersedesId",
  "updatedAt",
  "version",
] as const satisfies readonly ValueKey[];

export const VALUE_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "label",
  "schemeId",
  "supersedesId",
  "updatedAt",
  "version",
] as const satisfies readonly ValueSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const VALUE_EDITABLE_FIELDS = [
  "code",
  "label",
  "schemeId",
  "supersedesId",
] as const satisfies readonly ValueKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const VALUE_AS_ONE_RELATION_CONFIG = {
  relation: "value",
  type: ERelationType.One,
  selectableFields: VALUE_SELECTABLE_FIELDS,
  defaultSelectFields: VALUE_DEFAULT_SELECT_FIELDS,
} as const satisfies IValueAsOneRelationConfig;

export const VALUE_AS_MANY_RELATION_CONFIG = {
  relation: "values",
  type: ERelationType.Many,
  selectableFields: VALUE_SELECTABLE_FIELDS,
  defaultSelectFields: VALUE_DEFAULT_SELECT_FIELDS,
  sortableFields: VALUE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IValueAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const VALUE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ValueRelationKey>().one(
    () => SchemeConfig.SCHEME_AS_ONE_RELATION_CONFIG,
    "scheme",
  ),
] as const;

export const VALUE_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const VALUE_QUERY_OPTIONS = {
  searchableFields: VALUE_SEARCHABLE_FIELDS,
  selectableFields: VALUE_SELECTABLE_FIELDS,
  defaultSelectFields: VALUE_DEFAULT_SELECT_FIELDS,
  sortableFields: VALUE_SORTABLE_FIELDS,
  filterFields: VALUE_FILTERABLE_FIELDS,
  dateRangeFields: VALUE_DATE_RANGE_FIELDS,
  relationKeys: VALUE_RELATION_KEYS,
  editableFields: VALUE_EDITABLE_FIELDS,
  asOne: VALUE_AS_ONE_RELATION_CONFIG,
  asMany: VALUE_AS_MANY_RELATION_CONFIG,
  oneRelations: VALUE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: VALUE_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IValue,
  ValueSortableField,
  ValueSelectableField,
  ValueFilterableField,
  ValueDateRangeField,
  ValueRelationKey,
  typeof VALUE_ONE_RELATION_QUERY_OPTIONS,
  typeof VALUE_MANY_RELATION_QUERY_OPTIONS
>;
