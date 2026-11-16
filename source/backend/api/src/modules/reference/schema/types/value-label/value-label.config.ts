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
  IValueLabel,
  ValueLabelKey,
  ValueLabelRelationKey,
  ValueLabelSortableField,
  ValueLabelFilterableField,
  ValueLabelDateRangeField,
  ValueLabelSelectableField,
  IValueLabelAsOneRelationConfig,
  IValueLabelAsManyRelationConfig,
} from "./value-label.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const VALUE_LABEL_RELATION_KEYS = ["value"] as const satisfies readonly ValueLabelKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const VALUE_LABEL_SORTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "id",
  "label",
  "labelKind",
  "languageTag",
  "updatedAt",
  "validFrom",
  "validUntil",
  "valueId",
  "version",
] as const satisfies readonly ValueLabelKey[];

export const VALUE_LABEL_SEARCHABLE_FIELDS = [
  "label",
  "languageTag",
] as const satisfies readonly ValueLabelKey[];

export const VALUE_LABEL_FILTERABLE_FIELDS = [
  "id",
  "labelKind",
  "valueId",
] as const satisfies readonly ValueLabelKey[];

export const VALUE_LABEL_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
  "validFrom",
  "validUntil",
] as const satisfies readonly ValueLabelKey[];

export const VALUE_LABEL_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IValueLabel> = {
  searchableFields: [...VALUE_LABEL_SEARCHABLE_FIELDS],
  filterFields: [...VALUE_LABEL_FILTERABLE_FIELDS],
  dateRangeFields: [...VALUE_LABEL_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const VALUE_LABEL_SELECTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "id",
  "label",
  "labelKind",
  "languageTag",
  "updatedAt",
  "validFrom",
  "validUntil",
  "valueId",
  "version",
] as const satisfies readonly ValueLabelKey[];

export const VALUE_LABEL_DEFAULT_SELECT_FIELDS = [
  "createdAt",
  "deletedAt",
  "id",
  "label",
  "labelKind",
  "languageTag",
  "updatedAt",
  "validFrom",
  "validUntil",
  "valueId",
  "version",
] as const satisfies readonly ValueLabelSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const VALUE_LABEL_EDITABLE_FIELDS = [
  "label",
  "labelKind",
  "languageTag",
  "validFrom",
  "validUntil",
  "valueId",
] as const satisfies readonly ValueLabelKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const VALUE_LABEL_AS_ONE_RELATION_CONFIG = {
  relation: "valueLabel",
  type: ERelationType.One,
  selectableFields: VALUE_LABEL_SELECTABLE_FIELDS,
  defaultSelectFields: VALUE_LABEL_DEFAULT_SELECT_FIELDS,
} as const satisfies IValueLabelAsOneRelationConfig;

export const VALUE_LABEL_AS_MANY_RELATION_CONFIG = {
  relation: "valueLabels",
  type: ERelationType.Many,
  selectableFields: VALUE_LABEL_SELECTABLE_FIELDS,
  defaultSelectFields: VALUE_LABEL_DEFAULT_SELECT_FIELDS,
  sortableFields: VALUE_LABEL_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IValueLabelAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const VALUE_LABEL_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ValueLabelRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "value",
  ),
] as const;

export const VALUE_LABEL_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const VALUE_LABEL_QUERY_OPTIONS = {
  searchableFields: VALUE_LABEL_SEARCHABLE_FIELDS,
  selectableFields: VALUE_LABEL_SELECTABLE_FIELDS,
  defaultSelectFields: VALUE_LABEL_DEFAULT_SELECT_FIELDS,
  sortableFields: VALUE_LABEL_SORTABLE_FIELDS,
  filterFields: VALUE_LABEL_FILTERABLE_FIELDS,
  dateRangeFields: VALUE_LABEL_DATE_RANGE_FIELDS,
  relationKeys: VALUE_LABEL_RELATION_KEYS,
  editableFields: VALUE_LABEL_EDITABLE_FIELDS,
  asOne: VALUE_LABEL_AS_ONE_RELATION_CONFIG,
  asMany: VALUE_LABEL_AS_MANY_RELATION_CONFIG,
  oneRelations: VALUE_LABEL_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: VALUE_LABEL_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IValueLabel,
  ValueLabelSortableField,
  ValueLabelSelectableField,
  ValueLabelFilterableField,
  ValueLabelDateRangeField,
  ValueLabelRelationKey,
  typeof VALUE_LABEL_ONE_RELATION_QUERY_OPTIONS,
  typeof VALUE_LABEL_MANY_RELATION_QUERY_OPTIONS
>;
