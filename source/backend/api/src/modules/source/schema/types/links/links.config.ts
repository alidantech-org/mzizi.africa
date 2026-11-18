// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as SlugsConfig from "#/modules/source/schema/types/slugs/slugs.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ILinks,
  LinksKey,
  LinksRelationKey,
  LinksSortableField,
  LinksFilterableField,
  LinksDateRangeField,
  LinksSelectableField,
  ILinksAsOneRelationConfig,
  ILinksAsManyRelationConfig,
} from "./links.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const LINKS_RELATION_KEYS = [
  "fromSlug",
  "relationKind",
  "toSlug",
] as const satisfies readonly LinksKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const LINKS_SORTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "fromSlugId",
  "fromToPrecision",
  "fromYear",
  "id",
  "relationKindId",
  "toSlugId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly LinksKey[];

export const LINKS_SEARCHABLE_FIELDS = [] as const satisfies readonly LinksKey[];

export const LINKS_FILTERABLE_FIELDS = [
  "fromSlugId",
  "fromToPrecision",
  "id",
  "relationKindId",
  "toSlugId",
] as const satisfies readonly LinksKey[];

export const LINKS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly LinksKey[];

export const LINKS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<ILinks> = {
  searchableFields: [...LINKS_SEARCHABLE_FIELDS],
  filterFields: [...LINKS_FILTERABLE_FIELDS],
  dateRangeFields: [...LINKS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const LINKS_SELECTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "fromSlugId",
  "fromToPrecision",
  "fromYear",
  "id",
  "relationKindId",
  "toSlugId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly LinksKey[];

export const LINKS_DEFAULT_SELECT_FIELDS = [
  "createdAt",
  "deletedAt",
  "fromSlugId",
  "fromToPrecision",
  "fromYear",
  "id",
  "relationKindId",
  "toSlugId",
  "toYear",
  "updatedAt",
  "version",
] as const satisfies readonly LinksSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const LINKS_EDITABLE_FIELDS = [
  "fromSlugId",
  "fromToPrecision",
  "fromYear",
  "relationKindId",
  "toSlugId",
  "toYear",
] as const satisfies readonly LinksKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const LINKS_AS_ONE_RELATION_CONFIG = {
  relation: "links",
  type: ERelationType.One,
  selectableFields: LINKS_SELECTABLE_FIELDS,
  defaultSelectFields: LINKS_DEFAULT_SELECT_FIELDS,
} as const satisfies ILinksAsOneRelationConfig;

export const LINKS_AS_MANY_RELATION_CONFIG = {
  relation: "links",
  type: ERelationType.Many,
  selectableFields: LINKS_SELECTABLE_FIELDS,
  defaultSelectFields: LINKS_DEFAULT_SELECT_FIELDS,
  sortableFields: LINKS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies ILinksAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const LINKS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<LinksRelationKey>().one(
    () => SlugsConfig.SLUGS_AS_ONE_RELATION_CONFIG,
    "fromSlug",
  ),
  Q.createRelationKeyMapper<LinksRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "relationKind",
  ),
  Q.createRelationKeyMapper<LinksRelationKey>().one(
    () => SlugsConfig.SLUGS_AS_ONE_RELATION_CONFIG,
    "toSlug",
  ),
] as const;

export const LINKS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const LINKS_QUERY_OPTIONS = {
  searchableFields: LINKS_SEARCHABLE_FIELDS,
  selectableFields: LINKS_SELECTABLE_FIELDS,
  defaultSelectFields: LINKS_DEFAULT_SELECT_FIELDS,
  sortableFields: LINKS_SORTABLE_FIELDS,
  filterFields: LINKS_FILTERABLE_FIELDS,
  dateRangeFields: LINKS_DATE_RANGE_FIELDS,
  relationKeys: LINKS_RELATION_KEYS,
  editableFields: LINKS_EDITABLE_FIELDS,
  asOne: LINKS_AS_ONE_RELATION_CONFIG,
  asMany: LINKS_AS_MANY_RELATION_CONFIG,
  oneRelations: LINKS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: LINKS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  ILinks,
  LinksSortableField,
  LinksSelectableField,
  LinksFilterableField,
  LinksDateRangeField,
  LinksRelationKey,
  typeof LINKS_ONE_RELATION_QUERY_OPTIONS,
  typeof LINKS_MANY_RELATION_QUERY_OPTIONS
>;
