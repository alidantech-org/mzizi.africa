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
  IProcurementContract,
  ProcurementContractKey,
  ProcurementContractRelationKey,
  ProcurementContractSortableField,
  ProcurementContractFilterableField,
  ProcurementContractDateRangeField,
  ProcurementContractSelectableField,
  IProcurementContractAsOneRelationConfig,
  IProcurementContractAsManyRelationConfig
} from './procurement-contract.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const PROCUREMENT_CONTRACT_RELATION_KEYS = ['tender', ] as const satisfies readonly ProcurementContractKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const PROCUREMENT_CONTRACT_SORTABLE_FIELDS = ['code', 'createdAt', 'updatedAt', 'validFrom', 'validTo', 'value', 'version', ] as const satisfies readonly ProcurementContractKey[];

export const PROCUREMENT_CONTRACT_SEARCHABLE_FIELDS = ['code', ] as const satisfies readonly ProcurementContractKey[];

export const PROCUREMENT_CONTRACT_FILTERABLE_FIELDS = ['awardedEntityId', 'code', 'contractingOfficeId', 'contractingUnitId', 'id', 'isCurrent', 'status', 'tenderId', 'value', 'version', ] as const satisfies readonly ProcurementContractKey[];

export const PROCUREMENT_CONTRACT_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly ProcurementContractKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const PROCUREMENT_CONTRACT_SELECTABLE_FIELDS = ['awardedEntityId', 'awardedOn', 'code', 'contractingOfficeId', 'contractingUnitId', 'createdAt', 'currencyCode', 'id', 'isCurrent', 'status', 'tenderId', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'value', ] as const satisfies readonly ProcurementContractKey[];

export const PROCUREMENT_CONTRACT_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ProcurementContractSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const PROCUREMENT_CONTRACT_EDITABLE_FIELDS = ['awardedEntityId', 'awardedOn', 'code', 'contractingOfficeId', 'contractingUnitId', 'currencyCode', 'isCurrent', 'status', 'tenderId', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'value', ] as const satisfies readonly ProcurementContractKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const PROCUREMENT_CONTRACT_AS_ONE_RELATION_CONFIG = {
  relation: 'procurementContract',
  type: ERelationType.One,
  selectableFields: PROCUREMENT_CONTRACT_SELECTABLE_FIELDS,
  defaultSelectFields: PROCUREMENT_CONTRACT_DEFAULT_SELECT_FIELDS
} as const satisfies IProcurementContractAsOneRelationConfig;

export const PROCUREMENT_CONTRACT_AS_MANY_RELATION_CONFIG = {
  relation: 'procurementContracts',
  type: ERelationType.Many,
  selectableFields: PROCUREMENT_CONTRACT_SELECTABLE_FIELDS,
  defaultSelectFields: PROCUREMENT_CONTRACT_DEFAULT_SELECT_FIELDS,
  sortableFields: PROCUREMENT_CONTRACT_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IProcurementContractAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const PROCUREMENT_CONTRACT_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ProcurementContractRelationKey>().one(TenderConfig.TENDER_AS_ONE_RELATION_CONFIG, 'tender'),
] as const;

export const PROCUREMENT_CONTRACT_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const PROCUREMENT_CONTRACT_QUERY_OPTIONS = {
  searchableFields: PROCUREMENT_CONTRACT_SEARCHABLE_FIELDS,
  selectableFields: PROCUREMENT_CONTRACT_SELECTABLE_FIELDS,
  defaultSelectFields: PROCUREMENT_CONTRACT_DEFAULT_SELECT_FIELDS,
  sortableFields: PROCUREMENT_CONTRACT_SORTABLE_FIELDS,
  filterFields: PROCUREMENT_CONTRACT_FILTERABLE_FIELDS,
  dateRangeFields: PROCUREMENT_CONTRACT_DATE_RANGE_FIELDS,
  oneRelations: PROCUREMENT_CONTRACT_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: PROCUREMENT_CONTRACT_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IProcurementContract,
  ProcurementContractSortableField,
  ProcurementContractSelectableField,
  ProcurementContractFilterableField,
  ProcurementContractDateRangeField,
  ProcurementContractRelationKey,
  typeof PROCUREMENT_CONTRACT_ONE_RELATION_QUERY_OPTIONS,
  typeof PROCUREMENT_CONTRACT_MANY_RELATION_QUERY_OPTIONS
>;