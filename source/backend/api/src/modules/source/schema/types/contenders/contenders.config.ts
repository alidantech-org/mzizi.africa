// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";
import * as DisputesConfig from "#/modules/source/schema/types/disputes/disputes.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IContenders,
  ContendersKey,
  ContendersRelationKey,
  ContendersSortableField,
  ContendersFilterableField,
  ContendersDateRangeField,
  ContendersSelectableField,
  IContendersAsOneRelationConfig,
  IContendersAsManyRelationConfig,
} from "./contenders.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const CONTENDERS_RELATION_KEYS = [
  "citation",
  "dispute",
] as const satisfies readonly ContendersKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const CONTENDERS_SORTABLE_FIELDS = [
  "citationId",
  "claim",
  "createdAt",
  "deletedAt",
  "disputeId",
  "id",
  "isPreferred",
  "position",
  "updatedAt",
  "version",
] as const satisfies readonly ContendersKey[];

export const CONTENDERS_SEARCHABLE_FIELDS = ["claim"] as const satisfies readonly ContendersKey[];

export const CONTENDERS_FILTERABLE_FIELDS = [
  "citationId",
  "disputeId",
  "id",
  "isPreferred",
] as const satisfies readonly ContendersKey[];

export const CONTENDERS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly ContendersKey[];

export const CONTENDERS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IContenders> = {
  searchableFields: [...CONTENDERS_SEARCHABLE_FIELDS],
  filterFields: [...CONTENDERS_FILTERABLE_FIELDS],
  dateRangeFields: [...CONTENDERS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const CONTENDERS_SELECTABLE_FIELDS = [
  "citationId",
  "claim",
  "createdAt",
  "deletedAt",
  "disputeId",
  "id",
  "isPreferred",
  "position",
  "updatedAt",
  "version",
] as const satisfies readonly ContendersKey[];

export const CONTENDERS_DEFAULT_SELECT_FIELDS = [
  "citationId",
  "claim",
  "createdAt",
  "deletedAt",
  "disputeId",
  "id",
  "isPreferred",
  "position",
  "updatedAt",
  "version",
] as const satisfies readonly ContendersSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const CONTENDERS_EDITABLE_FIELDS = [
  "citationId",
  "claim",
  "disputeId",
  "isPreferred",
  "position",
] as const satisfies readonly ContendersKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const CONTENDERS_AS_ONE_RELATION_CONFIG = {
  relation: "contenders",
  type: ERelationType.One,
  selectableFields: CONTENDERS_SELECTABLE_FIELDS,
  defaultSelectFields: CONTENDERS_DEFAULT_SELECT_FIELDS,
} as const satisfies IContendersAsOneRelationConfig;

export const CONTENDERS_AS_MANY_RELATION_CONFIG = {
  relation: "contenders",
  type: ERelationType.Many,
  selectableFields: CONTENDERS_SELECTABLE_FIELDS,
  defaultSelectFields: CONTENDERS_DEFAULT_SELECT_FIELDS,
  sortableFields: CONTENDERS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IContendersAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const CONTENDERS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ContendersRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "citation",
  ),
  Q.createRelationKeyMapper<ContendersRelationKey>().one(
    () => DisputesConfig.DISPUTES_AS_ONE_RELATION_CONFIG,
    "dispute",
  ),
] as const;

export const CONTENDERS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const CONTENDERS_QUERY_OPTIONS = {
  searchableFields: CONTENDERS_SEARCHABLE_FIELDS,
  selectableFields: CONTENDERS_SELECTABLE_FIELDS,
  defaultSelectFields: CONTENDERS_DEFAULT_SELECT_FIELDS,
  sortableFields: CONTENDERS_SORTABLE_FIELDS,
  filterFields: CONTENDERS_FILTERABLE_FIELDS,
  dateRangeFields: CONTENDERS_DATE_RANGE_FIELDS,
  relationKeys: CONTENDERS_RELATION_KEYS,
  editableFields: CONTENDERS_EDITABLE_FIELDS,
  asOne: CONTENDERS_AS_ONE_RELATION_CONFIG,
  asMany: CONTENDERS_AS_MANY_RELATION_CONFIG,
  oneRelations: CONTENDERS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: CONTENDERS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IContenders,
  ContendersSortableField,
  ContendersSelectableField,
  ContendersFilterableField,
  ContendersDateRangeField,
  ContendersRelationKey,
  typeof CONTENDERS_ONE_RELATION_QUERY_OPTIONS,
  typeof CONTENDERS_MANY_RELATION_QUERY_OPTIONS
>;
