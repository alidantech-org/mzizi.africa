// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as BillsTypes from "#/modules/governance/schema/types/bills/bills.types";
import type * as HansardsTypes from "#/modules/governance/schema/types/hansards/hansards.types";
import type * as HoldersTypes from "#/modules/governance/schema/types/holders/holders.types";
import type * as MotionsTypes from "#/modules/governance/schema/types/motions/motions.types";
import type * as SittingsTypes from "#/modules/governance/schema/types/sittings/sittings.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  SPEECHES_RELATION_KEYS,
  SPEECHES_SORTABLE_FIELDS,
  SPEECHES_SEARCHABLE_FIELDS,
  SPEECHES_FILTERABLE_FIELDS,
  SPEECHES_DATE_RANGE_FIELDS,
  SPEECHES_SELECTABLE_FIELDS,
  SPEECHES_DEFAULT_SELECT_FIELDS,
  SPEECHES_EDITABLE_FIELDS,
} from "./speeches.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One member's contribution at a sitting as recorded in the Hansard: a speech, question, answer, statement or ruling. The full text, when stored, is a content row about this speech. */
export interface ISpeeches extends B.IBase {
  billId: string | null;
  code: string;
  hansardId: string | null;
  holderId: string;
  motionId: string | null;
  pageReference: string | null;
  position: number;
  sittingId: string;
  sourceCitationId: string | null;
  speechKindId: string;
  summary: string | null;
  wordCount: number | null;
  readonly bill?: BillsTypes.IBills;
  readonly hansard?: HansardsTypes.IHansards;
  readonly holder?: HoldersTypes.IHolders;
  readonly motion?: MotionsTypes.IMotions;
  readonly sitting?: SittingsTypes.ISittings;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly speechKind?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type SpeechesKey = keyof ISpeeches;

export type SpeechesRelationKey = (typeof SPEECHES_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type ISpeechesReadonlyFields = B.IBaseReadonlyFields;

export type ISpeechesContextualFields = never;

export type ISpeechesSensitiveFields = never;

export type ISpeechesTransitionFields = never;

export type ISpeechesImmutableFields =
  | ISpeechesReadonlyFields
  | ISpeechesContextualFields
  | ISpeechesSensitiveFields
  | ISpeechesTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type ISpeechesCreatable = Omit<ISpeeches, ISpeechesImmutableFields | SpeechesRelationKey>;

export type ISpeechesSystemWritable = Omit<ISpeeches, B.IBaseReadonlyFields | SpeechesRelationKey>;

export type ISpeechesUpdatable = Partial<
  Omit<ISpeeches, ISpeechesImmutableFields | SpeechesRelationKey>
>;

export interface ISpeechesTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type SpeechesSortableField = (typeof SPEECHES_SORTABLE_FIELDS)[number];

export type SpeechesSearchableField = (typeof SPEECHES_SEARCHABLE_FIELDS)[number];

export type SpeechesFilterableField = (typeof SPEECHES_FILTERABLE_FIELDS)[number];

export type SpeechesDateRangeField = (typeof SPEECHES_DATE_RANGE_FIELDS)[number];

export type SpeechesSelectableField = (typeof SPEECHES_SELECTABLE_FIELDS)[number];

export type SpeechesDefaultSelectField = (typeof SPEECHES_DEFAULT_SELECT_FIELDS)[number];

export type SpeechesEditableField = (typeof SPEECHES_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type ISpeechesAsOneRelationConfig = Q.IOneRelationConfig<
  "speeches",
  SpeechesSelectableField
>;

export type ISpeechesAsManyRelationConfig = Q.IManyRelationConfig<
  "speeches",
  SpeechesSelectableField,
  SpeechesSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type ISpeechesAsOneRelationQuery = Q.IAsOneRelationQuery<ISpeeches, SpeechesSelectableField>;

export type ISpeechesAsManyRelationQuery = Q.IAsManyRelationQuery<
  ISpeeches,
  SpeechesSelectableField,
  SpeechesSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface ISpeechesRelationMap extends Record<SpeechesRelationKey, unknown> {
  bill: BillsTypes.IBillsAsOneRelationQuery;
  hansard: HansardsTypes.IHansardsAsOneRelationQuery;
  holder: HoldersTypes.IHoldersAsOneRelationQuery;
  motion: MotionsTypes.IMotionsAsOneRelationQuery;
  sitting: SittingsTypes.ISittingsAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  speechKind: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type ISpeechesRelationQueries = Q.IBaseRelationQueries<
  ISpeeches,
  SpeechesRelationKey,
  ISpeechesRelationMap
>;

export type ISpeechesItemQuery = Q.IBaseItemQuery<
  ISpeeches,
  SpeechesRelationKey,
  SpeechesSelectableField,
  SpeechesRelationKey,
  SpeechesSelectableField,
  ISpeechesRelationMap,
  ISpeechesRelationQueries
>;

export type ISpeechesListQuery = Q.IBaseListQuery<
  ISpeeches,
  SpeechesRelationKey,
  SpeechesSelectableField,
  SpeechesSortableField,
  SpeechesRelationKey,
  SpeechesSelectableField,
  SpeechesSortableField,
  SpeechesDateRangeField,
  SpeechesFilterableField,
  ISpeechesRelationMap,
  ISpeechesRelationQueries,
  ISpeechesItemQuery
>;
