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

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IProvisions,
  ProvisionsKey,
  ProvisionsRelationKey,
  ProvisionsSortableField,
  ProvisionsFilterableField,
  ProvisionsDateRangeField,
  ProvisionsSelectableField,
  IProvisionsAsOneRelationConfig,
  IProvisionsAsManyRelationConfig,
} from "./provisions.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PROVISIONS_RELATION_KEYS = [
  "instrument",
  "parent",
] as const satisfies readonly ProvisionsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PROVISIONS_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "designation",
  "id",
  "instrumentId",
  "kind",
  "parentId",
  "position",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly ProvisionsKey[];

export const PROVISIONS_SEARCHABLE_FIELDS = [
  "code",
  "designation",
  "title",
] as const satisfies readonly ProvisionsKey[];

export const PROVISIONS_FILTERABLE_FIELDS = [
  "id",
  "instrumentId",
  "kind",
  "parentId",
] as const satisfies readonly ProvisionsKey[];

export const PROVISIONS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly ProvisionsKey[];

export const PROVISIONS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IProvisions> = {
  searchableFields: [...PROVISIONS_SEARCHABLE_FIELDS],
  filterFields: [...PROVISIONS_FILTERABLE_FIELDS],
  dateRangeFields: [...PROVISIONS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PROVISIONS_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "designation",
  "id",
  "instrumentId",
  "kind",
  "parentId",
  "position",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly ProvisionsKey[];

export const PROVISIONS_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "designation",
  "id",
  "instrumentId",
  "kind",
  "parentId",
  "position",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly ProvisionsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PROVISIONS_EDITABLE_FIELDS = [
  "code",
  "designation",
  "instrumentId",
  "kind",
  "parentId",
  "position",
  "title",
] as const satisfies readonly ProvisionsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PROVISIONS_AS_ONE_RELATION_CONFIG = {
  relation: "provisions",
  type: ERelationType.One,
  selectableFields: PROVISIONS_SELECTABLE_FIELDS,
  defaultSelectFields: PROVISIONS_DEFAULT_SELECT_FIELDS,
} as const satisfies IProvisionsAsOneRelationConfig;

export const PROVISIONS_AS_MANY_RELATION_CONFIG = {
  relation: "provisions",
  type: ERelationType.Many,
  selectableFields: PROVISIONS_SELECTABLE_FIELDS,
  defaultSelectFields: PROVISIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: PROVISIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IProvisionsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PROVISIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ProvisionsRelationKey>().one(
    () => InstrumentsConfig.INSTRUMENTS_AS_ONE_RELATION_CONFIG,
    "instrument",
  ),
] as const;

export const PROVISIONS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PROVISIONS_QUERY_OPTIONS = {
  searchableFields: PROVISIONS_SEARCHABLE_FIELDS,
  selectableFields: PROVISIONS_SELECTABLE_FIELDS,
  defaultSelectFields: PROVISIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: PROVISIONS_SORTABLE_FIELDS,
  filterFields: PROVISIONS_FILTERABLE_FIELDS,
  dateRangeFields: PROVISIONS_DATE_RANGE_FIELDS,
  relationKeys: PROVISIONS_RELATION_KEYS,
  editableFields: PROVISIONS_EDITABLE_FIELDS,
  asOne: PROVISIONS_AS_ONE_RELATION_CONFIG,
  asMany: PROVISIONS_AS_MANY_RELATION_CONFIG,
  oneRelations: PROVISIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PROVISIONS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IProvisions,
  ProvisionsSortableField,
  ProvisionsSelectableField,
  ProvisionsFilterableField,
  ProvisionsDateRangeField,
  ProvisionsRelationKey,
  typeof PROVISIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof PROVISIONS_MANY_RELATION_QUERY_OPTIONS
>;
