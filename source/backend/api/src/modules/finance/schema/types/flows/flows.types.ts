// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as AppropriationsTypes from "#/modules/finance/schema/types/appropriations/appropriations.types";
import type * as ContractsTypes from "#/modules/civic/schema/types/contracts/contracts.types";
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as DebtsTypes from "#/modules/finance/schema/types/debts/debts.types";
import type * as FiscalPeriodsTypes from "#/modules/finance/schema/types/fiscal-periods/fiscal-periods.types";
import type * as FundsTypes from "#/modules/finance/schema/types/funds/funds.types";
import type * as InstitutionsTypes from "#/modules/governance/schema/types/institutions/institutions.types";
import type * as ProjectsTypes from "#/modules/civic/schema/types/projects/projects.types";
import type * as FeaturesTypes from "#/modules/geography/schema/types/features/features.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  FLOWS_RELATION_KEYS,
  FLOWS_SORTABLE_FIELDS,
  FLOWS_SEARCHABLE_FIELDS,
  FLOWS_FILTERABLE_FIELDS,
  FLOWS_DATE_RANGE_FIELDS,
  FLOWS_SELECTABLE_FIELDS,
  FLOWS_DEFAULT_SELECT_FIELDS,
  FLOWS_EDITABLE_FIELDS,
} from "./flows.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One reported financial flow at its source transaction grain, not a rolled-up aggregate. */
export interface IFlows extends B.IBase {
  amountMinorUnits: number;
  appropriationId: string | null;
  code: string;
  contractId: string | null;
  counterpartyEntityId: string | null;
  currencyId: string;
  debtId: string | null;
  expenditureClassId: string | null;
  fiscalPeriodId: string | null;
  flowKindId: string;
  fundId: string | null;
  institutionId: string | null;
  occurredOn: Date;
  projectId: string | null;
  scopeUnitFeatureId: string | null;
  sourceCitationId: string | null;
  readonly appropriation?: AppropriationsTypes.IAppropriations;
  readonly contract?: ContractsTypes.IContracts;
  readonly counterpartyEntity?: EntitiesTypes.IEntities;
  readonly currency?: ValueTypes.IValue;
  readonly debt?: DebtsTypes.IDebts;
  readonly expenditureClass?: ValueTypes.IValue;
  readonly fiscalPeriod?: FiscalPeriodsTypes.IFiscalPeriods;
  readonly flowKind?: ValueTypes.IValue;
  readonly fund?: FundsTypes.IFunds;
  readonly institution?: InstitutionsTypes.IInstitutions;
  readonly project?: ProjectsTypes.IProjects;
  readonly scopeUnitFeature?: FeaturesTypes.IFeatures;
  readonly sourceCitation?: CitationsTypes.ICitations;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type FlowsKey = keyof IFlows;

export type FlowsRelationKey = (typeof FLOWS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IFlowsReadonlyFields = B.IBaseReadonlyFields;

export type IFlowsContextualFields = never;

export type IFlowsSensitiveFields = never;

export type IFlowsTransitionFields = never;

export type IFlowsImmutableFields =
  IFlowsReadonlyFields | IFlowsContextualFields | IFlowsSensitiveFields | IFlowsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IFlowsCreatable = Omit<IFlows, IFlowsImmutableFields | FlowsRelationKey>;

export type IFlowsSystemWritable = Omit<IFlows, B.IBaseReadonlyFields | FlowsRelationKey>;

export type IFlowsUpdatable = Partial<Omit<IFlows, IFlowsImmutableFields | FlowsRelationKey>>;

export interface IFlowsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type FlowsSortableField = (typeof FLOWS_SORTABLE_FIELDS)[number];

export type FlowsSearchableField = (typeof FLOWS_SEARCHABLE_FIELDS)[number];

export type FlowsFilterableField = (typeof FLOWS_FILTERABLE_FIELDS)[number];

export type FlowsDateRangeField = (typeof FLOWS_DATE_RANGE_FIELDS)[number];

export type FlowsSelectableField = (typeof FLOWS_SELECTABLE_FIELDS)[number];

export type FlowsDefaultSelectField = (typeof FLOWS_DEFAULT_SELECT_FIELDS)[number];

export type FlowsEditableField = (typeof FLOWS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IFlowsAsOneRelationConfig = Q.IOneRelationConfig<"flows", FlowsSelectableField>;

export type IFlowsAsManyRelationConfig = Q.IManyRelationConfig<
  "flows",
  FlowsSelectableField,
  FlowsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IFlowsAsOneRelationQuery = Q.IAsOneRelationQuery<IFlows, FlowsSelectableField>;

export type IFlowsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IFlows,
  FlowsSelectableField,
  FlowsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IFlowsRelationMap extends Record<FlowsRelationKey, unknown> {
  appropriation: AppropriationsTypes.IAppropriationsAsOneRelationQuery;
  contract: ContractsTypes.IContractsAsOneRelationQuery;
  counterpartyEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  currency: ValueTypes.IValueAsOneRelationQuery;
  debt: DebtsTypes.IDebtsAsOneRelationQuery;
  expenditureClass: ValueTypes.IValueAsOneRelationQuery;
  fiscalPeriod: FiscalPeriodsTypes.IFiscalPeriodsAsOneRelationQuery;
  flowKind: ValueTypes.IValueAsOneRelationQuery;
  fund: FundsTypes.IFundsAsOneRelationQuery;
  institution: InstitutionsTypes.IInstitutionsAsOneRelationQuery;
  project: ProjectsTypes.IProjectsAsOneRelationQuery;
  scopeUnitFeature: FeaturesTypes.IFeaturesAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IFlowsRelationQueries = Q.IBaseRelationQueries<
  IFlows,
  FlowsRelationKey,
  IFlowsRelationMap
>;

export type IFlowsItemQuery = Q.IBaseItemQuery<
  IFlows,
  FlowsRelationKey,
  FlowsSelectableField,
  FlowsRelationKey,
  FlowsSelectableField,
  IFlowsRelationMap,
  IFlowsRelationQueries
>;

export type IFlowsListQuery = Q.IBaseListQuery<
  IFlows,
  FlowsRelationKey,
  FlowsSelectableField,
  FlowsSortableField,
  FlowsRelationKey,
  FlowsSelectableField,
  FlowsSortableField,
  FlowsDateRangeField,
  FlowsFilterableField,
  IFlowsRelationMap,
  IFlowsRelationQueries,
  IFlowsItemQuery
>;
