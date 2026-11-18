// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from "#/modules/common/schema/types/query";
import * as B from "#/modules/common/schema/types/base";

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as EntitiesTypes from "#/modules/official/schema/types/entities/entities.types";
import type * as ValueTypes from "#/modules/reference/schema/types/value/value.types";
import type * as ProcurementsTypes from "#/modules/civic/schema/types/procurements/procurements.types";
import type * as ProjectsTypes from "#/modules/civic/schema/types/projects/projects.types";
import type * as CitationsTypes from "#/modules/source/schema/types/citations/citations.types";

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  CONTRACTS_RELATION_KEYS,
  CONTRACTS_SORTABLE_FIELDS,
  CONTRACTS_SEARCHABLE_FIELDS,
  CONTRACTS_FILTERABLE_FIELDS,
  CONTRACTS_DATE_RANGE_FIELDS,
  CONTRACTS_SELECTABLE_FIELDS,
  CONTRACTS_DEFAULT_SELECT_FIELDS,
  CONTRACTS_EDITABLE_FIELDS,
} from "./contracts.config";

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** One executed contract with a contractor, optional procurement/project links and contracted amount. */
export interface IContracts extends B.IBase {
  amountMinorUnits: number;
  code: string;
  contractorEntityId: string;
  currencyId: string;
  natureId: string | null;
  procurementId: string | null;
  projectId: string | null;
  signedOn: Date | null;
  sourceCitationId: string | null;
  statusId: string;
  readonly contractorEntity?: EntitiesTypes.IEntities;
  readonly currency?: ValueTypes.IValue;
  readonly nature?: ValueTypes.IValue;
  readonly procurement?: ProcurementsTypes.IProcurements;
  readonly project?: ProjectsTypes.IProjects;
  readonly sourceCitation?: CitationsTypes.ICitations;
  readonly status?: ValueTypes.IValue;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ContractsKey = keyof IContracts;

export type ContractsRelationKey = (typeof CONTRACTS_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IContractsReadonlyFields = B.IBaseReadonlyFields;

export type IContractsContextualFields = never;

export type IContractsSensitiveFields = never;

export type IContractsTransitionFields = never;

export type IContractsImmutableFields =
  | IContractsReadonlyFields
  | IContractsContextualFields
  | IContractsSensitiveFields
  | IContractsTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IContractsCreatable = Omit<
  IContracts,
  IContractsImmutableFields | ContractsRelationKey
>;

export type IContractsSystemWritable = Omit<
  IContracts,
  B.IBaseReadonlyFields | ContractsRelationKey
>;

export type IContractsUpdatable = Partial<
  Omit<IContracts, IContractsImmutableFields | ContractsRelationKey>
>;

export interface IContractsTransitionPayload {}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ContractsSortableField = (typeof CONTRACTS_SORTABLE_FIELDS)[number];

export type ContractsSearchableField = (typeof CONTRACTS_SEARCHABLE_FIELDS)[number];

export type ContractsFilterableField = (typeof CONTRACTS_FILTERABLE_FIELDS)[number];

export type ContractsDateRangeField = (typeof CONTRACTS_DATE_RANGE_FIELDS)[number];

export type ContractsSelectableField = (typeof CONTRACTS_SELECTABLE_FIELDS)[number];

export type ContractsDefaultSelectField = (typeof CONTRACTS_DEFAULT_SELECT_FIELDS)[number];

export type ContractsEditableField = (typeof CONTRACTS_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IContractsAsOneRelationConfig = Q.IOneRelationConfig<
  "contracts",
  ContractsSelectableField
>;

export type IContractsAsManyRelationConfig = Q.IManyRelationConfig<
  "contracts",
  ContractsSelectableField,
  ContractsSortableField
>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IContractsAsOneRelationQuery = Q.IAsOneRelationQuery<
  IContracts,
  ContractsSelectableField
>;

export type IContractsAsManyRelationQuery = Q.IAsManyRelationQuery<
  IContracts,
  ContractsSelectableField,
  ContractsSortableField
>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IContractsRelationMap extends Record<ContractsRelationKey, unknown> {
  contractorEntity: EntitiesTypes.IEntitiesAsOneRelationQuery;
  currency: ValueTypes.IValueAsOneRelationQuery;
  nature: ValueTypes.IValueAsOneRelationQuery;
  procurement: ProcurementsTypes.IProcurementsAsOneRelationQuery;
  project: ProjectsTypes.IProjectsAsOneRelationQuery;
  sourceCitation: CitationsTypes.ICitationsAsOneRelationQuery;
  status: ValueTypes.IValueAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IContractsRelationQueries = Q.IBaseRelationQueries<
  IContracts,
  ContractsRelationKey,
  IContractsRelationMap
>;

export type IContractsItemQuery = Q.IBaseItemQuery<
  IContracts,
  ContractsRelationKey,
  ContractsSelectableField,
  ContractsRelationKey,
  ContractsSelectableField,
  IContractsRelationMap,
  IContractsRelationQueries
>;

export type IContractsListQuery = Q.IBaseListQuery<
  IContracts,
  ContractsRelationKey,
  ContractsSelectableField,
  ContractsSortableField,
  ContractsRelationKey,
  ContractsSelectableField,
  ContractsSortableField,
  ContractsDateRangeField,
  ContractsFilterableField,
  IContractsRelationMap,
  IContractsRelationQueries,
  IContractsItemQuery
>;
