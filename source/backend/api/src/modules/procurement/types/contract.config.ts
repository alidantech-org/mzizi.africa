// ----------------------------------
// SHARED CONFIG TYPES
// ----------------------------------

import * as Q from '#/modules/common/types/query';
import { ERelationType } from '#/modules/common/types/enums';

// ----------------------------------
// RELATED ENTITY CONFIGS
// ----------------------------------
import * as TenderConfig from '#/modules/procurement/types/tender.config';

// ----------------------------------
// LOCAL TYPES
// ----------------------------------

import type {
  IContract,
  ContractKey,
  ContractRelationKey,
  ContractSortableField,
  ContractFilterableField,
  ContractDateRangeField,
  ContractSelectableField,
  IContractAsOneRelationConfig,
  IContractAsManyRelationConfig
} from './contract.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const CONTRACT_RELATION_KEYS = ['tender', ] as const satisfies readonly ContractKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const CONTRACT_SORTABLE_FIELDS = ['code', 'createdAt', 'updatedAt', 'validFrom', 'validTo', 'value', 'version', ] as const satisfies readonly ContractKey[];

export const CONTRACT_SEARCHABLE_FIELDS = ['code', ] as const satisfies readonly ContractKey[];

export const CONTRACT_FILTERABLE_FIELDS = ['awardedEntityId', 'code', 'contractingOfficeId', 'contractingUnitId', 'id', 'isCurrent', 'method', 'status', 'tenderId', 'value', 'verificationState', 'version', ] as const satisfies readonly ContractKey[];

export const CONTRACT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly ContractKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const CONTRACT_SELECTABLE_FIELDS = ['artifactChecksum', 'artifactId', 'awardedEntityId', 'awardedOn', 'code', 'confidence', 'contractingOfficeId', 'contractingUnitId', 'createdAt', 'currencyCode', 'id', 'isCurrent', 'licence', 'method', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'status', 'tenderId', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'value', 'verificationState', ] as const satisfies readonly ContractKey[];

export const CONTRACT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ContractSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const CONTRACT_EDITABLE_FIELDS = ['artifactChecksum', 'artifactId', 'awardedEntityId', 'awardedOn', 'code', 'confidence', 'contractingOfficeId', 'contractingUnitId', 'currencyCode', 'isCurrent', 'licence', 'method', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'status', 'tenderId', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'value', 'verificationState', ] as const satisfies readonly ContractKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const CONTRACT_AS_ONE_RELATION_CONFIG = {
  relation: 'contract',
  type: ERelationType.One,
  selectableFields: CONTRACT_SELECTABLE_FIELDS,
  defaultSelectFields: CONTRACT_DEFAULT_SELECT_FIELDS
} as const satisfies IContractAsOneRelationConfig;

export const CONTRACT_AS_MANY_RELATION_CONFIG = {
  relation: 'contracts',
  type: ERelationType.Many,
  selectableFields: CONTRACT_SELECTABLE_FIELDS,
  defaultSelectFields: CONTRACT_DEFAULT_SELECT_FIELDS,
  sortableFields: CONTRACT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IContractAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const CONTRACT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ContractRelationKey>().one(TenderConfig.TENDER_AS_ONE_RELATION_CONFIG, 'tender'),
] as const;

export const CONTRACT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const CONTRACT_QUERY_OPTIONS = {
  searchableFields: CONTRACT_SEARCHABLE_FIELDS,
  selectableFields: CONTRACT_SELECTABLE_FIELDS,
  defaultSelectFields: CONTRACT_DEFAULT_SELECT_FIELDS,
  sortableFields: CONTRACT_SORTABLE_FIELDS,
  filterFields: CONTRACT_FILTERABLE_FIELDS,
  dateRangeFields: CONTRACT_DATE_RANGE_FIELDS,
  oneRelations: CONTRACT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: CONTRACT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IContract,
  ContractSortableField,
  ContractSelectableField,
  ContractFilterableField,
  ContractDateRangeField,
  ContractRelationKey,
  typeof CONTRACT_ONE_RELATION_QUERY_OPTIONS,
  typeof CONTRACT_MANY_RELATION_QUERY_OPTIONS
>;