// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as EntitiesConfig from "#/modules/official/schema/types/entities/entities.config";
import * as IndividualsConfig from "#/modules/official/schema/types/individuals/individuals.config";
import * as OccurrencesConfig from "#/modules/event/schema/types/occurrences/occurrences.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IParticipants,
  ParticipantsKey,
  ParticipantsRelationKey,
  ParticipantsSortableField,
  ParticipantsFilterableField,
  ParticipantsDateRangeField,
  ParticipantsSelectableField,
  IParticipantsAsOneRelationConfig,
  IParticipantsAsManyRelationConfig,
} from "./participants.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PARTICIPANTS_RELATION_KEYS = [
  "entity",
  "individual",
  "occurrence",
  "role",
] as const satisfies readonly ParticipantsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PARTICIPANTS_SORTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "entityId",
  "id",
  "individualId",
  "occurrenceId",
  "roleId",
  "updatedAt",
  "version",
] as const satisfies readonly ParticipantsKey[];

export const PARTICIPANTS_SEARCHABLE_FIELDS = [] as const satisfies readonly ParticipantsKey[];

export const PARTICIPANTS_FILTERABLE_FIELDS = [
  "entityId",
  "id",
  "individualId",
  "occurrenceId",
  "roleId",
] as const satisfies readonly ParticipantsKey[];

export const PARTICIPANTS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly ParticipantsKey[];

export const PARTICIPANTS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<IParticipants> = {
  searchableFields: [...PARTICIPANTS_SEARCHABLE_FIELDS],
  filterFields: [...PARTICIPANTS_FILTERABLE_FIELDS],
  dateRangeFields: [...PARTICIPANTS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PARTICIPANTS_SELECTABLE_FIELDS = [
  "createdAt",
  "deletedAt",
  "entityId",
  "id",
  "individualId",
  "occurrenceId",
  "roleId",
  "updatedAt",
  "version",
] as const satisfies readonly ParticipantsKey[];

export const PARTICIPANTS_DEFAULT_SELECT_FIELDS = [
  "createdAt",
  "deletedAt",
  "entityId",
  "id",
  "individualId",
  "occurrenceId",
  "roleId",
  "updatedAt",
  "version",
] as const satisfies readonly ParticipantsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PARTICIPANTS_EDITABLE_FIELDS = [
  "entityId",
  "individualId",
  "occurrenceId",
  "roleId",
] as const satisfies readonly ParticipantsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PARTICIPANTS_AS_ONE_RELATION_CONFIG = {
  relation: "participants",
  type: ERelationType.One,
  selectableFields: PARTICIPANTS_SELECTABLE_FIELDS,
  defaultSelectFields: PARTICIPANTS_DEFAULT_SELECT_FIELDS,
} as const satisfies IParticipantsAsOneRelationConfig;

export const PARTICIPANTS_AS_MANY_RELATION_CONFIG = {
  relation: "participants",
  type: ERelationType.Many,
  selectableFields: PARTICIPANTS_SELECTABLE_FIELDS,
  defaultSelectFields: PARTICIPANTS_DEFAULT_SELECT_FIELDS,
  sortableFields: PARTICIPANTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies IParticipantsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PARTICIPANTS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ParticipantsRelationKey>().one(
    () => EntitiesConfig.ENTITIES_AS_ONE_RELATION_CONFIG,
    "entity",
  ),
  Q.createRelationKeyMapper<ParticipantsRelationKey>().one(
    () => IndividualsConfig.INDIVIDUALS_AS_ONE_RELATION_CONFIG,
    "individual",
  ),
  Q.createRelationKeyMapper<ParticipantsRelationKey>().one(
    () => OccurrencesConfig.OCCURRENCES_AS_ONE_RELATION_CONFIG,
    "occurrence",
  ),
  Q.createRelationKeyMapper<ParticipantsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "role",
  ),
] as const;

export const PARTICIPANTS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PARTICIPANTS_QUERY_OPTIONS = {
  searchableFields: PARTICIPANTS_SEARCHABLE_FIELDS,
  selectableFields: PARTICIPANTS_SELECTABLE_FIELDS,
  defaultSelectFields: PARTICIPANTS_DEFAULT_SELECT_FIELDS,
  sortableFields: PARTICIPANTS_SORTABLE_FIELDS,
  filterFields: PARTICIPANTS_FILTERABLE_FIELDS,
  dateRangeFields: PARTICIPANTS_DATE_RANGE_FIELDS,
  relationKeys: PARTICIPANTS_RELATION_KEYS,
  editableFields: PARTICIPANTS_EDITABLE_FIELDS,
  asOne: PARTICIPANTS_AS_ONE_RELATION_CONFIG,
  asMany: PARTICIPANTS_AS_MANY_RELATION_CONFIG,
  oneRelations: PARTICIPANTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PARTICIPANTS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  IParticipants,
  ParticipantsSortableField,
  ParticipantsSelectableField,
  ParticipantsFilterableField,
  ParticipantsDateRangeField,
  ParticipantsRelationKey,
  typeof PARTICIPANTS_ONE_RELATION_QUERY_OPTIONS,
  typeof PARTICIPANTS_MANY_RELATION_QUERY_OPTIONS
>;
