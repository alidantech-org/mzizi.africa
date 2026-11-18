// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";
import type { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as EventsTypes from "#/modules/event/schema/types/events/events.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SUBJECTS_RELATION_KEYS,
  SUBJECTS_SORTABLE_FIELDS,
  SUBJECTS_SEARCHABLE_FIELDS,
  SUBJECTS_FILTERABLE_FIELDS,
  SUBJECTS_DATE_RANGE_FIELDS,
  SUBJECTS_SELECTABLE_FIELDS,
  SUBJECTS_DEFAULT_SELECT_FIELDS,
  SUBJECTS_EDITABLE_FIELDS,
} from "./subjects.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** What an event is about or belongs to: an election, an institution, a person, a facility, a bill. An election's registration and nomination dates are events attached to it here. */
export interface ISubjects extends B.IBase {
  code: string;
  eventId: string;
  roleId: string;
  subjectId: string;
  subjectTable: SubjectTable;
  readonly event?: EventsTypes.IEvents;
  readonly role?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SubjectsKey = keyof ISubjects;

export type SubjectsRelationKey = (typeof SUBJECTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISubjectsReadonlyFields = B.IBaseReadonlyFields;

export type ISubjectsContextualFields = never;

export type ISubjectsSensitiveFields = never;

export type ISubjectsTransitionFields = never;

export type ISubjectsImmutableFields =
  | ISubjectsReadonlyFields
  | ISubjectsContextualFields
  | ISubjectsSensitiveFields
  | ISubjectsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISubjectsCreatable = Omit<ISubjects, ISubjectsImmutableFields | SubjectsRelationKey>;

export type ISubjectsSystemWritable = Omit<ISubjects, B.IBaseReadonlyFields | SubjectsRelationKey>;

export type ISubjectsUpdatable = Partial<
  Omit<ISubjects, ISubjectsImmutableFields | SubjectsRelationKey>
>;

export interface ISubjectsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SubjectsSortableField = (typeof SUBJECTS_SORTABLE_FIELDS)[number];

export type SubjectsSearchableField = (typeof SUBJECTS_SEARCHABLE_FIELDS)[number];

export type SubjectsFilterableField = (typeof SUBJECTS_FILTERABLE_FIELDS)[number];

export type SubjectsDateRangeField = (typeof SUBJECTS_DATE_RANGE_FIELDS)[number];

export type SubjectsSelectableField = (typeof SUBJECTS_SELECTABLE_FIELDS)[number];

export type SubjectsDefaultSelectField = (typeof SUBJECTS_DEFAULT_SELECT_FIELDS)[number];

export type SubjectsEditableField = (typeof SUBJECTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISubjectsAsOneRelationConfig = Q.IOneRelationConfig<
  "subjects",
  SubjectsSelectableField
>;

export type ISubjectsAsManyRelationConfig = Q.IManyRelationConfig<
  "subjects",
  SubjectsSelectableField,
  SubjectsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISubjectsAsOneRelationQuery = Q.IAsOneRelationQuery<ISubjects, SubjectsSelectableField>;

export type ISubjectsAsManyRelationQuery = Q.IAsManyRelationQuery<
  ISubjects,
  SubjectsSelectableField,
  SubjectsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISubjectsRelationMap extends Record<SubjectsRelationKey, unknown> {
  event: EventsTypes.IEventsAsOneRelationQuery;
  role: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISubjectsRelationQueries = Q.IBaseRelationQueries<
  ISubjects,
  SubjectsRelationKey,
  ISubjectsRelationMap
>;

export type ISubjectsItemQuery = Q.IBaseItemQuery<
  ISubjects,
  SubjectsRelationKey,
  SubjectsSelectableField,
  SubjectsRelationKey,
  SubjectsSelectableField,
  ISubjectsRelationMap,
  ISubjectsRelationQueries
>;

export type ISubjectsListQuery = Q.IBaseListQuery<
  ISubjects,
  SubjectsRelationKey,
  SubjectsSelectableField,
  SubjectsSortableField,
  SubjectsRelationKey,
  SubjectsSelectableField,
  SubjectsSortableField,
  SubjectsDateRangeField,
  SubjectsFilterableField,
  ISubjectsRelationMap,
  ISubjectsRelationQueries,
  ISubjectsItemQuery
>;
