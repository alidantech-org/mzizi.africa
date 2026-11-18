// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as BillsTypes from "#/modules/governance/schema/types/bills/bills.types";
import type * as MotionsTypes from "#/modules/governance/schema/types/motions/motions.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as SittingsTypes from "#/modules/governance/schema/types/sittings/sittings.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  STAGES_RELATION_KEYS,
  STAGES_SORTABLE_FIELDS,
  STAGES_SEARCHABLE_FIELDS,
  STAGES_FILTERABLE_FIELDS,
  STAGES_DATE_RANGE_FIELDS,
  STAGES_SELECTABLE_FIELDS,
  STAGES_DEFAULT_SELECT_FIELDS,
  STAGES_EDITABLE_FIELDS,
} from "./stages.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One step of a bill's passage in order: a reading, a committee, a vote in the other house, assent, publication. */
export interface IStages extends B.IBase {
  billId: string;
  motionId: string | null;
  onDate: Date | null;
  outcomeId: string | null;
  sequenceNumber: number;
  sittingId: string | null;
  sourceCitationId: string | null;
  stageKindId: string;
  readonly bill?: BillsTypes.IBills;
  readonly motion?: MotionsTypes.IMotions;
  readonly outcome?: ValueTypes.IValue;
  readonly sitting?: SittingsTypes.ISittings;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly stageKind?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type StagesKey = keyof IStages;

export type StagesRelationKey = (typeof STAGES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IStagesReadonlyFields = B.IBaseReadonlyFields;

export type IStagesContextualFields = never;

export type IStagesSensitiveFields = never;

export type IStagesTransitionFields = never;

export type IStagesImmutableFields =
  | IStagesReadonlyFields
  | IStagesContextualFields
  | IStagesSensitiveFields
  | IStagesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IStagesCreatable = Omit<IStages, IStagesImmutableFields | StagesRelationKey>;

export type IStagesSystemWritable = Omit<IStages, B.IBaseReadonlyFields | StagesRelationKey>;

export type IStagesUpdatable = Partial<Omit<IStages, IStagesImmutableFields | StagesRelationKey>>;

export interface IStagesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type StagesSortableField = (typeof STAGES_SORTABLE_FIELDS)[number];

export type StagesSearchableField = (typeof STAGES_SEARCHABLE_FIELDS)[number];

export type StagesFilterableField = (typeof STAGES_FILTERABLE_FIELDS)[number];

export type StagesDateRangeField = (typeof STAGES_DATE_RANGE_FIELDS)[number];

export type StagesSelectableField = (typeof STAGES_SELECTABLE_FIELDS)[number];

export type StagesDefaultSelectField = (typeof STAGES_DEFAULT_SELECT_FIELDS)[number];

export type StagesEditableField = (typeof STAGES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IStagesAsOneRelationConfig = Q.IOneRelationConfig<"stages", StagesSelectableField>;

export type IStagesAsManyRelationConfig = Q.IManyRelationConfig<
  "stages",
  StagesSelectableField,
  StagesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IStagesAsOneRelationQuery = Q.IAsOneRelationQuery<IStages, StagesSelectableField>;

export type IStagesAsManyRelationQuery = Q.IAsManyRelationQuery<
  IStages,
  StagesSelectableField,
  StagesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IStagesRelationMap extends Record<StagesRelationKey, unknown> {
  bill: BillsTypes.IBillsAsOneRelationQuery;
  motion: MotionsTypes.IMotionsAsOneRelationQuery;
  outcome: ValueTypes.IValueAsOneRelationQuery;
  sitting: SittingsTypes.ISittingsAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  stageKind: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IStagesRelationQueries = Q.IBaseRelationQueries<
  IStages,
  StagesRelationKey,
  IStagesRelationMap
>;

export type IStagesItemQuery = Q.IBaseItemQuery<
  IStages,
  StagesRelationKey,
  StagesSelectableField,
  StagesRelationKey,
  StagesSelectableField,
  IStagesRelationMap,
  IStagesRelationQueries
>;

export type IStagesListQuery = Q.IBaseListQuery<
  IStages,
  StagesRelationKey,
  StagesSelectableField,
  StagesSortableField,
  StagesRelationKey,
  StagesSelectableField,
  StagesSortableField,
  StagesDateRangeField,
  StagesFilterableField,
  IStagesRelationMap,
  IStagesRelationQueries,
  IStagesItemQuery
>;
