// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as ProcurementContractTypes from '#/modules/procurement/types/procurement-contract.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  CONTRACT_MILESTONE_RELATION_KEYS,
  CONTRACT_MILESTONE_SORTABLE_FIELDS,
  CONTRACT_MILESTONE_SEARCHABLE_FIELDS,
  CONTRACT_MILESTONE_FILTERABLE_FIELDS,
  CONTRACT_MILESTONE_DATE_RANGE_FIELDS,
  CONTRACT_MILESTONE_SELECTABLE_FIELDS,
  CONTRACT_MILESTONE_DEFAULT_SELECT_FIELDS,
  CONTRACT_MILESTONE_EDITABLE_FIELDS
} from './contract-milestone.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Contract Milestone */
export interface IContractMilestone extends B.IBase {
  amount: number | null;
  artifactChecksum: string | null;
  artifactId: string | null;
  completedOn: Date | null;
  confidence: number | null;
  contractId: string;
  currencyCode: string | null;
  dueOn: Date | null;
  isCurrent: boolean;
  licence: string | null;
  method: ProvenanceMethod;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  title: string;
  toolOrModel: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  verificationState: VerificationState;
  readonly procurementContract?: ProcurementContractTypes.IProcurementContract;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ContractMilestoneKey = keyof IContractMilestone;

export type ContractMilestoneRelationKey = (typeof CONTRACT_MILESTONE_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IContractMilestoneReadonlyFields = B.IBaseReadonlyFields;

export type IContractMilestoneContextualFields = never;

export type IContractMilestoneSensitiveFields = never;

export type IContractMilestoneTransitionFields = never;

export type IContractMilestoneImmutableFields =
  | IContractMilestoneReadonlyFields
  | IContractMilestoneContextualFields
  | IContractMilestoneSensitiveFields
  | IContractMilestoneTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IContractMilestoneCreatable = Omit<IContractMilestone, IContractMilestoneImmutableFields | ContractMilestoneRelationKey>;

export type IContractMilestoneSystemWritable = Omit<IContractMilestone, B.IBaseReadonlyFields | ContractMilestoneRelationKey>;

export type IContractMilestoneUpdatable = Partial<Omit<IContractMilestone, IContractMilestoneImmutableFields | ContractMilestoneRelationKey>>;

export interface IContractMilestoneTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ContractMilestoneSortableField = (typeof CONTRACT_MILESTONE_SORTABLE_FIELDS)[number];

export type ContractMilestoneSearchableField = (typeof CONTRACT_MILESTONE_SEARCHABLE_FIELDS)[number];

export type ContractMilestoneFilterableField = (typeof CONTRACT_MILESTONE_FILTERABLE_FIELDS)[number];

export type ContractMilestoneDateRangeField = (typeof CONTRACT_MILESTONE_DATE_RANGE_FIELDS)[number];

export type ContractMilestoneSelectableField = (typeof CONTRACT_MILESTONE_SELECTABLE_FIELDS)[number];

export type ContractMilestoneDefaultSelectField = (typeof CONTRACT_MILESTONE_DEFAULT_SELECT_FIELDS)[number];

export type ContractMilestoneEditableField = (typeof CONTRACT_MILESTONE_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IContractMilestoneAsOneRelationConfig = Q.IOneRelationConfig<'contractMilestone', ContractMilestoneSelectableField>;

export type IContractMilestoneAsManyRelationConfig = Q.IManyRelationConfig<'contractMilestones', ContractMilestoneSelectableField, ContractMilestoneSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IContractMilestoneAsOneRelationQuery = Q.IAsOneRelationQuery<IContractMilestone, ContractMilestoneSelectableField>;

export type IContractMilestoneAsManyRelationQuery = Q.IAsManyRelationQuery<IContractMilestone, ContractMilestoneSelectableField, ContractMilestoneSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IContractMilestoneRelationMap extends Record<ContractMilestoneRelationKey, unknown> {
  procurementContract: ProcurementContractTypes.IProcurementContractAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IContractMilestoneRelationQueries = Q.IBaseRelationQueries<IContractMilestone, ContractMilestoneRelationKey, IContractMilestoneRelationMap>;

export type IContractMilestoneItemQuery = Q.IBaseItemQuery<
  IContractMilestone,
  ContractMilestoneRelationKey,
  ContractMilestoneSelectableField,
  ContractMilestoneRelationKey,
  ContractMilestoneSelectableField,
  IContractMilestoneRelationMap,
  IContractMilestoneRelationQueries
>;

export type IContractMilestoneListQuery = Q.IBaseListQuery<
  IContractMilestone,
  ContractMilestoneRelationKey,
  ContractMilestoneSelectableField,
  ContractMilestoneSortableField,
  ContractMilestoneRelationKey,
  ContractMilestoneSelectableField,
  ContractMilestoneSortableField,
  ContractMilestoneDateRangeField,
  ContractMilestoneFilterableField,
  IContractMilestoneRelationMap,
  IContractMilestoneRelationQueries,
  IContractMilestoneItemQuery
>;