// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import type { IBuildWhereConditionsOptions } from "#/database/base/query.types.ts";
import { ERelationType } from "#/modules/common/schema/types/enums";

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as EventsConfig from "#/modules/event/schema/types/events/events.config";
import * as ValueConfig from "#/modules/reference/schema/types/value/value.config";

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  ISubjects,
  SubjectsKey,
  SubjectsRelationKey,
  SubjectsSortableField,
  SubjectsFilterableField,
  SubjectsDateRangeField,
  SubjectsSelectableField,
  ISubjectsAsOneRelationConfig,
  ISubjectsAsManyRelationConfig,
} from "./subjects.types";

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const SUBJECTS_RELATION_KEYS = ["event", "role"] as const satisfies readonly SubjectsKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const SUBJECTS_SORTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "eventId",
  "id",
  "roleId",
  "subjectId",
  "subjectTable",
  "updatedAt",
  "version",
] as const satisfies readonly SubjectsKey[];

export const SUBJECTS_SEARCHABLE_FIELDS = ["code"] as const satisfies readonly SubjectsKey[];

export const SUBJECTS_FILTERABLE_FIELDS = [
  "eventId",
  "id",
  "roleId",
  "subjectId",
  "subjectTable",
] as const satisfies readonly SubjectsKey[];

export const SUBJECTS_DATE_RANGE_FIELDS = [
  "createdAt",
  "deletedAt",
  "updatedAt",
] as const satisfies readonly SubjectsKey[];

export const SUBJECTS_BUILD_WHERE_OPTIONS: IBuildWhereConditionsOptions<ISubjects> = {
  searchableFields: [...SUBJECTS_SEARCHABLE_FIELDS],
  filterFields: [...SUBJECTS_FILTERABLE_FIELDS],
  dateRangeFields: [...SUBJECTS_DATE_RANGE_FIELDS],
};

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const SUBJECTS_SELECTABLE_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "eventId",
  "id",
  "roleId",
  "subjectId",
  "subjectTable",
  "updatedAt",
  "version",
] as const satisfies readonly SubjectsKey[];

export const SUBJECTS_DEFAULT_SELECT_FIELDS = [
  "code",
  "createdAt",
  "deletedAt",
  "eventId",
  "id",
  "roleId",
  "subjectId",
  "subjectTable",
  "updatedAt",
  "version",
] as const satisfies readonly SubjectsSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const SUBJECTS_EDITABLE_FIELDS = [
  "code",
  "eventId",
  "roleId",
  "subjectId",
  "subjectTable",
] as const satisfies readonly SubjectsKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const SUBJECTS_AS_ONE_RELATION_CONFIG = {
  relation: "subjects",
  type: ERelationType.One,
  selectableFields: SUBJECTS_SELECTABLE_FIELDS,
  defaultSelectFields: SUBJECTS_DEFAULT_SELECT_FIELDS,
} as const satisfies ISubjectsAsOneRelationConfig;

export const SUBJECTS_AS_MANY_RELATION_CONFIG = {
  relation: "subjects",
  type: ERelationType.Many,
  selectableFields: SUBJECTS_SELECTABLE_FIELDS,
  defaultSelectFields: SUBJECTS_DEFAULT_SELECT_FIELDS,
  sortableFields: SUBJECTS_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50,
} as const satisfies ISubjectsAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const SUBJECTS_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<SubjectsRelationKey>().one(
    () => EventsConfig.EVENTS_AS_ONE_RELATION_CONFIG,
    "event",
  ),
  Q.createRelationKeyMapper<SubjectsRelationKey>().one(
    () => ValueConfig.VALUE_AS_ONE_RELATION_CONFIG,
    "role",
  ),
] as const;

export const SUBJECTS_MANY_RELATION_QUERY_OPTIONS = [] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const SUBJECTS_QUERY_OPTIONS = {
  searchableFields: SUBJECTS_SEARCHABLE_FIELDS,
  selectableFields: SUBJECTS_SELECTABLE_FIELDS,
  defaultSelectFields: SUBJECTS_DEFAULT_SELECT_FIELDS,
  sortableFields: SUBJECTS_SORTABLE_FIELDS,
  filterFields: SUBJECTS_FILTERABLE_FIELDS,
  dateRangeFields: SUBJECTS_DATE_RANGE_FIELDS,
  relationKeys: SUBJECTS_RELATION_KEYS,
  editableFields: SUBJECTS_EDITABLE_FIELDS,
  asOne: SUBJECTS_AS_ONE_RELATION_CONFIG,
  asMany: SUBJECTS_AS_MANY_RELATION_CONFIG,
  oneRelations: SUBJECTS_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: SUBJECTS_MANY_RELATION_QUERY_OPTIONS,
} as const satisfies Q.IEntityQueryOptions<
  ISubjects,
  SubjectsSortableField,
  SubjectsSelectableField,
  SubjectsFilterableField,
  SubjectsDateRangeField,
  SubjectsRelationKey,
  typeof SUBJECTS_ONE_RELATION_QUERY_OPTIONS,
  typeof SUBJECTS_MANY_RELATION_QUERY_OPTIONS
>;
