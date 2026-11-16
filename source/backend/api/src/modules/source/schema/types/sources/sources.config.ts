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
import * as EntitiesConfig from "#/modules/official/schema/types/entities/entities.config";
import * as PublishersConfig from "#/modules/source/schema/types/publishers/publishers.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ISources,
  SourcesKey,
  SourcesRelationKey,
  SourcesSortableField,
  SourcesFilterableField,
  SourcesDateRangeField,
  SourcesSelectableField,
  ISourcesAsOneRelationConfig,
  ISourcesAsManyRelationConfig,
} from "./sources.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SOURCES_RELATION_KEYS = [
  "kind",
  "officialEntity",
  "publisher",
] as const satisfies readonly SourcesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SOURCES_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "description",
  "id",
  "kindId",
  "officialEntityId",
  "publisherId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly SourcesKey[];

export const SOURCES_SEARCHABLE_FIELDS = [
  "code",
  "description",
  "title",
] as const satisfies readonly SourcesKey[];

export const SOURCES_FILTERABLE_FIELDS = [
  "id",
  "kindId",
  "officialEntityId",
  "publisherId",
] as const satisfies readonly SourcesKey[];

export const SOURCES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly SourcesKey[];

export const SOURCES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<ISources> = {
  searchableFields: [...SOURCES_SEARCHABLE_FIELDS],
  filterFields: [...SOURCES_FILTERABLE_FIELDS],
  dateRangeFields: [...SOURCES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SOURCES_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "description",
  "id",
  "kindId",
  "officialEntityId",
  "publisherId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly SourcesKey[];

export const SOURCES_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "description",
  "id",
  "kindId",
  "officialEntityId",
  "publisherId",
  "title",
  "updatedAt",
  "version",
] as const satisfies readonly SourcesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SOURCES_EDITABLE_FIELDS = [
  "code",
  "description",
  "kindId",
  "officialEntityId",
  "publisherId",
  "title",
] as const satisfies readonly SourcesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SOURCES_AS_ONE_RELATION_CONFIG = {
  relation: "sources",
  type: ERelationType.One,
  selectableFields: SOURCES_SELECTABLE_FIELDS,
  defaultSelectFields: SOURCES_DEFAULT_SELECT_FIELDS,
} as const satisfies ISourcesAsOneRelationConfig;

export const SOURCES_AS_MANY_RELATION_CONFIG = {
  relation: "sources",
  type: ERelationType.Many,
  selectableFields: SOURCES_SELECTABLE_FIELDS,
  defaultSelectFields: SOURCES_DEFAULT_SELECT_FIELDS,
  sortableFields: SOURCES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies ISourcesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SOURCES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<SourcesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "kind",
  ),
  Q.createRelationKeyMapper<SourcesRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "officialEntity",
  ),
  Q.createRelationKeyMapper<SourcesRelationKey>().one(
    () => PublishersConfig.PUBLISHERS_AS_ONE_RELATION_CONFIG,
    "publisher",
  ),
] as const;

export const SOURCES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SOURCES_QUERY_OPTIONS = {
  searchableFields: SOURCES_SEARCHABLE_FIELDS,
  selectableFields: SOURCES_SELECTABLE_FIELDS,
  defaultSelectFields: SOURCES_DEFAULT_SELECT_FIELDS,
  sortableFields: SOURCES_SORTABLE_FIELDS,
  filterFields: SOURCES_FILTERABLE_FIELDS,
  dateRangeFields: SOURCES_DATE_RANGE_FIELDS,
  relationKeys: SOURCES_RELATION_KEYS,
  editableFields: SOURCES_EDITABLE_FIELDS,
  asOne: SOURCES_AS_ONE_RELATION_CONFIG,
  asMany: SOURCES_AS_MANY_RELATION_CONFIG,
  oneRelations: SOURCES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SOURCES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  ISources,
  SourcesSortableField,
  SourcesSelectableField,
  SourcesFilterableField,
  SourcesDateRangeField,
  SourcesRelationKey,
  typeof SOURCES_ONE_RELATION_QUERY_OPTIONS,
  typeof SOURCES_MANY_RELATION_QUERY_OPTIONS
>;
