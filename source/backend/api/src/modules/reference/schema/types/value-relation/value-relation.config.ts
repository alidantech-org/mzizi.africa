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
  IValueRelation,
  ValueRelationKey,
  ValueRelationRelationKey,
  ValueRelationSortableField,
  ValueRelationFilterableField,
  ValueRelationDateRangeField,
  ValueRelationSelectableField,
  IValueRelationAsOneRelationConfig,
  IValueRelationAsManyRelationConfig,
} from "./value-relation.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const VALUE_RELATION_RELATION_KEYS = [
  "sourceValue",
  "targetValue",
] as const satisfies readonly ValueRelationKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const VALUE_RELATION_SORTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "id",
  "relationKind",
  "sourceValueId",
  "targetValueId",
  "validFrom",
  "validUntil",
] as const satisfies readonly ValueRelationKey[];

export const VALUE_RELATION_SEARCHABLE_FIELDS = [] as const satisfies readonly ValueRelationKey[];

export const VALUE_RELATION_FILTERABLE_FIELDS = [
  "id",
  "relationKind",
  "sourceValueId",
  "targetValueId",
] as const satisfies readonly ValueRelationKey[];

export const VALUE_RELATION_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "validFrom",
  "validUntil",
] as const satisfies readonly ValueRelationKey[];

export const VALUE_RELATION_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IValueRelation> = {
  searchableFields: [...VALUE_RELATION_SEARCHABLE_FIELDS],
  filterFields: [...VALUE_RELATION_FILTERABLE_FIELDS],
  dateRangeFields: [...VALUE_RELATION_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const VALUE_RELATION_SELECTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "id",
  "relationKind",
  "sourceValueId",
  "targetValueId",
  "validFrom",
  "validUntil",
] as const satisfies readonly ValueRelationKey[];

export const VALUE_RELATION_DEFAULT_SELECT_FIELDS = [
  "createdAt",
  "deletedAt",
  "id",
  "relationKind",
  "sourceValueId",
  "targetValueId",
  "validFrom",
  "validUntil",
] as const satisfies readonly ValueRelationSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const VALUE_RELATION_EDITABLE_FIELDS = [
  "relationKind",
  "sourceValueId",
  "targetValueId",
  "validFrom",
  "validUntil",
] as const satisfies readonly ValueRelationKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const VALUE_RELATION_AS_ONE_RELATION_CONFIG = {
  relation: "valueRelation",
  type: ERelationType.One,
  selectableFields: VALUE_RELATION_SELECTABLE_FIELDS,
  defaultSelectFields: VALUE_RELATION_DEFAULT_SELECT_FIELDS,
} as const satisfies IValueRelationAsOneRelationConfig;

export const VALUE_RELATION_AS_MANY_RELATION_CONFIG = {
  relation: "valueRelations",
  type: ERelationType.Many,
  selectableFields: VALUE_RELATION_SELECTABLE_FIELDS,
  defaultSelectFields: VALUE_RELATION_DEFAULT_SELECT_FIELDS,
  sortableFields: VALUE_RELATION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IValueRelationAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const VALUE_RELATION_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ValueRelationRelationKey>().one(
    ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "sourceValue",
  ),
  Q.createRelationKeyMapper<ValueRelationRelationKey>().one(
    ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "targetValue",
  ),
] as const;

export const VALUE_RELATION_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const VALUE_RELATION_QUERY_OPTIONS = {
  searchableFields: VALUE_RELATION_SEARCHABLE_FIELDS,
  selectableFields: VALUE_RELATION_SELECTABLE_FIELDS,
  defaultSelectFields: VALUE_RELATION_DEFAULT_SELECT_FIELDS,
  sortableFields: VALUE_RELATION_SORTABLE_FIELDS,
  filterFields: VALUE_RELATION_FILTERABLE_FIELDS,
  dateRangeFields: VALUE_RELATION_DATE_RANGE_FIELDS,
  relationKeys: VALUE_RELATION_RELATION_KEYS,
  editableFields: VALUE_RELATION_EDITABLE_FIELDS,
  asOne: VALUE_RELATION_AS_ONE_RELATION_CONFIG,
  asMany: VALUE_RELATION_AS_MANY_RELATION_CONFIG,
  oneRelations: VALUE_RELATION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: VALUE_RELATION_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IValueRelation,
  ValueRelationSortableField,
  ValueRelationSelectableField,
  ValueRelationFilterableField,
  ValueRelationDateRangeField,
  ValueRelationRelationKey,
  typeof VALUE_RELATION_ONE_RELATION_QUERY_OPTIONS,
  typeof VALUE_RELATION_MANY_RELATION_QUERY_OPTIONS
>;
