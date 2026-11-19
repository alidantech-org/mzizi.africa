// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as AppropriationsTypes from "#/modules/finance/schema/types/appropriations/appropriations.types";
import type * as BillsTypes from "#/modules/governance/schema/types/bills/bills.types";
import type * as ContractsTypes from "#/modules/civic/schema/types/contracts/contracts.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as InstrumentsTypes from "#/modules/legal/schema/types/instruments/instruments.types";
import type * as ProjectsTypes from "#/modules/civic/schema/types/projects/projects.types";
import type * as PromisesTypes from "#/modules/governance/schema/types/promises/promises.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  FULFILMENTS_RELATION_KEYS,
  FULFILMENTS_SORTABLE_FIELDS,
  FULFILMENTS_SEARCHABLE_FIELDS,
  FULFILMENTS_FILTERABLE_FIELDS,
  FULFILMENTS_DATE_RANGE_FIELDS,
  FULFILMENTS_SELECTABLE_FIELDS,
  FULFILMENTS_DEFAULT_SELECT_FIELDS,
  FULFILMENTS_EDITABLE_FIELDS,
} from "./fulfilments.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** A recorded link from a promise to what delivered it, with how the link was made and whether it is reviewed. */
export interface IFulfilments extends B.IBase {
  appropriationId: string | null;
  billId: string | null;
  contractId: string | null;
  evidenceStatusId: string;
  instrumentId: string | null;
  kindId: string;
  projectId: string | null;
  promiseId: string;
  recordedOn: Date;
  sourceCitationId: string | null;
  readonly appropriation?: AppropriationsTypes.IAppropriations;
  readonly bill?: BillsTypes.IBills;
  readonly contract?: ContractsTypes.IContracts;
  readonly evidenceStatus?: ValueTypes.IValue;
  readonly instrument?: InstrumentsTypes.IInstruments;
  readonly kind?: ValueTypes.IValue;
  readonly project?: ProjectsTypes.IProjects;
  readonly promise?: PromisesTypes.IPromises;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type FulfilmentsKey = keyof IFulfilments;

export type FulfilmentsRelationKey = (typeof FULFILMENTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IFulfilmentsReadonlyFields = B.IBaseReadonlyFields;

export type IFulfilmentsContextualFields = never;

export type IFulfilmentsSensitiveFields = never;

export type IFulfilmentsTransitionFields = never;

export type IFulfilmentsImmutableFields =
  | IFulfilmentsReadonlyFields
  | IFulfilmentsContextualFields
  | IFulfilmentsSensitiveFields
  | IFulfilmentsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IFulfilmentsCreatable = Omit<
  IFulfilments,
  IFulfilmentsImmutableFields | FulfilmentsRelationKey
>;

export type IFulfilmentsSystemWritable = Omit<
  IFulfilments,
  B.IBaseReadonlyFields | FulfilmentsRelationKey
>;

export type IFulfilmentsUpdatable = Partial<
  Omit<IFulfilments, IFulfilmentsImmutableFields | FulfilmentsRelationKey>
>;

export interface IFulfilmentsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type FulfilmentsSortableField = (typeof FULFILMENTS_SORTABLE_FIELDS)[number];

export type FulfilmentsSearchableField = (typeof FULFILMENTS_SEARCHABLE_FIELDS)[number];

export type FulfilmentsFilterableField = (typeof FULFILMENTS_FILTERABLE_FIELDS)[number];

export type FulfilmentsDateRangeField = (typeof FULFILMENTS_DATE_RANGE_FIELDS)[number];

export type FulfilmentsSelectableField = (typeof FULFILMENTS_SELECTABLE_FIELDS)[number];

export type FulfilmentsDefaultSelectField = (typeof FULFILMENTS_DEFAULT_SELECT_FIELDS)[number];

export type FulfilmentsEditableField = (typeof FULFILMENTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IFulfilmentsAsOneRelationConfig = Q.IOneRelationConfig<
  "fulfilments",
  FulfilmentsSelectableField
>;

export type IFulfilmentsAsManyRelationConfig = Q.IManyRelationConfig<
  "fulfilments",
  FulfilmentsSelectableField,
  FulfilmentsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IFulfilmentsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IFulfilments,
  FulfilmentsSelectableField
>;

export type IFulfilmentsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IFulfilments,
  FulfilmentsSelectableField,
  FulfilmentsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IFulfilmentsRelationMap extends Record<FulfilmentsRelationKey, unknown> {
  appropriation: AppropriationsTypes.IAppropriationsAsOneRelationQuery;
  bill: BillsTypes.IBillsAsOneRelationQuery;
  contract: ContractsTypes.IContractsAsOneRelationQuery;
  evidenceStatus: ValueTypes.IValueAsOneRelationQuery;
  instrument: InstrumentsTypes.IInstrumentsAsOneRelationQuery;
  kind: ValueTypes.IValueAsOneRelationQuery;
  project: ProjectsTypes.IProjectsAsOneRelationQuery;
  promise: PromisesTypes.IPromisesAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IFulfilmentsRelationQueries = Q.IBaseRelationQueries<
  IFulfilments,
  FulfilmentsRelationKey,
  IFulfilmentsRelationMap
>;

export type IFulfilmentsItemQuery = Q.IBaseItemQuery<
  IFulfilments,
  FulfilmentsRelationKey,
  FulfilmentsSelectableField,
  FulfilmentsRelationKey,
  FulfilmentsSelectableField,
  IFulfilmentsRelationMap,
  IFulfilmentsRelationQueries
>;

export type IFulfilmentsListQuery = Q.IBaseListQuery<
  IFulfilments,
  FulfilmentsRelationKey,
  FulfilmentsSelectableField,
  FulfilmentsSortableField,
  FulfilmentsRelationKey,
  FulfilmentsSelectableField,
  FulfilmentsSortableField,
  FulfilmentsDateRangeField,
  FulfilmentsFilterableField,
  IFulfilmentsRelationMap,
  IFulfilmentsRelationQueries,
  IFulfilmentsItemQuery
>;
