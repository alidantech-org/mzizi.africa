// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as BillsTypes from "#/modules/governance/schema/types/bills/bills.types";
import type * as BudgetVersionsTypes from "#/modules/finance/schema/types/budget-versions/budget-versions.types";
import type * as FiscalPeriodsTypes from "#/modules/finance/schema/types/fiscal-periods/fiscal-periods.types";
import type * as InstrumentsTypes from "#/modules/legal/schema/types/instruments/instruments.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as HoldersTypes from "#/modules/governance/schema/types/holders/holders.types";
import type * as ProvisionsTypes from "#/modules/legal/schema/types/provisions/provisions.types";
import type * as SittingsTypes from "#/modules/governance/schema/types/sittings/sittings.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  MOTIONS_RELATION_KEYS,
  MOTIONS_SORTABLE_FIELDS,
  MOTIONS_SEARCHABLE_FIELDS,
  MOTIONS_FILTERABLE_FIELDS,
  MOTIONS_DATE_RANGE_FIELDS,
  MOTIONS_SELECTABLE_FIELDS,
  MOTIONS_DEFAULT_SELECT_FIELDS,
  MOTIONS_EDITABLE_FIELDS,
} from "./motions.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One matter put to a sitting, with its outcome, tied to the bill, law provision or budget it concerns. */
export interface IMotions extends B.IBase {
  billId: string | null;
  budgetVersionId: string | null;
  code: string;
  fiscalPeriodId: string | null;
  instrumentId: string | null;
  motionKindId: string;
  movedByHolderId: string | null;
  outcomeId: string;
  provisionId: string | null;
  sittingId: string;
  sourceCitationId: string | null;
  summary: string | null;
  title: string;
  readonly bill?: BillsTypes.IBills;
  readonly budgetVersion?: BudgetVersionsTypes.IBudgetVersions;
  readonly fiscalPeriod?: FiscalPeriodsTypes.IFiscalPeriods;
  readonly instrument?: InstrumentsTypes.IInstruments;
  readonly motionKind?: ValueTypes.IValue;
  readonly movedByHolder?: HoldersTypes.IHolders;
  readonly outcome?: ValueTypes.IValue;
  readonly provision?: ProvisionsTypes.IProvisions;
  readonly sitting?: SittingsTypes.ISittings;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type MotionsKey = keyof IMotions;

export type MotionsRelationKey = (typeof MOTIONS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IMotionsReadonlyFields = B.IBaseReadonlyFields;

export type IMotionsContextualFields = never;

export type IMotionsSensitiveFields = never;

export type IMotionsTransitionFields = never;

export type IMotionsImmutableFields =
  | IMotionsReadonlyFields
  | IMotionsContextualFields
  | IMotionsSensitiveFields
  | IMotionsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IMotionsCreatable = Omit<IMotions, IMotionsImmutableFields | MotionsRelationKey>;

export type IMotionsSystemWritable = Omit<IMotions, B.IBaseReadonlyFields | MotionsRelationKey>;

export type IMotionsUpdatable = Partial<
  Omit<IMotions, IMotionsImmutableFields | MotionsRelationKey>
>;

export interface IMotionsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type MotionsSortableField = (typeof MOTIONS_SORTABLE_FIELDS)[number];

export type MotionsSearchableField = (typeof MOTIONS_SEARCHABLE_FIELDS)[number];

export type MotionsFilterableField = (typeof MOTIONS_FILTERABLE_FIELDS)[number];

export type MotionsDateRangeField = (typeof MOTIONS_DATE_RANGE_FIELDS)[number];

export type MotionsSelectableField = (typeof MOTIONS_SELECTABLE_FIELDS)[number];

export type MotionsDefaultSelectField = (typeof MOTIONS_DEFAULT_SELECT_FIELDS)[number];

export type MotionsEditableField = (typeof MOTIONS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IMotionsAsOneRelationConfig = Q.IOneRelationConfig<"motions", MotionsSelectableField>;

export type IMotionsAsManyRelationConfig = Q.IManyRelationConfig<
  "motions",
  MotionsSelectableField,
  MotionsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IMotionsAsOneRelationQuery = Q.IAsOneRelationQuery<IMotions, MotionsSelectableField>;

export type IMotionsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IMotions,
  MotionsSelectableField,
  MotionsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IMotionsRelationMap extends Record<MotionsRelationKey, unknown> {
  bill: BillsTypes.IBillsAsOneRelationQuery;
  budgetVersion: BudgetVersionsTypes.IBudgetVersionsAsOneRelationQuery;
  fiscalPeriod: FiscalPeriodsTypes.IFiscalPeriodsAsOneRelationQuery;
  instrument: InstrumentsTypes.IInstrumentsAsOneRelationQuery;
  motionKind: ValueTypes.IValueAsOneRelationQuery;
  movedByHolder: HoldersTypes.IHoldersAsOneRelationQuery;
  outcome: ValueTypes.IValueAsOneRelationQuery;
  provision: ProvisionsTypes.IProvisionsAsOneRelationQuery;
  sitting: SittingsTypes.ISittingsAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IMotionsRelationQueries = Q.IBaseRelationQueries<
  IMotions,
  MotionsRelationKey,
  IMotionsRelationMap
>;

export type IMotionsItemQuery = Q.IBaseItemQuery<
  IMotions,
  MotionsRelationKey,
  MotionsSelectableField,
  MotionsRelationKey,
  MotionsSelectableField,
  IMotionsRelationMap,
  IMotionsRelationQueries
>;

export type IMotionsListQuery = Q.IBaseListQuery<
  IMotions,
  MotionsRelationKey,
  MotionsSelectableField,
  MotionsSortableField,
  MotionsRelationKey,
  MotionsSelectableField,
  MotionsSortableField,
  MotionsDateRangeField,
  MotionsFilterableField,
  IMotionsRelationMap,
  IMotionsRelationQueries,
  IMotionsItemQuery
>;
