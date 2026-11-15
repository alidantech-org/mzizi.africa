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
  IFolders,
  FoldersKey,
  FoldersRelationKey,
  FoldersSortableField,
  FoldersFilterableField,
  FoldersDateRangeField,
  FoldersSelectableField,
  IFoldersAsOneRelationConfig,
  IFoldersAsManyRelationConfig,
} from "./folders.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const FOLDERS_RELATION_KEYS = ["parent", "role"] as const satisfies readonly FoldersKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const FOLDERS_SORTABLE_FIELDS = [
  "access",
  "authorization",
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "name",
  "parentId",
  "roleId",
  "updatedAt",
  "version",
] as const satisfies readonly FoldersKey[];

export const FOLDERS_SEARCHABLE_FIELDS = ["code", "name"] as const satisfies readonly FoldersKey[];

export const FOLDERS_FILTERABLE_FIELDS = [
  "access",
  "id",
  "parentId",
  "roleId",
] as const satisfies readonly FoldersKey[];

export const FOLDERS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly FoldersKey[];

export const FOLDERS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IFolders> = {
  searchableFields: [...FOLDERS_SEARCHABLE_FIELDS],
  filterFields: [...FOLDERS_FILTERABLE_FIELDS],
  dateRangeFields: [...FOLDERS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const FOLDERS_SELECTABLE_FIELDS = [
  "access",
  "authorization",
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "name",
  "parentId",
  "roleId",
  "updatedAt",
  "version",
] as const satisfies readonly FoldersKey[];

export const FOLDERS_DEFAULT_SELECT_FIELDS = [
  "access",
  "authorization",
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "name",
  "parentId",
  "roleId",
  "updatedAt",
  "version",
] as const satisfies readonly FoldersSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const FOLDERS_EDITABLE_FIELDS = [
  "access",
  "authorization",
  "code",
  "name",
  "parentId",
  "roleId",
] as const satisfies readonly FoldersKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const FOLDERS_AS_ONE_RELATION_CONFIG = {
  relation: "folders",
  type: ERelationType.One,
  selectableFields: FOLDERS_SELECTABLE_FIELDS,
  defaultSelectFields: FOLDERS_DEFAULT_SELECT_FIELDS,
} as const satisfies IFoldersAsOneRelationConfig;

export const FOLDERS_AS_MANY_RELATION_CONFIG = {
  relation: "folders",
  type: ERelationType.Many,
  selectableFields: FOLDERS_SELECTABLE_FIELDS,
  defaultSelectFields: FOLDERS_DEFAULT_SELECT_FIELDS,
  sortableFields: FOLDERS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IFoldersAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const FOLDERS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<FoldersRelationKey>().one(
    ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "role",
  ),
] as const;

export const FOLDERS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const FOLDERS_QUERY_OPTIONS = {
  searchableFields: FOLDERS_SEARCHABLE_FIELDS,
  selectableFields: FOLDERS_SELECTABLE_FIELDS,
  defaultSelectFields: FOLDERS_DEFAULT_SELECT_FIELDS,
  sortableFields: FOLDERS_SORTABLE_FIELDS,
  filterFields: FOLDERS_FILTERABLE_FIELDS,
  dateRangeFields: FOLDERS_DATE_RANGE_FIELDS,
  relationKeys: FOLDERS_RELATION_KEYS,
  editableFields: FOLDERS_EDITABLE_FIELDS,
  asOne: FOLDERS_AS_ONE_RELATION_CONFIG,
  asMany: FOLDERS_AS_MANY_RELATION_CONFIG,
  oneRelations: FOLDERS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: FOLDERS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IFolders,
  FoldersSortableField,
  FoldersSelectableField,
  FoldersFilterableField,
  FoldersDateRangeField,
  FoldersRelationKey,
  typeof FOLDERS_ONE_RELATION_QUERY_OPTIONS,
  typeof FOLDERS_MANY_RELATION_QUERY_OPTIONS
>;
