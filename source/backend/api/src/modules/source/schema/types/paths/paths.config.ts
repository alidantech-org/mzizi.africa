// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as DomainsConfig from "#/modules/source/schema/types/domains/domains.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IPaths,
  PathsKey,
  PathsRelationKey,
  PathsSortableField,
  PathsFilterableField,
  PathsDateRangeField,
  PathsSelectableField,
  IPathsAsOneRelationConfig,
  IPathsAsManyRelationConfig,
} from "./paths.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PATHS_RELATION_KEYS = ["domain"] as const satisfies readonly PathsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PATHS_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "domainId",
  "id",
  "kind",
  "method",
  "note",
  "path",
  "updatedAt",
  "version",
] as const satisfies readonly PathsKey[];

export const PATHS_SEARCHABLE_FIELDS = [
  "code",
  "note",
  "path",
] as const satisfies readonly PathsKey[];

export const PATHS_FILTERABLE_FIELDS = [
  "domainId",
  "id",
  "kind",
  "method",
] as const satisfies readonly PathsKey[];

export const PATHS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly PathsKey[];

export const PATHS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IPaths> = {
  searchableFields: [...PATHS_SEARCHABLE_FIELDS],
  filterFields: [...PATHS_FILTERABLE_FIELDS],
  dateRangeFields: [...PATHS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PATHS_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "domainId",
  "id",
  "kind",
  "method",
  "note",
  "path",
  "updatedAt",
  "version",
] as const satisfies readonly PathsKey[];

export const PATHS_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "domainId",
  "id",
  "kind",
  "method",
  "note",
  "path",
  "updatedAt",
  "version",
] as const satisfies readonly PathsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PATHS_EDITABLE_FIELDS = [
  "code",
  "domainId",
  "kind",
  "method",
  "note",
  "path",
] as const satisfies readonly PathsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PATHS_AS_ONE_RELATION_CONFIG = {
  relation: "paths",
  type: ERelationType.One,
  selectableFields: PATHS_SELECTABLE_FIELDS,
  defaultSelectFields: PATHS_DEFAULT_SELECT_FIELDS,
} as const satisfies IPathsAsOneRelationConfig;

export const PATHS_AS_MANY_RELATION_CONFIG = {
  relation: "paths",
  type: ERelationType.Many,
  selectableFields: PATHS_SELECTABLE_FIELDS,
  defaultSelectFields: PATHS_DEFAULT_SELECT_FIELDS,
  sortableFields: PATHS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IPathsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PATHS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<PathsRelationKey>().one(
    () => DomainsConfig.DOMAINS_AS_ONE_RELATION_CONFIG,
    "domain",
  ),
] as const;

export const PATHS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PATHS_QUERY_OPTIONS = {
  searchableFields: PATHS_SEARCHABLE_FIELDS,
  selectableFields: PATHS_SELECTABLE_FIELDS,
  defaultSelectFields: PATHS_DEFAULT_SELECT_FIELDS,
  sortableFields: PATHS_SORTABLE_FIELDS,
  filterFields: PATHS_FILTERABLE_FIELDS,
  dateRangeFields: PATHS_DATE_RANGE_FIELDS,
  relationKeys: PATHS_RELATION_KEYS,
  editableFields: PATHS_EDITABLE_FIELDS,
  asOne: PATHS_AS_ONE_RELATION_CONFIG,
  asMany: PATHS_AS_MANY_RELATION_CONFIG,
  oneRelations: PATHS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PATHS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IPaths,
  PathsSortableField,
  PathsSelectableField,
  PathsFilterableField,
  PathsDateRangeField,
  PathsRelationKey,
  typeof PATHS_ONE_RELATION_QUERY_OPTIONS,
  typeof PATHS_MANY_RELATION_QUERY_OPTIONS
>;
