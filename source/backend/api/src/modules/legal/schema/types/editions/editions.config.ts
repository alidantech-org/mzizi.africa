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
  IEditions,
  EditionsKey,
  EditionsRelationKey,
  EditionsSortableField,
  EditionsFilterableField,
  EditionsDateRangeField,
  EditionsSelectableField,
  IEditionsAsOneRelationConfig,
  IEditionsAsManyRelationConfig,
} from "./editions.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const EDITIONS_RELATION_KEYS = [
  "instrument",
  "supersedes",
] as const satisfies readonly EditionsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const EDITIONS_SORTABLE_FIELDS = [
  "ceasedOn",
  "code",
  "commencedOn",
  "consolidatedOn",
  "createdAt",
  "deletedAt",
  "designation",
  "id",
  "instrumentId",
  "observedAt",
  "repealedOn",
  "supersedesId",
  "updatedAt",
  "version",
] as const satisfies readonly EditionsKey[];

export const EDITIONS_SEARCHABLE_FIELDS = [
  "code",
  "designation",
] as const satisfies readonly EditionsKey[];

export const EDITIONS_FILTERABLE_FIELDS = [
  "id",
  "instrumentId",
  "supersedesId",
] as const satisfies readonly EditionsKey[];

export const EDITIONS_DATE_RANGE_FIELDS = [
  "ceasedOn",
  "commencedOn",
  "consolidatedOn",
  "createdAt",
  "deletedAt",
  "observedAt",
  "repealedOn",
  "updatedAt",
] as const satisfies readonly EditionsKey[];

export const EDITIONS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IEditions> = {
  searchableFields: [...EDITIONS_SEARCHABLE_FIELDS],
  filterFields: [...EDITIONS_FILTERABLE_FIELDS],
  dateRangeFields: [...EDITIONS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const EDITIONS_SELECTABLE_FIELDS = [
  "ceasedOn",
  "code",
  "commencedOn",
  "consolidatedOn",
  "createdAt",
  "deletedAt",
  "designation",
  "id",
  "instrumentId",
  "observedAt",
  "repealedOn",
  "supersedesId",
  "updatedAt",
  "version",
] as const satisfies readonly EditionsKey[];

export const EDITIONS_DEFAULT_SELECT_FIELDS = [
  "ceasedOn",
  "code",
  "commencedOn",
  "consolidatedOn",
  "createdAt",
  "deletedAt",
  "designation",
  "id",
  "instrumentId",
  "observedAt",
  "repealedOn",
  "supersedesId",
  "updatedAt",
  "version",
] as const satisfies readonly EditionsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const EDITIONS_EDITABLE_FIELDS = [
  "ceasedOn",
  "code",
  "commencedOn",
  "consolidatedOn",
  "designation",
  "instrumentId",
  "observedAt",
  "repealedOn",
  "supersedesId",
] as const satisfies readonly EditionsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const EDITIONS_AS_ONE_RELATION_CONFIG = {
  relation: "editions",
  type: ERelationType.One,
  selectableFields: EDITIONS_SELECTABLE_FIELDS,
  defaultSelectFields: EDITIONS_DEFAULT_SELECT_FIELDS,
} as const satisfies IEditionsAsOneRelationConfig;

export const EDITIONS_AS_MANY_RELATION_CONFIG = {
  relation: "editions",
  type: ERelationType.Many,
  selectableFields: EDITIONS_SELECTABLE_FIELDS,
  defaultSelectFields: EDITIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: EDITIONS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IEditionsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const EDITIONS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<EditionsRelationKey>().one(
    () => InstrumentsConfig.INSTRUMENTS_AS_ONE_RELATION_CONFIG,
    "instrument",
  ),
] as const;

export const EDITIONS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const EDITIONS_QUERY_OPTIONS = {
  searchableFields: EDITIONS_SEARCHABLE_FIELDS,
  selectableFields: EDITIONS_SELECTABLE_FIELDS,
  defaultSelectFields: EDITIONS_DEFAULT_SELECT_FIELDS,
  sortableFields: EDITIONS_SORTABLE_FIELDS,
  filterFields: EDITIONS_FILTERABLE_FIELDS,
  dateRangeFields: EDITIONS_DATE_RANGE_FIELDS,
  relationKeys: EDITIONS_RELATION_KEYS,
  editableFields: EDITIONS_EDITABLE_FIELDS,
  asOne: EDITIONS_AS_ONE_RELATION_CONFIG,
  asMany: EDITIONS_AS_MANY_RELATION_CONFIG,
  oneRelations: EDITIONS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: EDITIONS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IEditions,
  EditionsSortableField,
  EditionsSelectableField,
  EditionsFilterableField,
  EditionsDateRangeField,
  EditionsRelationKey,
  typeof EDITIONS_ONE_RELATION_QUERY_OPTIONS,
  typeof EDITIONS_MANY_RELATION_QUERY_OPTIONS
>;
