// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as HoldersConfig from "#/modules/governance/schema/types/holders/holders.config";
import * as MotionsConfig from "#/modules/governance/schema/types/motions/motions.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";
import * as CitationsConfig from "#/modules/source/schema/types/citations/citations.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IVotes,
  VotesKey,
  VotesRelationKey,
  VotesSortableField,
  VotesFilterableField,
  VotesDateRangeField,
  VotesSelectableField,
  IVotesAsOneRelationConfig,
  IVotesAsManyRelationConfig,
} from "./votes.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const VOTES_RELATION_KEYS = [
  "holder",
  "motion",
  "position",
  "sourceCitation",
] as const satisfies readonly VotesKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const VOTES_SORTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "holderId",
  "id",
  "motionId",
  "positionId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly VotesKey[];

export const VOTES_SEARCHABLE_FIELDS = [] as const satisfies readonly VotesKey[];

export const VOTES_FILTERABLE_FIELDS = [
  "holderId",
  "id",
  "motionId",
  "positionId",
  "sourceCitationId",
] as const satisfies readonly VotesKey[];

export const VOTES_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly VotesKey[];

export const VOTES_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IVotes> = {
  searchableFields: [...VOTES_SEARCHABLE_FIELDS],
  filterFields: [...VOTES_FILTERABLE_FIELDS],
  dateRangeFields: [...VOTES_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const VOTES_SELECTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "holderId",
  "id",
  "motionId",
  "positionId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly VotesKey[];

export const VOTES_DEFAULT_SELECT_FIELDS = [
  "createdAt",
  "deletedAt",
  "holderId",
  "id",
  "motionId",
  "positionId",
  "sourceCitationId",
  "updatedAt",
  "version",
] as const satisfies readonly VotesSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const VOTES_EDITABLE_FIELDS = [
  "holderId",
  "motionId",
  "positionId",
  "sourceCitationId",
] as const satisfies readonly VotesKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const VOTES_AS_ONE_RELATION_CONFIG = {
  relation: "votes",
  type: ERelationType.One,
  selectableFields: VOTES_SELECTABLE_FIELDS,
  defaultSelectFields: VOTES_DEFAULT_SELECT_FIELDS,
} as const satisfies IVotesAsOneRelationConfig;

export const VOTES_AS_MANY_RELATION_CONFIG = {
  relation: "votes",
  type: ERelationType.Many,
  selectableFields: VOTES_SELECTABLE_FIELDS,
  defaultSelectFields: VOTES_DEFAULT_SELECT_FIELDS,
  sortableFields: VOTES_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IVotesAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const VOTES_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<VotesRelationKey>().one(
    () => HoldersConfig.HOLDERS_AS_ONE_RELATION_CONFIG,
    "holder",
  ),
  Q.createRelationKeyMapper<VotesRelationKey>().one(
    () => MotionsConfig.MOTIONS_AS_ONE_RELATION_CONFIG,
    "motion",
  ),
  Q.createRelationKeyMapper<VotesRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "position",
  ),
  Q.createRelationKeyMapper<VotesRelationKey>().one(
    () => CitationsConfig.CITATIONS_AS_ONE_RELATION_CONFIG,
    "sourceCitation",
  ),
] as const;

export const VOTES_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const VOTES_QUERY_OPTIONS = {
  searchableFields: VOTES_SEARCHABLE_FIELDS,
  selectableFields: VOTES_SELECTABLE_FIELDS,
  defaultSelectFields: VOTES_DEFAULT_SELECT_FIELDS,
  sortableFields: VOTES_SORTABLE_FIELDS,
  filterFields: VOTES_FILTERABLE_FIELDS,
  dateRangeFields: VOTES_DATE_RANGE_FIELDS,
  relationKeys: VOTES_RELATION_KEYS,
  editableFields: VOTES_EDITABLE_FIELDS,
  asOne: VOTES_AS_ONE_RELATION_CONFIG,
  asMany: VOTES_AS_MANY_RELATION_CONFIG,
  oneRelations: VOTES_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: VOTES_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IVotes,
  VotesSortableField,
  VotesSelectableField,
  VotesFilterableField,
  VotesDateRangeField,
  VotesRelationKey,
  typeof VOTES_ONE_RELATION_QUERY_OPTIONS,
  typeof VOTES_MANY_RELATION_QUERY_OPTIONS
>;
