// ----------------------------------
// SHARED TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import * as B from '#/modules/common/types/base';
import type { ContractStatus } from '#/types/procurement/contract-status.enum';
import type { DatePrecision } from '#/types/shared/date-precision.enum';

// ----------------------------------
// RELATED ENTITY TYPES
// ----------------------------------
import type * as TenderTypes from '#/modules/procurement/types/tender.types';

// ----------------------------------
// LOCAL CONFIG CONSTANTS
// ----------------------------------

import type {
  PROCUREMENT_CONTRACT_RELATION_KEYS,
  PROCUREMENT_CONTRACT_SORTABLE_FIELDS,
  PROCUREMENT_CONTRACT_SEARCHABLE_FIELDS,
  PROCUREMENT_CONTRACT_FILTERABLE_FIELDS,
  PROCUREMENT_CONTRACT_DATE_RANGE_FIELDS,
  PROCUREMENT_CONTRACT_SELECTABLE_FIELDS,
  PROCUREMENT_CONTRACT_DEFAULT_SELECT_FIELDS,
  PROCUREMENT_CONTRACT_EDITABLE_FIELDS
} from './procurement-contract.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Procurement Contract */
export interface IProcurementContract extends B.IBase {
  awardedEntityId: string;
  awardedOn: Date | null;
  code: string;
  contractingOfficeId: string | null;
  contractingUnitId: string;
  currencyCode: string;
  isCurrent: boolean;
  status: ContractStatus;
  tenderId: string;
  validFrom: Date | null;
  validFromPrecision: DatePrecision | null;
  validTo: Date | null;
  validToPrecision: DatePrecision | null;
  value: number;
  readonly tender?: TenderTypes.ITender;
}

// ----------------------------------
// ENTITY KEYS
// ----------------------------------

export type ProcurementContractKey = keyof IProcurementContract;

export type ProcurementContractRelationKey = (typeof PROCUREMENT_CONTRACT_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IProcurementContractReadonlyFields = B.IBaseReadonlyFields;

export type IProcurementContractContextualFields = never;

export type IProcurementContractSensitiveFields = never;

export type IProcurementContractTransitionFields = never;

export type IProcurementContractImmutableFields =
  | IProcurementContractReadonlyFields
  | IProcurementContractContextualFields
  | IProcurementContractSensitiveFields
  | IProcurementContractTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IProcurementContractCreatable = Omit<IProcurementContract, IProcurementContractImmutableFields | ProcurementContractRelationKey>;

export type IProcurementContractSystemWritable = Omit<IProcurementContract, B.IBaseReadonlyFields | ProcurementContractRelationKey>;

export type IProcurementContractUpdatable = Partial<Omit<IProcurementContract, IProcurementContractImmutableFields | ProcurementContractRelationKey>>;

export interface IProcurementContractTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ProcurementContractSortableField = (typeof PROCUREMENT_CONTRACT_SORTABLE_FIELDS)[number];

export type ProcurementContractSearchableField = (typeof PROCUREMENT_CONTRACT_SEARCHABLE_FIELDS)[number];

export type ProcurementContractFilterableField = (typeof PROCUREMENT_CONTRACT_FILTERABLE_FIELDS)[number];

export type ProcurementContractDateRangeField = (typeof PROCUREMENT_CONTRACT_DATE_RANGE_FIELDS)[number];

export type ProcurementContractSelectableField = (typeof PROCUREMENT_CONTRACT_SELECTABLE_FIELDS)[number];

export type ProcurementContractDefaultSelectField = (typeof PROCUREMENT_CONTRACT_DEFAULT_SELECT_FIELDS)[number];

export type ProcurementContractEditableField = (typeof PROCUREMENT_CONTRACT_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IProcurementContractAsOneRelationConfig = Q.IOneRelationConfig<'procurementContract', ProcurementContractSelectableField>;

export type IProcurementContractAsManyRelationConfig = Q.IManyRelationConfig<'procurementContracts', ProcurementContractSelectableField, ProcurementContractSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IProcurementContractAsOneRelationQuery = Q.IAsOneRelationQuery<IProcurementContract, ProcurementContractSelectableField>;

export type IProcurementContractAsManyRelationQuery = Q.IAsManyRelationQuery<IProcurementContract, ProcurementContractSelectableField, ProcurementContractSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IProcurementContractRelationMap extends Record<ProcurementContractRelationKey, unknown> {
  tender: TenderTypes.ITenderAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IProcurementContractRelationQueries = Q.IBaseRelationQueries<IProcurementContract, ProcurementContractRelationKey, IProcurementContractRelationMap>;

export type IProcurementContractItemQuery = Q.IBaseItemQuery<
  IProcurementContract,
  ProcurementContractRelationKey,
  ProcurementContractSelectableField,
  ProcurementContractRelationKey,
  ProcurementContractSelectableField,
  IProcurementContractRelationMap,
  IProcurementContractRelationQueries
>;

export type IProcurementContractListQuery = Q.IBaseListQuery<
  IProcurementContract,
  ProcurementContractRelationKey,
  ProcurementContractSelectableField,
  ProcurementContractSortableField,
  ProcurementContractRelationKey,
  ProcurementContractSelectableField,
  ProcurementContractSortableField,
  ProcurementContractDateRangeField,
  ProcurementContractFilterableField,
  IProcurementContractRelationMap,
  IProcurementContractRelationQueries,
  IProcurementContractItemQuery
>;