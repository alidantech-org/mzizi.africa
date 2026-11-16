// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as SourcesConfig from "#/modules/source/schema/types/sources/sources.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IApis,
  ApisKey,
  ApisRelationKey,
  ApisSortableField,
  ApisFilterableField,
  ApisDateRangeField,
  ApisSelectableField,
  IApisAsOneRelationConfig,
  IApisAsManyRelationConfig,
} from "./apis.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const APIS_RELATION_KEYS = ["source"] as const satisfies readonly ApisKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const APIS_SORTABLE_FIELDS = [
  "baseUrl",
  "createdAt",
  "credentialBinding",
  "deletedAt",
  "id",
  "sourceId",
  "updatedAt",
  "version",
] as const satisfies readonly ApisKey[];

export const APIS_SEARCHABLE_FIELDS = ["credentialBinding"] as const satisfies readonly ApisKey[];

export const APIS_FILTERABLE_FIELDS = ["id", "sourceId"] as const satisfies readonly ApisKey[];

export const APIS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly ApisKey[];

export const APIS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IApis> = {
  searchableFields: [...APIS_SEARCHABLE_FIELDS],
  filterFields: [...APIS_FILTERABLE_FIELDS],
  dateRangeFields: [...APIS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const APIS_SELECTABLE_FIELDS = [
  "baseUrl",
  "createdAt",
  "credentialBinding",
  "deletedAt",
  "id",
  "sourceId",
  "updatedAt",
  "version",
] as const satisfies readonly ApisKey[];

export const APIS_DEFAULT_SELECT_FIELDS = [
  "baseUrl",
  "createdAt",
  "credentialBinding",
  "deletedAt",
  "id",
  "sourceId",
  "updatedAt",
  "version",
] as const satisfies readonly ApisSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const APIS_EDITABLE_FIELDS = [
  "baseUrl",
  "credentialBinding",
  "sourceId",
] as const satisfies readonly ApisKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const APIS_AS_ONE_RELATION_CONFIG = {
  relation: "apis",
  type: ERelationType.One,
  selectableFields: APIS_SELECTABLE_FIELDS,
  defaultSelectFields: APIS_DEFAULT_SELECT_FIELDS,
} as const satisfies IApisAsOneRelationConfig;

export const APIS_AS_MANY_RELATION_CONFIG = {
  relation: "apis",
  type: ERelationType.Many,
  selectableFields: APIS_SELECTABLE_FIELDS,
  defaultSelectFields: APIS_DEFAULT_SELECT_FIELDS,
  sortableFields: APIS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IApisAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const APIS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ApisRelationKey>().one(
    () => SourcesConfig.SOURCES_AS_ONE_RELATION_CONFIG,
    "source",
  ),
] as const;

export const APIS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const APIS_QUERY_OPTIONS = {
  searchableFields: APIS_SEARCHABLE_FIELDS,
  selectableFields: APIS_SELECTABLE_FIELDS,
  defaultSelectFields: APIS_DEFAULT_SELECT_FIELDS,
  sortableFields: APIS_SORTABLE_FIELDS,
  filterFields: APIS_FILTERABLE_FIELDS,
  dateRangeFields: APIS_DATE_RANGE_FIELDS,
  relationKeys: APIS_RELATION_KEYS,
  editableFields: APIS_EDITABLE_FIELDS,
  asOne: APIS_AS_ONE_RELATION_CONFIG,
  asMany: APIS_AS_MANY_RELATION_CONFIG,
  oneRelations: APIS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: APIS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IApis,
  ApisSortableField,
  ApisSelectableField,
  ApisFilterableField,
  ApisDateRangeField,
  ApisRelationKey,
  typeof APIS_ONE_RELATION_QUERY_OPTIONS,
  typeof APIS_MANY_RELATION_QUERY_OPTIONS
>;
