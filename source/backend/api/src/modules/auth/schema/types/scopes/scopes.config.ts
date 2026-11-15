// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IScopes,
  ScopesKey,
  ScopesRelationKey,
  ScopesSortableField,
  ScopesFilterableField,
  ScopesDateRangeField,
  ScopesSelectableField,
  IScopesAsOneRelationConfig,
  IScopesAsManyRelationConfig,
} from "./scopes.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SCOPES_RELATION_KEYS = [] as const satisfies readonly ScopesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SCOPES_SORTABLE_FIELDS = [
  "countryRefId",
  "createdAt",
  "datasetRefId",
  "fieldGroup",
  "geographicUnitRefId",
  "id",
  "includeDescendants",
  "institutionRefId",
  "isGlobal",
  "scopeHash",
] as const satisfies readonly ScopesKey[];

export const SCOPES_SEARCHABLE_FIELDS = [
  "fieldGroup",
  "scopeHash",
] as const satisfies readonly ScopesKey[];

export const SCOPES_FILTERABLE_FIELDS = [
  "countryRefId",
  "datasetRefId",
  "geographicUnitRefId",
  "id",
  "includeDescendants",
  "institutionRefId",
  "isGlobal",
] as const satisfies readonly ScopesKey[];

export const SCOPES_DATE_RANGE_FIELDS = ["createdAt"] as const satisfies readonly ScopesKey[];

export const SCOPES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IScopes> = {
  searchableFields: [...SCOPES_SEARCHABLE_FIELDS],
  filterFields: [...SCOPES_FILTERABLE_FIELDS],
  dateRangeFields: [...SCOPES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SCOPES_SELECTABLE_FIELDS = [
  "countryRefId",
  "createdAt",
  "datasetRefId",
  "fieldGroup",
  "geographicUnitRefId",
  "id",
  "includeDescendants",
  "institutionRefId",
  "isGlobal",
  "scopeHash",
] as const satisfies readonly ScopesKey[];

export const SCOPES_DEFAULT_SELECT_FIELDS = [
  "countryRefId",
  "createdAt",
  "datasetRefId",
  "fieldGroup",
  "geographicUnitRefId",
  "id",
  "includeDescendants",
  "institutionRefId",
  "isGlobal",
  "scopeHash",
] as const satisfies readonly ScopesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SCOPES_EDITABLE_FIELDS = [
  "countryRefId",
  "datasetRefId",
  "fieldGroup",
  "geographicUnitRefId",
  "includeDescendants",
  "institutionRefId",
  "isGlobal",
  "scopeHash",
] as const satisfies readonly ScopesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SCOPES_AS_ONE_RELATION_CONFIG = {
  relation: "scopes",
  type: ERelationType.One,
  selectableFields: SCOPES_SELECTABLE_FIELDS,
  defaultSelectFields: SCOPES_DEFAULT_SELECT_FIELDS,
} as const satisfies IScopesAsOneRelationConfig;

export const SCOPES_AS_MANY_RELATION_CONFIG = {
  relation: "scopes",
  type: ERelationType.Many,
  selectableFields: SCOPES_SELECTABLE_FIELDS,
  defaultSelectFields: SCOPES_DEFAULT_SELECT_FIELDS,
  sortableFields: SCOPES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IScopesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SCOPES_ONE_RELATION_QUERY_OPTIONS = [] as const;

export const SCOPES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SCOPES_QUERY_OPTIONS = {
  searchableFields: SCOPES_SEARCHABLE_FIELDS,
  selectableFields: SCOPES_SELECTABLE_FIELDS,
  defaultSelectFields: SCOPES_DEFAULT_SELECT_FIELDS,
  sortableFields: SCOPES_SORTABLE_FIELDS,
  filterFields: SCOPES_FILTERABLE_FIELDS,
  dateRangeFields: SCOPES_DATE_RANGE_FIELDS,
  relationKeys: SCOPES_RELATION_KEYS,
  editableFields: SCOPES_EDITABLE_FIELDS,
  asOne: SCOPES_AS_ONE_RELATION_CONFIG,
  asMany: SCOPES_AS_MANY_RELATION_CONFIG,
  oneRelations: SCOPES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SCOPES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IScopes,
  ScopesSortableField,
  ScopesSelectableField,
  ScopesFilterableField,
  ScopesDateRangeField,
  ScopesRelationKey,
  typeof SCOPES_ONE_RELATION_QUERY_OPTIONS,
  typeof SCOPES_MANY_RELATION_QUERY_OPTIONS
>;
