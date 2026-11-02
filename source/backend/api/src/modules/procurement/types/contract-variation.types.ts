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
  CONTRACT_VARIATION_RELATION_KEYS,
  CONTRACT_VARIATION_SORTABLE_FIELDS,
  CONTRACT_VARIATION_SEARCHABLE_FIELDS,
  CONTRACT_VARIATION_FILTERABLE_FIELDS,
  CONTRACT_VARIATION_DATE_RANGE_FIELDS,
  CONTRACT_VARIATION_SELECTABLE_FIELDS,
  CONTRACT_VARIATION_DEFAULT_SELECT_FIELDS,
  CONTRACT_VARIATION_EDITABLE_FIELDS
} from './contract-variation.config';

// ----------------------------------
// CORE ENTITY CONTRACT
// ----------------------------------

/** Contract Variation */
export interface IContractVariation extends B.IBase {
  amountChange: number;
  approvedOn: Date | null;
  artifactChecksum: string | null;
  artifactId: string | null;
  confidence: number | null;
  contractId: string;
  currencyCode: string;
  isCurrent: boolean;
  licence: string | null;
  method: ProvenanceMethod;
  reason: string;
  retrievedAt: Date | null;
  sourceName: string;
  sourceReference: string | null;
  sourceUrl: string | null;
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

export type ContractVariationKey = keyof IContractVariation;

export type ContractVariationRelationKey = (typeof CONTRACT_VARIATION_RELATION_KEYS)[number];

// ----------------------------------
// FIELD GROUPINGS
// ----------------------------------

export type IContractVariationReadonlyFields = B.IBaseReadonlyFields;

export type IContractVariationContextualFields = never;

export type IContractVariationSensitiveFields = never;

export type IContractVariationTransitionFields = never;

export type IContractVariationImmutableFields =
  | IContractVariationReadonlyFields
  | IContractVariationContextualFields
  | IContractVariationSensitiveFields
  | IContractVariationTransitionFields;

// ----------------------------------
// WRITE CONTRACTS
// ----------------------------------

export type IContractVariationCreatable = Omit<IContractVariation, IContractVariationImmutableFields | ContractVariationRelationKey>;

export type IContractVariationSystemWritable = Omit<IContractVariation, B.IBaseReadonlyFields | ContractVariationRelationKey>;

export type IContractVariationUpdatable = Partial<Omit<IContractVariation, IContractVariationImmutableFields | ContractVariationRelationKey>>;

export interface IContractVariationTransitionPayload {
}

// ----------------------------------
// QUERY FIELD TYPES
// ----------------------------------

export type ContractVariationSortableField = (typeof CONTRACT_VARIATION_SORTABLE_FIELDS)[number];

export type ContractVariationSearchableField = (typeof CONTRACT_VARIATION_SEARCHABLE_FIELDS)[number];

export type ContractVariationFilterableField = (typeof CONTRACT_VARIATION_FILTERABLE_FIELDS)[number];

export type ContractVariationDateRangeField = (typeof CONTRACT_VARIATION_DATE_RANGE_FIELDS)[number];

export type ContractVariationSelectableField = (typeof CONTRACT_VARIATION_SELECTABLE_FIELDS)[number];

export type ContractVariationDefaultSelectField = (typeof CONTRACT_VARIATION_DEFAULT_SELECT_FIELDS)[number];

export type ContractVariationEditableField = (typeof CONTRACT_VARIATION_EDITABLE_FIELDS)[number];

// ----------------------------------
// RELATION CONFIG TYPES
// ----------------------------------

export type IContractVariationAsOneRelationConfig = Q.IOneRelationConfig<'contractVariation', ContractVariationSelectableField>;

export type IContractVariationAsManyRelationConfig = Q.IManyRelationConfig<'contractVariations', ContractVariationSelectableField, ContractVariationSortableField>;

// ----------------------------------
// RELATION QUERY TYPES
// ----------------------------------

export type IContractVariationAsOneRelationQuery = Q.IAsOneRelationQuery<IContractVariation, ContractVariationSelectableField>;

export type IContractVariationAsManyRelationQuery = Q.IAsManyRelationQuery<IContractVariation, ContractVariationSelectableField, ContractVariationSortableField>;

// ----------------------------------
// RELATION MAP
// ----------------------------------

export interface IContractVariationRelationMap extends Record<ContractVariationRelationKey, unknown> {
  procurementContract: ProcurementContractTypes.IProcurementContractAsOneRelationQuery;
}

// ----------------------------------
// QUERY CONTRACTS
// ----------------------------------

export type IContractVariationRelationQueries = Q.IBaseRelationQueries<IContractVariation, ContractVariationRelationKey, IContractVariationRelationMap>;

export type IContractVariationItemQuery = Q.IBaseItemQuery<
  IContractVariation,
  ContractVariationRelationKey,
  ContractVariationSelectableField,
  ContractVariationRelationKey,
  ContractVariationSelectableField,
  IContractVariationRelationMap,
  IContractVariationRelationQueries
>;

export type IContractVariationListQuery = Q.IBaseListQuery<
  IContractVariation,
  ContractVariationRelationKey,
  ContractVariationSelectableField,
  ContractVariationSortableField,
  ContractVariationRelationKey,
  ContractVariationSelectableField,
  ContractVariationSortableField,
  ContractVariationDateRangeField,
  ContractVariationFilterableField,
  IContractVariationRelationMap,
  IContractVariationRelationQueries,
  IContractVariationItemQuery
>;