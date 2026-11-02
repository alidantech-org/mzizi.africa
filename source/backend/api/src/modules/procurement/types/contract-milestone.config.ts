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
  IContractMilestone,
  ContractMilestoneKey,
  ContractMilestoneRelationKey,
  ContractMilestoneSortableField,
  ContractMilestoneFilterableField,
  ContractMilestoneDateRangeField,
  ContractMilestoneSelectableField,
  IContractMilestoneAsOneRelationConfig,
  IContractMilestoneAsManyRelationConfig
} from './contract-milestone.types';

// ----------------------------------
// RELATION KEYS
// ----------------------------------

export const CONTRACT_MILESTONE_RELATION_KEYS = ['procurementContract', ] as const satisfies readonly ContractMilestoneKey[];

// ----------------------------------
// QUERY FIELD CONFIG
// ----------------------------------

export const CONTRACT_MILESTONE_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', 'version', ] as const satisfies readonly ContractMilestoneKey[];

export const CONTRACT_MILESTONE_SEARCHABLE_FIELDS = [] as const satisfies readonly ContractMilestoneKey[];

export const CONTRACT_MILESTONE_FILTERABLE_FIELDS = ['contractId', 'id', 'isCurrent', 'method', 'verificationState', 'version', ] as const satisfies readonly ContractMilestoneKey[];

export const CONTRACT_MILESTONE_DATE_RANGE_FIELDS = ['createdAt', 'updatedAt', 'validFrom', 'validTo', ] as const satisfies readonly ContractMilestoneKey[];

// ----------------------------------
// SELECT FIELD CONFIG
// ----------------------------------

export const CONTRACT_MILESTONE_SELECTABLE_FIELDS = ['amount', 'artifactChecksum', 'artifactId', 'completedOn', 'confidence', 'contractId', 'createdAt', 'currencyCode', 'dueOn', 'id', 'isCurrent', 'licence', 'method', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'title', 'toolOrModel', 'updatedAt', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly ContractMilestoneKey[];

export const CONTRACT_MILESTONE_DEFAULT_SELECT_FIELDS = ['createdAt', 'id', ] as const satisfies readonly ContractMilestoneSelectableField[];

// ----------------------------------
// EDITABLE FIELD CONFIG
// ----------------------------------

export const CONTRACT_MILESTONE_EDITABLE_FIELDS = ['amount', 'artifactChecksum', 'artifactId', 'completedOn', 'confidence', 'contractId', 'currencyCode', 'dueOn', 'isCurrent', 'licence', 'method', 'retrievedAt', 'sourceName', 'sourceReference', 'sourceUrl', 'title', 'toolOrModel', 'validFrom', 'validFromPrecision', 'validTo', 'validToPrecision', 'verificationState', ] as const satisfies readonly ContractMilestoneKey[];

// ----------------------------------
// RELATION CONFIGS
// ----------------------------------

export const CONTRACT_MILESTONE_AS_ONE_RELATION_CONFIG = {
  relation: 'contractMilestone',
  type: ERelationType.One,
  selectableFields: CONTRACT_MILESTONE_SELECTABLE_FIELDS,
  defaultSelectFields: CONTRACT_MILESTONE_DEFAULT_SELECT_FIELDS
} as const satisfies IContractMilestoneAsOneRelationConfig;

export const CONTRACT_MILESTONE_AS_MANY_RELATION_CONFIG = {
  relation: 'contractMilestones',
  type: ERelationType.Many,
  selectableFields: CONTRACT_MILESTONE_SELECTABLE_FIELDS,
  defaultSelectFields: CONTRACT_MILESTONE_DEFAULT_SELECT_FIELDS,
  sortableFields: CONTRACT_MILESTONE_SORTABLE_FIELDS,
  defaultLimit: 10,
  maxLimit: 50
} as const satisfies IContractMilestoneAsManyRelationConfig;

// ----------------------------------
// RELATION QUERY OPTIONS
// ----------------------------------

export const CONTRACT_MILESTONE_ONE_RELATION_QUERY_OPTIONS = [
  Q.createRelationKeyMapper<ContractMilestoneRelationKey>().one(ProcurementContractConfig.PROCUREMENT_CONTRACT_AS_ONE_RELATION_CONFIG, 'procurementContract'),
] as const;

export const CONTRACT_MILESTONE_MANY_RELATION_QUERY_OPTIONS = [
] as const;

// ----------------------------------
// ENTITY QUERY OPTIONS
// ----------------------------------

export const CONTRACT_MILESTONE_QUERY_OPTIONS = {
  searchableFields: CONTRACT_MILESTONE_SEARCHABLE_FIELDS,
  selectableFields: CONTRACT_MILESTONE_SELECTABLE_FIELDS,
  defaultSelectFields: CONTRACT_MILESTONE_DEFAULT_SELECT_FIELDS,
  sortableFields: CONTRACT_MILESTONE_SORTABLE_FIELDS,
  filterFields: CONTRACT_MILESTONE_FILTERABLE_FIELDS,
  dateRangeFields: CONTRACT_MILESTONE_DATE_RANGE_FIELDS,
  oneRelations: CONTRACT_MILESTONE_ONE_RELATION_QUERY_OPTIONS,
  manyRelations: CONTRACT_MILESTONE_MANY_RELATION_QUERY_OPTIONS
} as const satisfies Q.IEntityQueryOptions<
  IContractMilestone,
  ContractMilestoneSortableField,
  ContractMilestoneSelectableField,
  ContractMilestoneFilterableField,
  ContractMilestoneDateRangeField,
  ContractMilestoneRelationKey,
  typeof CONTRACT_MILESTONE_ONE_RELATION_QUERY_OPTIONS,
  typeof CONTRACT_MILESTONE_MANY_RELATION_QUERY_OPTIONS
>;