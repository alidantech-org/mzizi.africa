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
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IDisputes,
  DisputesKey,
  DisputesRelationKey,
  DisputesSortableField,
  DisputesFilterableField,
  DisputesDateRangeField,
  DisputesSelectableField,
  IDisputesAsOneRelationConfig,
  IDisputesAsManyRelationConfig,
} from "./disputes.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const DISPUTES_RELATION_KEYS = [
  "kind",
  "resolutionCitation",
  "status",
] as const satisfies readonly DisputesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const DISPUTES_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "kindId",
  "resolutionCitationId",
  "resolvedOn",
  "statusId",
  "subjectId",
  "subjectTable",
  "summary",
  "updatedAt",
  "version",
] as const satisfies readonly DisputesKey[];

export const DISPUTES_SEARCHABLE_FIELDS = [
  "code",
  "summary",
] as const satisfies readonly DisputesKey[];

export const DISPUTES_FILTERABLE_FIELDS = [
  "id",
  "kindId",
  "resolutionCitationId",
  "statusId",
  "subjectId",
  "subjectTable",
] as const satisfies readonly DisputesKey[];

export const DISPUTES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "resolvedOn",
  "updatedAt",
] as const satisfies readonly DisputesKey[];

export const DISPUTES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IDisputes> = {
  searchableFields: [...DISPUTES_SEARCHABLE_FIELDS],
  filterFields: [...DISPUTES_FILTERABLE_FIELDS],
  dateRangeFields: [...DISPUTES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const DISPUTES_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "kindId",
  "resolutionCitationId",
  "resolvedOn",
  "statusId",
  "subjectId",
  "subjectTable",
  "summary",
  "updatedAt",
  "version",
] as const satisfies readonly DisputesKey[];

export const DISPUTES_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "id",
  "kindId",
  "resolutionCitationId",
  "resolvedOn",
  "statusId",
  "subjectId",
  "subjectTable",
  "summary",
  "updatedAt",
  "version",
] as const satisfies readonly DisputesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const DISPUTES_EDITABLE_FIELDS = [
  "code",
  "kindId",
  "resolutionCitationId",
  "resolvedOn",
  "statusId",
  "subjectId",
  "subjectTable",
  "summary",
] as const satisfies readonly DisputesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const DISPUTES_AS_ONE_RELATION_CONFIG = {
  relation: "disputes",
  type: ERelationType.One,
  selectableFields: DISPUTES_SELECTABLE_FIELDS,
  defaultSelectFields: DISPUTES_DEFAULT_SELECT_FIELDS,
} as const satisfies IDisputesAsOneRelationConfig;

export const DISPUTES_AS_MANY_RELATION_CONFIG = {
  relation: "disputes",
  type: ERelationType.Many,
  selectableFields: DISPUTES_SELECTABLE_FIELDS,
  defaultSelectFields: DISPUTES_DEFAULT_SELECT_FIELDS,
  sortableFields: DISPUTES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IDisputesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const DISPUTES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<DisputesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "kind",
  ),
  Q.createRelationKeyMapper<DisputesRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "resolutionCitation",
  ),
  Q.createRelationKeyMapper<DisputesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "status",
  ),
] as const;

export const DISPUTES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const DISPUTES_QUERY_OPTIONS = {
  searchableFields: DISPUTES_SEARCHABLE_FIELDS,
  selectableFields: DISPUTES_SELECTABLE_FIELDS,
  defaultSelectFields: DISPUTES_DEFAULT_SELECT_FIELDS,
  sortableFields: DISPUTES_SORTABLE_FIELDS,
  filterFields: DISPUTES_FILTERABLE_FIELDS,
  dateRangeFields: DISPUTES_DATE_RANGE_FIELDS,
  relationKeys: DISPUTES_RELATION_KEYS,
  editableFields: DISPUTES_EDITABLE_FIELDS,
  asOne: DISPUTES_AS_ONE_RELATION_CONFIG,
  asMany: DISPUTES_AS_MANY_RELATION_CONFIG,
  oneRelations: DISPUTES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: DISPUTES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IDisputes,
  DisputesSortableField,
  DisputesSelectableField,
  DisputesFilterableField,
  DisputesDateRangeField,
  DisputesRelationKey,
  typeof DISPUTES_ONE_RELATION_QUERY_OPTIONS,
  typeof DISPUTES_MANY_RELATION_QUERY_OPTIONS
>;
