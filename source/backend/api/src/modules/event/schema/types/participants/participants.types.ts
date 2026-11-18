// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as IndividualsTypes from "#/modules/official/schema/types/individuals/individuals.types";
import type * as OccurrencesTypes from "#/modules/event/schema/types/occurrences/occurrences.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PARTICIPANTS_RELATION_KEYS,
  PARTICIPANTS_SORTABLE_FIELDS,
  PARTICIPANTS_SEARCHABLE_FIELDS,
  PARTICIPANTS_FILTERABLE_FIELDS,
  PARTICIPANTS_DATE_RANGE_FIELDS,
  PARTICIPANTS_SELECTABLE_FIELDS,
  PARTICIPANTS_DEFAULT_SELECT_FIELDS,
  PARTICIPANTS_EDITABLE_FIELDS,
} from "./participants.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One organisation or person taking part in one occurrence in a role. */
export interface IParticipants extends B.IBase {
  entityId: string | null;
  individualId: string | null;
  occurrenceId: string;
  roleId: string;
  readonly entity?: EntitiesTypes.IEntities;
  readonly individual?: IndividualsTypes.IIndividuals;
  readonly occurrence?: OccurrencesTypes.IOccurrences;
  readonly role?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ParticipantsKey = keyof IParticipants;

export type ParticipantsRelationKey = (typeof PARTICIPANTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IParticipantsReadonlyFields = B.IBaseReadonlyFields;

export type IParticipantsContextualFields = never;

export type IParticipantsSensitiveFields = never;

export type IParticipantsTransitionFields = never;

export type IParticipantsImmutableFields =
  | IParticipantsReadonlyFields
  | IParticipantsContextualFields
  | IParticipantsSensitiveFields
  | IParticipantsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IParticipantsCreatable = Omit<
  IParticipants,
  IParticipantsImmutableFields | ParticipantsRelationKey
>;

export type IParticipantsSystemWritable = Omit<
  IParticipants,
  B.IBaseReadonlyFields | ParticipantsRelationKey
>;

export type IParticipantsUpdatable = Partial<
  Omit<IParticipants, IParticipantsImmutableFields | ParticipantsRelationKey>
>;

export interface IParticipantsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ParticipantsSortableField = (typeof PARTICIPANTS_SORTABLE_FIELDS)[number];

export type ParticipantsSearchableField = (typeof PARTICIPANTS_SEARCHABLE_FIELDS)[number];

export type ParticipantsFilterableField = (typeof PARTICIPANTS_FILTERABLE_FIELDS)[number];

export type ParticipantsDateRangeField = (typeof PARTICIPANTS_DATE_RANGE_FIELDS)[number];

export type ParticipantsSelectableField = (typeof PARTICIPANTS_SELECTABLE_FIELDS)[number];

export type ParticipantsDefaultSelectField = (typeof PARTICIPANTS_DEFAULT_SELECT_FIELDS)[number];

export type ParticipantsEditableField = (typeof PARTICIPANTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IParticipantsAsOneRelationConfig = Q.IOneRelationConfig<
  "participants",
  ParticipantsSelectableField
>;

export type IParticipantsAsManyRelationConfig = Q.IManyRelationConfig<
  "participants",
  ParticipantsSelectableField,
  ParticipantsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IParticipantsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IParticipants,
  ParticipantsSelectableField
>;

export type IParticipantsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IParticipants,
  ParticipantsSelectableField,
  ParticipantsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IParticipantsRelationMap extends Record<ParticipantsRelationKey, unknown> {
  entity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  individual: IndividualsTypes.IIndividualsAsOneRelationQuery;
  occurrence: OccurrencesTypes.IOccurrencesAsOneRelationQuery;
  role: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IParticipantsRelationQueries = Q.IBaseRelationQueries<
  IParticipants,
  ParticipantsRelationKey,
  IParticipantsRelationMap
>;

export type IParticipantsItemQuery = Q.IBaseItemQuery<
  IParticipants,
  ParticipantsRelationKey,
  ParticipantsSelectableField,
  ParticipantsRelationKey,
  ParticipantsSelectableField,
  IParticipantsRelationMap,
  IParticipantsRelationQueries
>;

export type IParticipantsListQuery = Q.IBaseListQuery<
  IParticipants,
  ParticipantsRelationKey,
  ParticipantsSelectableField,
  ParticipantsSortableField,
  ParticipantsRelationKey,
  ParticipantsSelectableField,
  ParticipantsSortableField,
  ParticipantsDateRangeField,
  ParticipantsFilterableField,
  IParticipantsRelationMap,
  IParticipantsRelationQueries,
  IParticipantsItemQuery
>;
