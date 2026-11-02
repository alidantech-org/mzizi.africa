// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as ProcurementContractConfig from '#/modules/procurement/types/procurement-contract.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IContractVariation,
  ContractVariationKey,
  ContractVariationRelationKey,
  ContractVariationSortableField,
  ContractVariationFilterableField,
  ContractVariationDateRangeField,
  ContractVariationSelectableField,
  IContractVariationAsOneRelationConfig,
  IContractVariationAsManyRelationConfig
} from './contract-variation.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const CONTRACT_VARIATION_RELATION_KEYS = ['procurementContract', ] as const satisfies readonly ContractVariationKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const CONTRACT_VARIATION_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly ContractVariationKey[];

export const CONTRACT_VARIATION_SEARCHABLE_FIELDS = [] as const satisfies readonly ContractVariationKey[];

export const CONTRACT_VARIATION_FILTERABLE_FIELDS = ['contractId', 'id', 'isCurrent', 'method', 'verificationState', 'version', ] as const satisfies readonly ContractVariationKey[];

export const CONTRACT_VARIATION_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly ContractVariationKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const CONTRACT_VARIATION_SELECTABLE_FIELDS = ['amountChange', 'approvedOn', 'artifactChecksum', 'artifactId', 'confidence', 'contractId', 'createdAt', 'currencyCode', 'id', 'isCurrent', 'licence', 'method', 'reason', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly ContractVariationKey[];

export const CONTRACT_VARIATION_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ContractVariationSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const CONTRACT_VARIATION_EDITABLE_FIELDS = ['amountChange', 'approvedOn', 'artifactChecksum', 'artifactId', 'confidence', 'contractId', 'currencyCode', 'isCurrent', 'licence', 'method', 'reason', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly ContractVariationKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const CONTRACT_VARIATION_AS_ONE_RELATION_CONFIG = {
  relation: 'contractVariation',
  type: ERelationType.One,
  selectableFields: CONTRACT_VARIATION_SELECTABLE_FIELDS,
  defaultSelectFields: CONTRACT_VARIATION_DEFAULT_SELECT_FIELDS
} as const satisfies IContractVariationAsOneRelationConfig;

export const CONTRACT_VARIATION_AS_MANY_RELATION_CONFIG = {
  relation: 'contractVariations',
  type: ERelationType.Many,
  selectableFields: CONTRACT_VARIATION_SELECTABLE_FIELDS,
  defaultSelectFields: CONTRACT_VARIATION_DEFAULT_SELECT_FIELDS,
  sortableFields: CONTRACT_VARIATION_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IContractVariationAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const CONTRACT_VARIATION_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ContractVariationRelationKey>().one(ProcurementContractConfig.PROCUREMENT_CONTRACT_AS_ONE_RELATION_CONFIG, 'procurementContract'),
] as const;

export const CONTRACT_VARIATION_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const CONTRACT_VARIATION_QUERY_OPTIONS = {
  searchableFields: CONTRACT_VARIATION_SEARCHABLE_FIELDS,
  selectableFields: CONTRACT_VARIATION_SELECTABLE_FIELDS,
  defaultSelectFields: CONTRACT_VARIATION_DEFAULT_SELECT_FIELDS,
  sortableFields: CONTRACT_VARIATION_SORTABLE_FIELDS,
  filterFields: CONTRACT_VARIATION_FILTERABLE_FIELDS,
  dateRangeFields: CONTRACT_VARIATION_DATE_RANGE_FIELDS,
  oneRelations: CONTRACT_VARIATION_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: CONTRACT_VARIATION_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IContractVariation,
  ContractVariationSortableField,
  ContractVariationSelectableField,
  ContractVariationFilterableField,
  ContractVariationDateRangeField,
  ContractVariationRelationKey,
  typeof CONTRACT_VARIATION_ONE_RELATION_QUERY_OPTIONS,
  typeof CONTRACT_VARIATION_MANY_RELATION_QUERY_OPTIONS
>;