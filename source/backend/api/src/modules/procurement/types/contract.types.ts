// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { ContractStatus } from '#/types/procurement/contract-status.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';
import type { ProvenanceMethod } from '#/types/shared/provenance-method.enum';
import type { VerificationState } from '#/types/shared/verification-state.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as TenderTypes from '#/modules/procurement/types/tender.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  CONTRACT_RELATION_KEYS,
  CONTRACT_SORTABLE_FIELDS,
  CONTRACT_SEARCHABLE_FIELDS,
  CONTRACT_FILTERABLE_FIELDS,
  CONTRACT_DATE_RANGE_FIELDS,
  CONTRACT_SELECTABLE_FIELDS,
  CONTRACT_DEFAULT_SELECT_FIELDS,
  CONTRACT_EDITABLE_FIELDS
} from './contract.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Contract */
export interface IContract extends B.IBase {
  artifactChecksum: string | null;
  artifactId: string | null;
  awardedEntityId: string;
  awardedOn: Date | null;
  code: string;
  confidence: number | null;
  contractingOfficeId: string | null;
  contractingUnitId: string;
  currencyCode: string;
  isCurrent: boolean;
  licence: string | null;
  method: ProvenanceMethod;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
  status: ContractStatus;
  tenderId: string;
  toolOrModel: string | null;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  value: number;
  verificationState: VerificationState;
  readonly tender?: TenderTypes.ITender;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ContractKey = keyof IContract;

export type ContractRelationKey = (typeof CONTRACT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IContractReadonlyFields = B.IBaseReadonlyFields;

export type IContractContextualFields = never;

export type IContractSensitiveFields = never;

export type IContractTransitionFields = never;

export type IContractImmutableFields =
  | IContractReadonlyFields
  | IContractContextualFields
  | IContractSensitiveFields
  | IContractTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IContractCreatable = Omit<IContract, IContractImmutableFields | ContractRelationKey>;

export type IContractSystemWritable = Omit<IContract, B.IBaseReadonlyFields | ContractRelationKey>;

export type IContractUpdatable = Partial<Omit<IContract, IContractImmutableFields | ContractRelationKey>>;

export interface IContractTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ContractSortableField = (typeof CONTRACT_SORTABLE_FIELDS)[number];

export type ContractSearchableField = (typeof CONTRACT_SEARCHABLE_FIELDS)[number];

export type ContractFilterableField = (typeof CONTRACT_FILTERABLE_FIELDS)[number];

export type ContractDateRangeField = (typeof CONTRACT_DATE_RANGE_FIELDS)[number];

export type ContractSelectableField = (typeof CONTRACT_SELECTABLE_FIELDS)[number];

export type ContractDefaultSelectField = (typeof CONTRACT_DEFAULT_SELECT_FIELDS)[number];

export type ContractEditableField = (typeof CONTRACT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IContractAsOneRelationConfig = Q.IOneRelationConfig<'contract', ContractSelectableField>;

export type IContractAsManyRelationConfig = Q.IManyRelationConfig<'contracts', ContractSelectableField, ContractSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IContractAsOneRelationQuery = Q.IAsOneRelationQuery<IContract, ContractSelectableField>;

export type IContractAsManyRelationQuery = Q.IAsManyRelationQuery<IContract, ContractSelectableField, ContractSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IContractRelationMap extends Record<ContractRelationKey, unknown> {
  tender: TenderTypes.ITenderAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IContractRelationQueries = Q.IBaseRelationQueries<IContract, ContractRelationKey, IContractRelationMap>;

export type IContractItemQuery = Q.IBaseItemQuery<
  IContract,
  ContractRelationKey,
  ContractSelectableField,
  ContractRelationKey,
  ContractSelectableField,
  IContractRelationMap,
  IContractRelationQueries
>;

export type IContractListQuery = Q.IBaseListQuery<
  IContract,
  ContractRelationKey,
  ContractSelectableField,
  ContractSortableField,
  ContractRelationKey,
  ContractSelectableField,
  ContractSortableField,
  ContractDateRangeField,
  ContractFilterableField,
  IContractRelationMap,
  IContractRelationQueries,
  IContractItemQuery
>;