// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as HoldersTypes from "#/modules/governance/schema/types/holders/holders.types";
import type * as IndividualsTypes from "#/modules/official/schema/types/individuals/individuals.types";
import type * as OccurrencesTypes from "#/modules/event/schema/types/occurrences/occurrences.types";
import type * as OfficesTypes from "#/modules/governance/schema/types/offices/offices.types";
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";
import type * as SittingsTypes from "#/modules/governance/schema/types/sittings/sittings.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";
import type * as SpeechesTypes from "#/modules/governance/schema/types/speeches/speeches.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as TopicTypes from "#/modules/reference/schema/types/topic/topic.types";
import type * as UnitTypes from "#/modules/reference/schema/types/unit/unit.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PROMISES_RELATION_KEYS,
  PROMISES_SORTABLE_FIELDS,
  PROMISES_SEARCHABLE_FIELDS,
  PROMISES_FILTERABLE_FIELDS,
  PROMISES_DATE_RANGE_FIELDS,
  PROMISES_SELECTABLE_FIELDS,
  PROMISES_DEFAULT_SELECT_FIELDS,
  PROMISES_EDITABLE_FIELDS,
} from "./promises.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Something a leader said they would do, with where and when, what was promised and its checked status. 'No record found' is a status backed by source coverage, never an empty cell. */
export interface IPromises extends B.IBase {
  code: string;
  dueOn: Date | null;
  madeOn: Date;
  makerHolderId: string | null;
  makerIndividualId: string | null;
  occurrenceId: string | null;
  officeId: string | null;
  placeFeatureId: string | null;
  quantity: number | null;
  sittingId: string | null;
  sourceCitationId: string | null;
  speechId: string | null;
  statement: string;
  statusAsOf: Date;
  statusId: string;
  topicId: string | null;
  unitId: string | null;
  readonly makerHolder?: HoldersTypes.IHolders;
  readonly makerIndividual?: IndividualsTypes.IIndividuals;
  readonly occurrence?: OccurrencesTypes.IOccurrences;
  readonly office?: OfficesTypes.IOffices;
  readonly placeFeature?: FeaturesTypes.IFeatures;
  readonly sitting?: SittingsTypes.ISittings;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly speech?: SpeechesTypes.ISpeeches;
  readonly status?: ValueTypes.IValue;
  readonly topic?: TopicTypes.ITopic;
  readonly unit?: UnitTypes.IUnit;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type PromisesKey = keyof IPromises;

export type PromisesRelationKey = (typeof PROMISES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IPromisesReadonlyFields = B.IBaseReadonlyFields;

export type IPromisesContextualFields = never;

export type IPromisesSensitiveFields = never;

export type IPromisesTransitionFields = never;

export type IPromisesImmutableFields =
  | IPromisesReadonlyFields
  | IPromisesContextualFields
  | IPromisesSensitiveFields
  | IPromisesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IPromisesCreatable = Omit<IPromises, IPromisesImmutableFields | PromisesRelationKey>;

export type IPromisesSystemWritable = Omit<IPromises, B.IBaseReadonlyFields | PromisesRelationKey>;

export type IPromisesUpdatable = Partial<
  Omit<IPromises, IPromisesImmutableFields | PromisesRelationKey>
>;

export interface IPromisesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type PromisesSortableField = (typeof PROMISES_SORTABLE_FIELDS)[number];

export type PromisesSearchableField = (typeof PROMISES_SEARCHABLE_FIELDS)[number];

export type PromisesFilterableField = (typeof PROMISES_FILTERABLE_FIELDS)[number];

export type PromisesDateRangeField = (typeof PROMISES_DATE_RANGE_FIELDS)[number];

export type PromisesSelectableField = (typeof PROMISES_SELECTABLE_FIELDS)[number];

export type PromisesDefaultSelectField = (typeof PROMISES_DEFAULT_SELECT_FIELDS)[number];

export type PromisesEditableField = (typeof PROMISES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IPromisesAsOneRelationConfig = Q.IOneRelationConfig<
  "promises",
  PromisesSelectableField
>;

export type IPromisesAsManyRelationConfig = Q.IManyRelationConfig<
  "promises",
  PromisesSelectableField,
  PromisesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IPromisesAsOneRelationQuery = Q.IAsOneRelationQuery<IPromises, PromisesSelectableField>;

export type IPromisesAsManyRelationQuery = Q.IAsManyRelationQuery<
  IPromises,
  PromisesSelectableField,
  PromisesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IPromisesRelationMap extends Record<PromisesRelationKey, unknown> {
  makerHolder: HoldersTypes.IHoldersAsOneRelationQuery;
  makerIndividual: IndividualsTypes.IIndividualsAsOneRelationQuery;
  occurrence: OccurrencesTypes.IOccurrencesAsOneRelationQuery;
  office: OfficesTypes.IOfficesAsOneRelationQuery;
  placeFeature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  sitting: SittingsTypes.ISittingsAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  speech: SpeechesTypes.ISpeechesAsOneRelationQuery;
  status: ValueTypes.IValueAsOneRelationQuery;
  topic: TopicTypes.ITopicAsOneRelationQuery;
  unit: UnitTypes.IUnitAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IPromisesRelationQueries = Q.IBaseRelationQueries<
  IPromises,
  PromisesRelationKey,
  IPromisesRelationMap
>;

export type IPromisesItemQuery = Q.IBaseItemQuery<
  IPromises,
  PromisesRelationKey,
  PromisesSelectableField,
  PromisesRelationKey,
  PromisesSelectableField,
  IPromisesRelationMap,
  IPromisesRelationQueries
>;

export type IPromisesListQuery = Q.IBaseListQuery<
  IPromises,
  PromisesRelationKey,
  PromisesSelectableField,
  PromisesSortableField,
  PromisesRelationKey,
  PromisesSelectableField,
  PromisesSortableField,
  PromisesDateRangeField,
  PromisesFilterableField,
  IPromisesRelationMap,
  IPromisesRelationQueries,
  IPromisesItemQuery
>;
